import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from './context';
import Delete from './Delete';
import Comments from './Comments';
import EditItem from './EditItem';

const Post = ({ post, setPosts, setSelectedPost }) => {
    const { user } = useContext(UserContext);
    const [isEditing, setIsEditing] = useState(false);
    const [showComments, setShowComments] = useState(false);
    useEffect(() => {
        setShowComments(false)
    }, [post])
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
                        <div >
                            <div onClick={() => setSelectedPost(null)}>
                                {/* <Delete
                                    setMyItem={setPosts}
                                    id={post.id}
                                    type="posts"
                                /> */}
                                <Delete
                                    id={post.id}
                                    type="posts"
                                    setMyItem={setPosts}
                                    onDelete={async (itemId) => {
                                        const response = await fetch(`http://localhost:3012/comments?postId=${itemId}`);
                                        const comments = await response.json();

                                        for (const comment of comments) {
                                            await fetch(`http://localhost:3012/comments/${comment.id}`, {
                                                method: 'DELETE',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                            });
                                        }
                                    }}
                                />

                            </div>
                            <div onClick={() => setIsEditing(true)}>✏️</div>
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
                    setView={setSelectedPost}
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