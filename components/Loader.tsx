
import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "AIが創造力を発揮しています...",
  "ピクセルを一つずつ描いています...",
  "素晴らしいアイデアを練っています...",
  "もうすぐ傑作が完成します...",
  "バリエーションを作成中...",
];

const Loader: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
        }, 2500);

        return () => clearInterval(intervalId);
    }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full my-20">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
      <h2 className="mt-6 text-xl font-semibold text-gray-300">画像を生成中です</h2>
      <p className="mt-2 text-gray-400 transition-opacity duration-500">
        {loadingMessages[messageIndex]}
      </p>
    </div>
  );
};

export default Loader;
