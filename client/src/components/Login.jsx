import { useContext, useState, useEffect } from 'react';
import { UserContext } from './context';
import { Link, useNavigate } from 'react-router-dom';
import '../css/login.css'

const Login = () => {
  const { setUser } = useContext(UserContext);
  const [userLogin, setUserLogin] = useState({ name: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login', { replace: true });
  }, []);

 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log(userLogin);
      
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userLogin.name,
          password: userLogin.password
        })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        navigate(`/users/${data.id}/home`);
        setError('');
      } else {
        setError(data.message || 'Login failed');
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
      <div className='loginForm'>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={userLogin.name}
              onChange={(e) => setUserLogin(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Type username..."
              required
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={userLogin.password}
              onChange={(e) => setUserLogin(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Type password..."
              required
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />
          </div>
          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>
            Login
          </button>
        </form>
        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        <div className="toSignUp">Don&apos;t have an account?
          <Link to="/signup"> Create an account</Link>
        </div>
      </div>
    </>
  );
};

export default Login;