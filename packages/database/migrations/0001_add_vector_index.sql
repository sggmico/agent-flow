-- 启用 pgvector 扩展
CREATE EXTENSION IF NOT EXISTS vector;

-- 为 code_embeddings 表的 embedding 列创建 HNSW 索引
-- HNSW (Hierarchical Navigable Small World) 提供高性能的向量相似度搜索
-- 使用 vector_cosine_ops 操作符类进行余弦相似度搜索
CREATE INDEX IF NOT EXISTS "embedding_hnsw_idx" ON "code_embeddings"
USING hnsw ("embedding" vector_cosine_ops);

-- 可选：调整 HNSW 索引参数以优化性能
-- m: 每个节点的最大连接数 (默认 16，范围 2-100)
-- ef_construction: 索引构建时的搜索深度 (默认 64，越大越精确但越慢)
--
-- 示例（如需调整性能，取消下面的注释）:
-- DROP INDEX IF EXISTS "embedding_hnsw_idx";
-- CREATE INDEX "embedding_hnsw_idx" ON "code_embeddings"
-- USING hnsw ("embedding" vector_cosine_ops)
-- WITH (m = 16, ef_construction = 64);
