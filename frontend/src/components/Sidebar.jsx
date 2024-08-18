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
    </aside>
  );
};

export default Sidebar;
