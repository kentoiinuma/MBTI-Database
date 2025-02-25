import React from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled } from '@mui/material/styles';

// アイコンのカスタムスタイル
const StyledMoreVertIcon = styled(MoreVertIcon)({
  fontSize: 35,
});

/**
 * PostHeader - 投稿のユーザー情報表示用ヘッダーコンポーネント
 *
 * @param {Object} props
 * @param {Object} props.user - ユーザー情報 (avatarUrl, username, clerkId)
 * @param {string} props.createdAt - 投稿日時（ISO形式）
 * @param {string} props.currentUserId - 現在ログインしているユーザーのID
 * @param {Function} props.onMenuClick - メニューアイコンクリック時のコールバック関数
 * @param {Function} props.onUserClick - ユーザー情報クリック時のコールバック関数
 * @param {Function} props.onDateClick - 日付クリック時のコールバック関数（オプション）
 */
const PostHeader = ({ user, createdAt, currentUserId, onMenuClick, onUserClick, onDateClick }) => {
  // 日付フォーマット
  const dateOptions = { month: 'long', day: 'numeric' };
  const formattedDate = new Date(createdAt).toLocaleDateString('ja-JP', dateOptions);

  // ユーザークリックイベントハンドラ
  const handleUserClick = (e) => {
    e.stopPropagation();
    onUserClick && onUserClick(user.clerkId);
  };

  // 日付クリックイベントハンドラ
  const handleDateClick = (e) => {
    e.stopPropagation();
    onDateClick && onDateClick(createdAt);
  };

  // メニュークリックイベントハンドラ
  const handleMenuClick = (e) => {
    e.stopPropagation();
    onMenuClick && onMenuClick(e);
  };

  return (
    <div className="flex items-center justify-between md:pl-16 lg:pl-32">
      <div className="flex items-center">
        <div className="flex items-center cursor-pointer" onClick={handleUserClick}>
          <div className="w-12 h-12 rounded-full overflow-hidden md:w-20 md:h-20">
            <img
              src={user.avatarUrl}
              alt="profileImage"
              className="w-full h-full object-cover transition-all duration-300 hover:brightness-90"
            />
          </div>
          <div className="ml-2 md:ml-4">
            <h1>
              <span className="text-lg font-medium md:font-normal hover:underline cursor-pointer md:text-2xl">
                {user.username}
              </span>
            </h1>
          </div>
        </div>
        <span className="ml-2 hover:underline cursor-pointer md:ml-4" onClick={handleDateClick}>
          {formattedDate}
        </span>
      </div>
      {currentUserId === user.clerkId && (
        <div className="md:mr-16 lg:mr-32 relative">
          <div
            className="hover:bg-gray-200 p-2 rounded-full inline-block cursor-pointer"
            onClick={handleMenuClick}
          >
            <StyledMoreVertIcon />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostHeader;
