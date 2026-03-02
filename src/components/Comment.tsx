import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

interface ApiCommentShape {
  id?: number;
  body?: string;
  created_at?: string;
  user?: User | null;
  name?: string;
  replies?: ApiCommentShape[] | null;
  children?: ApiCommentShape[] | null;
}

interface CommentItemProps {
  comment: CommentType;
  postSlug: string;
  depth?: number;
  canReply: boolean;
  isAuthenticated: boolean;
  onReplyAdded: (parentId: number, reply: CommentType) => void;
}

interface CommentProps {
  comments: unknown;
  postSlug: string;
}

const normalizeComment = (input: unknown): CommentType | null => {
  if (!input || typeof input !== "object") {
    return null;
  }

  const raw = input as ApiCommentShape;
  if (typeof raw.id !== "number" || typeof raw.body !== "string") {
    return null;
  }

  const fallbackName =
    typeof raw.name === "string" && raw.name.trim() ? raw.name.trim() : "Ẩn danh";
  const user =
    raw.user && typeof raw.user.id === "number" && typeof raw.user.name === "string"
      ? raw.user
      : { id: 0, name: fallbackName };

  const nested = Array.isArray(raw.replies)
    ? raw.replies
    : Array.isArray(raw.children)
      ? raw.children
      : [];
  const replies = nested
    .map(normalizeComment)
    .filter((item): item is CommentType => item !== null);

  return {
    id: raw.id,
    body: raw.body,
    created_at: raw.created_at ?? new Date().toISOString(),
    user,
    replies,
  };
};

const normalizeComments = (input: unknown): CommentType[] => {
  if (!Array.isArray(input)) {
    return [];
  }

  return input.map(normalizeComment).filter((item): item is CommentType => item !== null);
};

const getAuthUser = (): { isAuthenticated: boolean; name: string; avatar: string } => {
  const rawUser = localStorage.getItem("user");
  if (!rawUser) {
    return { isAuthenticated: false, name: "", avatar: "" };
  }

  try {
    const parsed = JSON.parse(rawUser) as {
      token?: string;
      access_token?: string;
      name?: string;
      avatar?: string;
      data?: {
        token?: string;
        access_token?: string;
        name?: string;
        avatar?: string;
      };
      image?: string;
      photo?: string;
      user?: {
        token?: string;
        access_token?: string;
        name?: string;
        avatar?: string;
        image?: string;
        photo?: string;
      };
    };

    const token =
      parsed?.token ||
      parsed?.access_token ||
      parsed?.data?.token ||
      parsed?.data?.access_token ||
      parsed?.user?.token ||
      parsed?.user?.access_token;
    const name =
      typeof parsed?.name === "string"
        ? parsed.name
        : typeof parsed?.data?.name === "string"
          ? parsed.data.name
        : typeof parsed?.user?.name === "string"
          ? parsed.user.name
          : "";
    const avatar =
      parsed?.avatar ||
      parsed?.data?.avatar ||
      parsed?.user?.avatar ||
      parsed?.image ||
      parsed?.user?.image ||
      parsed?.photo ||
      parsed?.user?.photo ||
      "";

    return { isAuthenticated: Boolean(token), name, avatar };
  } catch {
    return { isAuthenticated: false, name: "", avatar: "" };
  }
};

const CommentForm = ({
  postSlug,
  parentId = null,
  isAuthenticated,
  onSuccess,
  onCancel,
  placeholder = "Viết bình luận...",
}: {
  postSlug: string;
  parentId?: number | null;
  isAuthenticated: boolean;
  onSuccess: (comment: CommentType) => void;
  onCancel?: () => void;
  placeholder?: string;
}) => {
  const [guestName, setGuestName] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!isAuthenticated && !guestName.trim()) {
      setError("Vui lòng nhập tên khách.");
      return;
    }

    if (!body.trim()) {
      setError("Vui lòng nhập nội dung bình luận.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload: { body: string; parent_id?: number; guest_name?: string } = {
        body: body.trim(),
      };

      if (!isAuthenticated) {
        payload.guest_name = guestName.trim();
      }

      if (parentId !== null) {
        payload.parent_id = parentId;
      }

      const res = isAuthenticated
        ? await apiService.authPost(`client/post/${postSlug}/comments`, payload)
        : await apiService.post(`client/post/${postSlug}/comments`, payload);
      const createdComment = normalizeComment(res?.data?.data);
      if (!createdComment) {
        throw new Error("Invalid comment response");
      }

      onSuccess(createdComment);
      if (!isAuthenticated) {
        setGuestName("");
      }
      setBody("");
    } catch {
      setError("Gửi thất bại, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2 mb-3">
      {!isAuthenticated && (
        <input
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder="Nhập tên khách..."
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        />
      )}
      <textarea
        placeholder={placeholder}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={2}
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
      />
      {error && <p className="text-xs text-sky-700 mt-1">{error}</p>}
      <div className="flex flex-wrap gap-2 mt-2">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="cursor-pointer px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Đang gửi..." : "Gửi"}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="cursor-pointer px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm rounded-lg transition-colors dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200"
          >
            Hủy
          </button>
        )}
      </div>
    </div>
  );
};

const CommentItem = ({
  comment,
  postSlug,
  depth = 0,
  canReply,
  isAuthenticated,
  onReplyAdded,
}: CommentItemProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReplySuccess = (reply: CommentType) => {
    onReplyAdded(comment.id, reply);
    setShowReplyForm(false);
  };

  return (
    <div className={`${depth > 0 ? "ml-4 sm:ml-8 border-l-2 border-slate-100 pl-3 sm:pl-4 dark:border-slate-700" : ""}`}>
      <div className="flex items-start gap-3 mb-1">
        <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-semibold text-sm shrink-0 dark:bg-slate-700 dark:text-slate-100">
          {comment.user?.name?.charAt(0).toUpperCase() || "?"}
        </div>

        <div className="flex-1">
          <div className="bg-slate-50 rounded-xl px-4 py-2.5 dark:bg-slate-800">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{comment.user?.name}</p>
            <p className="text-sm text-slate-700 mt-0.5 dark:text-slate-300">{comment.body}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-1 ml-1">
            <p className="text-xs text-slate-400 dark:text-slate-500">{formatDate(comment.created_at)}</p>
            {canReply && depth < 3 && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="cursor-pointer text-xs text-sky-600 hover:text-sky-800 transition-colors dark:text-sky-300 dark:hover:text-sky-200"
              >
                {showReplyForm ? "Hủy" : "Trả lời"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div
        className={`ml-0 sm:ml-11 overflow-hidden transition-all duration-300 ease-in-out ${
          showReplyForm ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <CommentForm
          postSlug={postSlug}
          parentId={comment.id}
          isAuthenticated={isAuthenticated}
          onSuccess={handleReplySuccess}
          onCancel={() => setShowReplyForm(false)}
          placeholder={`Trả lời ${comment.user?.name}...`}
        />
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-1 mb-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postSlug={postSlug}
              depth={depth + 1}
              canReply={canReply}
              isAuthenticated={isAuthenticated}
              onReplyAdded={onReplyAdded}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Comment = ({ comments: initialComments, postSlug }: CommentProps) => {
  const [comments, setComments] = useState<CommentType[]>(() => normalizeComments(initialComments));
  const [auth, setAuth] = useState(() => getAuthUser());

  useEffect(() => {
    setComments(normalizeComments(initialComments));
  }, [initialComments, postSlug]);

  useEffect(() => {
    setAuth(getAuthUser());
  }, []);

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
    <div className="border-t border-slate-200 py-4 mt-4 dark:border-slate-700">
      <h3 className="font-semibold text-slate-700 mb-4 dark:text-slate-200">{comments.length} bình luận</h3>
      {auth.isAuthenticated ? (
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-2 dark:text-slate-300">
          {auth.avatar ? (
            <img
              src={auth.avatar}
              alt={auth.name || "Người dùng"}
              className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-600"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold flex items-center justify-center dark:bg-slate-700 dark:text-slate-100">
              {(auth.name?.charAt(0) || "N").toUpperCase()}
            </div>
          )}
          <p>
            Đăng nhập với tên <span className="font-semibold text-slate-800 dark:text-slate-100">{auth.name || "Người dùng"}</span>
          </p>
        </div>
      ) : (
        <p className="text-sm text-slate-600 mb-2 dark:text-slate-300">
          Bạn đang bình luận với tư cách khách. Có thể{" "}
          <Link to="/login" className="text-sky-700 hover:text-sky-800 font-medium dark:text-sky-300 dark:hover:text-sky-200">
            đăng nhập
          </Link>{" "}
          để gửi bình luận bằng tài khoản.
        </p>
      )}

      <CommentForm
        postSlug={postSlug}
        isAuthenticated={auth.isAuthenticated}
        onSuccess={handleNewComment}
        placeholder="Viết bình luận của bạn..."
      />

      {comments.length === 0 ? (
        <p className="text-center text-slate-400 text-sm py-4 dark:text-slate-500">Chưa có bình luận nào.</p>
      ) : (
        <div className="mt-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postSlug={postSlug}
              canReply={true}
              isAuthenticated={auth.isAuthenticated}
              onReplyAdded={handleReplyAdded}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;


