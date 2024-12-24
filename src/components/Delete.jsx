import React from 'react';

const Delete = (props) => {
    const deleteTask = (itemId) => {
        fetch(`http://localhost:3011/${props.type}/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(() => {
                props.setMyItem(prev => prev.filter(item => item.id !== itemId));
            })
            .catch(err => console.error('Error deleting task:', err));
    };

    return (
        <span onClick={() => deleteTask(props.id)}>🗑️</span>
    )
};

export default Delete;