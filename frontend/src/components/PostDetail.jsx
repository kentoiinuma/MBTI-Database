import React, { useState, useEffect, createContext, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import XIcon from '@mui/icons-material/X';
import { useUser } from '@clerk/clerk-react';
import { styled } from '@mui/material/styles';

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

// usePostUsernameカスタムフックのエクト
export const usePostUsername = () => useContext(PostUsernameContext);

let API_URL;
if (window.location.origin === 'http://localhost:3001') {
  API_URL = 'http://localhost:3000';
} else if (window.location.origin === 'https://www.mbti-database.com') {
  API_URL = 'https://api.mbti-database.com';
} else {
  API_URL = 'http://localhost:3000';
}

const StyledMoreVertIcon = styled(MoreVertIcon)({
  fontSize: 35,
});

const StyledXIcon = styled(XIcon)({
  fontSize: 40,
});

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [mediaWorks, setMediaWorks] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deletePostId, setDeletePostId] = useState(null);
  const open = Boolean(anchorEl);
  const { user: currentUser } = useUser();
  const { setPostUsername } = usePostUsername();
  const [loading, setLoading] = useState(true);
  const [userMbtiType, setUserMbtiType] = useState(null);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/posts/${postId}`);
        const data = await response.json();
        console.log('API response:', data);
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
        setMediaWorks(data.media_works);
        setPostUsername(data.user.username);
        setLoading(false);

        // ユーザーのMBTIタイプを取得
        const mbtiResponse = await fetch(`${API_URL}/api/v1/mbti/${data.user.clerk_id}`);
        const mbtiData = await mbtiResponse.json();
        if (mbtiData.mbti_type) {
          setUserMbtiType(mbtiData.mbti_type);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setLoading(false);
      }
    };

    fetchPostData();
  }, [postId, setPostUsername]);

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
            setSnackbarMessage('ポストを削除ました！');
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

    return (
      <div className={containerClass}>
        {works.map((work, index) => (
          <Image
            key={index}
            cloudName="dputyeqso"
            publicId={work.image}
            className={`
              ${works.length === 1 ? 'w-[250px] h-[250px] md:w-[500px] md:h-[500px]' : 'w-[122.5px] h-[122.5px] md:w-[247.5px] md:h-[247.5px]'}
            `}
          />
        ))}
      </div>
    );
  };

  const renderUserDetails = (postUser, createdAt) => {
    const dateOptions = { month: 'long', day: 'numeric' };
    const formattedDate = new Date(createdAt).toLocaleDateString('ja-JP', dateOptions);

    return (
      <div className="flex items-center justify-between md:pl-16 lg:pl-32">
        <div className="flex items-center">
          <div
            className="flex items-center cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/profile/${postUser.clerkId}`);
            }}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden md:w-20 md:h-20">
              <img
                src={postUser.avatarUrl}
                alt={`profileImage`}
                className="w-full h-full object-cover transition-all duration-300 hover:brightness-90"
              />
            </div>
            <div className="ml-2 md:ml-4">
              <h1>
                <span className="text-lg font-medium md:font-normal hover:underline cursor-pointer md:text-2xl">
                  {postUser.username}
                </span>
              </h1>
            </div>
          </div>
          <span className="ml-2 hover:underline cursor-pointer md:ml-4">{formattedDate}</span>
        </div>
        {currentUser?.id === postUser.clerkId && (
          <div className="md:mr-16 lg:mr-32 relative">
            <div
              className="hover:bg-gray-200 p-2 rounded-full inline-block cursor-pointer"
              onClick={(event) => handleClick(event, postId)}
            >
              <StyledMoreVertIcon />
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
                <DeleteOutlineOutlinedIcon fontSize="small" style={{ marginRight: '8px' }} />
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
                <DialogTitle id="alert-dialog-title">{'ポストの削除'}</DialogTitle>
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
            </Menu>
          </div>
        )}
      </div>
    );
  };

  const shareToX = (post) => {
    const ogPageUrl = `${API_URL}/api/v1/ogp_page/${post.id}`;
    let artistText = '';

    if (mediaWorks && mediaWorks[0]) {
      const mediaType = mediaWorks[0].media_type === 'anime' ? 'アニメ' : '音楽アーティスト';
      const mbtiTypeText = userMbtiType ? `(${userMbtiType})` : '';
      artistText = `${post.user.username}${mbtiTypeText}の好きな${mediaType}は${mediaWorks
        .map((work, index, array) => `${work.title}${index < array.length - 1 ? '、' : ''}`)
        .join('')}です！`;
    }

    const hashtag = '#MBTIデータベース';
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      artistText + '\n' + hashtag + '\n'
    )}&url=${encodeURIComponent(ogPageUrl)}`;
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="px-4 md:px-0">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-custom"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-10">{post?.user && renderUserDetails(post.user, post.createdAt)}</div>
          <div className="mb-3 md:mb-5">
            <div className="text-base px-12 w-full text-center md:text-xl md:px-36 lg:px-40">
              {post.user.username}
              {userMbtiType && `(${userMbtiType})`}
              の好きな
              {mediaWorks[0] ? (
                <>{mediaWorks[0].media_type === 'anime' ? 'アニメ' : '音楽アーティスト'}</>
              ) : (
                ''
              )}
              は
              {mediaWorks
                .map((work, index, array) => `${work.title}${index < array.length - 1 ? '、' : ''}`)
                .join('')}
              です！
            </div>
          </div>
          <div className="relative w-full mb-3 md:mb-5">
            <div className="flex justify-center">
              <div className="bg-black">{renderImages(mediaWorks)}</div>
            </div>
            {currentUser?.id === post.user.clerkId && (
              <div
                className="absolute bottom-0 right-0 rounded-full hover:bg-gray-200 cursor-pointer md:p-3 md:left-[700px] lg:left-[1250px]"
                onClick={(e) => {
                  e.stopPropagation();
                  shareToX(post);
                }}
              >
                <StyledXIcon />
              </div>
            )}
          </div>
          <hr className="border-t border-[#2EA9DF] w-screen -mx-4 md:-mx-0" />
          <Snackbar
            open={openSnackbar}
            autoHideDuration={2500}
            onClose={() => setOpenSnackbar(false)}
          >
            <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </>
      )}
    </div>
  );
};

export default PostDetail;
