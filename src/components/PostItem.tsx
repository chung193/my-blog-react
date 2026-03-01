import { Link } from 'react-router-dom'
import { Eye, MessageCircle, Clock } from "lucide-react";

function Post({ slug, name, description, date, views, comments, categoryName, categorySlug }: { slug: string; name: string; description: string, date: string; views: number; comments: number }) {
    return (
        <div className="max-w-4xl w-full mx-auto mb-4">
<Link
  to={`/category/${categorySlug}`}
  className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700 transition-colors hover:border-sky-300 hover:bg-sky-100 hover:text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-300"
>
  {categoryName}
</Link>
            <h2 className="text-lg sm:text-xl font-bold mb-2 leading-snug">
                <Link to={`/posts/${slug}`} className='hover:text-sky-900'>{name}</Link>
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
