import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import SearchModal from './SearchModal';
import { Image } from 'cloudinary-react';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledToggleButton = styled(ToggleButton)(({ selected }) => ({
  backgroundColor: selected ? '#2EA9DF' : '#fff',
  borderColor: '#2EA9DF',
  color: selected ? '#fff' : '#2EA9DF',
  '&:hover': {
    backgroundColor: selected ? '#2387c1' : '#f0f0f0',
    borderColor: '#2387c1',
  },
  '&.Mui-selected': {
    backgroundColor: '#2EA9DF',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#2387c1',
    },
  },
  '&.MuiToggleButton-root': {
    border: '1px solid #2EA9DF',
  },
}));

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
  const [contentType, setContentType] = useState('anime'); // 'music'から'anime'に変更

  let API_URL;
  if (window.location.origin === 'http://localhost:3001') {
    API_URL = 'http://localhost:3000';
  } else if (window.location.origin === 'https://www.mbti-database.com') {
    API_URL = 'https://api.mbti-database.com';
  } else {
    API_URL = 'http://localhost:3000';
  }

  const handleSearch = async (event) => {
    if (event.key === 'Enter') {
      const trimmedValue = event.target.value.trim();
      if (trimmedValue !== '') {
        setSearchQuery(trimmedValue);
        let response;
        if (contentType === 'music') {
          response = await fetch(`${API_URL}/api/v1/spotify/search/${trimmedValue}`);
        } else {
          response = await fetch(`${API_URL}/api/v1/anilist/search/${trimmedValue}`);
        }

        if (response.ok) {
          const data = await response.json();
          if (contentType === 'music' && data.artist) {
            setArtist(data.artist);
            setModalOpen(true);
            setArtistNotFound(false);
          } else if (contentType === 'anime' && Array.isArray(data) && data.length > 0) {
            setAnime(data[0]);
            setModalOpen(true);
            setArtistNotFound(false);
          } else {
            setArtistNotFound(true);
          }
        } else {
          setArtistNotFound(true);
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
          [...prevImages, { url: uploadedImageUrl, title }].slice(0, 4)
        );
      }
    } else {
      console.error('Image upload failed');
    }
    setInputValue('');
    setModalOpen(false);
  };

  const handlePost = async () => {
    const postResponse = await fetch(`${API_URL}/api/v1/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clerk_id: user.id,
        media_type: contentType === 'music' ? 5 : 0,
      }),
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

  const checkExistingPost = async () => {
    const response = await fetch(
      `${API_URL}/api/v1/check_existing_post?clerk_id=${user.id}&media_type=${contentType === 'music' ? 5 : 0}`
    );
    if (response.ok) {
      const data = await response.json();
      return data.exists;
    }
    return false;
  };

  const handlePostAndRedirect = async () => {
    if (selectedImages.length === 0) {
      console.error('No images selected');
      return;
    }
    setIsLoading(true);
    const existingPost = await checkExistingPost();
    if (existingPost) {
      setCustomAlertVisible(true);
      setIsLoading(false);
      return; // ここで処理を終了
    }
    const postResult = await handlePost();
    setIsLoading(false);
    if (postResult) {
      console.log('Post success state set to true');
      navigate('/', { state: { postSuccess: true } });
    } else {
      setCustomAlertVisible(true); // 投稿に失敗した場合もアラートを表示
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
    if (selectedImages.length === 0) {
      return (
        <div
          className={`${containerClass} w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-black`}
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
            className={`
              ${selectedImages.length === 1 ? 'w-[300px] h-[300px] md:w-[500px] md:h-[500px]' : 'w-[147.5px] h-[147.5px] md:w-[247.5px] md:h-[247.5px]'}
            `}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 my-10">
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
                {contentType === 'music'
                  ? '正しいアーティスト名を入力してください。'
                  : '正しいアニメ名を入力してください。'}
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
                {contentType === 'music'
                  ? '音楽アーティストの投稿は1回のみです。'
                  : 'アニメの投稿は1回のみです。'}
              </Alert>
            </Snackbar>
          )}
          <ToggleButtonGroup
            value={contentType}
            exclusive
            onChange={handleContentTypeChange}
            aria-label="content type"
          >
            <StyledToggleButton value="anime" aria-label="anime">
              アニメ
            </StyledToggleButton>
            <StyledToggleButton value="music" aria-label="music">
              音楽
            </StyledToggleButton>
          </ToggleButtonGroup>
          <div className="flex items-center space-x-2">
            <div className="relative w-full">
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
                placeholder={contentType === 'music' ? '好きな音楽アーティスト' : '好きなアニメ'}
                className="input bg-off-white input-bordered input-info pl-12 pr-4 py-2 w-full"
                onKeyPress={handleSearch}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col items-center space-y-1 text-center">
            <span className="px-12 text-[13px] md:text-base">
              1~4つの好きなアニメ・音楽アーティストのイメージを投稿してください。
            </span>
            <span className="px-12 text-[13px] md:text-base">
              ※ アニメ、音楽アーティストの投稿はそれぞれ1回のみです。
            </span>
          </div>
          <div className="bg-black">{renderImages()}</div>
          <div className="flex justify-center">
            <button
              type="submit"
              onClick={handlePostAndRedirect}
              className="w-full inline-flex justify-center items-center px-4 py-2 font-bold rounded-full focus:outline-none focus:ring-opacity-50 bg-[#2EA9DF] text-white hover:bg-[#2589B4] transition-colors duration-300"
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
