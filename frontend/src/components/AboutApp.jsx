// frontend/src/components/AboutApp.jsx
import React from 'react';
import Link from '@mui/material/Link'; // MUIのLinkコンポーネントをインポート

function AboutApp() {
  return (
    <div>
      <p>
        MBTIタイプ診断をしたことのあるユーザーが、音楽やアニメなどのメディアごとに好きな作品やアーティストを投稿することにより、MBTIタイプごとの好みをデータベース化するWebアプリケーションです。
      </p>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h2>Step1</h2>
        <div>
          <p>ログインしてMBTIタイプとその診断方法を登録しよう！</p>
          <p>
            MBTIは最終的には自分でタイプを決める必要がある主観的な心理検査なので、ユーザーの誤診によりデータベースや統計が意味をなさないことが問題視されていますが、ユーザーの診断方法をデータベースに登録し、その診断方法をもとにデータベースの母集団をフィルタリングする機能を実装することで、少しでも誤診を考慮した上でデータベースを見やすくできるようにしました。
          </p>
        </div>
      </div>
      <ul>
        <li>
          診断方法とは？
          <ul>
            <li>
              診断サイトでの診断を参考にしたり、書籍やWebサイトなどでMBTIに関する情報を集めて、自らの判断で決定したものなのか？（非公式）
            </li>
            <li>
              参考URL
              <ul>
                <li>
                  <Link href="https://www.16personalities.com/ja/%E6%80%A7%E6%A0%BC%E8%A8%BA%E6%96%AD%E3%83%86%E3%82%B9%E3%83%88">
                    16personalities
                  </Link>
                </li>
                <li>
                  <Link href="https://www.idrlabs.com/jp/cognitive-function/test.php">
                    心理機能テスト
                  </Link>
                </li>
                <li>
                  <Link href="http://rinnsyou.com/archives/category/0200sinriryouhou/0203yungu">
                    心理機能について
                  </Link>
                </li>
                <li>
                  <Link href="https://www.amazon.co.jp/dp/4905050219">
                    MBTIの書籍
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link href="https://www.mbti.or.jp/">公式</Link>
              のセッションを通じて決定したものなのか？（公式）
            </li>
          </ul>
        </li>
      </ul>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h2>Step2</h2>
        <div>
          <p>
            好きな作品やアーティストのイメージ画像を投稿しよう！(現在音楽アーティストのみ)
          </p>
          <p>1~4枚のイメージ画像を投稿できます。</p>
        </div>
      </div>
      <p>
        <img
          src="https://res.cloudinary.com/dputyeqso/image/upload/f_auto/KD48HXJGNCLJGKODATI3"
          alt="イメージ画像投稿例"
        />
      </p>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h2>Step3</h2>
        <div>
          <p>投稿した作品やアーティストについてのコメントを書こう！</p>
          <p>
            なぜこの作品やアーティストが好きなのか、どのMBTIタイプの人におすすめなのかなど、自由に書いてみましょう。
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutApp;
