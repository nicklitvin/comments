import { useState, useEffect } from "react";
import { callAPI, Comment } from "../lib/utils";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Pencil, Trash } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function Home() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [updatedText, setUpdatedText] = useState<string>("");
    const [newCommentText, setNewCommentText] = useState<string>("");
    const [newCommentImage, setNewCommentImage] = useState<string>("");

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

    const updateCommentState = (id: string, newComment: Comment) => {
        setComments((prev) =>
            prev.map((comment) =>
                comment.id === id ? newComment : comment
            )
        );
    };

    const toggleLike = async (id: string, increment: boolean) => {
        const updatedComment = await callAPI<Comment>({
            method: "POST",
            url: `/comments/like/${id}`,
            payload: { increment },
        });
        if (updatedComment) {
            updateCommentState(id, updatedComment);
        }
    };

    const updateComment = async (id: string) => {
        const newComment = await callAPI<Comment>({
            method: "PUT",
            url: `/comments/update/${id}`,
            payload: { text: updatedText },
        });
        if (newComment) {
            updateCommentState(id, newComment)
        }
        setEditingCommentId(null);
    };

    const deleteComment = async (id: string) => {
        await callAPI({
            method: "DELETE",
            url: `/comments/delete/${id}`,
        });
        setComments((prev) => prev.filter((comment) => comment.id !== id));
    };

    const addComment = async () => {
        const newComment = await callAPI<Comment>({
            method: "POST",
            url: "/comments/create",
            payload: { text: newCommentText, image: newCommentImage, author: "Admin" },
        });

        if (newComment) {
            setComments((prev) => [newComment, ...prev]);
            setNewCommentText("");
            setNewCommentImage("");
            toast.success("Comment added successfully!");
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4 self-start">Add Comment</h2>
            <div className="w-full max-w-3xl p-4 border rounded mb-4">
                <p className="mb-2 self-start text-gray-600">Commenting as: Admin</p>
                <Textarea
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full mb-2"
                />
                <Textarea
                    value={newCommentImage}
                    onChange={(e) => setNewCommentImage(e.target.value)}
                    placeholder="Image URL (optional)"
                    className="w-full mb-2"
                />
                <Button onClick={addComment} className="self-end">
                    Publish
                </Button>
            </div>
            <h2 className="text-2xl font-bold mb-4 self-start">Comment History</h2>
            <div className="w-full max-w-3xl space-y-4">
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
                            <span className="flex space-x-2">
                                {editingCommentId !== comment.id && (
                                    <>
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
                                        <Button
                                            variant="ghost"
                                            className="p-1"
                                            onClick={() => deleteComment(comment.id)}
                                        >
                                            <Trash className="w-5 h-5 text-red-500 hover:text-red-700" />
                                        </Button>
                                    </>
                                )}
                            </span>
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
                                    <Button 
                                        onClick={() => updateComment(comment.id)} 
                                        disabled={updatedText === comment.text}
                                    >
                                        Save
                                    </Button>
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