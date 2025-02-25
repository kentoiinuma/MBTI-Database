import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { getApiUrl } from '../utils/apiUrl';
import PostHeader from './shared/PostHeader';
import PostContent from './shared/PostContent';
import MediaImages from './shared/MediaImages';
import DeleteMenu from './shared/DeleteMenu';
import ShareButton from './shared/ShareButton';

/**
 * 投稿詳細表示コンポーネント (PostShow.jsx)
 */
const PostShow = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useUser();

  // 投稿データ、メディア、MBTI 情報、ローディング状態の管理
  const [post, setPost] = useState(null);
  const [mediaWorks, setMediaWorks] = useState([]);
  const [mbti, setMbti] = useState(null);
  const [loading, setLoading] = useState(true);

  // メニュー／ダイアログ用の状態管理
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postRes = await fetch(`${getApiUrl()}/posts/${postId}`);
        const postData = await postRes.json();
        setPost({
          ...postData,
          user: {
            ...postData.user,
            avatarUrl: postData.user.avatar_url,
            username: postData.user.username,
            clerkId: postData.user.clerk_id,
          },
          createdAt: postData.created_at,
        });
        setMediaWorks(postData.media_works);

        try {
          const mbtiRes = await fetch(`${getApiUrl()}/users/${postData.user.clerk_id}/mbti`);
          const mbtiData = await mbtiRes.json();
          if (mbtiData.mbti_type) {
            setMbti(mbtiData);
          }
        } catch (error) {
          console.error(
            'PostShow.jsx: fetchPostData - MBTI情報の取得中にエラーが発生しました:',
            error
          );
        }
      } catch (error) {
        console.error(
          'PostShow.jsx: fetchPostData - 投稿情報の取得中にエラーが発生しました:',
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [postId]);

  // メニュー／ダイアログ操作用関数
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => {
    setOpenDialog(false);
    handleMenuClose();
  };

  // 投稿削除処理
  const handleDeletePost = async () => {
    try {
      const deleteRes = await fetch(`${getApiUrl()}/posts/${postId}`, {
        method: 'DELETE',
      });
      if (!deleteRes.ok) {
        console.error('PostShow.jsx: handleDeletePost - ポストの削除に失敗しました');
        return;
      }
      setOpenDialog(false);
      // 削除成功時は、navigate に state を渡して PostsIndex.jsx へ遷移
      navigate('/posts', {
        state: { deleteSuccess: true, snackbarMessage: 'ポストを削除しました！' },
      });
    } catch (error) {
      console.error(
        'PostShow.jsx: handleDeletePost - ポストの削除中にエラーが発生しました:',
        error
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-custom"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-0">
      {post?.user && (
        <div className="mt-10">
          <PostHeader
            user={post.user}
            createdAt={post.createdAt}
            currentUserId={currentUser?.id}
            onMenuClick={handleMenuOpen}
            onUserClick={(clerkId) => navigate(`/users/${clerkId}`)}
          />
        </div>
      )}

      <div className="mb-3 md:mb-5">
        <PostContent username={post.user.username} mbti={mbti} mediaWorks={mediaWorks} />
      </div>

      <div className="relative w-full mb-3 md:mb-5">
        <div className="flex justify-center">
          <div className="bg-black">
            <MediaImages works={mediaWorks} />
          </div>
        </div>
        {currentUser?.id === post?.user.clerkId && (
          <ShareButton
            post={{ id: post.id, mediaWorks: mediaWorks }}
            mbti={mbti}
            username={post?.user.username}
          />
        )}
      </div>

      <hr className="border-t border-[#2EA9DF] w-screen -mx-4 md:-mx-0" />

      {/* DeleteMenuコンポーネントを使用 */}
      <DeleteMenu
        anchorEl={anchorEl}
        openDialog={openDialog}
        onMenuClose={handleMenuClose}
        onDialogOpen={handleDialogOpen}
        onDialogClose={handleDialogClose}
        onDelete={handleDeletePost}
      />
    </div>
  );
};

export default PostShow;
