import React, { useState, useEffect } from 'react';
import { useUser, UserProfile } from '@clerk/clerk-react';

const Profile = () => {
  const { user } = useUser();
  const [mbtiType, setMbtiType] = useState(null);
  const [showUserProfile, setShowUserProfile] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/api/v1/mbti/${user.id}`)
        .then(response => response.json())
        .then(data => setMbtiType(data.mbti_type));
    }
  }, [user, API_URL]); // API_URL added to the dependency array

  const [selectedSection, setSelectedSection] = useState('posts');

  const selectSection = (section) => {
    setSelectedSection(section);
  };

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

  const renderContent = () => {
    switch (selectedSection) {
      case 'posts':
        return <div className="text-center mt-8">ポスト</div>;
      case 'comments':
        return <div className="text-center mt-8">コメント</div>;
      case 'likes':
        return <div className="text-center mt-8">いいね</div>;
    }
  };

  return (
    <div className="flex flex-col items-center mt-8">
      {user && (
        <>
          <div className="flex items-center justify-between w-full px-8">
            <div className="avatar">
                <div className="w-24 rounded-full">
                    <img src={user?.profileImageUrl} />
                </div>
            </div>
            <div className="ml-8">
              <h1 className="text-xl">{user.username}</h1>
              <div className="text-xl">{mbtiType}</div>
            </div>
            <div className="ml-auto mb-12 mr-20">
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                  </svg>
                </div>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li><button onClick={() => setShowUserProfile(true)}>アイコン/アバター</button></li>
                  <li><a href="/path/to/mbti">MBTIタイプ/診断方法</a></li>
                </ul>
              </div>
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
        </>
      )}
      {showUserProfile && <UserProfile />}
    </div>
  );
};

export default Profile;
