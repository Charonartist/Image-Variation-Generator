import React, { useState, useCallback } from 'react';
import ImageDropzone from './components/ImageDropzone';
import ImageGrid from './components/ImageGrid';
import Loader from './components/Loader';
import Header from './components/Header';
import { type GeneratedImage } from './types';
import { PROMPTS } from './constants';
import { generateImageVariation } from './services/geminiService';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<{ file: File; dataUrl: string } | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageDrop = useCallback((file: File) => {
    setIsLoading(false);
    setError(null);
    setGeneratedImages([]);

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setOriginalImage({ file, dataUrl });
    };
    reader.onerror = () => {
      setError('ファイルの読み込みに失敗しました。');
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const startGeneration = async (startIndex: number = 0) => {
    if (!originalImage) return;

    setIsLoading(true);
    setError(null);
    
    // Clear previously generated images if starting a new generation
    if (startIndex === 0) {
      setGeneratedImages([]);
    }

    const promptsToGenerate = PROMPTS.slice(startIndex);
    
    const BATCH_SIZE = 5;
    const promptChunks: string[][] = [];
    for (let i = 0; i < promptsToGenerate.length; i += BATCH_SIZE) {
      promptChunks.push(promptsToGenerate.slice(i, i + BATCH_SIZE));
    }

    try {
      let imageCounter = startIndex;
      for (let i = 0; i < promptChunks.length; i++) {
        const chunk = promptChunks[i];
        const generationPromises = chunk.map((prompt) =>
          generateImageVariation(originalImage.dataUrl, prompt).then(newImageDataUrl => ({
            id: `${Date.now()}-${imageCounter++}`,
            src: newImageDataUrl,
            prompt: prompt,
          }))
        );
        
        const results = await Promise.all(generationPromises);
        setGeneratedImages(prevImages => [...prevImages, ...results]);

        // 最後のチャンクでなければ1秒待機
        if (i < promptChunks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    } catch (err) {
      console.error(err);
      setError('画像の生成中にエラーが発生しました。生成できた画像のみ表示しています。');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setOriginalImage(null);
    setGeneratedImages([]);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="w-full max-w-7xl mx-auto flex-grow">
        {/* 1. Dropzone - No image uploaded yet */}
        {!originalImage && (
          <ImageDropzone onImageDrop={handleImageDrop} />
        )}

        {/* 2. Preview & Options - Image uploaded, waiting for user to start */}
        {originalImage && !isLoading && generatedImages.length === 0 && !error && (
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-200">プレビュー</h2>
            <div className="flex justify-center mb-6">
                <img src={originalImage.dataUrl} alt="Upload preview" className="max-h-72 w-auto rounded-lg shadow-lg border-2 border-gray-700" />
            </div>
            <p className="text-lg text-gray-400 mb-6">どこから画像を生成しますか？</p>
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 mb-6">
                <button onClick={() => startGeneration(0)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-lg text-base">全て生成 (1-20)</button>
                <button onClick={() => startGeneration(5)} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-5 rounded-lg transition-colors duration-300 text-sm">6枚目から</button>
                <button onClick={() => startGeneration(10)} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-5 rounded-lg transition-colors duration-300 text-sm">11枚目から</button>
                <button onClick={() => startGeneration(15)} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-5 rounded-lg transition-colors duration-300 text-sm">16枚目から</button>
            </div>
            <button onClick={handleReset} className="text-gray-400 hover:text-white transition-colors duration-300">
              別の画像をアップロード
            </button>
          </div>
        )}

        {/* 3. Initial Loading */}
        {isLoading && generatedImages.length === 0 && <Loader />}

        {/* 4. Results View */}
        {generatedImages.length > 0 && (
          <div className="w-full text-center">
            <button
                onClick={handleReset}
                className="mb-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 shadow-lg"
            >
                別の画像を試す
            </button>
            <ImageGrid images={generatedImages} />
          </div>
        )}

        {/* 5. Error Display */}
        {error && (
          <div className="text-center my-10 bg-red-900/50 border border-red-700 p-6 rounded-lg max-w-3xl mx-auto">
            <p className="text-red-400 font-semibold text-lg">{error}</p>
            <button
                onClick={handleReset}
                className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
            >
                リセット
            </button>
          </div>
        )}

        {/* 6. Subsequent Loading */}
        {isLoading && generatedImages.length > 0 && (
            <div className="mt-8">
                <Loader />
            </div>
        )}
      </main>
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;
