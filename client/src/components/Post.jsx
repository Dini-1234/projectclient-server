import { useContext, useEffect, useState } from 'react';
import { UserContext } from './context';
import Delete from './Delete';
import Comments from './Comments';
import EditItem from './EditItem';
import PropTypes from 'prop-types';

const Post = ({ post, setPosts, setSelectedPost }) => {
    const { user } = useContext(UserContext);
    const [isEditing, setIsEditing] = useState(false);
    const [showComments, setShowComments] = useState(false);
    console.log(user.id,"uutu");

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
                    {post.user_id === user?.id && (
                        <div >
                            <div>
                                <Delete
                                    setMyItem={(item) => {
                                        setPosts(item);
                                        setSelectedPost(null)
                                    }}
                                    id={post.id}
                                    type="posts"
                                    dependents={{ son: "comments", father: "post" }}
                                />
                            </div>
                            <button onClick={() => setIsEditing(true)}>✏️</button>
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
            {showComments && <Comments post_id={post.id} />}
        </div>
    );
};
Post.propTypes = {
    post: PropTypes.object.isRequired,
    setPosts: PropTypes.func.isRequired,
    setSelectedPost: PropTypes.func.isRequired,
};

export default Post;
