import React from 'react';

// SearchModal コンポーネントは、検索結果のモーダルウィンドウを表示します。
// props:
//   - isOpen: モーダルが開いているかどうかの真偽値
//   - searchQuery: ユーザーが検索したクエリ文字列
//   - contentType: 'music' または 'anime'（検索対象の種類）
//   - artist: 音楽検索の場合のアーティストデータ
//   - anime: アニメ検索の場合のアニメデータ
//   - onImageSelect: 画像がクリックされたときに呼ばれるコールバック関数
//   - onClose: モーダルを閉じるためのコールバック関数
const SearchModal = ({
  isOpen,
  searchQuery,
  contentType,
  artist,
  anime,
  onImageSelect,
  onClose,
}) => {
  // モーダルが開いていない、または表示するデータ（artist または anime）が存在しない場合は何もレンダリングしない
  if (!isOpen || (!artist && !anime)) return null;

  // コンテンツタイプが音楽かどうかを判定
  const isMusic = contentType === 'music';

  // 画像の URL、表示名、alt テキストを格納するための変数を初期化
  let imageUrl = '';
  let displayName = '';
  let altText = '';

  // 音楽の場合のデータ設定
  if (isMusic && artist) {
    // アーティストの画像URL（先頭の画像）、名前、alt テキストを取得
    imageUrl = artist.images?.[0]?.url;
    displayName = artist.name;
    altText = `Artist ${artist.name}`;
  } else if (!isMusic && anime) {
    // アニメの場合のデータ設定
    imageUrl = anime.coverImage.large;
    displayName = anime.title.native;
    altText = `Anime ${anime.title.native}`;
  }

  // 画像クリック時のハンドラ
  // onImageSelect コールバックに、画像URLと表示名を渡して呼び出す
  const handleImageClick = () => {
    onImageSelect(imageUrl, displayName);
  };

  return (
    // モーダル全体の背景（半透明のグレー背景）と中央寄せのレイアウト
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 flex justify-center items-center p-4">
      {/* モーダルウィンドウの本体 */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-auto max-h-[90vh] overflow-hidden">
        {/* ヘッダー部分：検索クエリの表示と閉じるボタン */}
        <div className="flex justify-between items-center p-2 md:p-4">
          <h2 className="text-lg md:text-xl font-semibold">{`「${searchQuery}」の検索結果`}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
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
        {/* 検索結果の対象となる名称（アーティスト名またはアニメタイトル）の表示 */}
        <div className="flex justify-between items-center px-4 md:px-8">
          <h2 className="text-lg md:text-xl font-semibold">{displayName}</h2>
        </div>
        {/* ユーザーへの案内文 */}
        <p className="text-sm text-gray-600 px-4 md:px-8 mt-1">
          ※イメージを1クリックして追加してください。
        </p>
        {/* 画像表示部分 */}
        <div className="px-4 md:px-8 pb-8 flex justify-center">
          <img
            src={imageUrl}
            alt={altText}
            className="max-w-full h-auto cursor-pointer transition duration-300 ease-in-out hover:brightness-90"
            onClick={handleImageClick} // クリックで handleImageClick を実行
          />
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
