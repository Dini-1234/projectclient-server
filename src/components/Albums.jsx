import React, { useState, useEffect } from 'react';
import Search from './Search';
import { useContext } from 'react';
import { UserContext } from './context';
import '../css/album.css';
import { Link } from 'react-router-dom';
import AddItem from './AddItem';

const Albums = () => {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [albums, setAlbums] = useState([]);
  const { user } = useContext(UserContext);
  const fields = [{ name: "title", inputType: "text" }];
  const initialObject = { userId: user.id };

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3012/albums?userId=${user.id}`)
      .then(response => response.json())
      .then(json => {
        setAlbums(json);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching albums:', error);
        setLoading(false);
      });
  }, [user.id]);


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Search
        search={search}
        setSearch={setSearch}
      />
      <AddItem fields={fields} initialObject={initialObject} setData={setAlbums} type={"albums"} />
      <div className="albums-grid">
        {albums.filter(album =>
          album.title.toLowerCase().includes(search.toLowerCase()) ||
          album.id.toString().includes(search)
        ).map((album, index) => (
          <Link to={`/albums/${album.id}`} key={album.id} state={{ album }}>
            <div className="album">
              <p>{index + 1}. {album.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Albums;
