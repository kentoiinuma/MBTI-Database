// frontend/src/components/AllPosts.jsx
import React, { useState, useEffect } from 'react';
import { Image } from 'cloudinary-react';
import { useLocation } from 'react-router-dom'; // Added

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [mediaWorks, setMediaWorks] = useState({});
  const location = useLocation(); // Added
  const [showAlert, setShowAlert] = useState(false); // Added

  let API_URL;
  if (window.location.origin === 'http://localhost:3001') {
    API_URL = 'http://localhost:3000';
  } else if (window.location.origin === 'https://favorite-database-16type-f-5f78fa224595.herokuapp.com') {
    API_URL = "https://favorite-database-16type-5020d6339517.herokuapp.com";
  } else {
    // デフォルトのURL
    API_URL = 'http://localhost:3000';
  }

  useEffect(() => {
    if (location.state?.postSuccess) {
      setShowAlert(true); // Added
      setTimeout(() => setShowAlert(false), 3000); // Added
    }

    fetch(`${API_URL}/api/v1/posts/all`)
      .then(response => response.json())
      .then(data => {
        setPosts(data);
        data.forEach(post => {
          fetch(`${API_URL}/api/v1/media_works?post_id=${post.id}`)
            .then(response => response.json())
            .then(media => {
              setMediaWorks(prev => ({ ...prev, [post.id]: media.map(work => work.image) }));
            });
        });
      });
  }, [API_URL, location]); // Added location to dependency array

  const renderImages = (images) => {
    const containerClass = `image-container-${images.length}`;
    const imageSize = images.length === 1 ? 500 : 247.5;

    return (
        <div className={containerClass} >
            {images.map((imageUrl, index) => (
            <Image key={index} cloudName="dputyeqso" publicId={imageUrl} width={imageSize} height={imageSize} />
            ))}
        </div>
    );
  };

  return (
    <div>
      {showAlert && (
        <div role="alert" className="alert">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>投稿が成功しました。</span>
        </div>
      )}
      {posts.map(post => (
        <React.Fragment key={post.id}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px', marginBottom: '20px' }}>
            <div style={mediaWorks[post.id] && mediaWorks[post.id].length === 2 ? { width: '500px', height: '247.5px', backgroundColor: 'black' } : { width: '500px', height: '500px', backgroundColor: 'black' }}>
              {mediaWorks[post.id] && renderImages(mediaWorks[post.id])}
            </div>
          </div>
          <hr className="border-t border-[#7DB9DE] w-full" />
        </React.Fragment>
      ))}
    </div>
  );
};

export default AllPosts;