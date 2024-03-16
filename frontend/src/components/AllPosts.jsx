import React, { useState, useEffect } from 'react';
import { Image } from 'cloudinary-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material'; // MUIのSnackbarとAlertをインポート

const AllPosts = () => {
  // 状態管理
  const [posts, setPosts] = useState([]); // 投稿データ
  const [mediaWorks, setMediaWorks] = useState({}); // メディア作品データ
  const location = useLocation(); // 現在のURL情報
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbarの開閉状態を管理

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

  // 投稿成功時にスナックバーを表示するためのuseEffect
  useEffect(() => {
    if (location.state?.postSuccess) {
      setOpenSnackbar(true); // Snackbarを開く
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.postSuccess]); // 依存配列にlocation.state.postSuccessのみを含める

  // コンポーネントのマウント時とAPI_URL、location.pathnameが変更された時に実行
  useEffect(() => {
    // 投稿データを取得
    fetch(`${API_URL}/api/v1/posts/all`)
      .then((response) => response.json())
      .then((data) => {
        setPosts(
          data.map((post) => ({
            ...post,
            user: { ...post.user, avatarUrl: null, username: null },
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
                        avatarUrl: userData.avatar_url, // usersテーブルから取得
                        username: userData.username, // usersテーブルから取得
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
                [post.id]: media,
              }));
            });
        });
      });
  }, [API_URL, location.pathname]); // API_URLとlocation.pathnameの変更時にのみ実行

  // 画像をレンダリングする関数
  const renderImages = (works) => {
    const containerClass = `image-container-${works.length}`;
    const imageSize = works.length === 1 ? 500 : 247.5;

    return (
      <div className={containerClass}>
        {works.map((work, index) => (
          <Image
            key={index}
            cloudName="dputyeqso"
            publicId={work.image}
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
    const formattedDate = new Date(createdAt).toLocaleDateString(
      'ja-JP',
      dateOptions,
    );

    return (
      <div className="user-details flex items-center">
        <div className="avatar">
          <div className="w-20 rounded-full">
            <img
              src={user.avatarUrl}
              alt={`profileImage`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="ml-4">
          <h1>
            <span className="text-2xl">{user.username}</span>{' '}
            <span className="ml-4">{formattedDate}</span>
          </h1>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* 投稿データをマップして表示 */}
      {posts.map((post) => (
        <React.Fragment key={post.id}>
          {/* ユーザー詳細表示 */}
          <div style={{ margin: '20px 0 0 30px' }}>
            {post.user && renderUserDetails(post.user, post.createdAt)}
          </div>
          {/* 好きな音楽アーティストの表示 */}
          <div className="mb-5 text-center">
            <span className="text-xl">
              私が好きな音楽アーティストは
              {mediaWorks[post.id] &&
                mediaWorks[post.id]
                  .map(
                    (work, index, array) =>
                      `${work.title}${index < array.length - 1 ? '、' : ''}`,
                  )
                  .join('')}
              です！
            </span>
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
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          投稿が成功しました。
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AllPosts;
