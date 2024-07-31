import React, { useState, useEffect, createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Image } from 'cloudinary-react';
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
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import XIcon from '@mui/icons-material/X';
import { useUser } from '@clerk/clerk-react'; // useUserをインポート

// PostUsernameContextの作成
const PostUsernameContext = createContext();

// PostUsernameProviderコンポーネントの定義
export const PostUsernameProvider = ({ children }) => {
  const [postUsername, setPostUsername] = useState('');

  return (
    <PostUsernameContext.Provider value={{ postUsername, setPostUsername }}>
      {children}
    </PostUsernameContext.Provider>
  );
};

// usePostUsernameカスタムフックのエクスポート
export const usePostUsername = () => useContext(PostUsernameContext);

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

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const [mediaWorks, setMediaWorks] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deletePostId, setDeletePostId] = useState(null);
  const open = Boolean(anchorEl);
  const { postId } = useParams();
  const { user: currentUser } = useUser(); // useUserからcurrentUserを取得
  const { setPostUsername } = usePostUsername(); // コンテキストからsetPostUsernameを取得

  useEffect(() => {
    fetch(`${API_URL}/api/v1/posts/${postId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('API response:', data); // APIレスポンスの全体を確認
        setPost({
          ...data,
          user: {
            ...data.user,
            avatarUrl: data.user.avatar_url,
            username: data.user.username,
            clerkId: data.user.clerk_id,
          },
          createdAt: data.created_at,
        });
        // メディア作品情報を直接設定
        setMediaWorks({
          [data.id]: data.media_works,
        });
        setPostUsername(data.user.username);
      });
  }, [API_URL, postId, setPostUsername]);

  const handleClick = (event, postId) => {
    setAnchorEl(event.currentTarget);
    setDeletePostId(postId);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = () => {
    console.log('Opening dialog for post ID:', deletePostId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    handleClose();
  };

  const handleDeletePost = () => {
    console.log('Deleting post with ID:', deletePostId);
    if (deletePostId) {
      fetch(`${API_URL}/api/v1/posts/${deletePostId}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            setOpenDialog(false);
            setOpenSnackbar(true);
            setSnackbarMessage('ポストを削除しました！');
            // ポスト削除にAllPostsコンポーネントに遷移する
            window.location.href = '/';
          } else {
            console.error('Failed to delete the post');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

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

  const renderUserDetails = (user, createdAt, postId) => {
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
        {currentUser?.id === user.clerkId && (
          <div className="mr-8" style={{ position: 'relative' }}>
            <div
              className="hover:bg-gray-200 p-2 rounded-full"
              style={{ display: 'inline-block', cursor: 'pointer' }}
              onClick={(event) => handleClick(event, postId)}
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
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
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
                    borderRadius: '16px',
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
                      borderRadius: '20px',
                      ':hover': {
                        boxShadow: '0px 4px 20px rgba(173, 216, 230, 1)',
                      },
                    }}
                  >
                    キャンセル
                  </Button>
                  <Button
                    onClick={handleDeletePost}
                    autoFocus
                    sx={{
                      borderRadius: '20px',
                      ':hover': {
                        boxShadow: '0px 4px 20px rgba(173, 216, 230, 1)',
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

  return (
    <div>
      {post && (
        <React.Fragment key={post.id}>
          <div style={{ margin: '20px 0 0 30px' }}>
            {post.user && renderUserDetails(post.user, post.createdAt, post.id)}
          </div>
          <div className="mb-5">
            <div className="text-xl pl-28 pr-16 w-full text-center">
              {post.user.username}の好きな
              {mediaWorks[post.id] && mediaWorks[post.id][0] && (
                <>
                  {mediaWorks[post.id][0].media_type === 'anime'
                    ? 'アニメ'
                    : '音楽アーティスト'}
                </>
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              marginBottom: '5px',
            }}
          >
            <div
              style={
                mediaWorks[post.id] && mediaWorks[post.id].length === 2
                  ? {
                      width: '500px',
                      height: '247.5px',
                      backgroundColor: 'black',
                      marginLeft: '345px', // 左マージンを40pxに増やす
                    }
                  : {
                      width: '500px',
                      height: '500px',
                      backgroundColor: 'black',
                      marginLeft: '345px', // 左マージンを40pxに増やす
                    }
              }
            >
              {mediaWorks[post.id] && renderImages(mediaWorks[post.id])}
            </div>
            {currentUser?.id === post.user.clerkId && (
              <div
                style={{
                  textAlign: 'right',
                  marginTop: '450px',
                  marginLeft: '200px',
                }}
                className="p-3 rounded-full hover:bg-gray-200"
                onClick={() => shareToX(post)}
              >
                <XIcon style={{ fontSize: 40, cursor: 'pointer' }} />
              </div>
            )}
          </div>
          <hr className="border-t border-[#2EA9DF] w-full" />
        </React.Fragment>
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

export default PostDetail;
