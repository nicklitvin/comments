import { API } from "./api";
import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";

export class Server {
    private api : API;
    private readonly URLS = {
        hi: "/api/hi",
        comments: "/api/comments",
        likeComment: "/api/comments/like/:id",
        updateComment: "/api/comments/update/:id",
        createComment: "/api/comments/create",
        deleteComment: "/api/comments/delete/:id"
    }

    constructor({ useBuild } : { useBuild: boolean }) {
        this.api = new API();
        const app = express();
        app.listen(process.env.WEB_PORT);
        app.use(express.json());

        app.use(cors({
            origin: process.env.WEB_IP,
            methods: ["GET", "POST", "PUT", "DELETE"],
            // credentials: true
        }));

        app.get(this.URLS.hi, this.hi.bind(this));
        app.get(this.URLS.comments, this.getComments.bind(this));
        app.post(this.URLS.likeComment, this.likeComment.bind(this));
        app.put(this.URLS.updateComment, this.updateComment.bind(this));
        app.post(this.URLS.createComment, this.createComment.bind(this));
        app.delete(this.URLS.deleteComment, this.deleteComment.bind(this));

        if (useBuild) {
            app.use(express.static(path.join(__dirname, "../../web/dist")));
            app.get("*", (req, res) => {
                res.sendFile(path.join(__dirname, "../../web/dist"));
            });
        }
    }

    async deleteAllData() {
        try {
            await this.api.db.deleteAllData();
            console.log("All data deleted from the database.");
        } catch (err) {
            console.error("Failed to delete all data:", err);
        }
    }

    async importComments() {
        try {
            const filePath = path.join(__dirname, "../../comments.json");
            const data = fs.readFileSync(filePath, "utf-8");
            const { comments } = JSON.parse(data);

            await this.api.db.importComments(comments);

            console.log("Comments imported successfully.");
        } catch (err) {
            console.error("Failed to import comments:", err);
        }
    }

    async hi(req : Request, res : Response) {
        try {
            const out = await this.api.hi();
            return res.status(out.message ? 400 : 200).json(out);
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    async getComments(req: Request, res: Response) {
        try {
            const out = await this.api.getComments();
            return res.status(out.message ? 400 : 200).json(out);
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    async likeComment(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { increment } = req.body;
            const out = await this.api.likeComment(id, increment);
            return res.status(out.message ? 400 : 200).json(out);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }

    async updateComment(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { text } = req.body;
            const out = await this.api.updateComment(id, text);
            return res.status(out.message ? 400 : 200).json(out);
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    async createComment(req: Request, res: Response) {
        try {
            const { text, image } = req.body;
            const out = await this.api.createComment(text, image);
            return res.status(out.message ? 400 : 200).json(out);
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    async deleteComment(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const out = await this.api.deleteComment(id);
            return res.status(out.message ? 400 : 200).send(out.message ? out : undefined);
        } catch (err) {
            return res.status(500).json(err);
        }
    }
}