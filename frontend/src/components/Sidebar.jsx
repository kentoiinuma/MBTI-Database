import React from 'react';
import { NavLink } from 'react-router-dom';
import '../App.css';

const Sidebar = () => {
  return (
    <aside className="z-20 fixed bg-white text-black w-69 min-h-screen py-5 pl-5 flex flex-col border-r border-[#2EA9DF]">
      <h1 className="text-xl font-bold mb-8 flex items-center">
        <img
          src={process.env.PUBLIC_URL + '/favicon.ico'}
          alt="favicon"
          className="w-8 h-8"
        />
        <NavLink
          to="/"
          style={{
            fontWeight: '600',
            fontStyle: 'italic',
          }}
        >
          <span style={{ color: '#7B90D2', fontSize: '1.4em' }}>M</span>
          <span style={{ color: '#86C166', fontSize: '1.4em' }}>B</span>
          <span style={{ color: '#A5DEE4', fontSize: '1.4em' }}>T</span>
          <span style={{ color: '#FBE251', fontSize: '1.4em' }}>I</span>
          <span style={{ color: '#2EA9DF', fontSize: '1.2em' }}>
            データベース
          </span>
        </NavLink>
      </h1>
      <nav className="flex-grow">
        <ul className="space-y-4">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'sidebar-link active' : 'sidebar-link'
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 inline-block mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
              ホーム
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/Se"
              className={({ isActive }) =>
                isActive ? 'sidebar-link active' : 'sidebar-link'
              }
            >
              Se ESFP/ESTP/ISFP/ISTP
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/Si"
              className={({ isActive }) =>
                isActive ? 'sidebar-link active' : 'sidebar-link'
              }
            >
              Si ESFJ/ESTJ/ISFJ/ISTJ
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/Ne"
              className={({ isActive }) =>
                isActive ? 'sidebar-link active' : 'sidebar-link'
              }
            >
              Ne ENFP/ENTP/INFP/INTP
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/Ni"
              className={({ isActive }) =>
                isActive ? 'sidebar-link active' : 'sidebar-link'
              }
            >
              Ni ENFJ/ENTJ/INFJ/INTJ
            </NavLink>
          </li>
        </ul>
      </nav>
      <nav className="mt-auto">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/terms-of-service"
              className="sidebar-link"
              style={{ fontSize: '1em' }}
            >
              利用規約
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/privacy-policy"
              className="sidebar-link"
              style={{ fontSize: '1em' }}
            >
              プライバシーポリシー
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
