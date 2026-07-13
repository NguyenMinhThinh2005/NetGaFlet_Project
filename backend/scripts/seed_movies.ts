// =========================================================================
// SEED SCRIPT: Fetch movies from OPhim API, embed with Gemini, upsert to Supabase
// Run: npx ts-node --esm scripts/seed_movies.ts
// Requires backend/.env to have SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY
// =========================================================================
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// =========================================================================
// Config
// =========================================================================
const OPHIM_BASE = 'https://ophim1.com';
const PAGES_TO_FETCH = 3;      // 3 pages × ~20 movies = up to 60 movies
const RATE_LIMIT_MS = 600;     // delay between Gemini calls to avoid 429 errors

// =========================================================================
// Validate env
// =========================================================================
const SUPABASE_URL = process.env['SUPABASE_URL'] ?? '';
const SUPABASE_KEY = process.env['SUPABASE_SERVICE_ROLE_KEY'] ?? '';
const GEMINI_KEY   = process.env['GEMINI_API_KEY'] ?? '';

if (!SUPABASE_URL || SUPABASE_KEY === 'YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE' || !SUPABASE_KEY) {
  console.error('❌  SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set in backend/.env');
  process.exit(1);
}
if (!GEMINI_KEY || GEMINI_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
  console.error('❌  GEMINI_API_KEY not set in backend/.env');
  process.exit(1);
}

// =========================================================================
// Clients
// =========================================================================
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const genAI    = new GoogleGenerativeAI(GEMINI_KEY);

// =========================================================================
// Helpers
// =========================================================================
const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

async function fetchJson(url: string): Promise<any> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} → ${url}`);
  return res.json();
}

async function generateEmbedding(text: string): Promise<number[]> {
  const model  = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

// =========================================================================
// Main
// =========================================================================
async function main() {
  console.log('🚀  NetGaFlex Movie Seeder starting...\n');

  // STEP 1: Collect slugs from "phim-moi-cap-nhat" pages
  const slugs: string[] = [];
  for (let page = 1; page <= PAGES_TO_FETCH; page++) {
    try {
      const url  = `${OPHIM_BASE}/danh-sach/phim-moi-cap-nhat?page=${page}`;
      const data = await fetchJson(url);
      const items: any[] = data?.items ?? [];
      console.log(`📄  Page ${page}: found ${items.length} movies`);
      for (const item of items) {
        if (item?.slug) slugs.push(item.slug as string);
      }
    } catch (err) {
      console.warn(`  ⚠️  Failed to fetch page ${page}:`, err);
    }
  }

  if (slugs.length === 0) {
    console.error('❌  No slugs collected. OPhim API may be unreachable.');
    process.exit(1);
  }

  console.log(`\n🎬  Total slugs collected: ${slugs.length}`);
  console.log('─'.repeat(60));

  // STEP 2: Process each movie
  let success = 0;
  let skipped = 0;
  let failed  = 0;

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    if (!slug) { skipped++; continue; }

    process.stdout.write(`[${String(i + 1).padStart(3)}/${slugs.length}] ${slug.padEnd(50)}`);

    try {
      // Fetch movie detail
      const detail = await fetchJson(`${OPHIM_BASE}/phim/${slug}`);
      const movie  = detail?.movie ?? detail?.data?.item ?? null;
      if (!movie) {
        console.log('⚠️  no movie object');
        skipped++;
        continue;
      }

      const name        = (movie.name        ?? '') as string;
      const originName  = (movie.origin_name ?? '') as string;
      const thumbUrl    = (movie.thumb_url   ?? movie.poster_url ?? '') as string;
      const description = (movie.content     ?? movie.description ?? '') as string;
      const year        = (movie.year        ?? null) as number | null;

      // Categories and countries
      const category: { id: string; name: string }[] =
        Array.isArray(movie.category) ? movie.category : [];
      const country: { id: string; name: string }[] =
        Array.isArray(movie.country) ? movie.country : [];

      // Build the text to embed
      const textToEmbed = [
        name,
        originName,
        description.replace(/<[^>]+>/g, '').slice(0, 800), // strip HTML tags, cap length
        category.map((c: any) => c.name).join(', '),
        country.map((c: any) => c.name).join(', '),
        year ? `Năm ${year}` : '',
      ].filter(Boolean).join('. ');

      // Generate embedding
      const embedding = await generateEmbedding(textToEmbed);

      // Upsert into Supabase
      const { error } = await supabase.from('movies_cache').upsert(
        {
          slug,
          name,
          origin_name : originName  || null,
          thumb_url   : thumbUrl    || null,
          description : description || null,
          year,
          category    : category.length  ? category  : null,
          country     : country.length   ? country   : null,
          embedding,
          updated_at  : new Date().toISOString(),
        },
        { onConflict: 'slug' }
      );

      if (error) {
        console.log(`❌  Supabase error: ${error.message}`);
        failed++;
      } else {
        console.log('✅');
        success++;
      }

      // Respect Gemini rate limit
      await sleep(RATE_LIMIT_MS);

    } catch (err: any) {
      console.log(`❌  ${err?.message ?? err}`);
      failed++;
      await sleep(RATE_LIMIT_MS);
    }
  }

  // STEP 3: Summary
  console.log('\n' + '═'.repeat(60));
  console.log('📊  SEEDING SUMMARY');
  console.log('═'.repeat(60));
  console.log(`  ✅  Successfully indexed : ${success}`);
  console.log(`  ⚠️   Skipped              : ${skipped}`);
  console.log(`  ❌  Failed               : ${failed}`);
  console.log(`  📦  Total processed      : ${slugs.length}`);
  console.log('═'.repeat(60));
  console.log('\n✨  Done! movies_cache table is ready for semantic search.\n');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
