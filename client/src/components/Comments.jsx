import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { UserContext } from "./context";
import Delete from "./Delete";
import AddItem from "./AddItem";
import EditItem from "./EditItem";

function Comments({ post_id }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(null);
  const [editedComment, setEditedComment] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [post_id]);

  const fetchComments = async () => {
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3000/api/comments?postId=${post_id}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (comment) => {
    setIsEditing(comment.id);
    setEditedComment(comment);
  };

  return (
    <div>
      <div className="add-comment-button">
        <AddItem
          fields={[{ name: "body", inputType: "textArea" }]}
          initialObject={{ post_id, body: "", email: user?.email || "unknown" }}
          type="comments"
          setData={setComments}
        />
      </div>

      {loading ? (
        <p>Loading comments...</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="comment">
            <b>Owner: {comment.email}</b>
            {!isEditing || isEditing !== comment.id ? (
              <>
                <p>{comment.body}</p>
                {comment.email === user?.email && (
                  <>
                    <Delete setMyItem={setComments} id={comment.id} type="comments" />
                    <div onClick={() => handleEdit(comment)}>✏️</div>
                  </>
                )}
              </>
            ) : (
              <EditItem
                item={editedComment}
                fields={[{ name: "body", inputType: "textArea" }]}
                type="comments"
                setData={setComments}
                setIsEditing={setIsEditing}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
}
Comments.propTypes = {
  post_id: PropTypes.number.isRequired,
};

export default Comments;
