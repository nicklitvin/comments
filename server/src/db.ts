import { PrismaClient, Comment } from "@prisma/client";

export class DB {
    private prisma : PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async getComments(): Promise<Comment[]> {
        return await this.prisma.comment.findMany({
            orderBy: {
                id: 'asc'
            }
        });
    }

    async likeComment(id: string, increment: boolean): Promise<Comment> {
        return await this.prisma.comment.update({
            where: { id },
            data: {
                likes: {
                    increment: increment ? 1 : -1
                }
            }
        });
    }

    async updateComment(id: string, text: string): Promise<Comment> {
        return await this.prisma.comment.update({
            where: { id },
            data: {
                text,
                date: new Date()
            }
        });
    }

    async createComment(author : string, text: string, image: string): Promise<Comment> {
        return await this.prisma.comment.create({
            data: {
                author,
                text,
                image,
                date: new Date(),
                likes: 0,
                parent: ""
            }
        });
    }

    async deleteComment(id: string): Promise<Comment> {
        return await this.prisma.comment.delete({
            where: { id }
        });
    }

    async commentExists(id: string): Promise<boolean> {
        const count = await this.prisma.comment.count({
            where: { id }
        });
        return count > 0;
    }

    async importComments(comments: Array<{ id: string, author: string, text: string, date: string, likes: number, image: string, parent: string }>): Promise<void> {
        await Promise.all(
            comments.map(comment =>
                this.prisma.comment.create({
                    data: {
                        id: comment.id,
                        author: comment.author,
                        text: comment.text,
                        date: new Date(comment.date),
                        likes: comment.likes,
                        image: comment.image,
                        parent: comment.parent
                    }
                })
            )
        );
    }

    async deleteAllData(): Promise<void> {
        await this.prisma.comment.deleteMany();
    }
}