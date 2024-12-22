import React, { useState, useEffect ,useContext} from "react";
import { UserContext } from './context';

function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState(""); // הערה חדשה
  const [loading, setLoading] = useState(false); // מצב טעינה
  const { user } = useContext(UserContext);

  // טוען את ההערות מהשרת
  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3010/comments?postId=${postId}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment) return; // אם אין טקסט להוסיף, לא עושים כלום

    const commentData = {
      postId: postId,
      body: newComment,
      email:user.email
    };

    try {
      const response = await fetch("http://localhost:3010/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      });
      const newCommentFromServer = await response.json();
      setComments((prev) => [...prev, newCommentFromServer]); // עדכון המערך עם ההערה החדשה
      setNewComment(""); // ניקוי שדה הטקסט
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div>
      <h3>הערות:</h3>

      {/* הצגת הערות */}
      {loading ? (
        <p>טוען הערות...</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="comment">
            <p>{comment.body}</p>
            <p>owner: {comment.email}</p>
          </div>
        ))
      )}

      {/* טופס להוספת הערה */}
      <div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="הכנס הערה"
        />
        <button onClick={handleAddComment}>הוסף הערה</button>
      </div>
    </div>
  );
}

export default Comments;
