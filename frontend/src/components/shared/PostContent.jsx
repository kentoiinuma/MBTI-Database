import React from 'react';

/**
 * PostContent - ポスト本文を共通フォーマットで表示するコンポーネント
 *
 * @param {Object} props
 * @param {string} props.username - ユーザー名
 * @param {Object} props.mbti - MBTIデータ (nullable)
 * @param {string} props.mbti.mbti_type - MBTIタイプ
 * @param {string} props.mbti.visibility - 公開設定 ('is_public' or 'is_private')
 * @param {Array} props.mediaWorks - メディア作品配列
 * @param {string} props.className - 追加のCSSクラス名（オプション）
 */
const PostContent = ({ username, mbti, mediaWorks, className = '' }) => {
  // MBTIが公開設定の場合のみ表示
  const mbtiText = mbti?.visibility === 'is_public' && mbti?.mbti_type ? `(${mbti.mbti_type})` : '';

  // メディアタイプの判定（アニメまたは音楽アーティスト）
  const mediaType =
    mediaWorks && mediaWorks[0]?.media_type === 'anime' ? 'アニメ' : '音楽アーティスト';

  // 作品名のリスト生成
  const worksList = mediaWorks
    ? mediaWorks
        .map((work, idx, arr) => `${work.title}${idx < arr.length - 1 ? '、' : ''}`)
        .join('')
    : '';

  return (
    <div className={`text-base px-12 w-full text-center md:text-xl md:px-36 lg:px-40 ${className}`}>
      {username}
      {mbtiText}
      の好きな
      {mediaType}は{worksList}
      です！
    </div>
  );
};

export default PostContent;
