import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/login.css';
import { useContext } from 'react';
import { UserContext } from './context';


function SignUp() {
    const [userSignUp, setUserSignUp] = useState({ name: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    const handleSignUp = async (e) => {
        e.preventDefault();
        const { name, password, confirmPassword } = userSignUp;

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3012/users?username=${name}`);
            const data = await response.json();

            if (data.length > 0) {
                setError('Username already exists');
            } else {
                alert('User created successfully!');
                setUser({ username: name, website: password })
                navigate('/editInfoNewUser', { state: { bool: "add" } });

            }
        } catch (err) {
            setError('An error occurred while connecting');
        }
    };

    return (
        <div className="signUpForm">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUp}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={userSignUp.name}
                        onChange={(e) => setUserSignUp(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Type username..."
                        required
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={userSignUp.password}
                        onChange={(e) => setUserSignUp(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Type password..."
                        required
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        value={userSignUp.confirmPassword}
                        onChange={(e) => setUserSignUp(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm password..."
                        required
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>
                    Sign Up
                </button>
            </form>
            {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        </div>
    );
}

export default SignUp;
