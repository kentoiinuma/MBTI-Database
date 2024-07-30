import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import SearchModal from './SearchModal';
import { Image } from 'cloudinary-react';
import { useNavigate } from 'react-router-dom';
import {
  Snackbar,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';

const ImageContentPost = () => {
  const { user } = useUser();
  const [isModalOpen, setModalOpen] = useState(false);
  const [artist, setArtist] = useState(null);
  const [anime, setAnime] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [artistNotFound, setArtistNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contentType, setContentType] = useState('music');

  let API_URL;
  if (window.location.origin === 'http://localhost:3001') {
    API_URL = 'http://localhost:3000';
  } else if (
    window.location.origin ===
    'https://favorite-database-16type-f-5f78fa224595.herokuapp.com'
  ) {
    API_URL = 'https://favorite-database-16type-5020d6339517.herokuapp.com';
  } else {
    API_URL = 'http://localhost:3000';
  }

  const handleSearch = async (event) => {
    if (event.key === 'Enter') {
      const trimmedValue = event.target.value.trim();
      if (trimmedValue !== '') {
        setSearchQuery(trimmedValue);
        try {
          let response;
          if (contentType === 'music') {
            response = await fetch(
              `${API_URL}/api/v1/spotify/search/${trimmedValue}`,
            );
          } else {
            response = await fetch(
              `${API_URL}/api/v1/anilist/search/${trimmedValue}`,
            );
          }

          if (response.ok) {
            const data = await response.json();
            if (contentType === 'music' && data.artist) {
              setArtist(data.artist);
              setModalOpen(true);
              setArtistNotFound(false);
            } else if (
              contentType === 'anime' &&
              Array.isArray(data) &&
              data.length > 0
            ) {
              setAnime(data[0]);
              setModalOpen(true);
              setArtistNotFound(false);
            } else {
              setArtistNotFound(true);
            }
          } else {
            const errorData = await response.json();
            console.error(
              'API request failed:',
              errorData.error,
              errorData.details,
            );
            setArtistNotFound(true);
            alert(
              `検索中にエラーが発生しました: ${errorData.details || errorData.error}`,
            );
          }
        } catch (error) {
          console.error('Error during API request:', error);
          setArtistNotFound(true);
          alert(
            '検索中に予期せぬエラーが発生しました。しばらくしてからもう一度お試しください。',
          );
        }
      }
    }
  };

  const handleImageSelect = async (imageUrl, title) => {
    const response = await fetch(`${API_URL}/api/v1/upload_image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });
    if (response.ok) {
      const data = await response.json();
      const uploadedImageUrl = data.url;
      if (!selectedImages.some((image) => image.title === title)) {
        setSelectedImages((prevImages) =>
          [...prevImages, { url: uploadedImageUrl, title }].slice(0, 4),
        );
      }
    } else {
      console.error('Image upload failed');
    }
    setInputValue('');
    setModalOpen(false);
  };

  const handlePost = async () => {
    const existingPostsResponse = await fetch(
      `${API_URL}/api/v1/posts?user_id=${user.id}`,
    );
    if (existingPostsResponse.ok) {
      const existingPosts = await existingPostsResponse.json();
      if (existingPosts.length > 0) {
        setCustomAlertVisible(true);
        return false;
      }
    } else {
      console.error('Failed to check existing posts');
      return false;
    }

    const postResponse = await fetch(`${API_URL}/api/v1/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clerk_id: user.id }),
    });

    if (postResponse.ok) {
      const postData = await postResponse.json();
      const postId = postData.id;

      for (let i = 0; i < selectedImages.length; i++) {
        const imagePair = selectedImages[i];
        const mediaWorkResponse = await fetch(`${API_URL}/api/v1/media_works`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            post_id: postId,
            title: imagePair.title,
            image: imagePair.url,
            media_type: contentType === 'music' ? 5 : 0,
          }),
        });
        if (!mediaWorkResponse.ok) {
          console.error('Media work creation failed');
          break;
        }
      }
      await fetch(`${API_URL}/api/v1/ogp/${postId}`, {
        method: 'GET',
      });
      return true;
    } else {
      console.error('Post creation failed');
      return false;
    }
  };

  const handlePostAndRedirect = async () => {
    if (selectedImages.length === 0) {
      console.error('No images selected');
      return;
    }
    setIsLoading(true);
    const postResult = await handlePost();
    setIsLoading(false);
    if (postResult) {
      console.log('Post success state set to true');
      navigate('/', { state: { postSuccess: true } });
    }
  };

  const handleContentTypeChange = (event, newContentType) => {
    if (newContentType !== null) {
      setContentType(newContentType);
      setSelectedImages([]);
      setInputValue('');
    }
  };

  const renderImages = () => {
    const containerClass = `image-container-${selectedImages.length}`;
    const imageSize = selectedImages.length === 1 ? 600 : 297.5;
    if (selectedImages.length === 0) {
      return (
        <div
          className={containerClass}
          style={{ width: '600px', height: '600px', backgroundColor: 'black' }}
        />
      );
    }
    return (
      <div className={containerClass}>
        {selectedImages.map((imagePair, index) => (
          <Image
            key={index}
            cloudName="dputyeqso"
            publicId={imagePair.url}
            width={imageSize}
            height={imageSize}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4">
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-custom"></div>
          </div>
        </div>
      ) : (
        <>
          {artistNotFound && (
            <Snackbar
              open={artistNotFound}
              autoHideDuration={2500}
              onClose={() => setArtistNotFound(false)}
            >
              <Alert
                onClose={() => setArtistNotFound(false)}
                severity="error"
                sx={{ width: '100%' }}
              >
                正しいアーティスト名を入力してください。
              </Alert>
            </Snackbar>
          )}
          {customAlertVisible && (
            <Snackbar
              open={customAlertVisible}
              autoHideDuration={2500}
              onClose={() => setCustomAlertVisible(false)}
            >
              <Alert
                onClose={() => setCustomAlertVisible(false)}
                severity="error"
                sx={{ width: '100%' }}
              >
                音楽アーティストの投稿は1回のみです。
              </Alert>
            </Snackbar>
          )}
          <ToggleButtonGroup
            value={contentType}
            exclusive
            onChange={handleContentTypeChange}
            aria-label="content type"
          >
            <ToggleButton value="music" aria-label="music">
              音楽アーティスト
            </ToggleButton>
            <ToggleButton value="anime" aria-label="anime">
              アニメ
            </ToggleButton>
          </ToggleButtonGroup>
          <div className="flex items-center space-x-2">
            <div className="relative w-full max-w-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 absolute left-3 top-1/2 transform -translate-y-1/2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <input
                type="text"
                placeholder={
                  contentType === 'music'
                    ? '好きな音楽アーティスト'
                    : '好きなアニメ'
                }
                className="input input-bordered input-info pl-12 pr-4 py-2 w-full"
                onKeyPress={handleSearch}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
          </div>
          <span style={{ color: '#2EA9DF' }}>
            ※1 現在、音楽アティストの投稿のみ行えます。
            <br />
            ※2 音楽アーティストの投稿は1回のみです。
          </span>
          <div className="bg-black">{renderImages()}</div>
          <div className="flex justify-center gap-4">
            <button
              type="submit"
              onClick={handlePostAndRedirect}
              className="w-full inline-flex justify-center items-center px-4 py-2 font-bold rounded-xl focus:outline-none focus:ring-opacity-50"
              style={{
                backgroundColor: '#2EA9DF',
                color: 'white',
                borderRadius: '50px',
              }}
            >
              ポストする
            </button>
          </div>
          <SearchModal
            isOpen={isModalOpen}
            searchQuery={searchQuery}
            contentType={contentType}
            artist={artist}
            anime={anime}
            onImageSelect={handleImageSelect}
            onClose={() => setModalOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default ImageContentPost;
