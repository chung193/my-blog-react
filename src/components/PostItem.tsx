import { Link } from 'react-router-dom'
import { Eye, MessageCircle, Clock } from "lucide-react";

function Post({ id, name, description, date, views, comments }: { id: number | string; name: string; description: string, date: string; views: number; comments: number }) {
    return (
        <div className="max-w-4xl w-full mx-auto mb-4">
            <h2 className="text-lg sm:text-xl font-bold mb-2 leading-snug">
                <Link to={`/posts/${id}`} className='hover:text-sky-900'>{name}</Link>
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-500 text-sm">
                <div className="flex items-center gap-1.5">
                    <Clock size={16} />
                    <span>{date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Eye size={16} />
                    <span>{views}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <MessageCircle size={16} />
                    <span>{comments}</span>
                </div>
            </div>

            <p className="mt-2 text-gray-700">{description}</p>
        </div >
    );
}

export default Post;
