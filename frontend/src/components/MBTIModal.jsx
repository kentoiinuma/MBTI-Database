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
      fetch(`${API_URL}/api/v1/users/${user.id}`)
        .then((response) => response.json())
        .then((data) => {
          setUserProfile({
            username: data.username,
            avatarUrl: data.avatar_url,
          });
          setEditableUsername(data.username);
        });

      // 初回表示時のみMBTIタイプと診断方法を読み込む
      if (!initialMBTI) {
        fetch(`${API_URL}/api/v1/mbti/${user.id}`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            if (data.mbti_type) {
              setSelectedMBTI(data.mbti_type);
            }
            if (data.visibility) {
              // visibilityを取得
              setVisibility(data.visibility);
            }
          })
          .catch((error) =>
            console.error("Failed to load user's MBTI type and diagnosis method", error)
          );
      }
    }
  }, [user, API_URL, initialMBTI, initialVisibility]);

  const handleClose = (event) => {
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

      // 初回登録か更新かを判断してAPIのエンドポイントとメソッドを変更
      const method = initialMBTI ? 'PUT' : 'POST';
      const endpoint = initialMBTI ? `${API_URL}/api/v1/mbti/${user.id}` : `${API_URL}/api/v1/mbti`;

      const mbtiResponse = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mbti_type: selectedMBTI,
          visibility: visibility, // visibilityを送信
          user_id: user.id, // POSTの場合のみ必要
        }),
      });

      if (!mbtiResponse.ok) {
        console.error('Failed to update MBTI information');
        return;
      }

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

      onUpdate(selectedMBTI);
      onClose();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
        onClick={handleClose}
      >
        <div
          id="modal-content"
          className="bg-white p-6 rounded-lg shadow-xl max-w-lg mx-auto border-[#2EA9DF]"
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
                  className="text-xl border py-1 px-3 shadow-sm focus:outline-none rounded-md bg-white focus:border-[#2EA9DF]"
                />
              </div>
            </Box>
          )}

          {/* 初回登録時のみ表示 */}
          {!initialMBTI && (
            <p className="text-center font-semibold mb-2 text-[#2EA9DF]">
              MBTIタイプと公開設定を選択してください。
            </p>
          )}

          {mbtiError && <Alert severity="error">MBTIタイプを選択してください</Alert>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="mbti-select"
                className="block text-sm font-medium mb-1 text-[#2EA9DF]"
              >
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
            </div>
            <fieldset className="mb-4">
              <legend className="text-sm font-medium mb-1 text-[#2EA9DF]">
                MBTIタイプの公開設定
              </legend>
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
