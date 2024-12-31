import React, { useContext, useState } from 'react';
import { UserContext } from './context';
import Delete from './Delete';
import Comments from './Comments';

const Post = ({ post, setPosts, setSelectedPost }) => {
    const { user } = useContext(UserContext);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        title: post.title,
        body: post.body,
    });
    const [showComments, setShowComments] = useState(false);

    const saveChanges = async () => {  // פונקציה חדשה לשמירה
        if (!editData.title || !editData.body) {
            alert("Please provide both title and body for the post.");
            return;
        }

        try {
            const updatedPost = { ...post, title: editData.title, body: editData.body };

            const response = await fetch(`http://localhost:3012/posts/${post.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedPost),
            });

            const updatedPostData = await response.json();

            setPosts((prev) =>
                prev.map((item) => (item.id === updatedPostData.id ? updatedPostData : item)) // עדכון הפוסט במצב המקומי
            );
            setIsEditing(false); // סיום העריכה
            document.body.style.overflow = 'auto'; // החזרת גלילה לאחר סיום העריכה
        } catch (error) {
            console.error("Error saving post changes:", error);
        }
    };

    return (
        <div>
            {!isEditing ? (
                <>
                    <h4>{post.title}</h4>
                    <p>{post.body}</p>
                    {post.userId === user.id && (
                        <div>
                            <Delete
                                setMyItem={setPosts}
                                id={post.id}
                                type="posts"
                                onDelete={() => setSelectedPost(null)} // סגירת הפוסט אחרי מחיקה
                            />
                            <button onClick={() => setIsEditing(true)}>Edit post</button>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <input
                        type="text"
                        value={editData.title}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    />
                    <textarea
                        value={editData.body}
                        onChange={(e) => setEditData({ ...editData, body: e.target.value })}
                    />
                    <button onClick={saveChanges}>Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </>
            )}

            <button onClick={() => setShowComments(!showComments)}>
                {showComments ? "Hide comments" : "View comments"}
            </button>
            {showComments && <Comments postId={post.id} />}
        </div>
    );
};

export default Post;
