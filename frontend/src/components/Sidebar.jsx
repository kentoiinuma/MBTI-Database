import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="z-20 fixed bg-white text-black w-64 min-h-screen p-5 flex flex-col border-r border-[#7DB9DE]">
      <h1 className="text-xl font-bold mb-4">
        <Link to="/">
          16type Favorite Database
        </Link>
      </h1>
      <nav className="flex-grow">
        <ul className="space-y-2">
          <li>
            <Link to="/">
              ホーム
            </Link>
          </li>
          <li>Se ESFP/ESTP/ISFP/ISTP</li>
          <li>Si ESFJ/ESTJ/ISFJ/ISTJ</li>
          <li>Ne ENFP/ENTP/INFP/INTP</li>
          <li>Ni ENFJ/ENTJ/INFJ/INTJ</li>
        </ul>
      </nav>
      <nav className="mt-auto">
        <ul className="space-y-2">
          <li>利用規約</li>
          <li>プライバシーポリシー</li>
          <li>お問い合わせ</li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;