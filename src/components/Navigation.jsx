import { Link, useLocation, useNavigate } from 'react-router-dom';


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
        <nav>
            <button onClick={handleBack}>↪️</button>
            <Link to="/home/posts">
                <button>פוסטים</button>
            </Link>
            <Link to="/home">
                <button>🏠</button>
            </Link>
            <Link to="/home/albums">
                <button>אלבומים</button>
            </Link>
            <Link to="/home/tasks">
                <button>משימות</button>
            </Link>
            <Link to="/login">
                <button onClick={() => {localStorage.removeItem('user')}}>התנתקות</button>
            </Link>
        </nav>
    );
};
export default Navigation;