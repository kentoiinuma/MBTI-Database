// frontend/src/components/AboutApp.jsx
import React from 'react';
import Link from '@mui/material/Link'; // Linkコンポーネント
import { useUser, SignInButton } from '@clerk/clerk-react'; // useUserとSignInButtonを1行でインポート
import { useNavigate } from 'react-router-dom'; // 追加
import Paper from '@mui/material/Paper'; // Paperコンポーネントをインポート

function AboutApp() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate(); // 追加

  return (
    <div style={{ margin: '40px', fontSize: '1.1em' }}>
      <p>
        MBTIタイプ診断をしたことのあるユーザーが、音楽やアニメなどのメディアごとに好きな作品やアーティストを投稿することにより、MBTIタイプごとの好みをデータベース化するWebアプリケーションです🙌
      </p>

      <h2
        style={{
          fontWeight: 'bold',
          fontSize: 'larger',
          marginTop: '40px',
          marginBottom: '10px',
        }}
      >
        なぜMBTIタイプごとの好みをデータベース化するのか？
      </h2>
      <p>
        インターネット上ではMBTIタイプごとの具体的な好みについて語る人が多く見られたのですが、あくまでその人たちの直観や肌感覚に依存するため、説得力が発信者の信用に基づいてしまうことに課題を感じました。
        そこで、実際にデータを取って確かめたいという思いから、このサービスを作成しました。
      </p>

      <h2
        style={{
          fontWeight: 'bold',
          fontSize: 'larger',
          marginTop: '40px',
          marginBottom: '10px',
        }}
      >
        なぜ作品なのか？
      </h2>
      <p>
        MBTIは個人の指向によってタイプを分類する類型論なので、何かをデータベースに投稿・Xに共有するとしたら多種多様な表現方法を持つ作品が個人の指向を最も反映でき、タイプごとに好きな作品の傾向が表れるのではないかと考えたからです！
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
            MBTIは最終的には自分でタイプを決める必要がある主観的な心理検査なので、ユーザーの誤診によりデータベースや統計が意味をなさないことが問題視されていますが、ユーザーの診断方法をデータベースに登録し、その診断方法をもとにデータベースの母集団をフィルタリングする機能を実装することで、少しでも誤診を考慮した上でデータベースを見やすくできるようにしました！
          </p>
          <ul>
            <li style={{ marginTop: '20px' }}>
              診断方法とは?
              <ul>
                <li>
                  ①診断サイトでの診断を参考にしたり、書籍やWebサイトなどで
                  <br />
                  MBTIに関する情報を集めて、自らの判断で決定したものなのか?
                  <br />
                  （非公式）
                </li>
                <li>
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
                  ②
                  <Link
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
          <Paper
            elevation={8}
            style={{ width: '550px', height: 'auto', marginLeft: '20px' }}
          >
            <video
              src="https://i.gyazo.com/dba4e9981c3d8da5d0d1c2782ede6463.mp4"
              alt="公式セッション画像"
              style={{ width: '100%', height: 'auto' }}
              controls
            >
              お使いのブラウザはvideoタグをサポートしていません。
            </video>
          </Paper>
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
        <Paper
          elevation={8}
          style={{ width: '550px', height: 'auto', marginRight: '20px' }}
        >
          <video
            src="https://i.gyazo.com/99db8bc5f73a4ccf2e81d85317632a1f.mp4"
            alt="イメージ画像投稿例"
            style={{ width: '100%', height: 'auto' }} // 画像の大きさを指定し、右マージンを追加
            controls
          >
            お使いのブラウザはvideoタグをサポートしていません。
          </video>
        </Paper>
        1~4枚のイメージ画像を投稿できます！
      </p>

      <h2
        style={{
          fontWeight: 'bold',
          fontSize: 'larger',
          marginTop: '40px',
          marginBottom: '10px',
        }}
      >
        Step3 Xに共有してみよう！
      </h2>
      <p
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row-reverse',
        }}
      >
        <Paper
          elevation={8}
          style={{ width: '550px', height: 'auto', marginLeft: '20px' }}
        >
          <img
            src="https://i.gyazo.com/71ea70c914f372f656fcaa4e139292a0.jpg"
            alt="イメージ画像投稿例"
            style={{ width: '100%', height: 'auto' }}
          />
        </Paper>
        自分の好きな作品やアーティストをXに共有できます！
      </p>
      <h2
        style={{
          fontWeight: 'bold',
          fontSize: 'larger',
          marginTop: '40px',
          marginBottom: '10px',
        }}
      >
        Step4 気になるMBTIタイプの好きな作品やアーティストを見てみよう！
      </h2>
      <p
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}
      >
        <Paper
          elevation={8}
          style={{ minWidth: '550px', height: 'auto', marginRight: '20px' }}
        >
          <video
            src="https://i.gyazo.com/cc5004bd2682567293c4bad9b534e682.mp4"
            alt="データベース詳細画面"
            style={{ width: '100%', height: 'auto' }}
            controls
          >
            お使いのブラウザはvideoタグをサポートしていません。
          </video>
        </Paper>
        <ul>
          <li>
            サイドバー（Se
            ESFP/ESTP/ISFP/ISTPなど）ではユーザーがメディアごとに投稿した作品やアーティスト名の情報をもとに作成されたデータベースを見ることができます！
            <br />
            サイドバーのデータベースは知覚機能（Ni/Ne/Si/Se）ごとに分けられていて、ボタンを選択・選択解除することで任意のタイプや診断方法のデータベースをフィルタリングすることができます。
          </li>
          <li style={{ marginTop: '20px' }}>
            知覚機能でグループを分ける理由
            <ul>
              <li>
                ①少ないユーザー数でもデータベースの傾向を見て取れるようにするための工夫の1つとして、MBTI16タイプをグルーピングしようと思ったから。
              </li>
              <li style={{ marginTop: '20px' }}>
                ②MBTIに触れていく中で知覚機能の違いがタイプ間で最も価値観の違いを生む要因だと感じ、逆に言えば知覚機能が共通していれば、価値観の近いタイプとしてグルーピングできると思ったから。
              </li>
            </ul>
          </li>
        </ul>
      </p>
      {isSignedIn ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '50px 0',
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
            margin: '50px 0',
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
