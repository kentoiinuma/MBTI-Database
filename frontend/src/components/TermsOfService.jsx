import React from 'react';

const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">利用規約</h1>
      <div className="prose prose-sm sm:prose lg:prose-lg mx-auto">
        <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-4">第1条（適用）</h2>
        <p className="mb-4">
          本規約は、MBTIデータベース（以下、「本サービス」といいます。）の利用に関する一切の関係に適用されます。
        </p>
        <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-4">第2条（定義）</h2>
        <p className="mb-4">本規約において使用する用語の定義は、次のとおりとします。</p>
        <ol className="list-decimal pl-6 mb-4">
          <li className="mb-2">「利用者」とは、本サービスを利用する者をいいます。</li>
          <li className="mb-2">
            「コンテンツ」とは、本サービス上に掲載されるテキスト、画像、動画、音声等の情報をいいます。
          </li>
        </ol>
        <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-4">第3条（利用登録）</h2>
        <p className="mb-4">
          利用者は、本サービスを利用するにあたり、本規約に同意の上、所定の事項を登録するものとします。
        </p>
        <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-4">第4条（利用者の義務）</h2>
        <p className="mb-4">利用者は、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
        <ol className="list-decimal pl-6 mb-4">
          <li className="mb-2">法令または公序良俗に違反する行為</li>
          <li className="mb-2">犯罪行為に関連する行為</li>
          <li className="mb-2">本サービスの運営を妨げる行為</li>
          <li className="mb-2">他の利用者または第三者の権利を侵害する行為</li>
          <li className="mb-2">虚偽の情報を登録する行為</li>
          <li className="mb-2">本サービスを通じて入手した情報を不正に利用する行為</li>
          <li className="mb-2">その他、本サービス運営会社が不適切と判断する行為</li>
        </ol>
        <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-4">第5条（コンテンツの権利）</h2>
        <p className="mb-4">コンテンツの著作権は、当該コンテンツの投稿者に帰属します。</p>
        <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-4">第6条（免責事項）</h2>
        <p className="mb-4">
          本サービス運営会社は、本サービスの利用によって生じた一切の損害について、責任を負いません。
        </p>
        <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-4">第7条（規約の変更）</h2>
        <p className="mb-4">
          本サービス運営会社は、本規約を予告なく変更することができるものとします。
        </p>
        <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-4">
          第8条（準拠法および裁判管轄）
        </h2>
        <p className="mb-4">本規約の解釈および適用は、日本法に準拠するものとします。</p>
        <p className="mb-4">
          本サービスに関する一切の紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
        </p>
        <p className="mt-8 text-sm text-gray-600">最終更新日: 2024年9月10日</p>
      </div>
    </div>
  );
};

export default TermsOfService;
