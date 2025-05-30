import { useContext, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Home from './components/Home';
import { UserContext } from './components/context';
import Todos from './components/Todos';
import Navigation from './components/Navigation';
import SignUp from './components/SignUp';
import Info from './components/Info';
import Error from './components/Error';
import Posts from './components/Posts';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  return (
    <div>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/users/:userId/home" element={<Home />} />
          <Route path="/users/guest/home" element={<Home />} />
          <Route path="/users/guest/posts" element={<Posts />} />
          <Route path="/users/:userId/posts" element={<Posts />} />
          <Route path="/users/:userId/tasks" element={<Todos />} />
          <Route path="/users/:userId/info" element={<Info />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;