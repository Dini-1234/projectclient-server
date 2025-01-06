import React, { useState, useEffect, useContext } from "react";
import Search from "./Search";
import '../css/photos.css';
import AddItem from "./AddItem";
import { UserContext } from './context';
import { useLocation } from 'react-router-dom';
import Delete from "./Delete";

const Photos = () => {
    const [photos, setPhotos] = useState([]);
    // const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    //  const [hasMore, setHasMore] = useState(true);
    const [search, setSearch] = useState('');
    const [newPhoto, setNewPhoto] = useState({ title: '', url: '' }); // מצב לתמונה חדשה
    const [editingPhoto, setEditingPhoto] = useState(null); // מצב לעריכת תמונה
    const [editData, setEditData] = useState({ title: '', url: '' }); // מצב לשדות עריכה
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1)
    const { user } = useContext(UserContext);
    const location = useLocation();
    const album = location.state?.album;
    const fields=[{name:"title",inputType:"text"},{name:"url",type:"text"},{name:"thumbnailUrl",type:"text"}];
    const initialObject={userId:user.id,albumId:album.id}
    useEffect(() => {
        fetchPhotos();
    }, [page]);

    const fetchPhotos = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3012/photos?albumId=${album.id}&_page=${page}`);
            const result = await response.json();
            result.data.length >=10 ? setHasMore(true) : setHasMore(false)
            setPhotos((prev) => [...prev, ...result.data]);
            // setPhotos(result.data);

        } catch (error) {

            console.error("Error fetching photos:", error);
        } finally {
            setLoading(false);
        }
    };
    const loadPhotos = () => {
        setPage(prev => prev + 1);
    }
    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollTop + clientHeight >= scrollHeight - 100 && !loading) {
            setPage((prev) => prev + 1);
        }
    };

    // פונקציה להוספת תמונה חדשה
    const addPhoto = async () => {
        if (!newPhoto.title || !newPhoto.url) {
            alert("Please provide both title and URL for the photo.");
            return;
        }

        try {
            const response = await fetch('http://localhost:3012/photos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    albumId: album.id,
                    title: newPhoto.title,
                    url: newPhoto.url,
                    thumbnailUrl: newPhoto.url, // או להוסיף thumbnail נפרד אם יש לך
                }),
            });

            const addedPhoto = await response.json();
            setPhotos((prev) => [...prev, addedPhoto]); // עדכון התמונות בתצוגה
            setNewPhoto({ title: '', url: '' }); // ניקוי השדות אחרי הוספה
        } catch (error) {
            console.error("Error adding photo:", error);
        }
    };

    // פונקציה לעריכת תמונה
    const startEditing = (photo) => {
        setEditingPhoto(photo); // שמירת התמונה לעריכה
        setEditData({ title: photo.title, url: photo.url }); // הגדרת הערכים בשדות
        document.body.style.overflow = 'hidden'; // מניעת גלילה בעמוד בעת פתיחת המודל
    };

    // פונקציה לעדכון המצב של התמונה אחרי עריכה
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // פונקציה לשליחת השינויים לשרת
    const saveChanges = async () => {
        if (!editData.title || !editData.url) {
            alert("Please provide both title and URL for the photo.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3012/photos/${editingPhoto.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    albumId: album.id,
                    title: editData.title,
                    url: editData.url,
                    thumbnailUrl: editData.url, // אם צריך
                }),
            });

            const updatedPhoto = await response.json();

            setPhotos((prev) =>
                prev.map((photo) => (photo.id === updatedPhoto.id ? updatedPhoto : photo)) // עדכון התמונה במצב המקומי
            );
            setEditingPhoto(null); // סגירת חלון העריכה
            document.body.style.overflow = 'auto'; // החזרת גלילה לאחר סיום העריכה
        } catch (error) {
            console.error("Error saving photo changes:", error);
        }
    };

    // פונקציה לביטול השינויים
    const cancelEdit = () => {
        setEditingPhoto(null); // סגירת חלון העריכה
        document.body.style.overflow = 'auto'; // החזרת גלילה לאחר ביטול העריכה
    };

    return (
        <div>
            <h1>{album.title}</h1>

            {/* טופס להוספת תמונה */}
           <AddItem  fields={fields} initialObject={initialObject} type={"photos"}setData={setPhotos}/>

            {/* חלונית קופצת לעריכת תמונה */}
            {editingPhoto && (
                <div className="edit-photo-popup">
                    <div className="popup-overlay"></div>
                    <div className="popup-content">
                        <h2>Edit Photo</h2>
                        <input
                            type="text"
                            name="title"
                            placeholder="Enter new title"
                            value={editData.title}
                            onChange={handleEditChange}
                        />
                        <input
                            type="text"
                            name="url"
                            placeholder="Enter new URL"
                            value={editData.url}
                            onChange={handleEditChange}
                        />
                        <button onClick={saveChanges}>Save Changes</button>
                        <button onClick={cancelEdit}>Cancel</button>
                    </div>
                </div>
            )}

            <div className="photos-grid"// onScroll={handleScroll}
            >
                {photos.map((photo, index) => (
                    <div key={index} className="photo-item">
                        <img src={photo.url} alt={photo.title} className="photo-img" />
                        <p className="photo-title">{photo.title}</p>
                        <button onClick={() => startEditing(photo)}>Edit</button>
                        <Delete setMyItem={setPhotos} id={photo.id} type="photos" />
                    </div>
                ))}
                {loading && <div>Loading more photos...</div>}
                {/* {!hasMore && <p>No more posts to load.</p>} */}
            </div>
            {hasMore?<div onClick={loadPhotos}>load more</div>:<div>no more photos</div>}
        </div>
    );
};

export default Photos;
