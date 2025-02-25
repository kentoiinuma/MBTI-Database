import React from 'react';
import XIcon from '@mui/icons-material/X';
import { styled } from '@mui/material/styles';
import { getApiUrl } from '../../utils/apiUrl';

const StyledXIcon = styled(XIcon)({
  fontSize: 40,
});

/**
 * シェアボタンコンポーネント
 * - X（旧Twitter）へのシェア機能を提供
 * - ポスト情報を元にシェアテキストを自動生成
 */
const ShareButton = ({ post, mbti, username }) => {
  const handleShare = (e) => {
    e.stopPropagation();

    const ogPageUrl = `${getApiUrl()}/posts/${post.id}/ogp_page`;
    const isPublic = mbti?.visibility === 'is_public';
    const mbtiText = isPublic && mbti?.mbti_type ? `(${mbti.mbti_type})` : '';

    const mediaWorks = post.mediaWorks || [];
    const mediaType = mediaWorks[0]?.media_type === 'anime' ? 'アニメ' : '音楽アーティスト';

    const text =
      `${username}${mbtiText}の好きな${mediaType}は` +
      mediaWorks.map((work, i, arr) => `${work.title}${i < arr.length - 1 ? '、' : ''}`).join('') +
      'です！';

    const hashtag = '#MBTIデータベース';
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text + '\n\n' + hashtag + '\n'
    )}&url=${encodeURIComponent(ogPageUrl)}`;

    window.open(shareUrl, '_blank');
  };

  return (
    <div
      className="absolute bottom-0 right-0 rounded-full hover:bg-gray-200 cursor-pointer md:left-[700px] lg:left-[1270px] w-12 h-12 flex items-center justify-center"
      onClick={handleShare}
    >
      <StyledXIcon />
    </div>
  );
};

export default ShareButton;
