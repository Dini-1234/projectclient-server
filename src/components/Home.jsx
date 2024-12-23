import React, { useContext } from 'react';
import { UserContext } from './context';

const Home = () => {
  const { user } = useContext(UserContext);

  return (
    <div>
      <h5>Welcome to home page!</h5>
    </div>
  );
};

export default Home;