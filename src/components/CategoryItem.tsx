import { Link } from 'react-router-dom'
import { Eye, MessageCircle, Clock } from "lucide-react";

function Post({ id, name, description, date, views, comments }: { id: number | string; name: string; description: string, date: string; views: number; comments: number }) {
    return (
        <div className="max-w-4xl w-full mx-auto mb-4">
            <h2 className="text-lg sm:text-xl font-bold mb-2 leading-snug">
                <Link to={`/category/${id}`} className='hover:text-sky-900'>{name}</Link>
            </h2>
            <p className="mt-2 text-gray-700">{description}</p>
        </div >
    );
}

export default Post;
