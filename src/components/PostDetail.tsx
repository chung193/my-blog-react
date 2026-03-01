import { useEffect, useState } from 'react'
import apiService from '../services/common'
import { useParams } from 'react-router-dom'
import Comment from './Comment'
import { Helmet } from "react-helmet-async";
import Waiting from './Waiting';

interface User {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
}

interface PostDetailData {
    id: number;
    name: string;
    description: string;
    thumbnail?: string;
    avatar?: string;
    content: string;
    user?: User;
    category?: Category;
    comments?: unknown;
}

function PostDetail() {
    const { id } = useParams()
    const [post, setPost] = useState<PostDetailData | null>(null)
    const [comments, setComments] = useState<unknown[]>([])

    useEffect(() => {
        if (!id) {
            setPost(null)
            setComments([])
            return
        }

        let cancelled = false

        apiService.get(`client/post/${id}`)
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

        apiService.get(`client/post/${id}/comments`)
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
    }, [id])

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
                            <a href={`/category/${post.category?.id}`}>{post.category?.name || "Uncategorized"}</a>
                        </strong>
                    </h6>
                    <h1 className='text-2xl sm:text-3xl mt-2 mb-2 font-bold leading-tight'>{post.name}</h1>
                    <img src={post.avatar} className="rounded-lg" />
                    <p className="mt-2 text-gray-700 font-bold my-2">{post.description}</p>
                    <div
                        className="post-content prose prose-sm sm:prose max-w-none overflow-hidden [&_img]:max-w-full [&_img]:h-auto [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_table]:block [&_table]:overflow-x-auto"
                        dangerouslySetInnerHTML={{ __html: post.content.replace(/&nbsp;/g, ' ').replace(/\u00a0/g, ' ') }}
                    />
                    <p className="mt-2 text-gray-700"><strong>Author:</strong> <a href={`/user/${post.user?.id}`}>{post.user?.name || "Unknown Author"}</a></p>
                    <Comment key={id} comments={comments} postId={id || ""} />
                </div>
            }
        </div>
    );
}
export default PostDetail
