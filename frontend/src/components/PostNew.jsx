import React, { useState, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';
import SearchModal from './SearchModal';
import { Image } from 'cloudinary-react';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { getApiUrl } from '../utils/apiUrl';

// -------------------------
// スタイリング（ToggleButton のカスタマイズ）
// -------------------------
const StyledToggleButton = styled(ToggleButton)(({ selected }) => ({
  backgroundColor: selected ? '#2EA9DF' : '#fff',
  borderColor: '#2EA9DF',
  color: selected ? '#fff' : '#2EA9DF',
  '&:hover': {
    backgroundColor: selected ? '#2387c1' : '#f0f0f0',
    borderColor: '#2387c1',
  },
  '&.Mui-selected': {
    backgroundColor: '#2EA9DF',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#2387c1',
    },
  },
  '&.MuiToggleButton-root': {
    border: '1px solid #2EA9DF',
  },
}));

// -------------------------
// API 呼び出し用ユーティリティ関数
// -------------------------

// ユーザーのポスト一覧を取得する関数
async function fetchUserPosts(userId) {
  try {
    const postsRes = await fetch(`${getApiUrl()}/users/${userId}/posts`);
    if (!postsRes.ok) {
      throw new Error('Failed to fetch user posts');
    }
    const postsData = await postsRes.json();
    return postsData;
  } catch (error) {
    console.error(`[fetchUserPosts] ユーザーポストの取得に失敗しました: ${error.message}`);
    return null;
  }
}

// ポストを作成する関数
async function createPost(clerkId, mediaType) {
  try {
    const postRes = await fetch(`${getApiUrl()}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clerk_id: clerkId,
        media_type: mediaType,
      }),
    });
    if (!postRes.ok) {
      throw new Error('Post creation failed');
    }
    const postData = await postRes.json();
    return postData;
  } catch (error) {
    console.error(`[createPost] ポスト作成に失敗しました: ${error.message}`);
    return null;
  }
}

// メディアワークを作成する関数
async function createMediaWorks(postId, selectedImages, mediaType) {
  try {
    for (const image of selectedImages) {
      const mediaRes = await fetch(`${getApiUrl()}/posts/${postId}/media_works`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postId,
          title: image.title,
          image: image.url,
          media_type: mediaType,
        }),
      });
      if (!mediaRes.ok) {
        throw new Error('Media work creation failed');
      }
      // 必要に応じて、レスポンスのパースも行えます
      // const mediaData = await mediaRes.json();
    }
  } catch (error) {
    console.error(`[createMediaWorks] メディアワーク作成に失敗しました: ${error.message}`);
    throw error;
  }
}

async function generateOgp(postId) {
  await fetch(`${getApiUrl()}/posts/${postId}/ogp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });
}

// -------------------------
// メインコンポーネント（PostNew）
// -------------------------
const PostNew = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  // ステートの定義
  const [isModalOpen, setModalOpen] = useState(false);
  const [artist, setArtist] = useState(null);
  const [anime, setAnime] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  // 重複投稿時のアラート表示状態
  const [duplicatePostAlert, setDuplicatePostAlert] = useState(false);
  const [searchFailed, setSearchFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contentType, setContentType] = useState('anime');

  // -------------------------
  // イベントハンドラ
  // -------------------------

  // 検索（Enterキー押下時）のハンドラ
  const handleSearch = useCallback(
    async (event) => {
      if (event.key === 'Enter') {
        const trimmedValue = event.target.value.trim();
        if (!trimmedValue) return;
        setSearchQuery(trimmedValue);

        try {
          const searchUrl =
            contentType === 'music'
              ? `${getApiUrl()}/spotify/search/${trimmedValue}`
              : `${getApiUrl()}/anilist/search/${trimmedValue}`;
          const searchRes = await fetch(searchUrl);
          if (!searchRes.ok) {
            throw new Error('Search request failed');
          }
          const searchData = await searchRes.json();

          if (contentType === 'music' && searchData.artist) {
            setArtist(searchData.artist);
            setSearchFailed(false);
            setModalOpen(true);
          } else if (
            contentType === 'anime' &&
            Array.isArray(searchData) &&
            searchData.length > 0
          ) {
            setAnime(searchData[0]);
            setSearchFailed(false);
            setModalOpen(true);
          } else {
            setSearchFailed(true);
          }
        } catch (error) {
          console.error(`[PostNew:handleSearch] 検索に失敗しました: ${error.message}`);
          setSearchFailed(true);
        }
      }
    },
    [contentType]
  );

  // 画像選択時のハンドラ
  const handleImageSelect = (imageUrl, title) => {
    setSelectedImages((prevImages) => {
      const alreadySelected = prevImages.some((img) => img.title === title);
      if (alreadySelected) return prevImages;
      // 最大4枚まで選択可能
      return [...prevImages, { url: imageUrl, title }].slice(0, 4);
    });
    setInputValue('');
    setModalOpen(false);
  };

  // ポスト作成および OGP 生成のハンドラ
  const handlePost = useCallback(
    async (mediaType) => {
      const postData = await createPost(user.id, mediaType);
      if (!postData) return false;

      try {
        await createMediaWorks(postData.id, selectedImages, mediaType);
        await generateOgp(postData.id);
      } catch (error) {
        // 各関数内でエラーログを出力しているのでここではそのまま false を返す
        return false;
      }
      return true;
    },
    [selectedImages, user.id]
  );

  // 同じメディアタイプのポストが既に存在するかをチェックするハンドラ
  const checkExistingPost = useCallback(
    async (mediaType) => {
      const postsData = await fetchUserPosts(user.id);
      if (!postsData) return false;
      // 既に同じ media_type のポストが存在する場合は true を返す
      return postsData.some((post) => post.media_type === mediaType);
    },
    [user.id]
  );

  // ポスト作成後、リダイレクトするためのハンドラ
  const handlePostAndRedirect = useCallback(async () => {
    if (selectedImages.length === 0) {
      console.error(`[PostNew:handlePostAndRedirect] 画像が選択されていません`);
      return;
    }
    setIsLoading(true);

    const mediaType = contentType === 'music' ? 5 : 0;
    const existingPost = await checkExistingPost(mediaType);
    if (existingPost) {
      setDuplicatePostAlert(true);
      setIsLoading(false);
      return;
    }

    const postResult = await handlePost(mediaType);
    setIsLoading(false);

    if (postResult) {
      // ポスト作成成功時にリダイレクト
      navigate('/posts', { state: { postSuccess: true } });
    } else {
      setDuplicatePostAlert(true);
    }
  }, [selectedImages, contentType, checkExistingPost, handlePost, navigate]);

  // コンテンツタイプ（アニメ／音楽）の切り替えハンドラ
  const handleContentTypeChange = (event, newContentType) => {
    if (!newContentType) return;
    setContentType(newContentType);
    setSelectedImages([]);
    setInputValue('');
  };

  // 選択中の画像またはプレースホルダーを描画する関数
  const renderImages = () => {
    const containerClass = `image-container-${selectedImages.length}`;

    if (selectedImages.length === 0) {
      return (
        <div
          className={`${containerClass} w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-black`}
        />
      );
    }

    return (
      <div className={containerClass}>
        {selectedImages.map((image, index) => (
          <Image
            key={index}
            cloudName="dputyeqso"
            publicId={image.url}
            className={
              selectedImages.length === 1
                ? 'w-[250px] h-[250px] md:w-[500px] md:h-[500px] object-cover'
                : 'w-[147.5px] h-[147.5px] md:w-[247.5px] md:h-[247.5px] object-cover'
            }
          />
        ))}
      </div>
    );
  };

  // -------------------------
  // コンポーネントのレンダリング
  // -------------------------
  return (
    <div className="flex flex-col items-center justify-center space-y-4 my-10">
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-custom"></div>
          </div>
        </div>
      ) : (
        <>
          {/* エラーアラート（該当するアーティスト/アニメが見つからない場合） */}
          {searchFailed && (
            <Snackbar
              open={searchFailed}
              autoHideDuration={2500}
              onClose={() => setSearchFailed(false)}
            >
              <Alert onClose={() => setSearchFailed(false)} severity="error" sx={{ width: '100%' }}>
                {contentType === 'music'
                  ? '正しいアーティスト名を入力してください。'
                  : '正しいアニメ名を入力してください。'}
              </Alert>
            </Snackbar>
          )}

          {/* アラート表示（同一メディアタイプのポストが既に存在する場合） */}
          {duplicatePostAlert && (
            <Snackbar
              open={duplicatePostAlert}
              autoHideDuration={2500}
              onClose={() => setDuplicatePostAlert(false)}
            >
              <Alert
                onClose={() => setDuplicatePostAlert(false)}
                severity="error"
                sx={{ width: '100%' }}
              >
                {contentType === 'music'
                  ? '音楽アーティストの投稿は1回のみです。'
                  : 'アニメの投稿は1回のみです。'}
              </Alert>
            </Snackbar>
          )}

          {/* コンテンツタイプ切替ボタン */}
          <ToggleButtonGroup
            value={contentType}
            exclusive
            onChange={handleContentTypeChange}
            aria-label="content type"
          >
            <StyledToggleButton value="anime" aria-label="anime">
              アニメ
            </StyledToggleButton>
            <StyledToggleButton value="music" aria-label="music">
              音楽
            </StyledToggleButton>
          </ToggleButtonGroup>

          {/* 検索入力欄 */}
          <div className="flex items-center space-x-2">
            <div className="relative w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 absolute left-3 top-1/2 transform -translate-y-1/2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <input
                type="text"
                placeholder={contentType === 'music' ? '好きな音楽アーティスト' : '好きなアニメ'}
                className="input bg-off-white input-bordered input-info pl-12 pr-4 py-2 w-full"
                onKeyDown={handleSearch}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
          </div>

          {/* ガイダンステキスト */}
          <div className="flex flex-col items-center space-y-1 text-center">
            <span className="px-12">
              1~4つの好きなアニメ・音楽アーティストのイメージを投稿してください。
            </span>
            <span className="px-12">※ アニメ、音楽アーティストの投稿はそれぞれ1回のみです。</span>
          </div>

          {/* 選択中の画像またはプレースホルダー */}
          <div className="bg-black">{renderImages()}</div>

          {/* 投稿ボタン */}
          <div className="flex justify-center">
            <button
              type="submit"
              onClick={handlePostAndRedirect}
              className="w-full inline-flex justify-center items-center px-4 py-2 font-bold rounded-full focus:outline-none focus:ring-opacity-50 bg-[#2EA9DF] text-white hover:bg-[#2589B4] transition-colors duration-300"
            >
              ポストする
            </button>
          </div>

          {/* 検索結果表示用モーダル */}
          <SearchModal
            isOpen={isModalOpen}
            searchQuery={searchQuery}
            contentType={contentType}
            artist={artist}
            anime={anime}
            onImageSelect={handleImageSelect}
            onClose={() => setModalOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default PostNew;
