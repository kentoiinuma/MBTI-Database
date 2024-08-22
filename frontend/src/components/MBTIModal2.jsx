import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import { styled } from '@mui/material/styles';
import { useUserContext } from '../contexts/UserContext';

const MBTI_TYPES = [
  'ESFP',
  'ESTP',
  'ISFP',
  'ISTP',
  'ESFJ',
  'ESTJ',
  'ISFJ',
  'ISTJ',
  'ENFP',
  'ENTP',
  'INFP',
  'INTP',
  'ENFJ',
  'ENTJ',
  'INFJ',
  'INTJ',
];

const StyledAddAPhotoOutlinedIcon = styled(AddAPhotoOutlinedIcon)({
  fontSize: 40,
  color: 'rgba(255, 255, 255, 0.7)',
});

const MBTIModal = ({ onClose, onUpdate }) => {
  const { user } = useUser();
  const [selectedMBTI, setSelectedMBTI] = useState('');
  const [diagnosisMethod, setDiagnosisMethod] = useState('');
  const [mbtiError, setMbtiError] = useState(false);
  const [methodError, setMethodError] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [editableUsername, setEditableUsername] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const { updateUserProfile } = useUserContext();

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

      fetch(`${API_URL}/api/v1/mbti/${user.id}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.mbti_type) {
            setSelectedMBTI(data.mbti_type);
          }
          if (data.diagnosis_method) {
            setDiagnosisMethod(data.diagnosis_method);
          }
        })
        .catch((error) =>
          console.error("Failed to load user's MBTI type and diagnosis method", error)
        );
    }
  }, [user, API_URL]);

  const handleClose = (event) => {
    if (event.target.id === 'modal-content') {
      return;
    }
    onClose();
  };

  const handleMBTIChange = (event) => {
    setSelectedMBTI(event.target.value);
  };

  const handleDiagnosisMethodChange = (event) => {
    setDiagnosisMethod(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setEditableUsername(event.target.value);
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

    if (!diagnosisMethod) {
      setMethodError(true);
      hasError = true;
    } else {
      setMethodError(false);
    }

    if (!hasError) {
      if (avatarFile) {
        await uploadAvatar(avatarFile);
      }

      const mbtiResponse = await fetch(`${API_URL}/api/v1/mbti/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mbti_type: selectedMBTI,
          diagnosis_method: diagnosisMethod,
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
              <div className="avatar cursor-pointer" onClick={triggerFileSelect}>
                <div className="w-24 h-24 rounded-full mr-4 overflow-hidden relative">
                  <img
                    src={userProfile.avatarUrl}
                    alt="User avatar"
                    className="w-full h-full object-cover brightness-50"
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
          {mbtiError && <Alert severity="error">MBTIタイプを選択してください</Alert>}
          {methodError && <Alert severity="error">タイプ診断の方法を選択してください。</Alert>}
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
              <legend className="text-sm font-medium mb-1 text-[#2EA9DF]">タイプ診断の方法</legend>
              <label className="block mb-4">
                <input
                  type="radio"
                  value="self_assessment"
                  name="diagnosisMethod"
                  onChange={handleDiagnosisMethodChange}
                  checked={diagnosisMethod === 'self_assessment'}
                  className="mr-2"
                />
                診断サイトでの診断を参考にしたり、書籍やWebサイトなどでMBTIに関する情報を集めて、自らの判断で決定した
                <div className="ml-4 mt-2">
                  <Link
                    href="https://www.16personalities.com/ja/%E6%80%A7%E6%A0%BC%E8%A8%BA%E6%96%AD%E3%83%86%E3%82%B9%E3%83%88"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    16personalities
                  </Link>
                  <br />
                  <Link
                    href="https://www.idrlabs.com/jp/cognitive-function/test.php"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    心理機能テスト
                  </Link>
                  <br />
                  <Link
                    href="http://rinnsyou.com/archives/category/0200sinriryouhou/0203yungu"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    心理機能について
                  </Link>
                  <br />
                  <Link
                    href="https://www.amazon.co.jp/dp/4905050219"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    MBTIの書籍
                  </Link>
                </div>
              </label>
              <label className="block">
                <input
                  type="radio"
                  value="official_assessment"
                  name="diagnosisMethod"
                  onChange={handleDiagnosisMethodChange}
                  checked={diagnosisMethod === 'official_assessment'}
                  className="mr-2"
                />
                <Link href="https://www.mbti.or.jp/" target="_blank" rel="noopener noreferrer">
                  公式
                </Link>
                のセッションを通じて決定した
              </label>
            </fieldset>
            <div className="flex justify-center gap-4">
              <button
                type="submit"
                className="inline-flex justify-center items-center px-4 py-2 font-bold rounded-full focus:outline-none focus:ring-opacity-50 bg-[#2EA9DF] text-white"
              >
                更新する
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default MBTIModal;
