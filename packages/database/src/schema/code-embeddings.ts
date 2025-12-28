import { customType, index, integer, jsonb, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * 代码语言类型
 */
export const codeLanguages = [
    'typescript',
    'javascript',
    'python',
    'java',
    'go',
    'rust',
    'cpp',
    'csharp',
    'other',
] as const;
export type CodeLanguage = (typeof codeLanguages)[number];

/**
 * 代码分块类型
 */
export const chunkTypes = ['function', 'class', 'interface', 'module', 'block'] as const;
export type ChunkType = (typeof chunkTypes)[number];

/**
 * 代码元数据
 */
export interface CodeMetadata {
    language: CodeLanguage;
    chunkType: ChunkType;
    startLine: number;
    endLine: number;
    symbols?: string[]; // 符号名称列表（函数名、类名等）
    imports?: string[]; // 导入的模块
    exports?: string[]; // 导出的符号
}

/**
 * 自定义 vector 类型用于 pgvector
 * 1536 维向量用于 OpenAI text-embedding-3-large
 */
const vector = customType<{ data: number[]; driverData: string }>({
    dataType() {
        return 'vector(1536)';
    },
    toDriver(value: number[]): string {
        return JSON.stringify(value);
    },
});

/**
 * 代码嵌入表
 * 存储向量化的代码块用于语义搜索
 */
export const codeEmbeddings = pgTable(
    'code_embeddings',
    {
        id: serial('id').primaryKey(),
        // 代码信息
        filePath: text('file_path').notNull(),
        codeChunk: text('code_chunk').notNull(), // 代码片段
        // 向量（1536 维 - OpenAI text-embedding-3-large）
        embedding: vector('embedding').notNull(),
        // 元数据
        metadata: jsonb('metadata').$type<CodeMetadata>().notNull(),
        // 项目信息
        projectId: integer('project_id'), // 预留字段，用于多项目支持
        // 时间戳
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at').defaultNow().notNull(),
    },
    (table) => ({
        // 文件路径索引用于快速查找
        filePathIdx: index('file_path_idx').on(table.filePath),
        // 注意：HNSW 索引需要在迁移后手动创建
        // CREATE INDEX embedding_idx ON code_embeddings USING hnsw (embedding vector_cosine_ops);
    }),
);

// 类型导出
export type CodeEmbedding = typeof codeEmbeddings.$inferSelect;
export type NewCodeEmbedding = typeof codeEmbeddings.$inferInsert;
