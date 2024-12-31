import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../css/navigation.css';
import  { useContext } from 'react';
import { UserContext } from './context';
const Navigation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    if (location.pathname === '/login' || location.pathname === '/' || location.pathname === '/signUp' || location.pathname==='/editInfoNewUser') {
        return null;
    }

    const handleBack = () => {
        if (location.pathname !== '/login' || location.pathname != '/' || location.pathname === '/signUp') {
            navigate(-1);
        }
    };

    return (
        <>
        <nav className="navigation">
            <button className="nav-button" onClick={handleBack}>↪️</button>
            <Link to="/home">
                <button className="nav-button">🏠</button>
            </Link>
            <Link to="/home/posts">
                <button className="nav-button">Posts</button>
            </Link>
            <Link to="/home/albums">
                <button className="nav-button">Albums</button>
            </Link>
            <Link to="/home/tasks">
                <button className="nav-button">Tasks</button>
            </Link>
            <Link to="/login">
                <button className="nav-button" onClick={() => { localStorage.removeItem('user') }}>Log out</button>
            </Link>
            <Link to="/info">
                <button className="nav-button" >Info</button>
            </Link>
            <div>Hello {user.name}!</div>
        </nav>

        </>
    );
};

export default Navigation;