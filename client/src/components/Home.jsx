import React, { useContext } from 'react';
import { UserContext } from './context';

const Home = () => {
  const { user } = useContext(UserContext);
  console.log(user);
  
  return (
    <div className='userName'>
      <h5>Hello {user ? user.username : "Guest user"}!</h5>
    </div>
  );
};

export default Home;