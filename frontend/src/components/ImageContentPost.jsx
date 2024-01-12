import React, { useState } from 'react';
import SearchModal from './SearchModal';
import '../App.css';



const ImageContentPost = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [artist, setArtist] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  // 検索ハンドラー
  const handleSearch = async (event) => {
    if (event.key === 'Enter' && event.target.value.trim() !== '') {
      setSearchQuery(event.target.value.trim());
      const response = await fetch(`${API_URL}/api/v1/spotify/search/${event.target.value}`);
      if (response.ok) {
        const data = await response.json();
        setArtist(data.artist);
        setModalOpen(true);
      } else {
        console.error('API request failed');
      }
    }
  };

  // モーダル内の画像クリックハンドラー
  const handleImageSelect = (imageUrl) => {
    // 既存の画像と同じでない場合のみ追加
    if (!selectedImages.includes(imageUrl)) {
      setSelectedImages(prevImages => [...prevImages, imageUrl].slice(0, 4)); // 最大4枚まで画像を追加
    }
    setModalOpen(false); // モーダルを閉じる
  };

// ImageContentPost.jsxのrenderImages関数内
const renderImages = () => {
  const containerClass = `image-container-${selectedImages.length}`;
  return (
    <div className={containerClass} style={{ paddingTop: '52.5%' }}> {/* アスペクト比を保持するスタイルを追加 */}
      {selectedImages.map((url, index) => (
        <img key={index} src={url} alt={`Artist ${index}`} className="image-style" />
      ))}
    </div>
  );
};


  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative w-full max-w-xs">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 absolute left-3 top-1/2 transform -translate-y-1/2">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="好きなアーティスト名を検索してください。"
            className="input input-bordered input-info pl-12 pr-4 py-2 w-full"
            onKeyPress={handleSearch}
          />
        </div>
      </div>
      <div className="w-2/3 bg-black rounded" >
        {renderImages()} {/* ここで選択された画像をレンダリング */}
      </div>
      <div className="flex justify-center gap-4">
          <button type="submit" className="w-full inline-flex justify-center items-center px-4 py-2 font-bold rounded-xl focus:outline-none focus:ring-opacity-50" style={{ backgroundColor: '#2EA9DF', color: 'white', borderRadius: '50px' }}>
            ポストする
          </button>
      </div>
      <SearchModal 
        isOpen={isModalOpen} 
        searchQuery={searchQuery} 
        artist={artist} 
        onImageSelect={handleImageSelect} 
        onClose={() => setModalOpen(false)} 
      />
    </div>
  );
};

export default ImageContentPost;



