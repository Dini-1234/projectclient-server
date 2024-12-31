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
    const { user } = useContext(UserContext);
    const location = useLocation();
    const album = location.state?.album;

    useEffect(() => {
        fetchPhotos();
    }, [user.id]);

    const fetchPhotos = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3012/photos?albumId=${album.id}`);
            const data = await response.json();

            // setPhotos((prev) => [...prev, ...data]);
            setPhotos(data);

        } catch (error) {
            console.error("Error fetching photos:", error);
        } finally {
            setLoading(false);
        }
    };

    // const handleScroll = (e) => {
    //     const { scrollTop, scrollHeight, clientHeight } = e.target;
    //     if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore && !loading) {
    //         setPage((prev) => prev + 1);
    //     }
    // };

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
            <div className="add-photo-form">
                <input
                    type="text"
                    name="title"
                    placeholder="Enter photo title"
                    value={newPhoto.title}
                    onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                />
                <input
                    type="text"
                    name="url"
                    placeholder="Enter photo URL"
                    value={newPhoto.url}
                    onChange={(e) => setNewPhoto({ ...newPhoto, url: e.target.value })}
                />
                <button onClick={addPhoto}>Add Photo</button>
            </div>

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
        </div>
    );
};

export default Photos;
