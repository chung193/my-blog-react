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

function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Helmet mặc định chỉ hiện ở trang chủ, PostDetail tự override */}
      {isHome && (
        <Helmet>
          <title>Trăn trở của 1 người khó ở</title>
          <meta name="description" content="Blog chia sẻ suy nghĩ, cảm xúc và trải nghiệm của một người khó ở." />
          <meta property="og:title" content="Trăn trở của 1 người khó ở" />
          <meta property="og:image" content="/default-thumbnail.jpg" />
        </Helmet>
      )}

      <Header />
      <DonateButton
        imageUrl="/donate.gif"
        donateUrl="https://me.momo.vn/yourname"
        tooltip="Mời anh ly cà phê ☕"
      />

      <div className="container mx-auto flex-1 px-4 py-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/category/:id" element={<Category />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/user/:id" element={<PostWithUser />} />
        </Routes>
      </div>

      <Footer />
      <BackToTop />
    </div>
  );
}

export default App;
