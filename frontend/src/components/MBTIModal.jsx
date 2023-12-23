import React, { useState } from 'react';

const MBTI_TYPES = [
  'INFP', 'ENFP', 'INFJ', 'ENFJ',
  'INTJ', 'ENTJ', 'INTP', 'ENTP',
  'ISFP', 'ESFP', 'ISTP', 'ESTP',
  'ISFJ', 'ESFJ', 'ISTJ', 'ESTJ'
];

const MBTIModal = ({ onClose }) => {
  const [selectedMBTI, setSelectedMBTI] = useState('');
  const [diagnosisMethod, setDiagnosisMethod] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleMBTIChange = (event) => {
    setSelectedMBTI(event.target.value);
  };

  const handleDiagnosisMethodChange = (event) => {
    setDiagnosisMethod(event.target.value);
  };

  const handleAgreementChange = (event) => {
    setAgreedToTerms(event.target.checked);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (agreedToTerms) {
      // ここで診断結果を処理します
      console.log(selectedMBTI, diagnosisMethod);
      onClose(); // モーダルを閉じます
    } else {
      alert('利用規約とプライバシーポリシーに同意してください。');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">MBTIタイプと診断方法を選択してください。</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="mbti-select" className="block text-sm font-medium text-gray-700 mb-1">
              MBTIタイプ
            </label>
            <select
              id="mbti-select"
              value={selectedMBTI}
              onChange={handleMBTIChange}
              className="block w-full border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
            >
              <option value="">--選択してください--</option>
              {MBTI_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <fieldset className="mb-4">
            <legend className="text-sm font-medium text-gray-700 mb-1">タイプ診断の方法</legend>
            <label className="block">
              <input type="radio" value="selfAssessment" name="diagnosisMethod" onChange={handleDiagnosisMethodChange} className="mr-2" />
              診断サイトやMBTIに関する情報を集めて、自らの判断で決定した(非公式)
            </label>
            <label className="block">
              <input type="radio" value="externalAssessment" name="diagnosisMethod" onChange={handleDiagnosisMethodChange} className="mr-2" />
              公式のセッションを通じて決定した(公式)
            </label>
          </fieldset>
          <div className="mb-4">
            <label className="flex items-center">
              <input type="checkbox" checked={agreedToTerms} onChange={handleAgreementChange} className="mr-2" />
              <span className="text-sm font-medium text-gray-700">利用規約、プライバシーポリシーに同意する</span>
            </label>
          </div>
          <div className="flex justify-between gap-4">
            <button type="submit" className="flex-1 inline-flex justify-center items-center px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">
              アカウントを作成
            </button>
            <button onClick={onClose} className="flex-1 inline-flex justify-center items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50">
              閉じる
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
  
export default MBTIModal;

