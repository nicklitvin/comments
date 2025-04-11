import { APIOutput } from "./types";
import { DB } from "./db";
import { Comment } from "@prisma/client";

export class API {
    public db: DB;

    constructor() {
        this.db = new DB();
    }

    async hi(): Promise<APIOutput<string>> {
        return Promise.resolve({
            data: "hi"
        });
    }

    async getComments(): Promise<APIOutput<Comment[]>> {
        const comments = await this.db.getComments();
        return { data: comments };
    }

    async likeComment(id: string, increment: boolean): Promise<APIOutput<Comment>> {
        const commentExists = await this.db.commentExists(id);
        if (!commentExists) {
            return { message: "Comment not found." };
        }
        const updatedComment = await this.db.likeComment(id, increment);
        return { data: updatedComment};
    }

    async updateComment(id: string, text: string): Promise<APIOutput<Comment>> {
        const commentExists = await this.db.commentExists(id);
        if (!commentExists) {
            return { message: "Comment not found." };
        }
        const updatedComment = await this.db.updateComment(id, text);
        return { data: updatedComment };
    }

    async createComment(text: string, image: string): Promise<APIOutput<Comment>> {
        const newComment = await this.db.createComment(text, image);
        return { data: newComment };
    }

    async deleteComment(id: string): Promise<APIOutput<void>> {
        const commentExists = await this.db.commentExists(id);
        if (!commentExists) {
            return { message: "Comment not found." };
        }
        await this.db.deleteComment(id);
        return {};
    }
}