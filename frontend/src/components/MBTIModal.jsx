import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import { styled } from '@mui/material/styles';
import { useUserContext } from '../contexts/UserContext';

const MBTI_TYPES = [
  'ESTP',
  'ESFP',
  'ISTP',
  'ISFP',
  'ESTJ',
  'ESFJ',
  'ISTJ',
  'ISFJ',
  'ENTP',
  'ENFP',
  'INTP',
  'INFP',
  'ENTJ',
  'ENFJ',
  'INTJ',
  'INFJ',
];

const StyledAddAPhotoOutlinedIcon = styled(AddAPhotoOutlinedIcon)({
  fontSize: 40,
  color: 'rgba(255, 255, 255, 0.7)',
});

const MBTIModal = ({ onClose, onUpdate, initialMBTI = '', initialVisibility = 'is_public' }) => {
  const { user } = useUser();
  const [selectedMBTI, setSelectedMBTI] = useState(initialMBTI);
  const [mbtiError, setMbtiError] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [editableUsername, setEditableUsername] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const { updateUserProfile } = useUserContext();
  // visibilityの状態を管理
  const [visibility, setVisibility] = useState(initialVisibility); // デフォルトは公開
  const [isLoading, setIsLoading] = useState(true);

  let API_URL;
  if (window.location.origin === 'http://localhost:3001') {
    API_URL = 'http://localhost:3000';
  } else if (window.location.origin === 'https://www.mbti-database.com') {
    API_URL = 'https://api.mbti-database.com';
  } else {
    API_URL = 'http://localhost:3000';
  }

  useEffect(() => {
    if (user) {
      Promise.all([
        fetch(`${API_URL}/api/v1/users/${user.id}`).then((response) => response.json()),
        !initialMBTI
          ? fetch(`${API_URL}/api/v1/mbti/${user.id}`).then((response) => response.json())
          : Promise.resolve(null),
      ])
        .then(([userData, mbtiData]) => {
          setUserProfile({
            username: userData.username,
            avatarUrl: userData.avatar_url,
          });
          setEditableUsername(userData.username);

          if (mbtiData) {
            if (mbtiData.mbti_type) {
              setSelectedMBTI(mbtiData.mbti_type);
            }
            if (mbtiData.visibility) {
              setVisibility(mbtiData.visibility);
            }
          }

          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Failed to load user data', error);
          setIsLoading(false);
        });
    }
  }, [user, API_URL, initialMBTI, initialVisibility]);

  const handleClose = (event) => {
    // 初期登録時（initialMBTIが空文字）はモーダルを閉じないようにする
    if (!initialMBTI) {
      return;
    }
    if (event.target.id === 'modal-content') {
      return;
    }
    onClose();
  };

  const handleMBTIChange = (event) => {
    setSelectedMBTI(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setEditableUsername(event.target.value);
  };

  // visibilityの変更を処理するハンドラ
  const handleVisibilityChange = (event) => {
    setVisibility(event.target.value);
  };

  const triggerFileSelect = () => document.getElementById('avatarUpload').click();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserProfile({
          ...userProfile,
          avatarUrl: reader.result,
        });
      };
      reader.readAsDataURL(file);
      setAvatarFile(file);
    }
  };

  const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await fetch(`${API_URL}/api/v1/users/${user.id}/upload_avatar`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setUserProfile({
          ...userProfile,
          avatarUrl: data.avatar_url,
        });
      } else {
        console.error('Failed to upload avatar:', data.error);
      }
    } catch (error) {
      console.error('Failed to upload avatar:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let hasError = false;

    if (!selectedMBTI) {
      setMbtiError(true);
      hasError = true;
    } else {
      setMbtiError(false);
    }

    if (!hasError) {
      if (avatarFile) {
        await uploadAvatar(avatarFile);
      }

      // initialMBTI初回登録時の処理
      if (!initialMBTI) {
        const mbtiResponse = await fetch(`${API_URL}/api/v1/mbti`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mbti_type: selectedMBTI,
            visibility: visibility,
            user_id: user.id,
          }),
        });

        if (!mbtiResponse.ok) {
          console.error('Failed to create MBTI information');
          return;
        }
      }

      // ユーザー情報の更新
      const userResponse = await fetch(`${API_URL}/api/v1/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            username: editableUsername,
          },
        }),
      });

      if (!userResponse.ok) {
        console.error('Failed to update user information');
        return;
      } else {
        updateUserProfile(editableUsername, userProfile.avatarUrl);
      }

      onUpdate(selectedMBTI, visibility); // visibility を渡す
      onClose();
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-custom"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
        onClick={handleClose}
      >
        <div
          id="modal-content"
          className="bg-white p-4 rounded-lg shadow-xl max-w-xs mx-4 border-[#2EA9DF] md:p-6 md:max-w-lg md:mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {userProfile && (
            <Box className="flex items-center space-x-4 p-4">
              <div className="avatar cursor-pointer group" onClick={triggerFileSelect}>
                <div className="w-24 h-24 rounded-full mr-4 overflow-hidden relative">
                  <img
                    src={userProfile.avatarUrl}
                    alt="User avatar"
                    className="w-full h-full object-cover brightness-75 group-hover:brightness-50 transition-all duration-300"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <StyledAddAPhotoOutlinedIcon
                      className="absolute left-1/2 transform -translate-x-1/2"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerFileSelect();
                      }}
                    />
                  </div>
                </div>
              </div>
              <input type="file" id="avatarUpload" className="hidden" onChange={handleFileChange} />
              <div className="flex flex-col">
                <label htmlFor="username" className="text-gray-700 mb-1">
                  名前
                </label>
                <input
                  id="username"
                  type="text"
                  value={editableUsername}
                  onChange={handleUsernameChange}
                  className="text-base border py-1 px-3 shadow-sm focus:outline-none rounded-md bg-white focus:border-[#2EA9DF] md:text-xl w-full"
                />
              </div>
            </Box>
          )}

          {/* 初回登録時のみ表示 */}
          {!initialMBTI && (
            <p className="text-center font-semibold mb-2 text-[#2EA9DF] md:whitespace-nowrap">
              MBTIタイプと公開設定を
              <br className="md:hidden" /> {/* md以上の画面では改行しない */}
              選択してください。
            </p>
          )}

          {mbtiError && <Alert severity="error">MBTIタイプを選択してください</Alert>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="mbti-select" className="block text-sm font-semibold mb-1">
                MBTIタイプ
              </label>
              <select
                id="mbti-select"
                value={selectedMBTI}
                onChange={handleMBTIChange}
                className="block w-full border py-2 px-3 shadow-sm focus:outline-none rounded-md border-[#2EA9DF] bg-white"
              >
                <option value="">--選択してください--</option>
                {MBTI_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm">
                <a
                  href="https://mentuzzle.com/shindan/report/16type"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2EA9DF] hover:underline"
                >
                  おすすめの16タイプ診断サービス
                </a>
              </p>
            </div>
            <fieldset className="mb-4">
              <legend className="text-sm font-semibold mb-1">MBTIタイプの公開設定</legend>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    id="is_public"
                    type="radio"
                    value="is_public"
                    checked={visibility === 'is_public'}
                    onChange={handleVisibilityChange}
                    className="w-4 h-4 text-[#2EA9DF] bg-gray-100 border-gray-300 focus:ring-0 focus:ring-offset-0 focus:ring-transparent dark:focus:ring-transparent dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="is_public"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    公開
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="is_private"
                    type="radio"
                    value="is_private"
                    checked={visibility === 'is_private'}
                    onChange={handleVisibilityChange}
                    className="w-4 h-4 text-[#2EA9DF] bg-gray-100 border-gray-300 focus:ring-0 focus:ring-offset-0 focus:ring-transparent dark:focus:ring-transparent dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="is_private"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    非公開
                  </label>
                </div>
              </div>
              <p className="text-sm mt-2">
                非公開にすると自分のMBTIタイプが他のユーザーから見えなくなります。
              </p>{' '}
              {/* 説明を追加 */}
            </fieldset>
            <div className="flex justify-center gap-4">
              <button
                type="submit"
                className="inline-flex justify-center items-center px-4 py-2 font-bold rounded-full focus:outline-none focus:ring-opacity-50 bg-[#2EA9DF] text-white hover:bg-[#2589B4] transition-colors duration-300"
              >
                {initialMBTI ? '更新する' : 'アカウントを作成'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default MBTIModal;
