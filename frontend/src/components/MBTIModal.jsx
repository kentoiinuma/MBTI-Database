import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import { styled } from '@mui/material/styles';
import { useUserContext } from '../contexts/UserContext';
import { getApiUrl } from '../utils/apiUrl';

// MBTIタイプの選択肢一覧
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

/**
 * MBTIModal - ユーザーのMBTIタイプ設定・編集用モーダルコンポーネント
 *
 * 機能：
 * - MBTIタイプの選択と公開/非公開設定
 * - ユーザー名の編集
 * - プロフィール画像のアップロード
 * - 新規設定と既存設定の更新に対応
 */
function MBTIModal({ onClose, onUpdate, initialMBTI = '', initialVisibility = 'is_public' }) {
  const { user } = useUser();
  const { updateProfile } = useUserContext();
  const clerkId = user?.id;

  // 状態管理変数
  const [selectedMBTI, setSelectedMBTI] = useState(initialMBTI); // 選択されたMBTIタイプ
  const [mbtiError, setMbtiError] = useState(false); // バリデーションエラー状態
  const [profile, setProfile] = useState(null); // ユーザープロフィール情報
  const [editableUsername, setEditableUsername] = useState(''); // 編集可能なユーザー名
  const [avatarFile, setAvatarFile] = useState(null); // アップロード用アバターファイル
  const [visibility, setVisibility] = useState(initialVisibility); // MBTIの公開設定
  const [isLoading, setIsLoading] = useState(true); // ロード状態
  const [isSubmitting, setIsSubmitting] = useState(false); // 送信処理中状態

  // 初期データ取得
  useEffect(() => {
    if (!clerkId) return;

    // ユーザー情報とMBTI情報を取得
    const fetchUserData = async () => {
      try {
        const userRes = await fetch(`${getApiUrl()}/users/${clerkId}`);
        const userData = await userRes.json();

        setProfile({
          username: userData.username,
          avatarUrl: userData.avatar_url,
        });
        setEditableUsername(userData.username);

        if (!initialMBTI) {
          const mbtiRes = await fetch(`${getApiUrl()}/users/${clerkId}/mbti`);
          const mbtiData = await mbtiRes.json();

          if (mbtiData.mbti_type) {
            setSelectedMBTI(mbtiData.mbti_type);
          }
          if (mbtiData.visibility) {
            setVisibility(mbtiData.visibility);
          }
        }
      } catch (error) {
        console.error(`[MBTIModal] ユーザーデータの取得に失敗しました: ${error.message}`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [clerkId, initialMBTI]);

  // アバター画像のアップロード処理
  const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const uploadRes = await fetch(`${getApiUrl()}/users/${clerkId}/upload_avatar`, {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (uploadRes.ok) {
        setProfile((prevProfile) => ({
          ...prevProfile,
          avatarUrl: uploadData.avatar_url,
        }));
      } else {
        console.error(`[MBTIModal] アバターのアップロードに失敗しました: ${uploadData.error}`);
      }
    } catch (error) {
      console.error(`[MBTIModal] アバターのアップロードに失敗しました: ${error.message}`, error);
    }
  };

  // モーダル外クリック時の処理
  const handleOverlayClick = (event) => {
    if (!initialMBTI) return;
    if (event.target.id === 'modal-content') return;
    onClose();
  };

  // フォーム入力ハンドラー
  const handleMBTIChange = (event) => {
    setSelectedMBTI(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setEditableUsername(event.target.value);
  };

  const handleVisibilityChange = (event) => {
    setVisibility(event.target.value);
  };

  // アバター画像選択関連の処理
  const triggerFileSelect = () => {
    document.getElementById('avatarUpload').click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prevProfile) => ({
        ...prevProfile,
        avatarUrl: reader.result,
      }));
    };
    reader.readAsDataURL(file);

    setAvatarFile(file);
  };

  // フォーム送信処理
  const handleSubmit = async (event) => {
    event.preventDefault();
    // バリデーション
    let hasError = false;

    if (!selectedMBTI) {
      setMbtiError(true);
      hasError = true;
    } else {
      setMbtiError(false);
    }

    if (hasError) return;

    setIsSubmitting(true);
    const mbtiPayload = {
      mbti_type: selectedMBTI,
      visibility,
    };

    // API送信処理
    try {
      // アバター画像のアップロード
      if (avatarFile) {
        await uploadAvatar(avatarFile);
      }

      // MBTIデータの作成（初回のみ）または更新
      if (!initialMBTI) {
        const mbtiCreateRes = await fetch(`${getApiUrl()}/users/${clerkId}/mbti`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mbtiPayload),
        });
        if (!mbtiCreateRes.ok) {
          console.error('[MBTIModal] MBTI情報の作成に失敗しました');
          return;
        }
      }

      // ユーザー情報の更新
      const userUpdateRes = await fetch(`${getApiUrl()}/users/${clerkId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: { username: editableUsername },
        }),
      });

      if (!userUpdateRes.ok) {
        console.error('[MBTIModal] ユーザー情報の更新に失敗しました');
        return;
      } else {
        updateProfile(editableUsername, profile?.avatarUrl);
      }

      onUpdate(selectedMBTI, visibility);
      onClose();
    } catch (error) {
      console.error('[MBTIModal] 処理中にエラーが発生しました:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ローディング表示
  if (isLoading || isSubmitting) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-custom"></div>
        </div>
      </div>
    );
  }

  // モーダルのUI描画
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={handleOverlayClick}
    >
      <div
        id="modal-content"
        className="bg-white p-4 rounded-lg shadow-xl max-w-xs mx-4 border-[#2EA9DF] md:p-6 md:max-w-lg md:mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* プロフィール情報表示・編集エリア */}
        {profile && (
          <Box className="flex items-center space-x-4 p-4">
            <div className="avatar cursor-pointer group" onClick={triggerFileSelect}>
              <div className="w-24 h-24 rounded-full mr-4 overflow-hidden relative">
                <img
                  src={profile.avatarUrl}
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
              <label htmlFor="username" className="mb-1">
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

        {/* 新規作成時のガイダンス */}
        {!initialMBTI && (
          <p className="text-center font-semibold mb-2 text-[#2EA9DF] md:whitespace-nowrap">
            MBTIタイプと公開設定を
            <br className="md:hidden" />
            選択してください。
          </p>
        )}

        {/* エラーメッセージ */}
        {mbtiError && <Alert severity="error">MBTIタイプを選択してください</Alert>}

        {/* MBTIタイプ設定フォーム */}
        <form onSubmit={handleSubmit}>
          {/* MBTIタイプ選択 */}
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

          {/* 公開設定選択 */}
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
                  className="w-4 h-4 text-[#2EA9DF] bg-gray-100 border-gray-300 focus:ring-0 focus:ring-offset-0 focus:ring-transparent focus:ring-2"
                />
                <label htmlFor="is_public" className="ml-2 text-sm font-medium">
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
                  className="w-4 h-4 text-[#2EA9DF] bg-gray-100 border-gray-300 focus:ring-0 focus:ring-offset-0 focus:ring-transparent focus:ring-2"
                />
                <label htmlFor="is_private" className="ml-2 text-sm font-medium">
                  非公開
                </label>
              </div>
            </div>
            <p className="text-sm mt-2">
              非公開にすると自分のMBTIタイプが他のユーザーから見えなくなります。
            </p>
          </fieldset>

          {/* 送信ボタン */}
          <div className="flex justify-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center items-center px-4 py-2 font-bold rounded-full focus:outline-none focus:ring-opacity-50 bg-[#2EA9DF] text-white hover:bg-[#2589B4] transition-colors duration-300"
            >
              {initialMBTI ? '更新する' : 'アカウントを作成'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MBTIModal;
