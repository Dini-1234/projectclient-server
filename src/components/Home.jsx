// import React from 'react';
// import { Link } from 'react-router-dom';

// const Home = () => {
//   return (
//     <div>
//       <h1>Home</h1>
//       <nav>
//         <Link to="/posts">Posts</Link>
//         <Link to="/albums">Albums</Link>
//         <Link to="/todos">Todos</Link>
//         <Link to="/login">Logout</Link>
//       </nav>
//     </div>
//   );
// };

// export default Home;
import React, { useContext } from 'react';
import { UserContext } from './context';
import { Link } from 'react-router-dom';


const Home = () => {
  const { user } = useContext(UserContext);

  return (
    <div>
     
      <h2>Home Page</h2>
      {/* {user ? <p>Welcome, {user.name}!</p> : <p>No user logged in.</p>} */}
      {/* <Link to="/home/posts">
        <button>פוסטים</button>
      </Link>
      <Link to="/home/albums">
        <button>אלבומים</button>
      </Link>
      <Link to="/home/tasks">
        <button>משימות</button>
      </Link>
      <Link to="/logout">
        <button>התנתקות</button>
      </Link> */}

    </div>
  );
};

export default Home;


