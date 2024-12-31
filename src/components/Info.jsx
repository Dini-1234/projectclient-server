import { useNavigate } from "react-router-dom";
import React, { useContext } from 'react';
import { UserContext } from './context';
function Info() {
    const { user } = useContext(UserContext);

    const navigate = useNavigate();

    const handleEdit = () => {
        navigate('/editInfo', { state: { bool:"edit" } });
    };

    return (
        <div className="userInfo">
            <h2>User Information</h2>
            <div>
                <strong>Name:</strong> {user.name}
            </div>
            <div>
                <strong>User Name:</strong> {user.username}
            </div>
            <div>
                <strong>Email:</strong> {user.email}
            </div>
            <div>
                <strong>Address:</strong>
                <div>Street: {user.address?.street}</div>
                <div>Suite: {user.address?.suite}</div>
                <div>City: {user.address?.city}</div>
                <div>Zipcode: {user.address?.zipcode}</div>
            </div>
            <div>
                <strong>Phone:</strong> {user.phone}
            </div>
            <div>
                <strong>Website:</strong> {user.website}
            </div>
            <div>
                <strong>Company:</strong> {user.company?.name}
            </div>
            <button onClick={handleEdit} style={{ marginTop: '20px', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>
                Edit Information
            </button>
        </div>
    );
}

export default Info;
