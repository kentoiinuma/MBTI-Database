// Sidebar.jsx
import React from 'react';

const Sidebar = () => {
  return (
    <aside className="bg-white text-black w-64 min-h-screen p-5 border-r border-[#7DB9DE]">
      <nav>
        <ul className="space-y-2">
          <li>ホーム</li>
          <li>Se ESFP/ESTP/ISFP/ISTP</li>
          <li>Si ESFJ/ESTJ/ISFJ/ISTJ</li>
          <li>Ne ENFP/ENTP/INFP/INTP</li>
          <li>Ni ENFJ/ENTJ/INFJ/INTJ</li>
          <li>利用規約</li>
          <li>プライバシーポリシー</li>
          <li>お問い合わせ</li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
