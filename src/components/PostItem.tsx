import { Link } from "react-router-dom";
import { Eye, MessageCircle, Clock } from "lucide-react";

interface PostProps {
  slug: string;
  name: string;
  description: string;
  date: string;
  views: number;
  comments: number;
  categoryName: string;
  categorySlug: string;
}

function Post({ slug, name, description, date, views, comments, categoryName, categorySlug }: PostProps) {
  return (
    <article className="max-w-4xl w-full mx-auto mb-4 p-4 transition-colors dark:bg-slate-950">
      <Link
        to={`/category/${categorySlug}`}
        className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700 transition-colors hover:border-sky-300 hover:bg-sky-100 hover:text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-200 dark:hover:bg-sky-500/20"
      >
        {categoryName}
      </Link>
      <h2 className="text-lg sm:text-xl font-bold mb-2 leading-snug text-slate-900 dark:text-slate-100">
        <Link to={`/posts/${slug}`} className="transition-colors hover:text-sky-900 dark:hover:text-sky-300">
          {name}
        </Link>
      </h2>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 text-sm dark:text-slate-300">
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

      <p className="mt-2 text-slate-700 dark:text-slate-200">{description}</p>
    </article>
  );
}

export default Post;
