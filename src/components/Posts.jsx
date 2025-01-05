// import React, { useState, useEffect, useContext } from "react";
// import Post from "./Post";
// import Search from "./Search";
// import '../css/posts.css';
// import { UserContext } from './context';

// const Posts = () => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [search, setSearch] = useState('');
//   const { user } = useContext(UserContext);
//   const [viewMyPosts, setViewMyPosts] = useState(false);
//   const [selectedPost, setSelectedPost] = useState(null);
//   const [newPostTitle, setNewPostTitle] = useState('');
//   const [newPostBody, setNewPostBody] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     fetchPosts()
//   }, [user.id]);

//   const fetchPosts = async () => {
//     if (loading) return;
//     setLoading(true);
//     try {
//       const response = await fetch(`http://localhost:3012/posts`);
//       const data = await response.json();
//       setPosts(data);
//     } catch (error) {
//       console.error("Error fetching posts:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addPost = async () => {
//     if (!newPostTitle || !newPostBody) {
//       alert('Please enter both a title and a body for the post.');
//       return;
//     }

//     try {
//       const newPost = {
//         userId: user.id,
//         title: newPostTitle,
//         body: newPostBody,
//       };
//       const response = await fetch('http://localhost:3012/posts', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newPost),
//       });

//       const addedPost = await response.json();
//       setPosts((prev) => [addedPost, ...prev]);
//       setNewPostTitle('');
//       setNewPostBody('');
//       setIsModalOpen(false); // Close the modal after adding a post
//     } catch (error) {
//       console.error('Error adding post:', error);
//     }
//   };

//   return (
//     <div className={`postsElements ${isModalOpen ? 'modal-open' : ''}`}>
//       <label htmlFor="search">Search</label>
//       <input
//         type="text"
//         placeholder="search..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         style={{ padding: '5px', marginBottom: '10px' }}
//       />

//       <button 
//         onClick={() => setViewMyPosts(prev => !prev)}
//         style={{
//           backgroundColor: viewMyPosts ? 'pink' : '', 
//           color: viewMyPosts ? 'white' : ''
//         }}
//       >
//         {viewMyPosts ? 'view all posts' : 'view my posts'}
//       </button>
//       <button onClick={() => setSearch("")}>
//         Clear search
//       </button>

//       <button className="add-post-btn" onClick={() => setIsModalOpen(true)}>+</button>

//       {isModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <h2>Add New Post</h2>
//             <input
//               type="text"
//               placeholder="Enter post title"
//               value={newPostTitle}
//               onChange={(e) => setNewPostTitle(e.target.value)}
//             />
//             <textarea
//               placeholder="Enter post body"
//               value={newPostBody}
//               onChange={(e) => setNewPostBody(e.target.value)}
//             />
//             <div className="modal-buttons">
//               <button onClick={addPost}>Save</button>
//               <button onClick={() => setIsModalOpen(false)}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="container">
//         <div className="posts-list">
//           {posts.filter(post =>
//             ((post.title.toLowerCase().includes(search.toLowerCase()) ||
//               post.id.toString().includes(search))) &&
//             (!viewMyPosts || post.userId === user.id)
//           ).map(post => (
//             <div 
//               key={post.id} 
//               className="post" 
//               onClick={() => setSelectedPost(post)}
//               style={{
//                 backgroundColor: post.userId === user.id ? 'pink' : ''
//               }}
//             >
//               <h3>{post.title}</h3>
//             </div>
//           ))}
//           {loading && <p>Loading more posts...</p>}
//         </div>

//         <div className="post-details">
//           {selectedPost ? (
//             <Post post={selectedPost} setPosts={setPosts} setSelectedPost={setSelectedPost} />
//           ) : (
//             <div className="no-post">Nothing to show here</div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
import React, { useState, useEffect, useContext } from "react";
import Post from "./Post";
import Search from "./Search";
import '../css/posts.css';
import { UserContext } from './context';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const { user } = useContext(UserContext);
  const [viewMyPosts, setViewMyPosts] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      };
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
      setIsModalOpen(false); // Close the modal after adding a post
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  return (
    <div className={`postsElements ${isModalOpen ? 'modal-open' : ''}`}>
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

      <button className="add-post-btn" onClick={() => setIsModalOpen(true)}>+</button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Post</h2>
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
            <div className="modal-buttons">
              <button onClick={addPost}>Save</button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        <div className="posts-list">
          {posts.filter(post =>
            ((
              //post.title.toLowerCase().includes(search.toLowerCase()) ||
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

// // export default Posts;
// import React, { useState, useEffect, useContext } from "react";
// import AddItem from "./AddItem";
// import "../css/posts.css";
// import { UserContext } from "./context";

// const Posts = () => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const { user } = useContext(UserContext);
//   const [isModalOpen, setModalOpen] = useState(false);

//   const fetchPosts = async () => {
//     if (loading) return;
//     setLoading(true);
//     try {
//       const response = await fetch(`http://localhost:3012/posts`);
//       const data = await response.json();
//       setPosts(data);
//     } catch (error) {
//       console.error("Error fetching posts:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   const handleSavePost = async (newPost) => {
//     try {
//       const post = {
//         userId: user.id,
//         ...newPost,
//       };
//       const response = await fetch("http://localhost:3012/posts", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(post),
//       });
//       const addedPost = await response.json();
//       setPosts((prev) => [addedPost, ...prev]);
//     } catch (error) {
//       console.error("Error adding post:", error);
//     }
//   };

//   const postFields = [
//     { name: "כותרת", type: "text" },
//     { name: "גוף", type: "textarea" },
//   ];

//   return (
//     <div className="posts-container">
//       <button onClick={() => setModalOpen(true)}>+ הוסף פוסט</button>
//       <AddItem
//         fields={postFields}
//         itemType="post"
//         isOpen={isModalOpen}
//         onClose={() => setModalOpen(false)}
//         onSave={handleSavePost}
//       />
//       <div className="posts-list">
//         {posts.map((post) => (
//           <div key={post.id} className="post">
//             <h3>{post.title}</h3>
//             <p>{post.body}</p>
//           </div>
//         ))}
//         {loading && <p>טוען פוסטים...</p>}
//       </div>
//     </div>
//   );
// };

// export default Posts;




// import React, { useState, useEffect } from "react";
// import PostDetails from "./PostDetails";
// import "../css/posts.css";

// const Posts = () => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedPost, setSelectedPost] = useState(null);

//   const fetchPosts = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`http://localhost:3012/posts`);
//       const data = await response.json();
//       setPosts(data);
//     } catch (error) {
//       console.error("Error fetching posts:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   const handleSaveChanges = async (updatedPost) => {
//     try {
//       const response = await fetch(`http://localhost:3012/posts/${updatedPost.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedPost),
//       });
//       const savedPost = await response.json();
//       setPosts((prev) =>
//         prev.map((post) => (post.id === savedPost.id ? savedPost : post))
//       );
//       setSelectedPost(null);
//     } catch (error) {
//       console.error("Error updating post:", error);
//     }
//   };

//   const handleDeletePost = async (postId) => {
//     try {
//       await fetch(`http://localhost:3012/posts/${postId}`, {
//         method: "DELETE",
//       });
//       setPosts((prev) => prev.filter((post) => post.id !== postId));
//       setSelectedPost(null);
//     } catch (error) {
//       console.error("Error deleting post:", error);
//     }
//   };

//   return (
//     <div className="posts-container">
//       {selectedPost && (
//         <PostDetails
//           post={selectedPost}
//           onClose={() => setSelectedPost(null)}
//           onSaveChanges={handleSaveChanges}
//           onDelete={handleDeletePost}
//         />
//       )}
//       <h2>Posts</h2>
//       {loading ? (
//         <p>Loading posts...</p>
//       ) : (
//         <div className="posts-list">
//           {posts.map((post) => (
//             <div
//               key={post.id}
//               className="post"
//               onClick={() => setSelectedPost(post)}
//             >
//               <h4>{post.title}</h4>
//               <p>{post.body.substring(0, 50)}...</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Posts;
