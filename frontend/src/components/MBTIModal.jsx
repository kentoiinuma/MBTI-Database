import React, { useState } from 'react';

const MBTI_TYPES = [
  'INFP', 'ENFP', 'INFJ', 'ENFJ',
  'INTJ', 'ENTJ', 'INTP', 'ENTP',
  'ISFP', 'ESFP', 'ISTP', 'ESTP',
  'ISFJ', 'ESFJ', 'ISTJ', 'ESTJ'
];

const MBTIModal = ({ onClose }) => {
  const [selectedMBTI, setSelectedMBTI] = useState('');

  const handleMBTIChange = (event) => {
    setSelectedMBTI(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(selectedMBTI);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>MBTIタイプを選択してください。</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="mbti-select">MBTIタイプ</label>
          <select id="mbti-select" value={selectedMBTI} onChange={handleMBTIChange}>
            <option value="">--選択してください--</option>
            {MBTI_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <button type="submit">選択</button>
        </form>
        <button onClick={onClose}>閉じる</button>
      </div>
    </div>
   );
  };
  
  export default MBTIModal;