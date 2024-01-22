import React from 'react';

const SearchModal = ({
  isOpen,
  searchQuery,
  artist,
  onImageSelect,
  onClose,
}) => {
  if (!isOpen || !artist) return null;

  // 画像クリックハンドラー
  const handleImageClick = () => {
    onImageSelect(artist.images[0].url, artist.name); // 画像URLとアーティスト名を親コンポーネントのコールバックでセット
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl modal-width modal-height overflow-hidden">
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl font-semibold">{`「${searchQuery}」の検索結果`}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex justify-between items-center pl-8">
          <h2 className="text-xl font-semibold">{`${artist.name}`}</h2>
        </div>
        <div className="px-8 pb-8 flex justify-center">
          <img
            src={artist.images[0].url}
            alt={`Artist ${artist.name}`}
            className="max-w-full h-auto cursor-pointer"
            onClick={handleImageClick}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
