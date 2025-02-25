import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Snackbar, Alert } from '@mui/material';
import Database from './database';
import { getApiUrl } from '../utils/apiUrl';
import PostHeader from './shared/PostHeader';
import PostContent from './shared/PostContent';
import MediaImages from './shared/MediaImages';
import DeleteMenu from './shared/DeleteMenu';
import ShareButton from './shared/ShareButton';

/**
 * PostCardコンポーネント
 * - 各ポストの詳細表示
 * - 削除用メニュー / ダイアログ、シェアボタンを含む
 */
const PostCard = ({ post, currentUser, onDelete, navigate }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // メニュー表示用ハンドラ
  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = (event) => {
    event.stopPropagation();
    setOpenDialog(true);
    handleCloseMenu();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // 削除リクエストを親へ通知
  const handleDelete = () => {
    onDelete(post.id);
    handleCloseDialog();
  };

  return (
    <div onClick={() => navigate(`/posts/${post.id}`)} className="cursor-pointer">
      {/* ユーザー情報 - PostHeaderコンポーネントに変更 */}
      <div className="mt-5">
        <PostHeader
          user={post.user}
          createdAt={post.createdAt}
          currentUserId={currentUser?.id}
          onMenuClick={handleMenuClick}
          onUserClick={(clerkId) => {
            navigate(`/users/${clerkId}`);
          }}
        />
      </div>

      {/* ポスト本文 - PostContentコンポーネントに変更 */}
      <div className="mb-3 md:mb-5">
        <PostContent username={post.user.username} mbti={post.mbti} mediaWorks={post.mediaWorks} />
      </div>

      {/* メディア画像とシェアボタン */}
      <div className="relative w-full mb-3 md:mb-5">
        <div className="flex justify-center">
          <div className="bg-black">
            {post.mediaWorks && <MediaImages works={post.mediaWorks} />}
          </div>
        </div>
        {currentUser?.id === post.user.clerkId && (
          <ShareButton post={post} mbti={post.mbti} username={post.user.username} />
        )}
      </div>
      <hr className="border-t border-[#2EA9DF] w-screen -mx-4 md:-mx-0" />

      {/* DeleteMenuコンポーネントを使用 */}
      <DeleteMenu
        anchorEl={anchorEl}
        openDialog={openDialog}
        onMenuClose={handleCloseMenu}
        onDialogOpen={handleOpenDialog}
        onDialogClose={handleCloseDialog}
        onDelete={handleDelete}
      />
    </div>
  );
};

const PostsIndex = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState('home');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const { user: currentUser } = useUser();

  // ポスト削除の処理
  const handleDeletePost = async (postId) => {
    try {
      const deleteRes = await fetch(`${getApiUrl()}/posts/${postId}`, {
        method: 'DELETE',
      });
      if (deleteRes.ok) {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        setOpenSnackbar(true);
        setSnackbarMessage('ポストを削除しました！');
      } else {
        console.error('PostsIndex.jsx / handleDeletePost: ポストの削除に失敗しました');
      }
    } catch (error) {
      console.error(
        'PostsIndex.jsx / handleDeletePost: ポスト削除中にエラーが発生しました:',
        error
      );
    }
  };

  // ポストと関連情報の取得
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRes = await fetch(`${getApiUrl()}/posts`);
        const postsData = await postsRes.json();

        // 初期化：createdAt の設定とユーザー情報の初期値
        const postsInitial = postsData.map((post) => ({
          ...post,
          user: {
            ...post.user,
            avatarUrl: null,
            username: null,
            clerkId: post.user.clerk_id,
          },
          createdAt: post.created_at,
        }));

        // 各ポストの詳細情報（ユーザー・メディア作品・MBTI）を並列取得
        const postsWithDetails = await Promise.all(
          postsInitial.map(async (post) => {
            try {
              const [userRes, mediaRes, mbtiRes] = await Promise.all([
                fetch(`${getApiUrl()}/users/${post.user.clerk_id}`),
                fetch(`${getApiUrl()}/posts/${post.id}/media_works`),
                fetch(`${getApiUrl()}/users/${post.user.clerk_id}/mbti`),
              ]);
              const userData = await userRes.json();
              const mediaData = await mediaRes.json();
              const mbtiData = await mbtiRes.json();
              return {
                ...post,
                user: {
                  ...post.user,
                  avatarUrl: userData.avatar_url,
                  username: userData.username,
                  clerkId: userData.clerk_id,
                },
                mediaWorks: mediaData,
                mbti: mbtiData,
              };
            } catch (error) {
              console.error(
                'PostsIndex.jsx / fetchPostDetails: ポスト詳細の取得中にエラーが発生しました:',
                error
              );
              return post; // エラー時はそのまま返す
            }
          })
        );
        setPosts(postsWithDetails);
      } catch (error) {
        console.error('PostsIndex.jsx / fetchPosts: ポストの取得中にエラーが発生しました:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [location.pathname]);

  // セクション切替
  const selectSection = (section) => {
    setSelectedSection(section);
  };

  // ポスト送信成功時のSnackbar表示（location.state利用）
  useEffect(() => {
    if (location.state?.postSuccess) {
      setOpenSnackbar(true);
      setSnackbarMessage('ポストを送信しました！');
      navigate(location.pathname, { replace: true, state: {} });
    } else if (location.state?.deleteSuccess) {
      setOpenSnackbar(true);
      setSnackbarMessage('ポストを削除しました！');
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // セクションごとのコンテンツ切替
  const renderContent = () => {
    if (selectedSection === 'home') {
      return isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-custom"></div>
          </div>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUser={currentUser}
            onDelete={handleDeletePost}
            navigate={navigate}
          />
        ))
      );
    } else if (selectedSection === 'database') {
      return (
        <div className="w-full max-w-7xl mx-auto">
          <Database />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="px-4 md:px-0">
      {/* セクション切替ナビゲーション */}
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

export default PostsIndex;
