import React, { useContext } from 'react';
import { UserContext } from './context';

const Home = () => {
  const { user } = useContext(UserContext);

  return (
    <div>
            <h5>Hello {user.name}!!!😊</h5>
            </div>
  );
};

export default Home;