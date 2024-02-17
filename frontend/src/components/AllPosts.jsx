import React, { useState, useEffect } from 'react';
import { Image } from 'cloudinary-react';
import { useLocation } from 'react-router-dom';

const AllPosts = () => {
  // 状態管理
  const [posts, setPosts] = useState([]); // 投稿データ
  const [mediaWorks, setMediaWorks] = useState({}); // メディア作品データ
  const [mbtiTypes, setMbtiTypes] = useState({}); // MBTIタイプデータ
  const location = useLocation(); // 現在のURL情報
  const [showAlert, setShowAlert] = useState(false); // アラート表示の状態

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
    API_URL = 'http://localhost:3000';
  }

  // コンポーネントのマウント時とAPI_URL、locationが変更された時に実行
  useEffect(() => {
    // 投稿成功時にアラートを表示
    if (location.state?.postSuccess) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }

    // 投稿データを取得
    fetch(`${API_URL}/api/v1/posts/all`)
      .then((response) => response.json())
      .then((data) => {
        setPosts(
          data.map((post) => ({
            ...post,
            user: { ...post.user, profileImageUrl: null, username: null },
            createdAt: post.created_at, // 投稿日時
          })),
        );
        data.forEach((post) => {
          // ユーザーデータを取得
          fetch(`${API_URL}/api/v1/users/${post.user.clerk_id}`)
            .then((response) => response.json())
            .then((userData) => {
              setPosts((currentPosts) =>
                currentPosts.map((p) => {
                  if (p.id === post.id) {
                    return {
                      ...p,
                      user: {
                        ...p.user,
                        profileImageUrl: userData.profile_image_url,
                        username: userData.username,
                      },
                    };
                  }
                  return p;
                }),
              );
            });
          // メディア作品データを取得
          fetch(`${API_URL}/api/v1/media_works?post_id=${post.id}`)
            .then((response) => response.json())
            .then((media) => {
              setMediaWorks((prev) => ({
                ...prev,
                [post.id]: media.map((work) => work.image),
              }));
            });
          // MBTIタイプデータを取得
          fetch(`${API_URL}/api/v1/mbti/${post.user.clerk_id}`)
            .then((response) => response.json())
            .then((mbtiData) => {
              setMbtiTypes((prevMbtiTypes) => ({
                ...prevMbtiTypes,
                [post.user.clerk_id]: mbtiData.mbti_type,
              }));
            })
            .catch((error) =>
              console.error('Error fetching MBTI data:', error),
            );
        });
      });
  }, [API_URL, location]);

  // 画像をレンダリングする関数
  const renderImages = (images) => {
    const containerClass = `image-container-${images.length}`;
    const imageSize = images.length === 1 ? 500 : 247.5;

    return (
      <div className={containerClass}>
        {images.map((imageUrl, index) => (
          <Image
            key={index}
            cloudName="dputyeqso"
            publicId={imageUrl}
            width={imageSize}
            height={imageSize}
          />
        ))}
      </div>
    );
  };

  // ユーザー詳細をレンダリングする関数
  const renderUserDetails = (user, createdAt) => {
    const dateOptions = { month: 'long', day: 'numeric' };
    const formattedDate = new Date(createdAt).toLocaleString(
      'ja-JP',
      dateOptions,
    );

    return (
      <div className="user-details flex items-center">
        <div className="avatar">
          <div className="w-20 rounded-full">
            <img
              src={user.profileImageUrl}
              alt={`profileImage`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="ml-4">
          <h1>
            <span className="text-2xl">{user.username}</span>{' '}
            <span className="ml-4">{mbtiTypes[user.clerk_id]}</span>{' '}
            <span className="ml-4">{formattedDate}</span>
          </h1>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* アラート表示の条件レンダリング */}
      {showAlert && (
        <div role="alert" className="alert">
          {/* アラートアイコン */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-info shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          {/* アラートメッセージ */}
          <span>投稿が成功しました。</span>
        </div>
      )}
      {/* 投稿データをマップして表示 */}
      {posts.map((post) => (
        <React.Fragment key={post.id}>
          {/* ユーザー詳細表示 */}
          <div style={{ margin: '20px 0 0 30px' }}>
            {post.user && renderUserDetails(post.user, post.createdAt)}
          </div>
          {/* メディア作品表示エリア */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <div
              style={
                mediaWorks[post.id] && mediaWorks[post.id].length === 2
                  ? {
                      width: '500px',
                      height: '247.5px',
                      backgroundColor: 'black',
                    }
                  : {
                      width: '500px',
                      height: '500px',
                      backgroundColor: 'black',
                    }
              }
            >
              {/* メディア作品の画像をレンダリング */}
              {mediaWorks[post.id] && renderImages(mediaWorks[post.id])}
            </div>
          </div>
          {/* 投稿間の区切り線 */}
          <hr className="border-t border-[#2EA9DF] w-full" />
        </React.Fragment>
      ))}
    </div>
  );
};

export default AllPosts;
