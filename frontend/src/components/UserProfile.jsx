import React, { useState, useEffect, useCallback, useMemo } from 'react';
import MBTIModal from './MBTIModal';
import { useUser } from '@clerk/clerk-react';
import { useUserContext } from '../contexts/UserContext';
import { useParams, useNavigate } from 'react-router-dom';
import { getApiUrl } from '../utils/apiUrl';
import PostHeader from './shared/PostHeader';
import PostContent from './shared/PostContent';
import MediaImages from './shared/MediaImages';
import DeleteMenu from './shared/DeleteMenu';
import ShareButton from './shared/ShareButton';

// ──────────────
// 1件の投稿表示コンポーネント
// ──────────────
const PostItem = ({
  post,
  profile,
  userMbtiType,
  mbtiVisibility,
  navigate,
  onMenuOpen,
  isOwnProfile,
}) => {
  return (
    <React.Fragment key={post.id}>
      <div onClick={() => navigate(`/posts/${post.id}`)} className="cursor-pointer">
        <div className="mt-5">
          <PostHeader
            user={{
              avatarUrl: profile.avatarUrl || 'デフォルトのアバター画像URL',
              username: profile.username || 'Unknown User',
              clerkId: profile.clerkId || '',
            }}
            createdAt={post.created_at}
            currentUserId={isOwnProfile ? profile.clerkId : null}
            onMenuClick={(event) => onMenuOpen(event, post.id)}
            onUserClick={(clerkId) => navigate(`/users/${clerkId}`)}
          />
        </div>
        <div className="mb-3 md:mb-5">
          <PostContent
            username={profile.username}
            mbti={
              mbtiVisibility === 'is_public'
                ? { mbti_type: userMbtiType, visibility: mbtiVisibility }
                : null
            }
            mediaWorks={post.mediaWorks}
          />
        </div>
        <div className="relative w-full mb-3 md:mb-5">
          <div className="flex justify-center">
            <div className="bg-black">
              <MediaImages works={post.mediaWorks} />
            </div>
          </div>
          {isOwnProfile && (
            <ShareButton
              post={post}
              mbti={userMbtiType ? { mbti_type: userMbtiType, visibility: mbtiVisibility } : null}
              username={profile.username}
            />
          )}
        </div>
      </div>
      <hr className="border-t border-[#2EA9DF] w-screen -mx-4 md:-mx-0" />
    </React.Fragment>
  );
};

function UserProfile() {
  // ステートの定義
  const [profile, setProfile] = useState(null);
  const [mbtiType, setMbtiType] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userMbtiType, setUserMbtiType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState('posts');
  const [showMBTIModal, setShowMBTIModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deletePostId, setDeletePostId] = useState(null);

  const { user } = useUser();
  const { isProfileUpdated } = useUserContext();
  const { clerkId } = useParams();
  const navigate = useNavigate();

  // 自分のプロフィールかどうかの判定
  const isOwnProfile = useMemo(() => {
    return user && profile && user.id === profile.clerkId;
  }, [user, profile]);

  // ──────────────
  // APIからデータを取得する関数群
  // ──────────────

  // ユーザープロフィール取得
  const fetchUserProfile = useCallback(async (targetClerkId) => {
    try {
      const res = await fetch(`${getApiUrl()}/users/${targetClerkId}`);
      const data = await res.json();
      setProfile({
        username: data.username,
        avatarUrl: data.avatar_url,
        clerkId: data.clerk_id,
      });
    } catch (error) {
      console.error(
        `[UserProfile] ユーザープロフィールの取得に失敗しました: ${error.message}`,
        error
      );
    }
  }, []);

  // MBTI情報取得
  const fetchUserMBTI = useCallback(async (targetClerkId) => {
    try {
      const res = await fetch(`${getApiUrl()}/users/${targetClerkId}/mbti`);
      const data = await res.json();
      if (data.mbti_type) {
        setMbtiType(data);
        setUserMbtiType(data.mbti_type);
      }
    } catch (error) {
      console.error(`[UserProfile] MBTI情報の取得に失敗しました: ${error.message}`, error);
    }
  }, []);

  // ユーザー投稿一覧（各投稿にmedia_works情報を付加）
  const fetchUserPosts = useCallback(async (targetClerkId) => {
    try {
      const res = await fetch(`${getApiUrl()}/users/${targetClerkId}/posts`);
      const postsData = await res.json();
      const postsWithMedia = await Promise.all(
        postsData.map(async (post) => {
          try {
            const mediaRes = await fetch(`${getApiUrl()}/posts/${post.id}/media_works`);
            const mediaData = await mediaRes.json();
            return { ...post, mediaWorks: mediaData };
          } catch (error) {
            console.error(
              `[UserProfile] ポスト ${post.id} のメディアワークの取得に失敗しました: ${error.message}`,
              error
            );
            return { ...post, mediaWorks: [] };
          }
        })
      );
      setUserPosts(postsWithMedia);
    } catch (error) {
      console.error(`[UserProfile] ユーザー投稿の取得に失敗しました: ${error.message}`, error);
    }
  }, []);

  // ──────────────
  // データ初期取得用のEffect
  // ──────────────
  useEffect(() => {
    const targetClerkId = clerkId || user?.id;
    if (!targetClerkId) return;
    (async () => {
      setIsLoading(true);
      await Promise.all([
        fetchUserProfile(targetClerkId),
        fetchUserMBTI(targetClerkId),
        fetchUserPosts(targetClerkId),
      ]);
      setIsLoading(false);
    })();
  }, [clerkId, user, isProfileUpdated, fetchUserProfile, fetchUserMBTI, fetchUserPosts]);

  // ──────────────
  // 各種ハンドラー
  // ──────────────

  // メニュー操作（MoreVertIcon押下時）
  const handleMenuOpen = (event, postId) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setDeletePostId(postId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // 削除ダイアログ操作
  const handleOpenDialog = (event) => {
    event.stopPropagation();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    handleMenuClose();
  };

  const handleDeletePost = async () => {
    if (!deletePostId) return;
    try {
      const res = await fetch(`${getApiUrl()}/posts/${deletePostId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('投稿の削除に失敗しました');
      setUserPosts((prevPosts) => prevPosts.filter((p) => p.id !== deletePostId));
    } catch (error) {
      console.error(`[UserProfile] ポストの削除に失敗しました: ${error.message}`, error);
    } finally {
      handleCloseDialog();
    }
  };

  // タブ操作
  const selectSection = (section) => setSelectedSection(section);
  const getSelectedStyle = (section) =>
    selectedSection === section ? 'border-b-4 border-[#2EA9DF] w-1/2 mx-auto rounded-lg' : '';

  // 各タブのコンテンツレンダリング
  const renderPostsSection = () => {
    if (userPosts.length === 0 && isOwnProfile) {
      return (
        <div className="flex justify-center items-center h-full mt-8">
          <p className="text-center text-gray-600">
            右下の+ボタンから好きな作品やアーティストをポストしてみよう😌
          </p>
        </div>
      );
    }

    return (
      <div>
        {[...userPosts].reverse().map((post) => (
          <PostItem
            key={post.id}
            post={post}
            profile={profile}
            userMbtiType={userMbtiType}
            mbtiVisibility={mbtiType?.visibility}
            navigate={navigate}
            onMenuOpen={handleMenuOpen}
            isOwnProfile={isOwnProfile}
          />
        ))}
      </div>
    );
  };

  const renderPlaceholder = (label) => (
    <div className="text-center mt-4 md:mt-8">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 inline-block"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484
             c-1.076-.091-2.264.071-2.95.904l-7.152 8.684
             a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152
             c.833-.686.995-1.874.904-2.95
             a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276
             a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276
             c.256.565.398 1.192.398 1.852Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.867 19.125h.008v.008h-.008v-.008Z"
        />
      </svg>
      {label} は実装予定です。
    </div>
  );

  const renderContent = () => {
    switch (selectedSection) {
      case 'posts':
        return renderPostsSection();
      case 'comments':
        return renderPlaceholder('コメント');
      case 'likes':
        return renderPlaceholder('いいね');
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-custom"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full px-4 md:px-0">
      {profile && (
        <>
          {/* ヘッダー部：アバター、ユーザー名、MBTI情報、MBTI編集ボタン */}
          <div className="flex items-center justify-between w-full pt-8 md:pt-8 md:px-8">
            <div className="avatar">
              <div className="w-16 h-16 rounded-full overflow-hidden md:w-24 md:h-24">
                <img
                  src={profile.avatarUrl || ''}
                  alt="User profile"
                  className="w-full h-full object-cover transition-all duration-300"
                />
              </div>
            </div>
            <div className="ml-4 md:ml-8">
              <h1>
                <span className="text-xl md:text-2xl">{profile.username}</span>{' '}
                <span className="ml-2 md:ml-4">
                  {mbtiType?.visibility === 'is_public' && mbtiType.mbti_type}
                </span>
              </h1>
            </div>
            <div className="ml-auto mb-4 md:mb-12 mr-4 md:mr-16 lg:mr-20">
              {(!clerkId || clerkId === user?.id) && (
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
                      d="m16.862 4.487 1.687-1.688
                         a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82
                         a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685
                         a4.5 4.5 0 0 1 1.13-1.897
                         L16.863 4.487Zm0 0L19.5 7.125"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* タブ部分 */}
          <div className="flex justify-between items-center mt-8 md:mt-16 w-full">
            <div
              className="flex-1 text-center cursor-pointer sidebar-link"
              onClick={() => selectSection('posts')}
            >
              <span className="text-lg md:text-xl">ポスト</span>
              <div className={getSelectedStyle('posts')}></div>
            </div>
            <div
              className="flex-1 text-center cursor-pointer sidebar-link"
              onClick={() => selectSection('comments')}
            >
              <span className="text-lg md:text-xl">コメント</span>
              <div className={getSelectedStyle('comments')}></div>
            </div>
            <div
              className="flex-1 text-center cursor-pointer sidebar-link"
              onClick={() => selectSection('likes')}
            >
              <span className="text-lg md:text-xl">いいね</span>
              <div className={getSelectedStyle('likes')}></div>
            </div>
          </div>

          <hr className="border-t border-[#2EA9DF] w-screen -mx-4 md:-mx-0" />

          {/* タブごとのコンテンツ */}
          {renderContent()}
        </>
      )}

      {/* MBTI編集モーダル（自分のプロフィールの場合のみ表示） */}
      {showMBTIModal && (!clerkId || clerkId === user?.id) && (
        <MBTIModal
          onClose={() => setShowMBTIModal(false)}
          onUpdate={(newMbtiType, newVisibility) => {
            fetch(`${getApiUrl()}/users/${user.id}/mbti`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                mbti_type: newMbtiType,
                visibility: newVisibility,
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                setMbtiType({
                  mbti_type: data.mbti_type,
                  visibility: data.visibility,
                });
                setUserMbtiType(data.mbti_type);
              })
              .catch((error) => {
                console.error(
                  `[UserProfile] MBTI タイプの更新に失敗しました: ${error.message}`,
                  error
                );
              });
          }}
          initialMBTI={mbtiType?.mbti_type || ''}
          initialVisibility={mbtiType?.visibility || 'is_public'}
        />
      )}

      {/* DeleteMenuコンポーネントを使用 */}
      <DeleteMenu
        anchorEl={anchorEl}
        openDialog={openDialog}
        onMenuClose={handleMenuClose}
        onDialogOpen={handleOpenDialog}
        onDialogClose={handleCloseDialog}
        onDelete={handleDeletePost}
      />
    </div>
  );
}

export default UserProfile;
