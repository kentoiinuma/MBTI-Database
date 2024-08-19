import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link } from '@mui/material'; // MUIのLinkコンポーネントをインポート
import Alert from '@mui/material/Alert'; // MUIのAlertコンポーネントをインポート
import Box from '@mui/material/Box';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import { useUserContext } from '../contexts/UserContext'; // useUserContextをインポート

// MBTIのタイプを定義
const MBTI_TYPES = [
  'ESFP',
  'ESTP',
  'ISFP',
  'ISTP', // Se
  'ESFJ',
  'ESTJ',
  'ISFJ',
  'ISTJ', // Si
  'ENFP',
  'ENTP',
  'INFP',
  'INTP', // Ne
  'ENFJ',
  'ENTJ',
  'INFJ',
  'INTJ', // Ni
];

// MBTIModalコンポーネントの定義
const MBTIModal = ({ onClose, onUpdate }) => {
  const { user } = useUser(); // Clerkからユーザー情報を取得
  const [selectedMBTI, setSelectedMBTI] = useState(''); // 選択されたMBTIタイプの状態
  const [diagnosisMethod, setDiagnosisMethod] = useState(''); // 診断方法の状態
  const [mbtiError, setMbtiError] = useState(false); // MBTIタイプ選択エラーの状態
  const [methodError, setMethodError] = useState(false); // 診断方法選択エラーの状態
  const [userProfile, setUserProfile] = useState(null); // ユーザープロファイル情報
  const [editableUsername, setEditableUsername] = useState(''); // 編集可能なユーザーネームの状態
  const [avatarFile, setAvatarFile] = useState(null); // アバターファイルの状態
  const { updateUserProfile } = useUserContext();

  // APIのURLを環境に応じて設定
  let API_URL;
  if (window.location.origin === 'http://localhost:3001') {
    API_URL = 'http://localhost:3000';
  } else if (window.location.origin === 'https://www.mbti-database.com') {
    API_URL = 'https://api.mbti-database.com';
  } else {
    // デフォルトのURL
    API_URL = 'http://localhost:3000';
  }

  useEffect(() => {
    if (user) {
      // ユーザープロファイル情報を取得
      fetch(`${API_URL}/api/v1/users/${user.id}`)
        .then((response) => response.json())
        .then((data) => {
          setUserProfile({
            username: data.username,
            avatarUrl: data.avatar_url,
          });
          setEditableUsername(data.username); // ユーザーネームを編集可能な状態に設定
        });

      fetch(`${API_URL}/api/v1/mbti/${user.id}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data); // ここで取得したデータを確認
          if (data.mbti_type) {
            setSelectedMBTI(data.mbti_type);
          }
          if (data.diagnosis_method) {
            // マッピング処理を削除し、直接値を設定
            setDiagnosisMethod(data.diagnosis_method);
          }
        })
        .catch((error) =>
          console.error("Failed to load user's MBTI type and diagnosis method", error)
        );
    }
  }, [user, API_URL]);

  // モーダル外をクリックしたときにモーダルを閉じる処理
  const handleClose = (event) => {
    // モーダルのコンテンツ部分をクリックした場合は何もしない
    if (event.target.id === 'modal-content') {
      return;
    }
    // それ以外の場所をクリックした場合はonCloseを呼び出してモーダルを閉じる
    onClose();
  };

  // MBTIタイプ選択時の処理
  const handleMBTIChange = (event) => {
    setSelectedMBTI(event.target.value);
  };

  // 診断方法選択時の処理
  const handleDiagnosisMethodChange = (event) => {
    setDiagnosisMethod(event.target.value);
  };

  // ユーザーネーム変更時の処理
  const handleUsernameChange = (event) => {
    setEditableUsername(event.target.value);
  };

  // アバター画像クリック時にファイル選択をトリガーする
  const triggerFileSelect = () => document.getElementById('avatarUpload').click();

  // ファイルが選択された時の処理
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // FileReaderを使用してファイルを読み込む
      const reader = new FileReader();
      reader.onloadend = () => {
        // 読み込んだ画像をuserProfileに反映
        setUserProfile({
          ...userProfile,
          avatarUrl: reader.result,
        });
      };
      reader.readAsDataURL(file);
      setAvatarFile(file); // 後でバックエンドにアップロードするためにファイルを状態に保存
    }
  };

  // アバターをアップロードする関数
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

  // フォーム送信時の処理
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
      // アバターが選択されていればアップロード
      if (avatarFile) {
        await uploadAvatar(avatarFile);
      }

      // MBTI情報の更新
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
        // エラーハンドリング
        console.error('Failed to update MBTI information');
        return;
      }

      // ユーザーネームの更新
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
        // エラーハンドリング
        console.error('Failed to update user information');
        return;
      } else {
        // UserContextを通じてアプリケーション全体にユーザー情報の更新を伝播
        updateUserProfile(editableUsername, userProfile.avatarUrl);
      }

      // 親コンポーネントの更新処理を呼び出し
      onUpdate(selectedMBTI);
      // モーダルを閉じる
      onClose();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
        onClick={handleClose} // モーダルの背景をクリックしたときにモーダルを閉じる処理を追加
      >
        <div
          id="modal-content" // モーダルのコンテンツ部分を特定するためのIDを追加
          className="bg-white p-6 rounded-lg shadow-xl max-w-lg mx-auto"
          style={{ borderColor: '#2EA9DF' }}
          onClick={(e) => e.stopPropagation()} // モーダルのコンテンツ内でのクリックイベントが外側に伝播しないようにする
        >
          {userProfile && (
            <Box position="relative" className="flex items-center space-x-4 p-4">
              <div className="avatar" onClick={triggerFileSelect}>
                <div className="w-24 rounded-full mr-4 cursor-pointer overflow-hidden">
                  <img
                    src={userProfile.avatarUrl}
                    alt="User avatar"
                    className="w-full h-auto" // 画像の幅をdivに合わせ、高さを自動調整するように変更
                    onClick={(e) => e.stopPropagation()} // この行を追加: 画像クリック時のイベント伝播を停止
                    style={{ filter: 'brightness(80%)' }} // 画像の明るさを80%に設定
                  />
                  <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    style={{
                      cursor: 'pointer',
                    }}
                  >
                    <AddAPhotoOutlinedIcon
                      style={{
                        fontSize: 40,
                        color: 'rgba(255, 255, 255, 0.7)',
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-70%)',
                      }}
                      onClick={(e) => {
                        e.stopPropagation(); // アイコンクリック時のイベント伝播を停止
                        triggerFileSelect(); // 明示的にファイル選択をトリガー
                      }}
                    />
                  </Box>
                </div>
              </div>
              <input
                type="file"
                id="avatarUpload"
                style={{ display: 'none' }} // 隠しinput
                onChange={handleFileChange}
              />
              <div className="flex flex-col">
                <label htmlFor="username" className="text-gray-700 mb-1">
                  名前
                </label>
                <input
                  id="username"
                  type="text"
                  value={editableUsername}
                  onChange={handleUsernameChange}
                  className="text-xl border py-1 px-3 shadow-sm focus:outline-none rounded-md"
                  style={{ borderColor: 'lightgray', backgroundColor: 'white' }}
                  onFocus={(e) => (e.target.style.borderColor = '#2EA9DF')}
                  onBlur={(e) => (e.target.style.borderColor = 'lightgray')}
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
                className="block text-sm font-medium text-gray-700 mb-1"
                style={{ color: '#2EA9DF' }}
              >
                MBTIタイプ
              </label>
              <select
                id="mbti-select"
                value={selectedMBTI}
                onChange={handleMBTIChange}
                className="block w-full border py-2 px-3 shadow-sm focus:outline-none rounded-md"
                style={{ borderColor: '#2EA9DF', backgroundColor: 'white' }}
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
              <legend
                className="text-sm font-medium text-gray-700 mb-1"
                style={{ color: '#2EA9DF' }}
              >
                タイプ診断の方法
              </legend>
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
                className="w-full inline-flex justify-center items-center px-4 py-2 font-bold rounded focus:outline-none focus:ring-opacity-50"
                style={{ backgroundColor: '#2EA9DF', color: 'white' }}
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
