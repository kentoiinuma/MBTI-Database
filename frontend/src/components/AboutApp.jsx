import React from 'react';
import { useNavigate } from 'react-router-dom';

function AboutApp() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          <span className="text-[#7B90D2] text-[1.3em]">M</span>
          <span className="text-[#86C166] text-[1.3em]">B</span>
          <span className="text-[#A5DEE4] text-[1.3em]">T</span>
          <span className="text-[#FBE251] text-[1.3em]">I</span>
          <span className="text-[#2EA9DF] text-[0.9em]">
            <span className="text-[1.1em]">タイプ</span>
            <span className="text-gray-800">に紐づけて</span>
            <br className="md:hidden" />
            <span className="text-[1.1em]">好き</span>
            <span className="text-gray-800">を共有するアプリ</span>
          </span>
        </h1>

        <div className="mb-12 text-center">
          <p className="text-lg">
            MBTIデータベースは、MBTIタイプに紐付けて好きな作品を共有するwebアプリです！
            <br />
            <span className="mt-1 inline-block">
              投稿された作品はグラフとしてデータベース化され、フィルタリングすることで気になるタイプの好きな作品を見ることができます。
            </span>
          </p>
        </div>

        <div className="space-y-12">
          <StepCard
            title="MBTIタイプの登録"
            description="サインアップ後、モーダルが出てくるので、MBTIタイプを登録してください。"
            imageSrc="/mbti-registration.webp"
          >
            <div className="mt-8">
              <p>
                <a
                  href="https://mentuzzle.com/shindan/report/16type"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2EA9DF] hover:underline"
                >
                  おすすめの16タイプ診断サービス
                </a>
              </p>
              <p className="mt-2">
                心理機能について
                <br />
                {[
                  { text: 'Se', url: 'http://rinnsyou.com/archives/339' },
                  { text: 'Si', url: 'http://rinnsyou.com/archives/341' },
                  { text: 'Ne', url: 'http://rinnsyou.com/archives/345' },
                  { text: 'Ni', url: 'http://rinnsyou.com/archives/347' },
                  { text: 'Te', url: 'http://rinnsyou.com/archives/327' },
                  { text: 'Ti', url: 'http://rinnsyou.com/archives/329' },
                  { text: 'Fe', url: 'http://rinnsyou.com/archives/333' },
                  { text: 'Fi', url: 'http://rinnsyou.com/archives/335' },
                ].map((item, index) => (
                  <React.Fragment key={item.text}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2EA9DF] hover:underline"
                    >
                      {item.text}
                    </a>
                    {index < 7 && ' '}
                  </React.Fragment>
                ))}
              </p>
              <p className="mt-2">
                ※より正確な診断結果を得るには
                <a
                  href="https://jppjapan.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2EA9DF] hover:underline"
                >
                  MBTI公式セッション
                </a>
                を受講する必要があります。
              </p>
            </div>
          </StepCard>

          <StepCard
            title="好きな作品の投稿とX共有"
            description={
              <>
                <p>1~4つの好きなアニメや音楽アーティストのイメージを投稿してみましょう！</p>
                <p>※現在、アニメと音楽アーティストの投稿ができます。</p>
                <p className="mt-2">
                  また、XにMBTIタイプと共に好きな作品を共有することにより、簡易的な自己紹介ができます。
                </p>
              </>
            }
            imageSrc="/post-and-share.webp"
          ></StepCard>

          <StepCard
            title="データベースの閲覧"
            description={
              <>
                <p>
                  グラフで表されたデータベースをフィルタリングして、気になるMBTIタイプの好きな作品を見てみましょう！
                </p>
              </>
            }
            imageSrc="/database-filtering.webp"
          />
        </div>

        <div className="flex justify-center my-12">
          <button
            onClick={() => navigate('/home')}
            className="px-4 py-2 font-bold rounded-full focus:outline-none focus:ring-opacity-50 bg-[#2EA9DF] text-white hover:bg-[#2589B4] transition-colors duration-300"
          >
            ホームへ
          </button>
        </div>
      </div>
    </div>
  );
}

function StepCard({ step, title, description, imageSrc, children }) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6 md:flex md:items-center md:space-x-6">
        <div className="md:w-2/3 mb-6 md:mb-0 lg:mx-16">
          <div className="mb-4">
            <h4 className="text-xl font-semibold">{title}</h4>
          </div>
          <p className="mb-4">{description}</p>
          {children}
        </div>
        <div className="md:w-1/3">
          <div className="relative h-auto w-full max-w-[300px] mx-auto md:mx-0">
            <img
              src={imageSrc}
              alt={`Step ${step} screenshot`}
              className="rounded-lg shadow-md object-contain w-full "
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutApp;
