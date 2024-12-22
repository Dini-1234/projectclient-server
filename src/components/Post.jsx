import React, { useContext, useState } from 'react';
import { UserContext } from './context';
import Delete from './Delete';
import Comments from './Comments';

const Post = (props) => {
    const { user } = useContext(UserContext); //צריך את זה כאן למחיקה, בינתיים בהערה למטה
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(props.post.title);
    const [newBody, setNewBody] = useState(props.post.body);

    const saveEdit = () => {
        const updatedPost = { ...props.post, title: newTitle, body: newBody };

        fetch(`http://localhost:3010/posts/${props.post.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedPost),
        })
            .then(() => {
                setIsEditing(false);
                setIsModalOpen(prev => !prev);
                props.setPosts(prev =>
                    prev.map(item =>
                        item.id === props.post.id ? { ...item, title: newTitle, body: newBody } : item
                    )
                );
            })
            .catch(err => console.error('Error updating post:', err));
    };

    return (
        <>
            {!isModalOpen && (
                <p>
                    <div>{props.index + 1}.</div>
                    <div key={props.post.id} className="post">
                        <h3>{props.post.title}</h3>
                        <span onClick={() => { setIsModalOpen(prev => !prev); }} style={{ cursor: 'pointer', color: 'blue' }}>קרא עוד</span>
                    </div>
                </p>
            )}

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        {!isEditing ? (
                            <>
                                <h4>{props.post.title}</h4>
                                <p>{props.post.body}</p>
                                <button onClick={() => setIsEditing(true)}>ערוך פוסט</button>
                            </>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="כותרת הפוסט"
                                />
                                <textarea
                                    value={newBody}
                                    onChange={(e) => setNewBody(e.target.value)}
                                    placeholder="תוכן הפוסט"
                                />
                                <button onClick={saveEdit}>שמור</button>
                                <button onClick={() => setIsEditing(false)}>ביטול</button>
                            </>
                        )}

                        <button onClick={() => { setIsModalOpen(prev => !prev) }}>סגור</button>

                        {/* {props.post.userId === user.id && ( */} {/* userId-שימי לב - כאן השגיאה ב */}
                        <Delete
                            setMyItem={props.setPosts}
                            id={props.post.id}
                            type="posts"
                        />
                        {/* )} */}

                        <Comments postId={props.post.id} />
                    </div>
                </div>
            )}
        </>
    );
};

export default Post;
