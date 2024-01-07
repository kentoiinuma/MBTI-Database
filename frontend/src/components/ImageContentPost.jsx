import React from 'react';
import '../App.css';

const ImageContentPost = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative w-full max-w-xs">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 absolute left-3 top-1/2 transform -translate-y-1/2">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="好きなアーティスト名を正確に入力してください。"
            className="input input-bordered input-info pl-12 pr-4 py-2 w-full"
          />
        </div>
      </div>
      <div
        className="w-2/3 bg-black rounded" // Add 'rounded' to apply a default border radius
        style={{
            paddingTop: '34.9066666667%', // Adjusted paddingTop value for an aspect ratio of 1.91:1 with w-2/3 width
        }}
      />
        <div className="flex justify-center gap-4">
          <button type="submit" className="w-full inline-flex justify-center items-center px-4 py-2 font-bold rounded-xl focus:outline-none focus:ring-opacity-50" style={{ backgroundColor: '#2EA9DF', color: 'white', borderRadius: '50px' }}>
            ポストする
          </button>
        </div>
    </div>
  );
};

export default ImageContentPost;
