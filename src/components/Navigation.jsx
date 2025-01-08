import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../css/navigation.css';
import { useContext, useState } from 'react';
import { UserContext } from './context';

const Navigation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [buttonColor, setButtonColor] = useState(false);
    const [message, setMessage] = useState('');

    if (location.pathname === '/login' || location.pathname === '/signUp' || location.pathname === '/editInfoNewUser') {
        return null;
    }

    const handleBack = () => {
        if (location.pathname !== '/login' || location.pathname === '/signUp') {
            navigate(-1);
        }
    };

    const handleRestrictedAccess = (e) => {
        if (!user) {
            e.preventDefault();
            setMessage("You must log in or sign up to access this page.");
            setButtonColor(true);
            setTimeout(() => {
                setButtonColor(false);
                setMessage('')
            }, 1000);
        }
    };

    return (
        <>
            <nav className="navigation">
                <button className="nav-button" onClick={handleBack}>↪️</button>
                <Link to="/home">
                    <button className="nav-button">🏠</button>
                </Link>
                <Link to="/posts">
                    <button className="nav-button">Posts</button>
                </Link>
                <Link to="/albums">
                    <button className="nav-button" onClick={handleRestrictedAccess}>Albums</button>
                </Link>
                <Link to="/tasks">
                    <button className="nav-button" onClick={handleRestrictedAccess}>Tasks</button>
                </Link>
                {user ? <Link to="/login">
                    <button className="nav-button" onClick={() => { localStorage.removeItem('user'); setUser() }}>Log out</button>
                </Link> :
                    <>
                        <Link to="/login">
                            <button className={`nav-button ${buttonColor ? 'pink' : ''}`} onClick={handleRestrictedAccess}>Login</button>
                        </Link>
                        <Link to="/signup">
                            <button className={`nav-button ${buttonColor ? 'pink' : ''}`} onClick={handleRestrictedAccess}>Sign up</button>
                        </Link>
                    </>
                }
                <Link to="/info">
                    <button className="nav-button" onClick={handleRestrictedAccess}>Info</button>
                </Link>
                <div>Hello {user ? user.name : "Guest user"}!</div>
            </nav>

            {message && (
                <div className="notification">
                    {message}
                </div>
            )}
        </>
    );
};

export default Navigation;
