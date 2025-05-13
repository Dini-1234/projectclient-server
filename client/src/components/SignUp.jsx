import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../css/login.css';
import { useContext } from 'react';
import { UserContext } from './context';

function SignUp() {
    const [userSignUp, setUserSignUp] = useState({
        name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    const handleSignUp = async (e) => {
        e.preventDefault();
        const { name, username, email, phone, password, confirmPassword } = userSignUp;

        // בדיקה אם הסיסמאות תואמות
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            // שליחת הבקשה לשרת להירשם
            const response = await fetch(`http://localhost:3000/api/users/signUp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    username,
                    email,
                    phone,
                    password,
                })
            });

            if (!response.ok) {
                throw new Error('Failed to register');
            }

            const data = await response.json();
            console.log(data);
            
            if (data.success) {
                alert('User created successfully!');
                setUser(data);
                console.log(data.id);
                
                navigate( `/users/${data.id}/home`, { state: { bool: "add" } });
            } else {
                setError('Username already exists');
            }
        } catch (err) {
            setError('An error occurred while connecting');
        }
    };

    return (
        <>
            <Link to="/users/guest/home">
                <button className="nav-button">🏠</button>
            </Link>

            <div className="loginForm">
                <h2>Sign Up</h2>
                <form onSubmit={handleSignUp}>
    <div className="form-group">
        <label>Name:</label>
        <input
            type="text"
            value={userSignUp.name}
            onChange={(e) => setUserSignUp(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter your name"
            required
        />
    </div>
    <div className="form-group">
        <label>Username:</label>
        <input
            type="text"
            value={userSignUp.username}
            onChange={(e) => setUserSignUp(prev => ({ ...prev, username: e.target.value }))}
            placeholder="Enter your username"
            required
        />
    </div>
    <div className="form-group">
        <label>Email:</label>
        <input
            type="email"
            value={userSignUp.email}
            onChange={(e) => setUserSignUp(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter your email"
            required
        />
    </div>
    <div className="form-group">
        <label>Phone:</label>
        <input
            type="text"
            value={userSignUp.phone}
            onChange={(e) => setUserSignUp(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="Enter your phone number"
            required
        />
    </div>
    <div className="form-group">
        <label>Password:</label>
        <input
            type="password"
            value={userSignUp.password}
            onChange={(e) => setUserSignUp(prev => ({ ...prev, password: e.target.value }))}
            placeholder="Enter password"
            required
        />
    </div>
    <div className="form-group">
        <label>Confirm Password:</label>
        <input
            type="password"
            value={userSignUp.confirmPassword}
            onChange={(e) => setUserSignUp(prev => ({ ...prev, confirmPassword: e.target.value }))}
            placeholder="Confirm password"
            required
        />
    </div>
    <button type="submit" className="login-button">
        Sign Up
    </button>
</form>

                {error && <div className="error-message">{error}</div>}
                <div className="toLogin">Already have an account?
                    <Link to="/login"> Please login</Link>
                </div>
            </div>
        </>
    );
}

export default SignUp;
