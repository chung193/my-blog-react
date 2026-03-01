import { useState, useEffect } from "react";
import Category from "./CategoryItem";
import Pagination from "./Pagination";
import Waiting from "./Waiting";
import apiService from "../services/common";
import { formatDate } from "../utils/formatDate";
import { useParams } from 'react-router-dom'

function Categories() {
    const [categories, setCategories] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        apiService.get(`client/category`)
            .then(response => {
                setCategories(response.data.data);
                setPage(response.data.meta.current_page);
                setTotalPages(response.data.meta.last_page);
            })
            .catch(error => {
                console.error("Error fetching categories:", error);
            });
    }, [page]);

    if (!categories) return <Waiting />;

    return (
        <>
            {categories.map((post) => (
                <Category
                    key={post.slug || post.id}
                    slug={post.slug || String(post.id)}
                    name={post.name}
                    date={formatDate(post.created_at)}
                    description={post.description}
                    views={post.views}
                    comments={post.comments || 0}
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

export default Categories;
