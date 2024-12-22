import { useState, useContext, useEffect } from 'react';
import './App.css'
import Login from './components/Login'
import Home from './components/Home';
import { UserContext } from './components/context';
import Todos from './components/Todos'
import Posts from './components/Posts'
import Albums from './components/Albums'
import Navigation from './components/Navigation'
import Post from './components/Post';
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
      {/* <div>hi {user.name} welcome!</div> */}
      {/* {user ? <Home /> : <Login />} */}
      <Router>
        <Navigation />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Login />} />
          <Route path="/home/posts" element={<Posts />} />
          <Route path="/home/albums" element={<Albums />} />
          <Route path="/home/tasks" element={<Todos />} />
          <Route path="/home/posts/:id" element={<Post />} />

          {/* <Route path="/logout" element={<Logout />} /> */}
        </Routes>
      </Router>
    </div>
  );
};
export default App
