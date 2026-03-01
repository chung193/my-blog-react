import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import apiService from "../services/common";
import { ChevronDown, Clock3, FolderOpen, LogOut, MessageCircle } from "lucide-react";

interface MenuCategory {
  id?: number;
  slug: string;
  name: string;
}

type AuthProfile = {
  isAuthenticated: boolean;
  name: string;
  avatar: string;
};

const getAuthProfile = (): AuthProfile => {
  const rawUser = localStorage.getItem("user");
  if (!rawUser) {
    return { isAuthenticated: false, name: "", avatar: "" };
  }

  try {
    const parsed = JSON.parse(rawUser) as {
      token?: string;
      access_token?: string;
      name?: string;
      avatar?: string;
      user?: {
        name?: string;
        avatar?: string;
        image?: string;
        photo?: string;
      };
      image?: string;
      photo?: string;
    };

    const token = parsed?.token || parsed?.access_token;
    const name = parsed?.name || parsed?.user?.name || "";
    const avatar =
      parsed?.avatar ||
      parsed?.user?.avatar ||
      parsed?.image ||
      parsed?.user?.image ||
      parsed?.photo ||
      parsed?.user?.photo ||
      "";

    return { isAuthenticated: Boolean(token), name, avatar };
  } catch {
    return { isAuthenticated: false, name: "", avatar: "" };
  }
};

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [auth, setAuth] = useState<AuthProfile>(() => getAuthProfile());
  const [categories, setCategories] = useState<MenuCategory[]>([]);

  useEffect(() => {
    setAuth(getAuthProfile());
  }, [location.pathname]);

  useEffect(() => {
    let mounted = true;

    apiService
      .get("client/category", { page: 1 })
      .then((response) => {
        if (!mounted) return;
        const items = Array.isArray(response?.data?.data) ? response.data.data : [];
        const mapped = items
          .filter((item: unknown): item is { id?: number; slug: string; name: string } => {
            if (!item || typeof item !== "object") return false;
            const current = item as { id?: unknown; slug?: unknown; name?: unknown };
            return typeof current.slug === "string" && typeof current.name === "string";
          })
          .map((item: { id?: number; slug: string; name: string }) => ({
            id: item.id,
            slug: item.slug,
            name: item.name,
          }));
        setCategories(mapped);
      })
      .catch(() => {
        if (!mounted) return;
        setCategories([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setAuth(getAuthProfile());
    navigate("/login");
  };

  return (
    <header className="border-b border-gray-200">
      <div className="max-w-4xl w-full mx-auto h-16 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center space-x-2">
          <Logo />
        </div>
        <nav>
          <ul className="flex space-x-4 text-sm sm:text-base items-center h-full">
            <li>
              <Link to="/" className="hover:text-gray-400 flex items-center gap-1.5">
                <Clock3 className="w-4 h-4" />
                Mới nhất
              </Link>
            </li>
            <li className="relative group h-full flex items-center">
              <button className="hover:text-gray-400 cursor-pointer flex items-center gap-1.5 h-full">
                <FolderOpen className="w-4 h-4" />
                <span>Bài viết</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute right-0 top-[calc(100%+20px)] mt-0 w-56 bg-white border border-gray-200 rounded-b-lg shadow-lg py-1 z-50 opacity-0 invisible transition-all duration-150 group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible">

                {categories.slice(0, 8).map((category) => (
                  <Link
                    key={category.slug}
                    to={`/category/${category.slug}`}
                    className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    {category.name}
                  </Link>
                ))}

                {categories.length > 8 && (
                  <Link
                    to="/categories"
                    className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                  >
                    <FolderOpen className="w-4 h-4" />
                    Xem tất cả danh mục
                  </Link>
                )}
              </div>
            </li>
            {!auth.isAuthenticated && (
              <>
                <li>
                  <Link to="/login" className="hover:text-gray-400">
                    Đăng nhập
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-gray-400">
                    Đăng ký
                  </Link>
                </li>
              </>
            )}
            {auth.isAuthenticated && (
              <li className="relative group h-full flex items-center">
                <button className="flex items-center gap-2 cursor-pointer h-full">
                  {auth.avatar ? (
                    <img
                      src={auth.avatar}
                      alt={auth.name || "Người dùng"}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold flex items-center justify-center">
                      {(auth.name?.charAt(0) || "N").toUpperCase()}
                    </div>
                  )}
                  <span className="text-gray-700 max-w-32 truncate">{auth.name || "Người dùng"}</span>
                </button>
                <div className="absolute 
                    right-0 
                    top-[calc(100%+16px)] 
                    mt-0 
                    w-56 
                    bg-white 
                    border 
                    border-gray-200 
                    rounded-b-lg 
                    shadow-lg 
                    z-50 
                    opacity-0 
                    invisible 
                    transition-all 
                    duration-150 
                    group-hover:opacity-100 
                    group-hover:visible 
                    group-focus-within:opacity-100 
                    group-focus-within:visible"
                >
                  <Link
                    to="/my-comments"
                    className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-gray-500" />
                    Xem bình luận đã gửi
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
