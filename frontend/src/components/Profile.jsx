import React, { useState, useEffect } from 'react';
import { Image } from 'cloudinary-react';
import MBTIModal from './MBTIModal2';
import { useUser } from '@clerk/clerk-react';
import { useUserContext } from '../contexts/UserContext';
import { useParams, useNavigate } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import XIcon from '@mui/icons-material/X';
import {
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [mbtiType, setMbtiType] = useState(null);
  const [showMBTIModal, setShowMBTIModal] = useState(false);
  const [userPosts, setUserPosts] = useState([]);

  const { user: currentUser } = useUser();
  const { userUpdated } = useUserContext();
  const { clerkId } = useParams();
  const navigate = useNavigate();

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

  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deletePostId, setDeletePostId] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const targetClerkId = clerkId || currentUser?.id;
    if (targetClerkId) {
      fetch(`${API_URL}/api/v1/users/${targetClerkId}`)
        .then((response) => response.json())
        .then((data) => {
          setUserProfile({
            username: data.username,
            avatarUrl: data.avatar_url,
            clerkId: data.clerk_id,
          });
        });

      fetch(`${API_URL}/api/v1/mbti/${targetClerkId}`)
        .then((response) => response.json())
        .then((data) => setMbtiType(data.mbti_type));

      fetch(`${API_URL}/api/v1/posts?user_id=${targetClerkId}`)
        .then((response) => response.json())
        .then((posts) => {
          setUserPosts(posts);
          posts.forEach((post) => {
            fetch(`${API_URL}/api/v1/media_works?post_id=${post.id}`)
              .then((response) => response.json())
              .then((mediaWorks) => {
                setUserPosts((prevPosts) =>
                  prevPosts.map((p) =>
                    p.id === post.id ? { ...p, mediaWorks } : p,
                  ),
                );
              });
          });
        })
        .catch((error) => {
          console.error('Error fetching posts:', error);
          // エラーハンドリングを行う（例：エラーメッセージを表示する）
        });
    }
  }, [API_URL, currentUser, clerkId, userUpdated]);

  const [selectedSection, setSelectedSection] = useState('posts');

  const selectSection = (section) => {
    setSelectedSection(section);
  };

  const getSelectedStyle = (section) => {
    if (selectedSection === section) {
      return {
        borderBottom: '4px solid #2EA9DF',
        width: '33%',
        margin: '0 auto',
        borderRadius: '10px',
      };
    }
    return {};
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

  const renderUserDetails = (post, createdAt, postId) => {
    if (!userProfile) {
      console.error('userProfile is undefined', { postId, createdAt });
      return null;
    }

    const dateOptions = { month: 'long', day: 'numeric' };
    const formattedDate = new Date(createdAt).toLocaleDateString(
      'ja-JP',
      dateOptions,
    );

    return (
      <div className="user-details flex items-center justify-between">
        <div className="flex items-center">
          <div
            className="flex items-center cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/profile/${userProfile.clerkId || ''}`);
            }}
          >
            <div className="avatar">
              <div className="w-20 rounded-full overflow-hidden">
                <img
                  src={userProfile.avatarUrl || 'デフォルトのアバター画像URL'}
                  alt={`profileImage`}
                  className="w-full h-full object-cover transition-all duration-300 hover:brightness-90"
                />
              </div>
            </div>
            <div className="ml-4">
              <h1>
                <span className="text-2xl hover:underline cursor-pointer">
                  {userProfile.username || 'Unknown User'}
                </span>
              </h1>
            </div>
          </div>
          <span className="ml-4 hover:underline cursor-pointer">
            {formattedDate}
          </span>
        </div>
        {currentUser?.id === userProfile.clerkId && (
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
              <MenuItem onClick={handleDeleteClick}>
                <DeleteOutlineOutlinedIcon
                  fontSize="small"
                  style={{ marginRight: '8px' }}
                />
                削除
              </MenuItem>
              <MenuItem onClick={handleEditClick}>
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

  const handleClick = (event, postId) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setDeletePostId(postId);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = () => {
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
            // 投稿が正常に削除された場合、投稿リストからの投稿を削除
            setUserPosts(userPosts.filter((post) => post.id !== deletePostId));
            setOpenDialog(false); // ダイアログを閉じる
            // ここでスナックバーを表示するなど処理を追加できます
          } else {
            // エラーハンドリング
            console.error('Failed to delete the post');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
    handleCloseDialog();
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'posts':
        return (
          <div>
            {userPosts.map((post) => (
              <React.Fragment key={post.id}>
                <div
                  onClick={() => navigate(`/post/${post.id}`)}
                  className="cursor-pointer"
                >
                  <div style={{ margin: '20px 0 0 30px' }}>
                    {renderUserDetails(post, post.created_at, post.id)}
                  </div>
                  <div className="mb-5">
                    <div className="text-xl pl-28 pr-16 w-full text-center">
                      {userProfile.username}の好きな
                      {post.mediaWorks && post.mediaWorks[0] ? (
                        <>
                          {post.mediaWorks[0].media_type === 'anime'
                            ? 'アニメ'
                            : '音楽アーティスト'}
                        </>
                      ) : (
                        ''
                      )}
                      は
                      {post.mediaWorks &&
                        post.mediaWorks
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
                      marginBottom: '20px',
                    }}
                  >
                    <div
                      style={
                        post.mediaWorks && post.mediaWorks.length === 2
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
                      {post.mediaWorks && renderImages(post.mediaWorks)}
                    </div>
                    {currentUser?.id === userProfile.clerkId && (
                      <div
                        style={{
                          textAlign: 'right',
                          marginTop: '450px',
                          marginLeft: '200px',
                        }}
                        className="p-3 rounded-full hover:bg-gray-200"
                        onClick={(e) => {
                          e.stopPropagation();
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
            ))}
          </div>
        );
      case 'comments':
        return (
          <div className="text-center mt-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 inline-block mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.867 19.125h.008v.008h-.008v-.008Z"
              />
            </svg>
            本リリースで実装予定
          </div>
        );
      case 'likes':
        return (
          <div className="text-center mt-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 inline-block mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.867 19.125h.008v.008h-.008v-.008Z"
              />
            </svg>
            本リリースで実装予定
          </div>
        );
      default:
        return null;
    }
  };

  const shareToX = (post) => {
    const ogPageUrl = `${API_URL}/api/v1/ogp_page/${post.id}`;
    let artistText = '';

    if (post.mediaWorks && post.mediaWorks[0]) {
      const mediaType =
        post.mediaWorks[0].media_type === 'anime'
          ? 'アニメ'
          : '音楽アーティスト';
      artistText = post.mediaWorks
        .map(
          (work, index, array) =>
            `${work.title}${index < array.length - 1 ? '、' : ''}`,
        )
        .join('');

      const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `${userProfile.username}の好きな${mediaType}は${artistText}です！\n${ogPageUrl}`,
      )}`;
      window.open(shareUrl, '_blank');
    }
  };

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    handleOpenDialog();
  };

  const handleEditClick = (event) => {
    event.stopPropagation();
    // 編集機能の実装（本リリース時）
    handleClose();
  };

  return (
    <div className="flex flex-col w-full">
      {userProfile && (
        <>
          <div className="flex items-center justify-between w-full px-8">
            <div className="avatar">
              <div className="w-24 rounded-full overflow-hidden">
                <img
                  src={userProfile?.avatarUrl}
                  alt="User profile"
                  className="w-full h-full object-cover transition-all duration-300 hover:brightness-90"
                />
              </div>
            </div>
            <div className="ml-8">
              <h1>
                <span className="text-2xl">{userProfile.username}</span>{' '}
                <span className="ml-4">{mbtiType}</span>
              </h1>
            </div>
            <div className="ml-auto mb-12 mr-20">
              {(!clerkId || clerkId === currentUser?.id) && (
                <div
                  tabIndex={0}
                  role="button"
                  onClick={() => setShowMBTIModal(true)}
                  className="p-2 rounded-full hover:bg-gray-200"
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
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center mt-16 w-full">
            <div
              className="flex-1 text-center cursor-pointer"
              onClick={() => selectSection('posts')}
            >
              <span className="text-xl">ポスト</span>
              <div style={getSelectedStyle('posts')}></div>
            </div>
            <div
              className="flex-1 text-center cursor-pointer"
              onClick={() => selectSection('comments')}
            >
              <span className="text-xl">コメント</span>
              <div style={getSelectedStyle('comments')}></div>
            </div>
            <div
              className="flex-1 text-center cursor-pointer"
              onClick={() => selectSection('likes')}
            >
              <span className="text-xl">いいね</span>
              <div style={getSelectedStyle('likes')}></div>
            </div>
          </div>
          <hr className="border-t border-[#2EA9DF] w-full" />
          {renderContent()}
        </>
      )}
      {showMBTIModal && (!clerkId || clerkId === currentUser?.id) && (
        <MBTIModal
          onClose={() => setShowMBTIModal(false)}
          onUpdate={setMbtiType}
        />
      )}
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
    </div>
  );
};

export default Profile;
