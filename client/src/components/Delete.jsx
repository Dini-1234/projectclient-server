import { useState } from 'react';
import PropTypes from 'prop-types';
import '../css/delete.css'

const Delete = (props) => {
    const [ setShowConfirmation] = useState(false);
    const deleteItem = async (itemId) => {
        try {

            await fetch(`http://localhost:3000/api/${props.type}/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            props.setMyItem(prev => prev.filter(item => item.id !== itemId));
        } catch (err) {
            console.error('Error deleting task or dependents:', err);
        } finally {
            setShowConfirmation(false);
        }
    };

    console.log(props?.dependents);
    
    return (
        <div>
            <button onClick={() => deleteItem(props.id)}>🗑️</button>
        </div>
    );
};
Delete.propTypes = {
    type: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    setMyItem: PropTypes.func.isRequired,
    dependents: PropTypes.shape({
        son: PropTypes.string,
        father: PropTypes.string,
    }),
};

export default Delete;
