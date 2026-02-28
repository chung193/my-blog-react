import { useState } from "react";
import apiService from "../services/common";
import { formatDate } from "../utils/formatDate";

interface User {
    id: number;
    name: string;
}

interface CommentType {
    id: number;
    body: string;
    user: User;
    replies: CommentType[];
    created_at: string;
}

interface CommentItemProps {
    comment: CommentType;
    postId: number | string;
    depth?: number;
    onReplyAdded: (parentId: number, reply: CommentType) => void;
}

interface CommentProps {
    comments: CommentType[];
    postId: number | string;
}

const CommentForm = ({
    postId,
    parentId = null,
    onSuccess,
    onCancel,
    placeholder = "Viết bình luận...",
}: {
    postId: number | string;
    parentId?: number | null;
    onSuccess: (comment: CommentType) => void;
    onCancel?: () => void;
    placeholder?: string;
}) => {
    const [name, setName] = useState("");
    const [body, setBody] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        if (!name.trim() || !body.trim()) {
            setError("Vui lòng điền tên và nội dung.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            const res = await apiService.post(`client/posts/${postId}/comments`, {
                name,
                body,
                parent_id: parentId,
            });
            onSuccess(res.data.data);
            setName("");
            setBody("");
        } catch {
            setError("Gửi thất bại, thử lại nhé.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-2 mb-3">
            <input
                type="text"
                placeholder="Tên của bạn"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <textarea
                placeholder={placeholder}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            <div className="flex flex-wrap gap-2 mt-2">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="cursor-pointer px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
                >
                    {loading ? "Đang gửi..." : "Gửi"}
                </button>
                {onCancel && (
                    <button
                        onClick={onCancel}
                        className="cursor-pointer px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded-lg transition-colors"
                    >
                        Huỷ
                    </button>
                )}
            </div>
        </div>
    );
};

const CommentItem = ({ comment, postId, depth = 0, onReplyAdded }: CommentItemProps) => {
    const [showReplyForm, setShowReplyForm] = useState(false);

    const handleReplySuccess = (reply: CommentType) => {
        onReplyAdded(comment.id, reply);
        setShowReplyForm(false);
    };

    return (
        <div className={`${depth > 0 ? "ml-4 sm:ml-8 border-l-2 border-gray-100 pl-3 sm:pl-4" : ""}`}>
            <div className="flex items-start gap-3 mb-1">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm shrink-0">
                    {comment.user?.name?.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                    <div className="bg-gray-50 rounded-xl px-4 py-2.5">
                        <p className="text-sm font-semibold text-gray-800">{comment.user?.name}</p>
                        <p className="text-sm text-gray-700 mt-0.5">{comment.body}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-1 ml-1">
                        <p className="text-xs text-gray-400">{formatDate(comment.created_at)}</p>
                        {depth < 3 && (
                            <button
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                className="cursor-pointer text-xs text-blue-500 hover:text-blue-700 transition-colors"
                            >
                                {showReplyForm ? "Huỷ" : "Trả lời"}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Form reply với animation smooth */}
            <div
                className={`ml-0 sm:ml-11 overflow-hidden transition-all duration-300 ease-in-out ${showReplyForm ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <CommentForm
                    postId={postId}
                    parentId={comment.id}
                    onSuccess={handleReplySuccess}
                    onCancel={() => setShowReplyForm(false)}
                    placeholder={`Trả lời ${comment.user?.name}...`}
                />
            </div>

            {/* Replies đệ quy */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-1 mb-3">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            postId={postId}
                            depth={depth + 1}
                            onReplyAdded={onReplyAdded}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const Comment = ({ comments: initialComments, postId }: CommentProps) => {
    const [comments, setComments] = useState<CommentType[]>(initialComments);

    const addReplyToTree = (nodes: CommentType[], parentId: number, reply: CommentType): CommentType[] => {
        return nodes.map((node) => {
            if (node.id === parentId) {
                return { ...node, replies: [...(node.replies || []), reply] };
            }
            if (node.replies?.length > 0) {
                return { ...node, replies: addReplyToTree(node.replies, parentId, reply) };
            }
            return node;
        });
    };

    const handleReplyAdded = (parentId: number, reply: CommentType) => {
        setComments((prev) => addReplyToTree(prev, parentId, reply));
    };

    const handleNewComment = (comment: CommentType) => {
        setComments((prev) => [...prev, comment]);
    };

    return (
        <div className="border-t border-gray-200 py-4 mt-4">
            <h3 className="font-semibold text-gray-700 mb-4">
                {comments.length} bình luận
            </h3>

            <CommentForm
                postId={postId}
                onSuccess={handleNewComment}
                placeholder="Viết bình luận của bạn..."
            />

            {comments.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-4">Chưa có bình luận nào.</p>
            ) : (
                <div className="mt-4">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            postId={postId}
                            onReplyAdded={handleReplyAdded}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Comment;
