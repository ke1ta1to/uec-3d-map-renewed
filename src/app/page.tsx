import Scene from '@/components/Scene/Scene'

export default function Home() {
  return (
    <>
      {/* SEO用の非表示コンテンツ */}
      <div className="sr-only">
        <h1>UEC 3D キャンパスマップ - 電気通信大学バーチャルキャンパス</h1>
        <p>
          電気通信大学の3Dキャンパスマップです。WebGLとReact Three Fiberを使用した
          インタラクティブな3Dマップで、キャンパス内の建物や施設を立体的に探索できます。
        </p>
        <ul>
          <li>WASD キーで移動</li>
          <li>スペースキーでジャンプ</li>
          <li>マウスで視点操作</li>
          <li>ESCキーで一時停止</li>
        </ul>
        <p>
          東京都調布市にある電気通信大学のキャンパスを、最新のWeb技術を使って
          バーチャルに体験できます。受験生や在学生、関係者の方々にとって
          便利なキャンパス案内ツールです。
        </p>
      </div>
      
      <main className="w-full h-screen" role="application" aria-label="3Dキャンパスマップ">
        <Scene />
      </main>
    </>
  );
}
