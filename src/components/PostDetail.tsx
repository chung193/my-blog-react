import { useEffect, useState } from 'react'
import apiService from '../services/common'
import { useParams } from 'react-router-dom'
import Comment from './Comment'
import { Helmet } from "react-helmet-async";
import Waiting from './Waiting';

interface User {
    id: number;
    name: string;
    slug?: string;
}

interface Category {
    id: number;
    name: string;
    slug?: string;
}

interface PostDetailData {
    id: number;
    slug?: string;
    name: string;
    description: string;
    thumbnail?: string;
    avatar?: string;
    content: string;
    user?: User;
    category?: Category;
    comments?: unknown;
}

const toSlug = (value: string): string => {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

function PostDetail() {
    const { slug } = useParams()
    const [post, setPost] = useState<PostDetailData | null>(null)
    const [comments, setComments] = useState<unknown[]>([])

    useEffect(() => {
        if (!slug) {
            setPost(null)
            setComments([])
            return
        }

        let cancelled = false

        apiService.get(`client/post/${slug}`)
            .then(response => {
                if (cancelled) return

                const postData = response.data.data as PostDetailData
                setPost(postData)
                setComments(Array.isArray(postData?.comments) ? postData.comments : [])
            })
            .catch(error => {
                if (cancelled) return
                setPost(null)
                setComments([])
                console.error("Error fetching post:", error)
            })

        apiService.get(`client/post/${slug}/comments`)
            .then(response => {
                if (cancelled) return
                const serverComments = response?.data?.data
                if (Array.isArray(serverComments)) {
                    setComments(serverComments)
                }
            })
            .catch(error => {
                if (cancelled) return
                console.error("Error fetching comments:", error)
            })

        return () => {
            cancelled = true
        }
    }, [slug])

    return (
        <div className="max-w-4xl w-full mx-auto mb-4 break-words min-w-0">
            {post && (
                <Helmet>
                    <title>{post.name} || Trăn trở của 1 người khó ở</title>
                    <meta name="description" content={post.description || ""} />
                    <meta property="og:title" content={post.name} />
                    <meta property="og:image" content={post.thumbnail || ""} />
                </Helmet>
            )}
            {!post && <Waiting />}
            {post &&
                <div>
                    <h6 className='text-1xl mt-2 mb-2 text-gray-500 hover:text-gray-700'>
                        <strong>
                            <a href={`/category/${post.category?.slug || post.category?.id}`} className='inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700 transition-colors hover:border-sky-300 hover:bg-sky-100 hover:text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-300'>
                                {post.category?.name || "Uncategorized"}
                            </a>
                        </strong>
                    </h6>
                    <h1 className='text-2xl sm:text-3xl mt-2 mb-2 font-bold leading-tight'>{post.name}</h1>
                    <img src={post.avatar} className="rounded-lg" />
                    <p className="mt-2 text-gray-700 font-bold my-2">{post.description}</p>
                    <div
                        className="post-content prose prose-sm sm:prose max-w-none overflow-hidden [&_img]:max-w-full [&_img]:h-auto [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_table]:block [&_table]:overflow-x-auto"
                        dangerouslySetInnerHTML={{ __html: post.content.replace(/&nbsp;/g, ' ').replace(/\u00a0/g, ' ') }}
                    />
                    <div className="mt-4 mb-1">
                        <a
                            href={`/user/${post.user?.slug || (post.user?.name ? toSlug(post.user.name) : post.user?.id)}`}
                            className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-white to-gray-50 px-3 py-2 transition-colors hover:from-sky-50 hover:to-white"
                        >
                            <div className="h-9 w-9 rounded-full bg-sky-100 text-sky-700 font-semibold flex items-center justify-center">
                                {(post.user?.name?.charAt(0) || "U").toUpperCase()}
                            </div>
                            <div className="leading-tight">
                                <p className="text-[11px] uppercase tracking-wide text-sky-600 font-semibold">Tác giả</p>
                                <p className="text-sm font-medium text-gray-800 hover:text-sky-800">
                                    {post.user?.name || "Unknown Author"}
                                </p>
                            </div>
                        </a>
                    </div>
                    <Comment key={slug} comments={comments} postSlug={slug || ""} />
                </div>
            }
        </div>
    );
}
export default PostDetail
