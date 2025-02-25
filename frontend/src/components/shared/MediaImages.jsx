import React from 'react';
import { Image } from 'cloudinary-react';

/**
 * メディア画像表示用共通コンポーネント
 * @param {Array} works - メディア作品のリスト [{image, title, media_type}]
 */
const MediaImages = ({ works }) => {
  if (!works || works.length === 0) return null;

  const containerClass = `image-container-${works.length}`;

  return (
    <div className={containerClass}>
      {works.map((work, index) => (
        <Image
          key={index}
          cloudName="dputyeqso"
          publicId={work.image}
          className={
            works.length === 1
              ? 'w-[250px] h-[250px] md:w-[500px] md:h-[500px]'
              : 'w-[122.5px] h-[122.5px] md:w-[247.5px] md:h-[247.5px]'
          }
        />
      ))}
    </div>
  );
};

export default MediaImages;
