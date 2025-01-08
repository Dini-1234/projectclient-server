import React, { useState, useEffect, useContext } from "react";
import { UserContext } from './context';
import Delete from "./Delete";
import AddItem from "./AddItem";
function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);


  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3012/comments?postId=${postId}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment) return;

    const commentData = {
      postId: postId,
      body: newComment,
      email: (user)?(user?.email):"unknown"
    };

    try {
      const response = await fetch("http://localhost:3012/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      });
      const newCommentFromServer = await response.json();
      setComments((prev) => [...prev, newCommentFromServer]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div>
      <h3>Comments:</h3>
      {loading ? (
        <p>Loading comments...</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="comment">
            <p>owner: {comment.email}</p>
            <p>{comment.body}</p>
            {comment.email == user?.email && <>
              <Delete
                setMyItem={setComments}
                id={comment.id}
                type="comments"
              />
              <button onClick={() => setIsEditing(true)}>Edit comment</button>
            </>}
          </div>
        ))
      )
      }

      <div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Type a comment..."
        />
        <button onClick={handleAddComment}>Add comment</button>

      </div>
    </div >
  );
}

export default Comments;