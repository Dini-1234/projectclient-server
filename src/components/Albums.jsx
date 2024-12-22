import React from 'react';

const Albums = () => {
  const checkData = async () => {
    const response = await fetch('http://localhost:3009/posts/1')
    const data = await response.json;
    console.log(data);

  }
  fetch('https://jsonplaceholder.typicode.com')
      .then(response => response.json())
      .then(json => console.log(json))
  const addData = () => {
    fetch('http://localhost:3009/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: "djjj" }),
    })
      .then((response) => response.json())
      .then((data) => { console.log(data) });

  }
  return <><div onClick={checkData}>Albums Component</div>
    <div onClick={addData}>Albums 22</div>
  </>;
};

export default Albums;