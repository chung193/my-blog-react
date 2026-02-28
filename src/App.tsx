import React, { useState, useEffect } from 'react';
import Footer from "./components/Footer";
import Header from "./components/Header";
import Post from "./components/Post";
import PostDetail from './components/PostDetail';
import BackToTop from "./components/BackToTop";
import DonateButton from "./components/Donate";
import Pagination from "./components/Pagination";
import { Routes, Route } from 'react-router-dom';
import apiService from "./services/common";
import { formatDate } from './utils/formatDate';
import { Helmet } from "react-helmet-async";
import Waiting from './components/Waiting';

function App() {
  const [posts, setPosts] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    apiService.get(`client/post`)
      .then(response => {
        setPosts(response.data.data);
        setPage(response.data.meta.current_page);
        setTotalPages(response.data.meta.last_page);
      })
      .catch(error => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>Trăn trở của 1 người khó ở</title>
        <meta name="description" content="Blog chia sẻ suy nghĩ, cảm xúc và trải nghiệm của một người khó ở." />
        <meta property="og:title" content="Trăn trở của 1 người khó ở" />
        <meta property="og:image" content="/default-thumbnail.jpg" />
      </Helmet>
      <Header />
      <DonateButton
        imageUrl="/donate.gif"
        donateUrl="https://me.momo.vn/yourname"
        tooltip="Mời anh ly cà phê ☕"
      />

      <div className="container mx-auto flex-1 px-8 py-4">
        {!posts &&
          <Waiting />
        }
        {posts &&
          <>
            <Routes>
              <Route path="/" element={
                <>
                  {posts.map((post) => (
                    <Post
                      key={post.id}
                      id={post.id}
                      name={post.name}
                      date={formatDate(post.created_at)}
                      description={post.description}
                      views={post.views}
                      comments={post.comments || 0}
                    />
                  ))}

                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(p) => setPage(p)}
                  />
                </>

              } />
              <Route path="/posts/:id" element={<PostDetail />} />
            </Routes>

          </>
        }
      </div>
      <Footer />
      <BackToTop />
    </div>
  )
}

export default App