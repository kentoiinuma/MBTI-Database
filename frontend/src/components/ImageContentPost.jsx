import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react'; // Clerkを使用してユーザー情報を取得
import SearchModal from './SearchModal'; // 検索モーダルコンポーネント
import { Image } from 'cloudinary-react'; // Cloudinaryを使用して画像を表示
import { useNavigate } from 'react-router-dom'; // ページ遷移を扱うためのフック
import { Snackbar, Alert } from '@mui/material'; // MUI SnackbarとAlertのインポート

const ImageContentPost = () => {
  const { user } = useUser(); // 現在のユーザー情報を取得
  const [isModalOpen, setModalOpen] = useState(false); // モーダルの開閉状態
  const [artist, setArtist] = useState(null); // 選択されたアーティスト情報
  const [searchQuery, setSearchQuery] = useState(''); // 検索クエリ
  const [selectedImages, setSelectedImages] = useState([]); // 選択された画像のリスト
  const [inputValue, setInputValue] = useState(''); // 入力フィールドの値
  const navigate = useNavigate(); // ナビゲーション関数を取得
  const [customAlertVisible, setCustomAlertVisible] = useState(false); // スタムアラートの表示状態
  const [artistNotFound, setArtistNotFound] = useState(false); // アーティストが見つからなかった場合の状態
  const [isLoading, setIsLoading] = useState(false); // ローディング状態を追加

  // APIのURLを環境に応じて設定
  let API_URL;
  if (window.location.origin === 'http://localhost:3001') {
    API_URL = 'http://localhost:3000';
  } else if (
    window.location.origin ===
    'https://favorite-database-16type-f-5f78fa224595.herokuapp.com'
  ) {
    API_URL = 'https://favorite-database-16type-5020d6339517.herokuapp.com';
  } else {
    API_URL = 'http://localhost:3000'; // デフォルトのURL
  }

  // 検索処理
  const handleSearch = async (event) => {
    if (event.key === 'Enter') {
      // Enterキーが押された場合
      const trimmedValue = event.target.value.trim(); // 入力値の前後の空白を削除
      if (trimmedValue !== '') {
        // 入力値が空でない場合
        setSearchQuery(trimmedValue); // 検索クエリを設定
        const response = await fetch(
          `${API_URL}/api/v1/spotify/search/${trimmedValue}`,
        ); // Spotify検索APIにリクエストを送信
        if (response.ok) {
          // レスポンスが正常な場合
          const data = await response.json();
          if (data.artist) {
            // アーティスト情が存在する場合
            setArtist(data.artist); // アーティスト情報を設定
            setModalOpen(true); // モーダルを開く
            setArtistNotFound(false); // アーティストが見かったためエラーをリセット
          } else {
            setArtistNotFound(true); // アーティストが見つからなかった場合エラーを設定
          }
        } else {
          console.error('API request failed'); // APIリクエストが失敗した場合
          setArtistNotFound(true); // エラーを設定
        }
      }
    }
  };

  // 画像選択処理
  const handleImageSelect = async (imageUrl, artistName) => {
    // 画像をアップロードするためのAPIエンドポイントにリクエストを送信
    const response = await fetch(`${API_URL}/api/v1/upload_image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }), // imageUrlをリクエストボディに含める
    });
    if (response.ok) {
      // レスポンスが正常な場合
      const data = await response.json();
      console.log(data); // レスポンスをログに出力
      const uploadedImageUrl = data.url;
      // 既存のアティスト名と同じでない場合のみ追加
      if (!selectedImages.some((image) => image.artist === artistName)) {
        console.log(selectedImages); // selectedImages配列をログに出力
        setSelectedImages((prevImages) =>
          [...prevImages, { url: uploadedImageUrl, artist: artistName }].slice(
            0,
            4,
          ),
        ); // 最大4枚まで画像を追加
      }
    } else {
      console.error('Image upload failed'); // 画像アップロードが失敗した場合
    }
    setInputValue(''); // 入力値をリセット
    setModalOpen(false); // モーダルを閉じる
  };

  // 投稿処理
  const handlePost = async () => {
    // ユーザーが既にポストを持っているかどうかを確認
    const existingPostsResponse = await fetch(
      `${API_URL}/api/v1/posts?user_id=${user.id}`,
    );
    if (existingPostsResponse.ok) {
      const existingPosts = await existingPostsResponse.json();
      if (existingPosts.length > 0) {
        // 既にポストが存在する場合はカスタムアラートを表示して処理を中断
        setCustomAlertVisible(true);
        return false;
      }
    } else {
      console.error('Failed to check existing posts');
      return false;
    }

    // ポストを作成
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

      // 選択された画像とアーティスト名をmedia_worksに保存
      for (let i = 0; i < selectedImages.length; i++) {
        const imagePair = selectedImages[i];
        const mediaWorkResponse = await fetch(`${API_URL}/api/v1/media_works`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            post_id: postId,
            title: imagePair.artist,
            image: imagePair.url,
            media_type: 5,
          }),
        });
        if (!mediaWorkResponse.ok) {
          console.error('Media work creation failed');
          break;
        }
      }
      return true;
    } else {
      console.error('Post creation failed');
      return false;
    }
  };

  // ポストするボタンのonClickイベントを変更します
  const handlePostAndRedirect = async () => {
    if (selectedImages.length === 0) {
      console.error('No images selected');
      return;
    }
    setIsLoading(true); // ポスト処理開始時にローディングを表示
    const postResult = await handlePost();
    setIsLoading(false); // ポスト処理終了時にローディングを非表示
    if (postResult) {
      // ポスト成功時にSnackbarを表示するために状態をtrueに設定
      console.log('Post success state set to true');
      navigate('/', { state: { postSuccess: true } });
    }
  };

  // ImageContentPost.jsxのrenderImages関数内
  const renderImages = () => {
    const containerClass = `image-container-${selectedImages.length}`; // コンテナのクラス名を設定
    const imageSize = selectedImages.length === 1 ? 600 : 297.5; // 画像の数に応じて適切な画像サイズを設定
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
                {/* アーティストが見つからなかった場合のメッセージ */}
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
                {/* 既にポストが在する場合のメッセージ */}
              </Alert>
            </Snackbar>
          )}
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
                placeholder="好きな音楽アーティスト"
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
          <div className="bg-black">
            {renderImages()} {/* ここで選択された画像をレンダリング */}
          </div>
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
            artist={artist}
            onImageSelect={handleImageSelect}
            onClose={() => setModalOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default ImageContentPost;
