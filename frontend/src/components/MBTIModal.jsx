import React, { useState } from 'react';

const MBTI_TYPES = [
  'ESFP', 'ESTP', 'ISFP', 'ISTP', // Se
  'ESFJ', 'ESTJ', 'ISFJ', 'ISTJ', // Si
  'ENFP', 'ENTP', 'INFP', 'INTP', // Ne
  'ENFJ', 'ENTJ', 'INFJ', 'INTJ'  // Ni
];

const MBTIModal = ({ onClose }) => {
  const [selectedMBTI, setSelectedMBTI] = useState('');
  const [diagnosisMethod, setDiagnosisMethod] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [mbtiError, setMbtiError] = useState(false);
  const [methodError, setMethodError] = useState(false);

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
      console.log(selectedMBTI, diagnosisMethod);
      onClose(); // モーダルを閉じます
    } else {
      setShowAlert(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}>
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg mx-auto" style={{ borderColor: '#2EA9DF' }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#2EA9DF' }}>MBTIタイプと診断方法を選択してください。</h2>
        {showAlert && (
          <div role="alert" className="alert">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>利用規約とプライバシーポリシーに同意してください。</span>
          </div>
        )}
        {mbtiError && (
          <div role="alert" className="alert">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>MBTIタイプを選択してください</span>
        </div>
        )}
        {methodError && (
          <div role="alert" className="alert">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>タイプ診断の方法を選択してください。</span>
        </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="mbti-select" className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#2EA9DF' }}>
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
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <fieldset className="mb-4">
            <legend className="text-sm font-medium text-gray-700 mb-1" style={{ color: '#2EA9DF' }}>タイプ診断の方法</legend>
            
            {/* 自己診断のオプション */}
            <label className="block mb-4"> {/* 下部の余白を追加 */}
              <input type="radio" value="selfAssessment" name="diagnosisMethod" onChange={handleDiagnosisMethodChange} className="mr-2" />
              診断サイトでの診断を参考にしたり、書籍やWebサイトなどでMBTIに関する情報を集めて、自らの判断で決定した
              <div className="ml-4 mt-2"> {/* インデントと上部の余白を追加 */}
                <a href="https://www.16personalities.com/ja/%E6%80%A7%E6%A0%BC%E8%A8%BA%E6%96%AD%E3%83%86%E3%82%B9%E3%83%88" target="_blank" rel="noopener noreferrer" style={{ color: '#2EA9DF' }}>16personalitiesの性格診断テスト</a>
                <br />
                <a href="https://www.idrlabs.com/jp/cognitive-function/test.php" target="_blank" rel="noopener noreferrer" style={{ color: '#2EA9DF' }}>心理機能テスト</a>
                <br />
                <a href="http://rinnsyou.com/archives/category/0200sinriryouhou/0203yungu" target="_blank" rel="noopener noreferrer" style={{ color: '#2EA9DF' }}>心理機能について</a>
                <br />
                <a href="https://www.amazon.co.jp/dp/4905050219" target="_blank" rel="noopener noreferrer" style={{ color: '#2EA9DF' }}>書籍</a>
              </div>
            </label>
            
            {/* 外部評価のオプション */}
            <label className="block">
              <input type="radio" value="externalAssessment" name="diagnosisMethod" onChange={handleDiagnosisMethodChange} className="mr-2" />
              <a href="https://www.mbti.or.jp/" target="_blank" rel="noopener noreferrer" style={{ color: '#2EA9DF' }}>公式</a>のセッションを通じて決定した
            </label>
          </fieldset>
          <div className="mb-4">
            <label className="flex items-center">
              <input type="checkbox" checked={agreedToTerms} onChange={handleAgreementChange} className="mr-2" />
              <span className="text-sm font-medium" style={{ color: '#2EA9DF' }}>利用規約、プライバシーポリシーに同意する</span>
            </label>
          </div>
          <div className="flex justify-center gap-4">
            <button type="submit" className="w-full inline-flex justify-center items-center px-4 py-2 font-bold rounded focus:outline-none focus:ring-opacity-50" style={{ backgroundColor: '#2EA9DF', color: 'white' }}>
              アカウントを作成
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MBTIModal;