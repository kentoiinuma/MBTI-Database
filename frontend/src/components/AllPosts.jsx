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
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import XIcon from '@mui/icons-material/X';
import Database from './database';
import { styled } from '@mui/material/styles';

const StyledMoreVertIcon = styled(MoreVertIcon)({
  fontSize: 35,
});

const StyledXIcon = styled(XIcon)({
  fontSize: 40,
});

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [mediaWorks, setMediaWorks] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deletePostId, setDeletePostId] = useState(null);
  const open = Boolean(anchorEl);
  const { user: currentUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [userMbtiTypes, setUserMbtiTypes] = useState({});
  const [selectedSection, setSelectedSection] = useState('home');

  const selectSection = (section) => {
    setSelectedSection(section);
  };

  const handleClick = (event, postId) => {
    event.stopPropagation();
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
            setPosts(posts.filter((post) => post.id !== deletePostId));
            setOpenDialog(false);
            setOpenSnackbar(true);
            setSnackbarMessage('ポストを除しました！');
          } else {
            console.error('Failed to delete the post');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

  let API_URL;
  if (window.location.origin === 'http://localhost:3001') {
    API_URL = 'http://localhost:3000';
  } else if (window.location.origin === 'https://www.mbti-database.com') {
    API_URL = 'https://api.mbti-database.com';
  } else {
    API_URL = 'http://localhost:3000';
  }

  useEffect(() => {
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
              clerkId: post.user.clerk_id,
            },
            createdAt: post.created_at,
          }))
        );
        setIsLoading(false);

        data.forEach((post) => {
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
                        avatarUrl: userData.avatar_url,
                        username: userData.username,
                        clerkId: userData.clerk_id,
                      },
                    };
                  }
                  return p;
                })
              );
            });

          fetch(`${API_URL}/api/v1/media_works?post_id=${post.id}`)
            .then((response) => response.json())
            .then((media) => {
              setMediaWorks((prev) => ({
                ...prev,
                [post.id]: media,
              }));
            });

          fetch(`${API_URL}/api/v1/mbti/${post.user.clerk_id}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then((data) => {
              if (data) {
                setUserMbtiTypes((prevTypes) => ({
                  ...prevTypes,
                  [post.user.clerk_id]: data,
                }));
              } else {
                console.log(`MBTI type not set for user ${post.user.clerk_id}`);
              }
            })
            .catch((error) => {
              console.error('Error fetching MBTI type:', error);
            });
        });
      });
  }, [API_URL, location.pathname]);

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

  const renderUserDetails = (postUser, createdAt, postId) => {
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
              className="hover:bg-gray-200 md:p-2 rounded-full inline-block cursor-pointer"
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
                    ポストを完全に削除���ますか？
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

    if (mediaWorks[post.id] && mediaWorks[post.id][0]) {
      const mediaType =
        mediaWorks[post.id][0].media_type === 'anime' ? 'アニメ' : '音楽アーティスト';
      // visibilityがis_publicの場合のみMBTIタイプを表示
      const mbtiType =
        userMbtiTypes[post.user.clerkId] &&
        userMbtiTypes[post.user.clerkId].visibility === 'is_public'
          ? `(${userMbtiTypes[post.user.clerkId].mbti_type})`
          : '';
      artistText = `${post.user.username}${mbtiType}の好きな${mediaType}は${mediaWorks[post.id]
        .map((work, index, array) => `${work.title}${index < array.length - 1 ? '、' : ''}`)
        .join('')}です！`;
    }

    const hashtag = '#MBTIデータベース';
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      artistText + '\n\n' + hashtag + '\n'
    )}&url=${encodeURIComponent(ogPageUrl)}`;
    window.open(shareUrl, '_blank');
  };

  useEffect(() => {
    if (location.state?.postSuccess) {
      setOpenSnackbar(true);
      setSnackbarMessage('ポストを送信しました！');
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const renderContent = () => {
    switch (selectedSection) {
      case 'home':
        return renderPosts();
      case 'database':
        return (
          <div className="w-full max-w-7xl mx-auto">
            <Database />
          </div>
        );
      default:
        return null;
    }
  };

  const renderPosts = () => {
    return (
      <div>
        {isLoading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="loading loading-spinner loading-lg text-custom"></div>
            </div>
          </div>
        ) : (
          posts.map((post) => (
            <React.Fragment key={post.id}>
              <div
                onClick={(e) => {
                  if (!anchorEl) {
                    navigate(`/post/${post.id}`);
                  }
                }}
              >
                <div className="mt-5">
                  {post.user && renderUserDetails(post.user, post.createdAt, post.id)}
                </div>
                <div className="mb-3 md:mb-5">
                  <div className="text-base px-12 w-full text-center md:text-xl md:px-36 lg:px-40">
                    {post.user.username}
                    {/* visibilityがis_publicの場合のみMBTIタイプを表示 */}
                    {userMbtiTypes[post.user.clerkId] &&
                    userMbtiTypes[post.user.clerkId].visibility === 'is_public'
                      ? `(${userMbtiTypes[post.user.clerkId].mbti_type})`
                      : ''}
                    の好きな
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
                            `${work.title}${index < array.length - 1 ? '、' : ''}`
                        )
                        .join('')}
                    です！
                  </div>
                </div>
                <div className="relative w-full mb-3 md:mb-5">
                  <div className="flex justify-center">
                    <div className="bg-black">
                      {mediaWorks[post.id] && renderImages(mediaWorks[post.id])}
                    </div>
                  </div>
                  {currentUser?.id === post.user.clerkId && (
                    <div
                      className="absolute bottom-0 right-0 rounded-full hover:bg-gray-200 cursor-pointer md:left-[700px] lg:left-[1270px] w-12 h-12 flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        shareToX(post);
                      }}
                    >
                      <StyledXIcon />
                    </div>
                  )}
                </div>
              </div>
              <hr className="border-t border-[#2EA9DF] w-screen -mx-4 md:-mx-0" />
            </React.Fragment>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="px-4 md:px-0">
      <div className="fixed top-16 md:top-12 left-0 right-0 bg-off-white z-10">
        <div className="flex justify-between items-center mt-4 w-full max-w-xl mx-auto md:mt-8 md:max-w-2xl">
          <div
            className="flex-1 text-center cursor-pointer text-lg md:text-xl sidebar-link"
            onClick={() => selectSection('database')}
          >
            <span>データベース</span>
            <div
              className={
                selectedSection === 'database'
                  ? 'border-b-4 border-[#2EA9DF] w-1/2 mx-auto rounded-lg'
                  : ''
              }
            ></div>
          </div>
          <div
            className="flex-1 text-center cursor-pointer text-lg md:text-xl sidebar-link"
            onClick={() => selectSection('home')}
          >
            <span>ホーム</span>
            <div
              className={
                selectedSection === 'home'
                  ? 'border-b-4 border-[#2EA9DF] w-1/2 mx-auto rounded-lg'
                  : ''
              }
            ></div>
          </div>
        </div>
        <hr className="border-t border-[#91989F] w-full" />
      </div>
      <div className="mt-20 md:mt-24">{renderContent()}</div>
      <Snackbar open={openSnackbar} autoHideDuration={2500} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AllPosts;
