import React, { useState } from 'react';
// SearchModalコンポーネントの定義。検索モーダルのUIを担当。
const SearchModal = ({
  isOpen, // モーダルが開いているかどうかの状態
  searchQuery, // 検索クエリ
  content, // 音楽アーティストまたはアニメの情報
  onImageSelect, // 画像選択時のコールバック関数
  onClose, // モーダルを閉じる際のコールバック関数
  contentType, // コンテンツタイプ ('music' または 'anime')
}) => {
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);

  // モーダルが開いていない、またはコンテンツ情報がない場合は何も表示しない
  if (!isOpen || !content) return null;

  // 画像クリック時のハンドラー。選択された画像のURLとタイトルを親コンポーネントに通知する。
  const handleImageClick = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    onImageSelect(imageUrl, content.name || content.title);
  };

  const imageUrls = contentType === 'music' 
    ? (content.images || []).map(img => img.url)
    : Object.values(content.images || {});

  // モーダルのUI部分
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl modal-width modal-height overflow-hidden">
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl font-semibold">{`「${searchQuery}」の検索結果`}</h2>{' '}
          {/* 検索クエリを表示 */}
          <button
            onClick={onClose} // 閉じるボタン。クリックでモーダルを閉じる。
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
          <h2 className="text-xl font-semibold">
            {content.name || content.title}
          </h2>{' '}
          {/* タイトルを表示 */}
        </div>
        <div className="px-8 pb-8 flex flex-wrap justify-center">
          {imageUrls.length > 0 ? (
            imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`${contentType === 'music' ? 'Artist' : 'Anime'} ${content.name || content.title} ${index + 1}`}
                className={`max-w-full h-auto cursor-pointer m-2 ${selectedImageUrl === url ? 'border-4 border-blue-500' : ''}`}
                onClick={() => handleImageClick(url)}
              />
            ))
          ) : (
            <div className="text-center">画像が見つかりません</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal; // SearchModalコンポーネントをエクスポート