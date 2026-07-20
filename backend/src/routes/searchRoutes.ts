import { Router } from 'express';
import { semanticSearch, indexMovie } from '../controllers/searchController';

const router = Router();

/**
 * POST /api/search/semantic
 * Body: { query: string, threshold?: number, limit?: number }
 * Tìm kiếm phim theo ngữ nghĩa tự nhiên
 */
router.post('/semantic', semanticSearch);

/**
 * POST /api/search/index-movie
 * Body: { slug, name, origin_name, thumb_url, description, year, category, country }
 * Thêm/cập nhật một bộ phim vào movies_cache với embedding vector
 */
router.post('/index-movie', indexMovie);

export default router;
