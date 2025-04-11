import { useState, useEffect } from "react";
import { callAPI, Comment } from "../lib/utils";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Pencil } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export function Home() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [updatedText, setUpdatedText] = useState<string>("");

    const fetchComments = async () => {
        const response = await callAPI<Comment[]>({
            method: "GET",
            url: "/comments",
        });
        setComments(response || []);
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const updateCommentLikes = (id: string, delta: number) => {
        setComments((prev) =>
            prev.map((comment) =>
                comment.id === id ? { ...comment, likes: comment.likes + delta } : comment
            )
        );
    };

    const toggleLike = async (id: string, increment: boolean) => {
        try {
            updateCommentLikes(id, increment ? 1 : -1);
            const response = await callAPI<Comment>({
                method: "POST",
                url: `/comments/like/${id}`,
                payload: { increment },
            });
            if (!response) throw new Error("Failed to update like");
        } catch {
            updateCommentLikes(id, increment ? -1 : 1);
        }
    };

    const updateCommentText = (id: string, text: string) => {
        setComments((prev) =>
            prev.map((comment) =>
                comment.id === id ? { ...comment, text } : comment
            )
        );
    };

    const updateComment = async (id: string) => {
        try {
            await callAPI({
                method: "PUT",
                url: `/comments/update/${id}`,
                payload: { text: updatedText },
            });
            updateCommentText(id, updatedText);
            setEditingCommentId(null);
        } catch (error) {
            console.error("Failed to update comment:", error);
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center">
            <div className="space-y-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="border p-4 rounded">
                        {comment.image && (
                            <img
                                src={comment.image}
                                alt="Comment"
                                className="w-full h-48 object-contain mb-2 rounded"
                            />
                        )}
                        <p className="font-bold text-xl flex justify-between items-center h-9">
                            {comment.author}
                            {editingCommentId !== comment.id && ( 
                                <Button
                                    variant="ghost"
                                    className="p-1"
                                    onClick={() => {
                                        setEditingCommentId(comment.id);
                                        setUpdatedText(comment.text); 
                                    }}
                                >
                                    <Pencil className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                                </Button>
                            )}
                        </p>
                        <p className="text-sm text-gray-500">{new Date(comment.date).toLocaleString()}</p>
                        {editingCommentId === comment.id ? (
                            <>
                                <Textarea
                                    value={updatedText}
                                    onChange={(e) => setUpdatedText(e.target.value)}
                                    className="border p-2 w-full"
                                />
                                <div className="flex items-center space-x-2 mt-2">
                                    <Button onClick={() => updateComment(comment.id)}>Save</Button>
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setEditingCommentId(null);
                                            setUpdatedText("");
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p>{comment.text}</p>
                                <div className="flex items-center space-x-2 mt-2">
                                    <div className="flex items-center space-x-0.5">
                                        <Button
                                            variant="ghost"
                                            onClick={() => toggleLike(comment.id, true)}
                                        >
                                            <ThumbsUp className="w-5 h-5 text-blue-500" />
                                        </Button>
                                        <span>{comment.likes}</span>
                                        <Button
                                            variant="ghost"
                                            onClick={() => toggleLike(comment.id, false)}
                                        >
                                            <ThumbsDown className="w-5 h-5 text-gray-500" />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}