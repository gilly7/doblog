import prisma from "../db/client.js";
export const createArticle = async (c) => {
    try {
        const user = c.get("user");
        const { title, content, published = true, categoryId, } = await c.req.json();
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
        });
        if (!category) {
            c.status(404);
            return c.json({ error: "Category not found" });
        }
        const article = await prisma.article.create({
            data: {
                title,
                content,
                published,
                authorId: user.id,
                categoryId,
            },
            include: {
                author: {
                    select: { id: true, name: true, email: true },
                },
                category: {
                    select: { id: true, name: true },
                },
            },
        });
        return c.json(article);
    }
    catch (error) {
        console.log(`failed to create article: ${error.message}`);
        c.status(500);
        return c.json({ error: "Internal server error" });
    }
};
export const getArticles = async (c) => {
    try {
        const page = parseInt(c.req.query("page") || "1", 10);
        const limit = parseInt(c.req.query("limit") || "10", 10);
        const categoryId = c.req.query("categoryId");
        const searchTerm = c.req.query("search");
        const skip = (page - 1) * limit;
        let whereClause = { published: true };
        if (categoryId) {
            whereClause.categoryId = categoryId;
        }
        if (searchTerm) {
            whereClause.OR = [
                { title: { contains: searchTerm, mode: "insensitive" } },
                { content: { contains: searchTerm, mode: "insensitive" } },
            ];
        }
        const [articles, totalCount] = await Promise.all([
            prisma.article.findMany({
                where: whereClause,
                include: {
                    author: {
                        select: { id: true, name: true },
                    },
                    category: {
                        select: { id: true, name: true },
                    },
                    _count: {
                        select: { comments: true },
                    },
                },
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.article.count({ where: whereClause }),
        ]);
        const totalPages = Math.ceil(totalCount / limit);
        return c.json({
            articles,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        });
    }
    catch (error) {
        console.error(`Failed to fetch articles: ${error.message}`);
        c.status(500);
        return c.json({ error: "Internal server error" });
    }
};
export const getArticle = async (c) => {
    try {
        const id = c.req.param("id");
        const article = await prisma.article.findUnique({
            where: { id },
            include: {
                author: {
                    select: { id: true, name: true },
                },
                category: {
                    select: { id: true, name: true },
                },
                comments: {
                    include: {
                        author: {
                            select: { id: true, name: true },
                        },
                    },
                },
            },
        });
        if (!article) {
            c.status(404);
            return c.json({ error: "Article not found" });
        }
        return c.json(article);
    }
    catch (error) {
        console.log(`failed to get article: ${error.message}`);
        c.status(500);
        return c.json({ error: "Internal server error" });
    }
};
export const updateArticle = async (c) => {
    try {
        const id = c.req.param("id");
        const user = c.get("user");
        const { title, content, published = true, categoryId, } = await c.req.json();
        const article = await prisma.article.findUnique({
            where: { id },
        });
        if (!article) {
            c.status(404);
            return c.json({ error: "Article not found" });
        }
        if (article.authorId !== user.id) {
            c.status(403);
            return c.json({ error: "Unauthorized" });
        }
        if (categoryId && categoryId !== article.categoryId) {
            const category = await prisma.category.findUnique({
                where: { id: categoryId },
            });
            if (!category) {
                c.status(404);
                return c.json({ error: "Category not found" });
            }
        }
        const updatedArticle = await prisma.article.update({
            where: { id },
            data: { title, content, published },
            include: {
                author: {
                    select: { name: true, email: true },
                },
            },
        });
        return c.json(updatedArticle);
    }
    catch (error) {
        console.log(`failed to update article: ${error.message}`);
        c.status(500);
        return c.json({ error: "Internal server error" });
    }
};
export const deleteArticle = async (c) => {
    try {
        const id = c.req.param("id");
        const user = c.get("user");
        const article = await prisma.article.findUnique({
            where: { id },
        });
        if (!article) {
            c.status(404);
            return c.json({ error: "Article not found" });
        }
        if (article.authorId !== user.id) {
            c.status(403);
            return c.json({ error: "Unauthorized" });
        }
        await prisma.article.delete({
            where: { id },
        });
        return c.json({ message: "Article deleted successfully" });
    }
    catch (error) {
        console.log(`failed to delete article: ${error.message}`);
        c.status(500);
        return c.json({ error: "Internal server error" });
    }
};
