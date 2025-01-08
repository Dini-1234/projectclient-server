import React, { useContext, useState } from 'react';
import { UserContext } from './context';
import Delete from './Delete';
import Comments from './Comments';
import EditItem from './EditItem'; // שימוש ב-EditItem הגלובלי

const Post = ({ post, setPosts, setSelectedPost }) => {
    const { user } = useContext(UserContext);
    const [isEditing, setIsEditing] = useState(false); // מצב עריכה
    const [showComments, setShowComments] = useState(false);

    const fields = [
        { name: "title", inputType: "text" },
        { name: "body", inputType: "textArea" }
    ]; 

    return (
        <div>
            {!isEditing ? (
                <>
                    <h4>{post.title}</h4>
                    <p>{post.body}</p>
                    {post.userId === user?.id && (
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
                <EditItem
                    item={post}
                    fields={fields}
                    type="posts"
                    setData={setPosts}
                    setIsEditing={setIsEditing}
                />
            )}

            <button onClick={() => setShowComments(!showComments)}>
                {showComments ? "Hide comments" : "View comments"}
            </button>
            {showComments && <Comments postId={post.id} />}
        </div>
    );
};

export default Post;
