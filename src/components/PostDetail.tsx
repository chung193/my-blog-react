import { useEffect, useState } from 'react'
import apiService from '../services/common'
import { useParams, Link } from 'react-router-dom'
import Comment from './Comment'
import { Helmet } from "react-helmet-async";
import Waiting from './Waiting';

function PostDetail() {
    const { id } = useParams()
    const [post, setPost] = useState(null)
    useEffect(() => {
        apiService.get(`client/post/${id}`)
            .then(response => {
                setPost(response.data.data)
            })
            .catch(error => {
                console.error("Error fetching post:", error)
            })
    }, [id])

    return (
        <div className="max-w-4xl w-4xl mx-auto mb-4">
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
                    <h6 className='text-1xl mt-2 mb-2'><strong><a href="">{post.category?.name || "Uncategorized"}</a></strong></h6>
                    <h1 className='text-3xl mt-2 mb-2'>{post.name}</h1>
                    <p className="mt-2 text-gray-700 font-bold my-2">{post.description}</p>
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    <p className="mt-2 text-gray-700"><strong>Author:</strong> {post.user?.name || "Unknown Author"}</p>
                    <Comment comments={post.comments || []} />
                </div>
            }
        </div>
    );
}
export default PostDetail