import React from 'react';
import { NavLink } from 'react-router-dom';
import '../App.css'; // Import the CSS file

const Sidebar = () => {
  return (
    <aside className="z-20 fixed bg-white text-black w-69 min-h-screen py-5 pl-5 flex flex-col border-r border-[#7DB9DE]">
      <h1 className="text-xl font-bold mb-8">
        <NavLink to="/" activeClassName="active" style={{ color: '#2EA9DF', fontSize: '1.3em' }}>
        16type Favorite<br />Database
        </NavLink>
      </h1>      
      <nav className="flex-grow">
        <ul className="space-y-4">
          <li>
            <NavLink to="/" activeClassName="active" className="sidebar-link">
              ホーム
            </NavLink>
          </li>
          <li>
            <NavLink to="/Se" activeClassName="active" className="sidebar-link">
              Se ESFP/ESTP/ISFP/ISTP
            </NavLink>
          </li>
          <li>
            <NavLink to="/Si" activeClassName="active" className="sidebar-link">
              Si ESFJ/ESTJ/ISFJ/ISTJ
            </NavLink>
          </li>
          <li>
            <NavLink to="/Ne" activeClassName="active" className="sidebar-link">
              Ne ENFP/ENTP/INFP/INTP
            </NavLink>
          </li>
          <li>
            <NavLink to="/Ni" activeClassName="active" className="sidebar-link">
              Ni ENFJ/ENTJ/INFJ/INTJ
            </NavLink>
          </li>
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