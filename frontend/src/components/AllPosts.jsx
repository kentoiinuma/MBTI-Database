import React, { useState, useEffect } from 'react';
import { Image } from 'cloudinary-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import {
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material'; // 必要なコンポーネントをインポート
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import XIcon from '@mui/icons-material/X';

const AllPosts = () => {
  const [posts, setPosts] = useState([]); // 投稿データ
  const [mediaWorks, setMediaWorks] = useState({}); // メディア作品データ
  const location = useLocation(); // 現在のURL情報
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbarの開閉状態を管理
  const [snackbarMessage, setSnackbarMessage] = useState(''); // スナックバーのメッセージ
  const [anchorEl, setAnchorEl] = useState(null); // ドロップダウンメニューのアンカー要素
  const [openDialog, setOpenDialog] = useState(false); // ダイアログの開閉状態を管理
  const [deletePostId, setDeletePostId] = useState(null); // 削除する投稿のID
  const open = Boolean(anchorEl); // ドロップダウンメニューが開いているかどうか
  const { user: currentUser } = useUser(); // useUserからuserを取得
  const [isLoading, setIsLoading] = useState(true); // ローディング状態の管理

  // ドロップダウンメニューを開く
  const handleClick = (event, postId) => {
    event.stopPropagation(); // この行を追加
    setAnchorEl(event.currentTarget);
    setDeletePostId(postId); // ここで削除する投稿のIDを設定
  };

  // ドロップダウンメニューを閉じる
  const handleClose = () => {
    setAnchorEl(null);
  };

  // ダイアログを開く関数
  const handleOpenDialog = () => {
    console.log('Opening dialog for post ID:', deletePostId); // 既に設定されているdeletePostIdを使用
    setOpenDialog(true);
  };

  // ダイアログを閉じる関数
  const handleCloseDialog = () => {
    setOpenDialog(false);
    handleClose(); // ダイアログを閉じると同時にMenuも閉じるようにす
  };

  // 投稿を削除する関数
  const handleDeletePost = () => {
    console.log('Deleting post with ID:', deletePostId); // この行を追加
    if (deletePostId) {
      fetch(`${API_URL}/api/v1/posts/${deletePostId}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            // 投稿が正常に削除された場合、投稿リストからその投稿を削除
            setPosts(posts.filter((post) => post.id !== deletePostId));
            setOpenDialog(false); // ダイアログを閉じる
            setOpenSnackbar(true); // スナックバーを表示する
            // スナックバーのメッセージを設定る
            setSnackbarMessage('ポストを除しました！');
          } else {
            // エラーハンドリング
            console.error('Failed to delete the post');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

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

  // コンポーネントのマウント時とAPI_URL、location.pathnameが変��された時に実行
  useEffect(() => {
    // 投稿データを取得
    fetch(`${API_URL}/api/v1/posts/all`)
      .then((response) => response.json())
      .then((data) => {
        setPosts(
          data.map((post) => ({
            ...post,
            user: {
              ...post.user,
              avatarUrl: null,
              username: null,
              clerkId: null,
            }, // clerkIdをnullで初期化
            createdAt: post.created_at, // 投稿日時
          })),
        );
        setIsLoading(false); // ローディング状態をfalseに更新
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
                        avatarUrl: userData.avatar_url, // usersテルから取得
                        username: userData.username, // usersテーブルから取
                        clerkId: userData.clerk_id, // usersテーブルから取得
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

  // ユーザー詳細をレンダリングする関
  const renderUserDetails = (postUser, createdAt, postId) => {
    const dateOptions = { month: 'long', day: 'numeric' };
    const formattedDate = new Date(createdAt).toLocaleDateString(
      'ja-JP',
      dateOptions,
    );

    return (
      <div className="user-details flex items-center justify-between">
        <div className="flex items-center">
          <div className="avatar">
            <div className="w-20 rounded-full">
              <img
                src={postUser.avatarUrl}
                alt={`profileImage`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="ml-4">
            <h1>
              <span className="text-2xl">{postUser.username}</span>{' '}
              <span className="ml-4">{formattedDate}</span>
            </h1>
          </div>
        </div>
        {currentUser?.id === postUser.clerkId && (
          <div className="mr-8" style={{ position: 'relative' }}>
            <div
              className="hover:bg-gray-200 p-2 rounded-full"
              style={{ display: 'inline-block', cursor: 'pointer' }}
              onClick={(event) => handleClick(event, postId)} // ここでpostIdを渡す
            >
              <MoreVertIcon style={{ fontSize: 35 }} />
            </div>
            <Menu
              id="long-menu"
              MenuListProps={{
                'aria-labelledby': 'long-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                style: {
                  maxHeight: 48 * 4.5,
                  width: '20ch',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)', // 影のスタイルを薄く調整
                },
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={() => handleOpenDialog()}>
                <DeleteOutlineOutlinedIcon
                  fontSize="small"
                  style={{ marginRight: '8px' }}
                />
                削除
              </MenuItem>
              <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                BackdropProps={{ invisible: true }}
                PaperProps={{
                  style: {
                    boxShadow:
                      '0px 1px 3px -1px rgba(0,0,0,0.1), 0px 1px 1px 0px rgba(0,0,0,0.06), 0px 1px 1px -1px rgba(0,0,0,0.04)',
                    borderRadius: '16px', // ダイアログの角を丸くする
                  },
                }}
              >
                <DialogTitle id="alert-dialog-title">
                  {'ポストの削除'}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    ポストを完全に削除しますか？
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleCloseDialog}
                    sx={{
                      borderRadius: '20px', // ボタンの角を丸くする
                      ':hover': {
                        boxShadow: '0px 4px 20px rgba(173, 216, 230, 1)', // ホバー時の影を薄い青色に設定
                      },
                    }}
                  >
                    キャンセル
                  </Button>
                  <Button
                    onClick={handleDeletePost}
                    autoFocus
                    sx={{
                      borderRadius: '20px', // ボタンの角を丸くする
                      ':hover': {
                        boxShadow: '0px 4px 20px rgba(173, 216, 230, 1)', // ホバー時の影を薄い青色に設定
                      },
                    }}
                  >
                    削除
                  </Button>
                </DialogActions>
              </Dialog>
              <MenuItem onClick={handleClose}>
                <EditOutlinedIcon
                  fontSize="small"
                  style={{ marginRight: '8px' }}
                />
                編集（本リリース時）
              </MenuItem>
            </Menu>
          </div>
        )}
      </div>
    );
  };

  // XIconをクリックしたときの処理を追加
  const shareToX = (post) => {
    const ogPageUrl = `${API_URL}/api/v1/ogp_page/${post.id}`;
    let artistText = '';

    if (mediaWorks[post.id] && mediaWorks[post.id][0]) {
      const mediaType =
        mediaWorks[post.id][0].media_type === 'anime'
          ? 'アニメ'
          : '音楽アーティスト';
      artistText = `${post.user.username}の好きな${mediaType}は${mediaWorks[
        post.id
      ]
        .map(
          (work, index, array) =>
            `${work.title}${index < array.length - 1 ? '、' : ''}`,
        )
        .join('')}です！`;
    }

    const hashtag = '#16typeFavoriteDatabase'; // ハッシュタグを追加
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      artistText + '\n' + hashtag + '\n',
    )}&url=${encodeURIComponent(ogPageUrl)}`;
    window.open(shareUrl, '_blank');
  };

  useEffect(() => {
    // ページ遷移時に渡されたstateを確認し、ポスト成功の状態に基づいてSnackbarを表示
    if (location.state?.postSuccess) {
      setOpenSnackbar(true);
      setSnackbarMessage('ポストを送信しました！');
      // 遷移後にstateをクリアする（ブラウザの戻る操作で再表示されないように）
      history.replaceState({}, '');
    }
  }, [location]);

  return (
    <div style={{ cursor: 'pointer' }}>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-custom"></div>
          </div>
        </div>
      ) : (
        posts.map((post) => (
          <React.Fragment key={post.id}>
            {/* 投稿全体をクリック可能にするためのdivを追加 */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (!anchorEl) {
                  navigate(`/post/${post.id}`);
                }
              }}
            >
              {/* ユーザー詳細表示 */}
              <div style={{ margin: '20px 0 0 30px' }}>
                {post.user &&
                  renderUserDetails(post.user, post.createdAt, post.id)}
              </div>
              {/* 好きな音楽アーティストの表示 */}
              <div className="mb-5">
                <div className="text-xl pl-28 pr-16 w-full text-center">
                  {post.user.username}の好きな
                  {mediaWorks[post.id] && mediaWorks[post.id][0] ? (
                    <>
                      {mediaWorks[post.id][0].media_type === 'anime'
                        ? 'アニメ'
                        : '音楽アーティスト'}
                    </>
                  ) : (
                    ''
                  )}
                  は
                  {mediaWorks[post.id] &&
                    mediaWorks[post.id]
                      .map(
                        (work, index, array) =>
                          `${work.title}${index < array.length - 1 ? '、' : ''}`,
                      )
                      .join('')}
                  です！
                </div>
              </div>
              {/* メディア作品表示エリア */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  marginBottom: '5px',
                }}
              >
                {/* メディア作品の画像をレンダリング */}
                <div
                  style={
                    mediaWorks[post.id] && mediaWorks[post.id].length === 2
                      ? {
                          width: '500px',
                          height: '247.5px',
                          backgroundColor: 'black',
                          marginLeft: '345px',
                        }
                      : {
                          width: '500px',
                          height: '500px',
                          backgroundColor: 'black',
                          marginLeft: '345px',
                        }
                  }
                >
                  {mediaWorks[post.id] && renderImages(mediaWorks[post.id])}
                </div>
                {/* 画像をレンダリングする関数の直後にXIconを配置するコード */}
                {currentUser?.id === post.user.clerkId && (
                  <div
                    style={{
                      textAlign: 'right',
                      marginTop: '450px',
                      marginLeft: '200px',
                    }}
                    className="p-3 rounded-full hover:bg-gray-200"
                    onClick={(e) => {
                      e.stopPropagation(); // 親要素のonClickイベントが発火するのを防ぐ
                      shareToX(post);
                    }}
                  >
                    <XIcon style={{ fontSize: 40, cursor: 'pointer' }} />
                  </div>
                )}
              </div>
            </div>
            <hr className="border-t border-[#2EA9DF] w-full" />
          </React.Fragment>
        ))
      )}
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
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AllPosts;
