import React, { useState, useEffect, useContext } from "react";
import Post from "./Post";
import Search from "./Search";
import '../css/posts.css';
import { UserContext } from './context';
import Delete from "./Delete";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const { user } = useContext(UserContext);
  const [viewMyPosts, setViewMyPosts] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');

  useEffect(() => {
    fetchPosts()
  }, [user.id]);

  const fetchPosts = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3012/posts`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

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
      const response = await fetch('http://localhost:3012/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });

      const addedPost = await response.json();
      setPosts((prev) => [addedPost, ...prev]); 
      setNewPostTitle('');
      setNewPostBody('');
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  const handleEdit = (postId) => {
    console.log("Editing post", postId);
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

      <button 
        onClick={() => setViewMyPosts(prev => !prev)}
        style={{
          backgroundColor: viewMyPosts ? 'pink' : '', 
          color: viewMyPosts ? 'white' : ''
        }}
      >
        {viewMyPosts ? 'view all posts' : 'view my posts'}
      </button>
      <button onClick={() => setSearch("")}>
        Clear search
      </button>

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
        <div className="posts-list">
          {posts.filter(post =>
            ((post.title.toLowerCase().includes(search.toLowerCase()) ||
              post.id.toString().includes(search))) &&
            (!viewMyPosts || post.userId === user.id)
          ).map(post => (
            <div 
              key={post.id} 
              className="post" 
              onClick={() => setSelectedPost(post)}
              style={{
                backgroundColor: post.userId === user.id ? 'pink' : ''
              }}
            >
              <h3>{post.title}</h3>

            </div>
          ))}
          {loading && <p>Loading more posts...</p>}
        </div>

        <div className="post-details">
          {selectedPost ? (
            <Post post={selectedPost} setPosts={setPosts}setSelectedPost={setSelectedPost} />
          ) : (
            <div className="no-post">Nothing to show here</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Posts;
