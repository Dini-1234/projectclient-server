import { useContext, useEffect } from 'react';
import './App.css'
import Login from './components/Login'
import Home from './components/Home';
import { UserContext } from './components/context';
import Todos from './components/Todos'
import Posts from './components/Posts'
import Albums from './components/Albums'
import Navigation from './components/Navigation'
import Post from './components/Post';
import Photos from './components/Photos';
import SignUp from './components/SignUp';
import EditInfo from './components/EditInfo';
import Info from './components/Info'
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
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/albums" element={<Albums />} />
          <Route path="/tasks" element={<Todos />} />
          <Route path="/albums/:id" element={<Photos />} />
          <Route path="/editInfo" element={<EditInfo />} />
          <Route path="/editInfoNewUser" element={<EditInfo />} />
          <Route path="/info" element={<Info />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;