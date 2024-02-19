// frontend/src/components/AboutApp.jsx
import React from 'react';
import Link from '@mui/material/Link'; // Linkコンポーネント
import { useUser, SignInButton } from '@clerk/clerk-react'; // useUserとSignInButtonを1行でインポート
import { useNavigate } from 'react-router-dom'; // 追加

function AboutApp() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate(); // 追加

  return (
    <div style={{ margin: '40px', fontSize: '1.1em' }}>
      <p>
        MBTIタイプ診断をしたことのあるユーザーが、音楽やアニメなどのメディアごとに好きな作品やアーティストを投稿することにより、MBTIタイプごとの好みをデータベース化するWebアプリケーションです。
      </p>

      <h2
        style={{
          fontWeight: 'bold',
          fontSize: 'larger',
          marginTop: '40px',
          marginBottom: '10px',
        }}
      >
        Step1 ログインしてMBTIタイプとその診断方法を登録しよう！
      </h2>
      <div
        style={{ display: 'flex', alignItems: 'flex-start', marginTop: '10px' }}
      >
        <div style={{ flex: 1 }}>
          <p>
            MBTIは最終的には自分でタイプを決める必要がある主観的な心理検査なので、ユーザーの誤診によりデータベースや統計が意味をなさないことが問題視されていますが、ユーザーの診断方法をデータベースに登録し、その診断方法をもとにデータベースの母集団をフィルタリングする機能を実装することで、少しでも誤診を考慮した上でデータベースを見やすくできるようにしました。
          </p>
          <ul>
            <li style={{ marginTop: '20px' }}>
              診断方法とは?
              <ul>
                <li>
                  ・診断サイトでの診断を参考にしたり、書籍やWebサイトなどでMBTIに関する情報を集めて、自らの判断で決定したものなのか?（非公式）
                </li>
                <li style={{ marginTop: '20px' }}>
                  参考URL
                  <ul>
                    <li>
                      <Link
                        href="https://www.16personalities.com/ja/%E6%80%A7%E6%A0%BC%E8%A8%BA%E6%96%AD%E3%83%86%E3%82%B9%E3%83%88"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        16personalities
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://www.idrlabs.com/jp/cognitive-function/test.php"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        心理機能テスト
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="http://rinnsyou.com/archives/category/0200sinriryouhou/0203yungu"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        心理機能について
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://www.amazon.co.jp/dp/4905050219"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        MBTIの書籍
                      </Link>
                    </li>
                  </ul>
                </li>
                <li style={{ marginTop: '20px' }}>
                  ・<Link
                    href="https://www.mbti.or.jp/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    公式
                  </Link>
                  のセッションを通じて決定したものなのか?（公式）
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div>
          <img
            src="https://i.gyazo.com/ce36080ef1129f38491cda509fa16dc6.png"
            alt="公式セッション画像"
            style={{ width: '550px', height: 'auto', marginLeft: '20px' }} // 画像の大きさと左マージンを指定
          />
        </div>
      </div>
      <h2
        style={{
          fontWeight: 'bold',
          fontSize: 'larger',
          marginTop: '40px',
          marginBottom: '10px',
        }}
      >
        Step2
        好きな作品やアーティストのイメージ画像を投稿しよう！(現在音楽アーティストのみ)
      </h2>
      <p style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src="https://i.gyazo.com/a6a96ad4aa2c5d4dad2675963f7d3886.png"
          alt="イメージ画像投稿例"
          style={{ width: '550px', height: 'auto', marginRight: '20px' }} // 画像の大きさを指定し、右マージンを追加
        />
        1~4枚のイメージ画像を投稿できます。
      </p>

      <h2
        style={{
          fontWeight: 'bold',
          fontSize: 'larger',
          marginTop: '40px',
          marginBottom: '10px',
        }}
      >
        Step3 気になるMBTIタイプの好きな作品やアーティストを見てみよう！
      </h2>
      <p
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row-reverse',
        }}
      >
        <img
          src="https://i.gyazo.com/ca4cafdaa7e67f40eccc3683c6b86826.png"
          alt="データベース詳細画面"
          style={{ width: '550px', height: 'auto', marginLeft: '20px' }} // 画像の大きさと左マージンを指定
        />
        データベース詳細画面ではユーザーがメディアごとに選んだ作品やアーティストをもとに作られたデータベースを閲覧できます。データベース詳細画面はMBTI16タイプを知覚機能（Ni/Ne/Si/Se）ごとに分けられていて、ボタンを選択・選択解除することで任意のタイプや診断方法のデータベースをフィルタリングすることができます。
      </p>
      {isSignedIn ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '20px 0',
          }}
        >
          <button
            onClick={() => navigate('/post')} // onClickイベントハンドラーを追加
            className="inline-flex justify-center items-center px-4 py-2 font-bold rounded-xl focus:outline-none focus:ring-opacity-50"
            style={{
              backgroundColor: '#2EA9DF',
              color: 'white',
              borderRadius: '50px',
            }}
          >
            ポストする
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '20px 0',
          }}
        >
          <SignInButton
            className="px-4 py-2 font-bold rounded-xl focus:outline-none focus:ring-opacity-50"
            style={{
              backgroundColor: '#2EA9DF',
              color: 'white',
              borderRadius: '50px',
            }}
          >
            ログインする
          </SignInButton>
        </div>
      )}
    </div>
  );
}

export default AboutApp;
