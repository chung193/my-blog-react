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
}

function Category() {
  const [posts, setPosts] = useState<PostRow[] | null>(null);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { slug } = useParams();

  useEffect(() => {
    setPosts(null);
    setCategoryTitle("");
    setPage(1);
  }, [slug]);

  useEffect(() => {
    apiService
      .get(`client/post?category_slug=${slug}&page=${page}`)
      .then((response) => {
        const rows = Array.isArray(response?.data?.data) ? response.data.data : [];
        setPosts(rows);
        setPage(response?.data?.meta?.current_page ?? 1);
        setTotalPages(response?.data?.meta?.last_page ?? 0);
        const fallbackTitle = (slug || "").replace(/-/g, " ");
        setCategoryTitle(response?.data?.meta?.category_name || rows?.[0]?.category?.name || fallbackTitle);
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
        Danh mục: {categoryTitle || "..."}
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

export default Category;
