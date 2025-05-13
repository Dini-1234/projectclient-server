import { useState, useEffect, useContext } from "react";
import Post from "./Post";
import '../css/posts.css';
import { UserContext } from './context';
import AddItem from "./AddItem";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  const [viewMyPosts, setViewMyPosts] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen] = useState(false);
  const postFields = [{ name: "title", inputType: "text" }, { name: "body", inputType: "textArea" }];
  const initialObject = { user_id: user?.id };

  useEffect(() => {
    fetchPosts()
  }, [user?.id]);

  const fetchPosts = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/posts`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`postsElements ${isModalOpen ? 'modal-open' : ''}`}>
      {user && <button
        onClick={() => setViewMyPosts(prev => !prev)}
        style={{
          backgroundColor: viewMyPosts ? 'pink' : '',
          color: viewMyPosts ? 'white' : ''
        }}
      >
        {viewMyPosts ? 'view all posts' : 'view my posts'}
      </button>}
      {user && <AddItem fields={postFields} initialObject={initialObject} type="posts" setData={setPosts} />}      <div className="container">
        <div className="posts-list">
          {posts
          .map(post => (
            <div
              key={post.id}
              className="post"
              onClick={() => setSelectedPost(post)}
              style={{
                backgroundColor: post.user_id === user?.id ? 'pink' : ''
              }}
            >
              <h3>{post.title}</h3>
            </div>
          ))}
          {loading && <p>Loading more posts...</p>}
        </div>

        <div className="post-details">
          {selectedPost && (!viewMyPosts || (selectedPost.user_id === user.id)) ? (
            <Post post={selectedPost} setPosts={setPosts} setSelectedPost={setSelectedPost} />
          ) : (
            <div className="no-post">Nothing to show here</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Posts;