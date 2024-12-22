import React, { useState, useRef ,useContext } from "react";
import { UserContext } from './context';
function AddItem(props) {
    const [isAdding, setIsAdding] = useState(false);
    const newTaskRef = useRef(null);
      const { user } = useContext(UserContext);
    

    const handleAddItem = () => {
        const newText = newTaskRef.current.value;
        if (!newText) return;

        const newTaskObj = {
            userId: user.id,
            title: newText,
            completed: false,
        };

        fetch(`http://localhost:3010/${props.type}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTaskObj),
        })
            .then(response => response.json())
            .then(newTaskData => {
                props.setMyItem(prevTodos => [...prevTodos, newTaskData]);

                newTaskRef.current.value = '';
                setIsAdding(false);
            })
            .catch(err => console.error(`Error adding new ${props.type}:`, err));
    };

    return (
        <>
            <button
                onClick={() => setIsAdding(!isAdding)}
                style={{ fontSize: '20px', marginBottom: '10px', padding: '5px 10px' }}
            >
                {isAdding ? 'ביטול' : '+'}
            </button>

            {isAdding && (
                <div>
                    <input
                        type="text"
                        ref={newTaskRef}
                        placeholder="הכנס משימה חדשה"
                        style={{ padding: '5px', marginRight: '10px' }}
                    />
                    <button onClick={handleAddItem} style={{ padding: '5px 10px' }}>
                        שלח
                    </button>
                </div>
            )}
        </>
    )
}
export default AddItem;