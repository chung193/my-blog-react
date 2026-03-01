import { Routes, Route, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import DonateButton from "./components/Donate";
import HomePage from "./components/HomePage";
import PostDetail from "./components/PostDetail";
import Category from "./components/Category";
import Categories from "./components/Categories";
import PostWithUser from "./components/PostWithUser";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import MyComments from "./components/MyComments";

function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const authPaths = ["/login", "/register", "/forgot-password", "/reset-password"];
  const isAuthPage = authPaths.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {isHome && (
        <Helmet>
          <title>Tran tro cua 1 nguoi kho o</title>
          <meta name="description" content="Blog chia se suy nghi, cam xuc va trai nghiem cua mot nguoi kho o." />
          <meta property="og:title" content="Tran tro cua 1 nguoi kho o" />
          <meta property="og:image" content="/default-thumbnail.jpg" />
        </Helmet>
      )}

      <Header />
      {!isAuthPage && (
        <DonateButton
          imageUrl="/donate.gif"
          donateUrl="https://me.momo.vn/yourname"
          tooltip="Mời anh ly cafe ☕"
        />
      )}

      <div className="container mx-auto flex-1 px-4 py-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts/:slug" element={<PostDetail />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/user/:slug" element={<PostWithUser />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/my-comments" element={<MyComments />} />
        </Routes>
      </div>

      <Footer />
      <BackToTop />
    </div>
  );
}

export default App;
