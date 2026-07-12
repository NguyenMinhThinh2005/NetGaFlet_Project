import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import { Request, Response } from 'express';

// =========================================================================
// Khởi tạo Gemini & Supabase clients
// =========================================================================
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Dùng service_role key để bypass RLS khi gọi match_movies RPC
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// =========================================================================
// Helper: Tạo embedding vector từ text query dùng Gemini text-embedding-004
// Model này xuất ra vector 768 chiều, khớp với cột embedding vector(768)
// =========================================================================
async function generateEmbedding(text: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

// =========================================================================
// POST /api/search/semantic
// Body: { query: string, threshold?: number, limit?: number }
// =========================================================================
export async function semanticSearch(req: Request, res: Response): Promise<void> {
  const { query, threshold = 0.5, limit = 10 } = req.body;

  // --- Validation ---
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    res.status(400).json({
      success: false,
      message: 'Trường "query" là bắt buộc và phải là chuỗi không rỗng.',
    });
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    res.status(500).json({ success: false, message: 'GEMINI_API_KEY chưa được cấu hình.' });
    return;
  }

  try {
    // BƯỚC 1: Sinh embedding vector từ câu truy vấn tự nhiên
    console.log(`[SemanticSearch] Generating embedding for: "${query}"`);
    const queryEmbedding = await generateEmbedding(query.trim());

    // BƯỚC 2: Gọi Supabase RPC match_movies với Cosine Similarity
    const { data, error } = await supabase.rpc('match_movies', {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: limit,
    });

    if (error) {
      console.error('[SemanticSearch] Supabase RPC error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tìm kiếm phim trong database.',
        error: error.message,
      });
      return;
    }

    // BƯỚC 3: Trả về danh sách phim kết quả
    res.json({
      success: true,
      query,
      count: data?.length ?? 0,
      movies: data ?? [],
    });
  } catch (err: any) {
    console.error('[SemanticSearch] Unexpected error:', err);
    res.status(500).json({
      success: false,
      message: 'Lỗi server không xác định.',
      error: err.message,
    });
  }
}

// =========================================================================
// POST /api/search/index-movie
// Dùng để đánh index một bộ phim vào movies_cache (upsert embedding)
// Body: { slug, name, origin_name, thumb_url, description, year, category, country }
// =========================================================================
export async function indexMovie(req: Request, res: Response): Promise<void> {
  const { slug, name, origin_name, thumb_url, description, year, category, country } = req.body;

  if (!slug || !name) {
    res.status(400).json({ success: false, message: '"slug" và "name" là bắt buộc.' });
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    res.status(500).json({ success: false, message: 'GEMINI_API_KEY chưa được cấu hình.' });
    return;
  }

  try {
    // Tạo chuỗi text đại diện cho bộ phim để embed
    const textToEmbed = [
      name,
      origin_name,
      description,
      Array.isArray(category) ? category.map((c: any) => c.name).join(', ') : '',
      Array.isArray(country) ? country.map((c: any) => c.name).join(', ') : '',
      year ? `Năm ${year}` : '',
    ]
      .filter(Boolean)
      .join('. ');

    console.log(`[IndexMovie] Embedding movie: "${name}" (${slug})`);
    const embedding = await generateEmbedding(textToEmbed);

    const { error } = await supabase.from('movies_cache').upsert(
      {
        slug,
        name,
        origin_name,
        thumb_url,
        description,
        year,
        category,
        country,
        embedding,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'slug' }
    );

    if (error) {
      res.status(500).json({ success: false, message: 'Lỗi khi lưu vào database.', error: error.message });
      return;
    }

    res.json({ success: true, message: `Đã index phim "${name}" thành công.` });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Lỗi server không xác định.', error: err.message });
  }
}
