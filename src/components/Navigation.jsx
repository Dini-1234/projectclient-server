import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../css/navigation.css';

const Navigation = () => {
    const location = useLocation();
    const navigate = useNavigate();

    if (location.pathname === '/login' || location.pathname === '/') {
        return null;
    }

    const handleBack = () => {
        if (location.pathname !== '/login' || location.pathname != '/') {
            navigate(-1);
        }
    };

    return (
        <nav className="navigation">
            <button className="nav-button" onClick={handleBack}>↪️</button>
            <Link to="/home/posts">
                <button className="nav-button">Posts</button>
            </Link>
            <Link to="/home">
                <button className="nav-button">🏠</button>
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
        </nav>
    );
};

export default Navigation;