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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-auto max-h-[90vh] overflow-hidden">
        {/* モーダルの内容 */}
        <div className="flex justify-between items-center p-2 md:p-4">
          <h2 className="text-lg md:text-xl font-semibold">{`「${searchQuery}」の検索結果`}</h2>
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex justify-between items-center px-4 md:px-8">
          <h2 className="text-lg md:text-xl font-semibold">
            {contentType === 'music' ? artist.name : anime.title.native}
          </h2>
        </div>
        <p className="text-sm text-gray-600 px-4 md:px-8 mt-1">
          ※イメージを1クリックして追加してください。
        </p>
        <div className="px-4 md:px-8 pb-8 flex justify-center">
          <img
            src={contentType === 'music' ? artist.images[0].url : anime.coverImage.large}
            alt={contentType === 'music' ? `Artist ${artist.name}` : `Anime ${anime.title.native}`}
            className="max-w-full h-auto cursor-pointer transition duration-300 ease-in-out hover:brightness-90"
            onClick={handleImageClick}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchModal; // SearchModalコンポーネントをエクスポート
