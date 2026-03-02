import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Post from "./PostItem";
import Pagination from "./Pagination";
import Waiting from "./Waiting";
import apiService from "../services/common";
import { formatDate } from "../utils/formatDate";

interface PostRow {
  id?: number | string;
  slug?: string;
  name: string;
  created_at: string;
  description: string;
  views: number;
  comments?: number;
  category?: {
    name?: string;
    slug?: string;
  };
  user?: {
    name?: string;
  };
}

function PostWithUser() {
  const [posts, setPosts] = useState<PostRow[] | null>(null);
  const [authorTitle, setAuthorTitle] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { slug } = useParams();

  useEffect(() => {
    setPosts(null);
    setAuthorTitle("");
    setPage(1);
  }, [slug]);

  useEffect(() => {
    apiService
      .get(`client/post?user_slug=${slug}&page=${page}`)
      .then((response) => {
        const rows = Array.isArray(response?.data?.data) ? response.data.data : [];
        setPosts(rows);
        setPage(response?.data?.meta?.current_page ?? 1);
        setTotalPages(response?.data?.meta?.last_page ?? 0);
        const fallbackTitle = (slug || "").replace(/-/g, " ");
        setAuthorTitle(response?.data?.meta?.user_name || rows?.[0]?.user?.name || fallbackTitle);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setPosts([]);
      });
  }, [slug, page]);

  if (!posts) return <Waiting />;

  return (
    <section className="rounded-2xl p-4 sm:p-5 dark:border-slate-800">
      <h1 className="max-w-4xl w-full mx-auto mb-4 text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
        Tác giả: {authorTitle || "..."}
      </h1>
      {posts.map((post) => (
        <Post
          key={post.slug || post.id}
          slug={post.slug || String(post.id)}
          name={post.name}
          date={formatDate(post.created_at)}
          description={post.description}
          views={post.views}
          comments={post.comments || 0}
          categoryName={post.category?.name || "Uncategorized"}
          categorySlug={post.category?.slug || "uncategorized"}
        />
      ))}
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
    </section>
  );
}

export default PostWithUser;
