import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

const Profile = () => {
  const { user } = useUser();
  const [mbtiType, setMbtiType] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/api/v1/mbti/${user.id}`)
        .then(response => response.json())
        .then(data => setMbtiType(data.mbti_type));
    }
  }, [user]);

  // 初期状態で 'posts' セクションが選択されているように設定
  const [selectedSection, setSelectedSection] = useState('posts');

  // セクションを選択する関数
  const selectSection = (section) => {
    setSelectedSection(section);
  };

  // 選択されたセクションに基づいてスタイルを適用する関数
  const getSelectedStyle = (section) => {
    if (selectedSection === section) {
      return {
        borderBottom: '4px solid #7DB9DE',
        width: '33%',
        margin: '0 auto',
        borderRadius: '10px',
      };
    }
    return {};
  };

  // 選択されたセクションに基づいてコンテンツを表示する関数
  const renderContent = () => {
    switch (selectedSection) {
      case 'posts':
        return <div className="text-center mt-8">ポスト</div>;
      case 'comments':
        return <div className="text-center mt-8">コメント</div>;
      case 'likes':
        return <div className="text-center mt-8">いいね</div>;
      default:
        return null; // 何も選択されていない場合は何も表示しない
    }
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <div className="flex items-center justify-start w-full px-8">
        <div className="h-24 w-24 bg-gray-200 rounded-full">
          <img src={user?.profileImageUrl} alt="User avatar" className="h-24 w-24 rounded-full" />
        </div>
        <div className="ml-8">
          <h1 className="text-xl">{user.username}</h1>
          <div className="text-xl">{mbtiType}</div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-16 w-full">
        <div className="flex-1 text-center cursor-pointer" onClick={() => selectSection('posts')}>
          <span className="text-xl">ポスト</span>
          <div style={getSelectedStyle('posts')}></div>
        </div>
        <div className="flex-1 text-center cursor-pointer" onClick={() => selectSection('comments')}>
          <span className="text-xl">コメント</span>
          <div style={getSelectedStyle('comments')}></div>
        </div>
        <div className="flex-1 text-center cursor-pointer" onClick={() => selectSection('likes')}>
          <span className="text-xl">いいね</span>
          <div style={getSelectedStyle('likes')}></div>
        </div>
      </div>
      <hr className="border-t border-[#7DB9DE] w-full" />
      {renderContent()}
    </div>
  );
};

export default Profile;
