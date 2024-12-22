import React, { useState } from 'react';

const Edit = (props) => {
    const editTask = (taskId) => {
        props.setIsEditing(taskId);
        const task = props.myTodos.find(todo => todo.id === taskId);
        props.setNewTitle(task.title);
    };

    return (
        <span onClick={() => editTask(props.id)}>🖊️</span>
    )
};

export default Edit;
