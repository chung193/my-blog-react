import { useState, useEffect } from "react";
import Post from "./PostItem";
import Pagination from "./Pagination";
import Waiting from "./Waiting";
import apiService from "../services/common";
import { formatDate } from "../utils/formatDate";
import { useParams } from 'react-router-dom'

function Category() {
    const [posts, setPosts] = useState(null);
    const [categoryTitle, setCategoryTitle] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const { slug } = useParams()

    useEffect(() => {
        setPosts(null);
        setCategoryTitle("");
        setPage(1);
    }, [slug]);

    useEffect(() => {
        apiService.get(`client/post?category_slug=${slug}&page=${page}`)
            .then(response => {
                const rows = response.data.data;
                setPosts(rows);
                setPage(response.data.meta.current_page);
                setTotalPages(response.data.meta.last_page);
                const fallbackTitle = (slug || "").replace(/-/g, " ");
                setCategoryTitle(
                    response?.data?.meta?.category_name ||
                    rows?.[0]?.category?.name ||
                    fallbackTitle
                );
            })
            .catch(error => {
                console.error("Error fetching posts:", error);
            });
    }, [slug, page]);

    if (!posts) return <Waiting />;

    return (
        <>
            <h1 className="max-w-4xl w-full mx-auto mb-4 text-2xl sm:text-3xl font-bold text-gray-800">
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
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
            />
        </>
    );
}

export default Category;

