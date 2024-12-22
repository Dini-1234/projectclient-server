import React, { useState, useEffect, useContext } from "react";
import Post from "./Post";
import Search from "./Search";
import './Posts.css'
import AddItem from "./AddItem";
import { UserContext } from './context';
const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const { user } = useContext(UserContext);
  const [viewMyPosts, setViewMyPosts] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);


  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const fetchPosts = async (page) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3010/posts?_page=${page}&_limit=10`);
      const data = await response.json();

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...data]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      if (hasMore && !loading) {
        setPage((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  return (
    <div>
      <Search
        search={search}
        setSearch={setSearch}
      />

      <button onClick={() => { setViewMyPosts(prev => !prev) }}>view my posts</button>
      <button onClick={() => setSearch("")}>
        נקה חיפוש
      </button>

      <AddItem
        type="posts"
        setMyItem={setPosts}
      />

      <div className="container">
        <div className="posts-list">
          {posts.filter(post =>
            (post.title.toLowerCase().includes(search.toLowerCase()) ||
              post.id.toString().includes(search)) &&
            (!viewMyPosts || post.userId === user.id)
          ).map(post => (
            <div key={post.id} className="post" onClick={() => setSelectedPost(post)}>
              <h3>{post.title}</h3>
            </div>
          ))}
        </div>

        <div className="post-details">
          {selectedPost ? (
            <Post post={selectedPost} setPosts={setPosts} />
          ) : (
            <div className="no-post">אין מה להראות כאן</div>
          )}
        </div>
      </div>

      {loading && <p>Loading more posts...</p>}
      {!hasMore && <p>No more posts to load.</p>}
    </div>
  );
};

export default Posts;