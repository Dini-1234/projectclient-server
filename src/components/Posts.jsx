import React, { useState, useEffect, useContext } from "react";
import Post from "./Post";
import Search from "./Search";
import '../css/posts.css';
import { UserContext } from './context';
import Delete from "./Delete";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const { user } = useContext(UserContext);
  const [viewMyPosts, setViewMyPosts] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  // מצב עבור הטופס להוספת פוסט חדש
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const fetchPosts = async (page) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3011/posts?_page=${page}`);
      const data = await response.json();

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...data.data]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  // פונקציה להוספת פוסט חדש
  const addPost = async () => {
    if (!newPostTitle || !newPostBody) {
      alert('Please enter both a title and a body for the post.');
      return;
    }

    try {
      const newPost = {
        userId: user.id,
        title: newPostTitle,
        body: newPostBody,
      }
      const response = await fetch('http://localhost:3011/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });

      const addedPost = await response.json();
      setPosts((prev) => [addedPost, ...prev]); // הוספת הפוסט החדש למצב המקומי
      setNewPostTitle(''); // ניקוי השדה
      setNewPostBody(''); // ניקוי השדה
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };
  // פונקציה לעריכת פוסט
  const handleEdit = (postId) => {
    console.log("Editing post", postId);
    // ניתן להוסיף קוד לעריכה של הפוסט
  };


  return (
    <div className="postsElements">
      <label htmlFor="search">Search</label>
      <input
        type="text"
        placeholder="search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: '5px', marginBottom: '10px' }}
      />

      <button onClick={() => setViewMyPosts(prev => !prev)}>View my posts</button>
      <button onClick={() => setSearch("")}>
        Clear search
      </button>

      {/* טופס להוספת פוסט חדש */}
      <div className="add-post-form">
        <input
          type="text"
          placeholder="Enter post title"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
        />
        <textarea
          placeholder="Enter post body"
          value={newPostBody}
          onChange={(e) => setNewPostBody(e.target.value)}
        />
        <button onClick={addPost}>Add Post</button>
      </div>

      <div className="container">
        <div
          className="posts-list"
        // onScroll={handleScroll}
        >
          {posts.filter(post =>
            (search && (post.title.toLowerCase().includes(search.toLowerCase()) ||
              post.id.toString().includes(search))) &&
            (!viewMyPosts || post.userId === user.id)
          ).map(post => (
            <div key={post.id} className="post" onClick={() => setSelectedPost(post)}>
              <h3>{post.title}</h3>
              {post.userId === user.id && (
                <div className="post-actions">
                  <button onClick={() => handleEdit(post.id)}>Edit</button>
                  <Delete setMyItem={setPosts} id={post.id} type="posts" />
                </div>
              )}
            </div>
          ))}
          {loading && <p>Loading more posts...</p>}
          {!hasMore && <p>No more posts to load.</p>}
        </div>

        <div className="post-details">
          {selectedPost ? (
            <Post post={selectedPost} setPosts={setPosts} />
          ) : (
            <div className="no-post">Nothing to show here</div>
          )}
        </div>
      </div>
    </div>
  );


};

export default Posts;
