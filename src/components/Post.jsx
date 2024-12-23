import React, { useContext, useState } from 'react';
import { UserContext } from './context';
import Delete from './Delete';
import Comments from './Comments';

const Post = ({ post, setPosts }) => {
    const { user } = useContext(UserContext);
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(post.title);
    const [newBody, setNewBody] = useState(post.body);
    const [showComments, setShowComments] = useState(false);

    const saveEdit = async () => {
        const updatedPost = { ...post, title: newTitle, body: newBody };

        try {
            await fetch(`http://localhost:3010/posts/${post.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedPost),
            });

            setPosts(prev =>
                prev.map(item =>
                    item.id === post.id ? { ...item, title: newTitle, body: newBody } : item
                )
            );
            setIsEditing(false);
        } catch (err) {
            console.error('Error updating post:', err);
        }
    };

    return (
        <div>
            {!isEditing ? (
                <>
                    <h4>{post.title}</h4>
                    <p>{post.body}</p>
                    <button onClick={() => setIsEditing(true)}>Edit post</button>
                </>
            ) : (
                <>
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <textarea
                        value={newBody}
                        onChange={(e) => setNewBody(e.target.value)}
                    />
                    <button onClick={saveEdit}>Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </>
            )}

            <Delete
                setMyItem={setPosts}
                id={post.id}
                type="posts"
            />

            <button onClick={() => setShowComments(!showComments)}>
                {showComments ? "Hide comments" : "view comments"}
            </button>
            {showComments && <Comments postId={post.id} />}
        </div>
    );
};

export default Post;