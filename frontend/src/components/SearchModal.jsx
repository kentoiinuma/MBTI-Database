import React from 'react';
// SearchModalコンポーネントの定義。検索モーダルのUIを担当。
const SearchModal = ({
  isOpen, // モーダルが開いているかどうかの状態
  searchQuery, // 検索クエリ
  contentType, // コンテンツタイプ（'music' または 'anime'）
  artist, // アーティスト情報
  anime, // アニメ情報
  onImageSelect, // 画像選択時のコールバック関数
  onClose, // モーダルを閉じる際のコールバック関数
}) => {
  // モーダルが開いていない、またはアーティスト情報がない場合は何も表示しない
  if (!isOpen || (!artist && !anime)) return null;

  // 画像クリック時のハンドラー。選択された画像のURLとタイトルを親コンポーネントに通知する。
  const handleImageClick = () => {
    if (contentType === 'music') {
      onImageSelect(artist.images[0].url, artist.name); // 画像URLとアーティスト名を親コンポーネントのコールバックでセット
    } else {
      // 日本語のタイトルを使用
      const animeTitle = anime.title.native;
      onImageSelect(anime.coverImage.large, animeTitle); // 画像URLとアニメタイトルを親コンポーネントのコールバックでセット
    }
  };

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
        <div className="flex justify-between items-center px-8">
          <h2 className="text-xl font-semibold">
            {contentType === 'music' ? artist.name : anime.title.native}
          </h2>{' '}
          {/* アーティスト名またはアニメタイトルを表示 */}
        </div>
        <div className="px-8 pb-8 flex justify-center">
          <img
            src={
              contentType === 'music'
                ? artist.images[0].url
                : anime.coverImage.large
            } // アーティストの画像またはアニメのカバー画像を表示
            alt={
              contentType === 'music'
                ? `Artist ${artist.name}`
                : `Anime ${anime.title.native}`
            }
            className="max-w-full h-auto cursor-pointer"
            onClick={handleImageClick} // 画像クリックでhandleImageClickを呼び出し
          />
        </div>
      </div>
    </div>
  );
};

export default SearchModal; // SearchModalコンポーネントをエクスポート
