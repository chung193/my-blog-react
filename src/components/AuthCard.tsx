import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="max-w-md w-full mx-auto my-8 px-4">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
        </div>

        {children}

        {footer && <div className="mt-6 text-sm text-center text-gray-600">{footer}</div>}
      </div>

      <p className="text-center text-xs text-gray-500 mt-4">
        <Link to="/" className="hover:text-gray-700 underline underline-offset-2">
          Quay về trang chủ
        </Link>
      </p>
    </div>
  );
}

export default AuthCard;
