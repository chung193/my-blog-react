import { useState, useEffect } from "react";
import Post from "./PostItem";
import Pagination from "./Pagination";
import Waiting from "./Waiting";
import apiService from "../services/common";
import { formatDate } from "../utils/formatDate";

function HomePage() {
    const [posts, setPosts] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        apiService.get(`client/post?page=${page}`)
            .then(response => {
                setPosts(response.data.data);
                setPage(response.data.meta.current_page);
                setTotalPages(response.data.meta.last_page);
            })
            .catch(error => {
                console.error("Error fetching posts:", error);
            });
    }, [page]);

    if (!posts) return <Waiting />;

    return (
        <>
            <h1 className="max-w-4xl w-full mx-auto mb-4 text-2xl sm:text-3xl font-bold text-gray-800">
                Mới nhất
            </h1>
            {posts && posts.map((post) => (
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

export default HomePage;
