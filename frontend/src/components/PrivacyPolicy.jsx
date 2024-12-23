import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">プライバシーポリシー</h1>
      <div className="prose prose-sm sm:prose lg:prose-lg mx-auto">
        <p className="mb-4">
          MBTIデータベース（以下、「当サービス」）は、ユーザーの個人情報保護を重要視しています。本プライバシーポリシーでは、当サービスが収集する情報とその使用方法について説明します。
        </p>

        <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-4">1. 収集する情報</h2>
        <p className="mb-4">当サービスは、以下の情報を収集する場合があります：</p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">
            ユーザーが提供する情報（ユーザー名、メールアドレス、MBTIタイプなど）
          </li>
          <li className="mb-2">利用状況データ（アクセスログ、投稿内容など）</li>
          <li className="mb-2">デバイス情報（IPアドレス、ブラウザの種類など）</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-4">2. 情報の使用目的</h2>
        <p className="mb-4">収集した情報は、以下の目的で使用されます：</p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">サービスの提供と改善</li>
          <li className="mb-2">ユーザー体験の向上</li>
          <li className="mb-2">統計データの作成</li>
          <li className="mb-2">セキュリティの確保</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-4">3. 情報の共有</h2>
        <p className="mb-4">
          当サービスは、法令に基づく場合や、ユーザーの同意がある場合を除き、収集した個人情報を第三者と共有しません。
        </p>

        <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-4">4. データの保護</h2>
        <p className="mb-4">
          当サービスは、収集した情報の安全性を確保するために適切な技術的・組織的措置を講じています。
        </p>

        <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-4">5. ユーザーの権利</h2>
        <p className="mb-4">
          ユーザーは、自身の個人情報へのアクセス、訂正、削除を要求する権利を有しています。
        </p>

        <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-4">6. クッキーの使用</h2>
        <p className="mb-4">
          当サービスは、ユーザー体験の向上のためにクッキーを使用する場合があります。
        </p>

        <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-4">
          7. プライバシーポリシーの変更
        </h2>
        <p className="mb-4">
          本プライバシーポリシーは、必要に応じて更新される場合があります。重要な変更がある場合は、ユーザーに通知します。
        </p>

        <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-4">8. お問い合わせ</h2>
        <p className="mb-4">
          プライバシーポリシーに関するご質問やお問い合わせは、問い合わせフォームからお願いいたします。
        </p>
        <p className="mt-8 text-sm text-gray-600">最終更新日: 2024年9月10日</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
