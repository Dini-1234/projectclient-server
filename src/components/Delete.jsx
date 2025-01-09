// import React from 'react';

// const Delete = (props) => {
//     const deleteTask = (itemId) => {
//         fetch(`http://localhost:3012/${props.type}/${itemId}`, {
//             method: 'DELETE',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         })
//             .then(() => {
//                 props.setMyItem(prev => prev.filter(item => item.id !== itemId));
//             })
//             .catch(err => console.error('Error deleting task:', err));
//     };

//     return (
//         <span onClick={() => deleteTask(props.id)}>🗑️</span>
//     )
// };

// export default Delete;

import React from 'react';

const Delete = ({ id, type, setMyItem, onDelete }) => {
    const deleteTask = async (itemId) => {
        try {
            await fetch(`http://localhost:3012/${type}/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (onDelete) {
                await onDelete(itemId);
            }

            setMyItem((prev) => prev.filter((item) => item.id !== itemId));
        } catch (err) {
            console.error('Error deleting task:', err);
        }
    };

    return (
        <span onClick={() => deleteTask(id)}>🗑️</span>
    );
};

export default Delete;