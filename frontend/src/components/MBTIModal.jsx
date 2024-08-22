import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import Alert from '@mui/material/Alert';

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

// MBTIModalコンポーネント
const MBTIModal = ({ onClose }) => {
  const { user } = useUser();
  const [selectedMBTI, setSelectedMBTI] = useState('');
  const [diagnosisMethod, setDiagnosisMethod] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [mbtiError, setMbtiError] = useState(false);
  const [methodError, setMethodError] = useState(false);
  // フォームが送信されたかどうかを追跡する新しい状態変数を追加
  const [formSubmitted, setFormSubmitted] = useState(false);

  // APIのURLを環境に応じて設定
  let API_URL;
  if (window.location.origin === 'http://localhost:3001') {
    API_URL = 'http://localhost:3000';
  } else if (window.location.origin === 'https://www.mbti-database.com') {
    API_URL = 'https://api.mbti-database.com';
  } else {
    API_URL = 'http://localhost:3000';
  }

  const handleMBTIChange = (event) => {
    setSelectedMBTI(event.target.value);
  };

  const handleDiagnosisMethodChange = (event) => {
    setDiagnosisMethod(event.target.value);
  };

  const handleAgreementChange = (event) => {
    setAgreedToTerms(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true); // フォームが送信されたときに true に設定
    if (!selectedMBTI) {
      setMbtiError(true);
    } else {
      setMbtiError(false);
    }
    if (!diagnosisMethod) {
      setMethodError(true);
    } else {
      setMethodError(false);
    }
    if (agreedToTerms && selectedMBTI && diagnosisMethod) {
      const response = await fetch(`${API_URL}/api/v1/mbti`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mbti_type: selectedMBTI,
          diagnosis_method: diagnosisMethod,
          user_id: user.id,
        }),
      });

      if (!response.ok) {
        // エラーハンドリング
      }

      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg mx-auto border border-[#2EA9DF]">
        <h2 className="text-xl font-semibold mb-4 text-[#2EA9DF]">
          MBTIタイプと診断方法を選択してください。
        </h2>
        {formSubmitted && agreedToTerms === false && (
          <Alert severity="error">利用規約とプライバシーポリシーに同意してください。</Alert>
        )}
        {mbtiError && <Alert severity="error">MBTIタイプを選択してください</Alert>}
        {methodError && <Alert severity="error">タイプ診断の方法を選択してください。</Alert>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="mbti-select" className="block text-sm font-medium text-[#2EA9DF] mb-1">
              MBTIタイプ
            </label>
            <select
              id="mbti-select"
              value={selectedMBTI}
              onChange={handleMBTIChange}
              className="block w-full border border-[#2EA9DF] py-2 px-3 shadow-sm focus:outline-none rounded-md bg-white"
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
            <legend className="text-sm font-medium text-[#2EA9DF] mb-1">タイプ診断の方法</legend>

            <label className="block mb-4">
              <input
                type="radio"
                value="self_assessment"
                name="diagnosisMethod"
                onChange={handleDiagnosisMethodChange}
                className="mr-2"
              />
              診断サイトでの診断を参考にしたり、書籍やWebサイトなどでMBTIに関する情報を集めて、自らの判断で決定した
              <div className="ml-4 mt-2">
                <MuiLink
                  href="https://www.16personalities.com/ja/%E6%80%A7%E6%A0%BC%E8%A8%BA%E6%96%AD%E3%83%86%E3%82%B9%E3%83%88"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  16personalities
                </MuiLink>
                <br />
                <MuiLink
                  href="https://www.idrlabs.com/jp/cognitive-function/test.php"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  心理機能テスト
                </MuiLink>
                <br />
                <MuiLink
                  href="http://rinnsyou.com/archives/category/0200sinriryouhou/0203yungu"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  心理機能について
                </MuiLink>
                <br />
                <MuiLink
                  href="https://www.amazon.co.jp/dp/4905050219"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  MBTIの書籍
                </MuiLink>
              </div>
            </label>

            <label className="block">
              <input
                type="radio"
                value="official_assessment"
                name="diagnosisMethod"
                onChange={handleDiagnosisMethodChange}
                className="mr-2"
              />
              <MuiLink href="https://www.mbti.or.jp/" target="_blank" rel="noopener noreferrer">
                公式
              </MuiLink>
              のセッションを通じて決定した
            </label>
          </fieldset>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={handleAgreementChange}
                className="mr-2"
              />
              <span className="text-sm font-medium">
                <Link to="/terms-of-service" className="text-[#2EA9DF]">
                  利用規約
                </Link>
                、
                <Link to="/privacy-policy" className="text-[#2EA9DF]">
                  プライバシーポリシー
                </Link>
                に同意する
              </span>
            </label>
          </div>
          <div className="flex justify-center gap-4">
            <button
              type="submit"
              className="w-full inline-flex justify-center items-center px-4 py-2 font-bold rounded focus:outline-none focus:ring-opacity-50 bg-[#2EA9DF] text-white"
            >
              アカウントを作成
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MBTIModal;
