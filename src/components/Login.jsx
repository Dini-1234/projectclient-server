import React, { useContext, useState } from 'react';
import { UserContext } from './context';
import { useNavigate } from 'react-router-dom'; // הוסף את useNavigate

const Login = () => {
  const { setUser } = useContext(UserContext);
  const [userLogin, setUserLogin] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate(); // הוסף את navigate
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3010/users?username=${userLogin.name}`);
      const data = await response.json();
      if (data.length > 0) {
        const foundUser = data[0];
        if (foundUser) {//add check of password .password === user.password
          localStorage.setItem('user', JSON.stringify(foundUser));
          setUser(foundUser);
          console.log(foundUser);

          //   const responses = await fetch('http://localhost:3010/users', {
          //     method: 'POST',
          //     headers: {
          //         'Content-Type': 'application/json',
          //     },
          //     body: JSON.stringify(user) // המרת האובייקט ל-JSON
          // });
          navigate('/home'); // מעבר לעמוד הבית אחרי התחברות מוצלחת

          setError('');
        } else {
          setError('סיסמה לא נכונה');
        }
      } else {
        setError('שם משתמש לא נמצא');
      }
    } catch (err) {
      setError('אירעה שגיאה בעת התחברות');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>שם משתמש:</label>
          <input
            type="text"
            value={userLogin.name}
            onChange={(e) => setUserLogin(prev => ({ ...prev, name: e.target.value }))}
            placeholder="הכנס שם משתמש"
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        <div>
          <label>סיסמה:</label>
          <input
            type="password"
            value={userLogin.password}
            onChange={(e) => setUserLogin(prev => ({ ...prev, password: e.target.value }))}
            placeholder="הכנס סיסמה"
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>
          התחבר
        </button>
      </form>
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
    </div>
  );
};

export default Login;
