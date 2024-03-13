import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link } from '@mui/material'; // MUIのLinkコンポーネントをインポート
import Alert from '@mui/material/Alert'; // MUIのAlertコンポーネントをインポート

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

  // APIのURLを環境に応じて設定
  let API_URL;
  if (window.location.origin === 'http://localhost:3001') {
    API_URL = 'http://localhost:3000';
  } else if (
    window.location.origin ===
    'https://favorite-database-16type-f-5f78fa224595.herokuapp.com'
  ) {
    API_URL = 'https://favorite-database-16type-5020d6339517.herokuapp.com';
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
          console.error(
            "Failed to load user's MBTI type and diagnosis method",
            error,
          ),
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
            avatar_url: userProfile.avatarUrl, // userProfileから現在のavatarUrlを取得して送信
          },
        }),
      });

      if (!userResponse.ok) {
        // エラーハンドリング
        console.error('Failed to update user information');
        return;
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
            <div className="flex items-center space-x-4 p-4">
              <img
                src={userProfile.avatarUrl}
                alt="User avatar"
                className="w-20 rounded-full mr-4" // space-x-4を削除し、mr-8を追加して間隔を広げる
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
            </div>
          )}
          {mbtiError && (
            <Alert severity="error">MBTIタイプを選択してください</Alert>
          )}
          {methodError && (
            <Alert severity="error">タイプ診断の方法を選択してください。</Alert>
          )}
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
                <Link
                  href="https://www.mbti.or.jp/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
