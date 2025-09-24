
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-8 sm:mb-12">
      <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
        画像バリエーションジェネレーター
      </h1>
      <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
        1枚の画像からAIが20種類の差分画像を生成します。下のエリアに画像をドラッグ＆ドロップしてください。
      </p>
    </header>
  );
};

export default Header;
