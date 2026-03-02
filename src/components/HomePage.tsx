import { useState, useEffect } from "react";
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
}

function HomePage() {
  const [posts, setPosts] = useState<PostRow[] | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    apiService
      .get(`client/post?page=${page}`)
      .then((response) => {
        const rows = Array.isArray(response?.data?.data) ? response.data.data : [];
        setPosts(rows);
        setPage(response?.data?.meta?.current_page ?? 1);
        setTotalPages(response?.data?.meta?.last_page ?? 0);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setPosts([]);
      });
  }, [page]);

  if (!posts) return <Waiting />;

  return (
    <>
      <h1 className="max-w-4xl w-full mx-auto mb-4 text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">Mới nhất</h1>
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
    </>
  );
}

export default HomePage;
