"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useRef, useEffect } from "react";
import { KeyboardControls } from "@react-three/drei";
import Model from "./Model";
import Player from "./Player";
import LoadingSpinner from "../UI/LoadingSpinner";
import Instructions from "../UI/Instructions";
import DebugInfo from "../UI/DebugInfo";
import { useMultiplayer } from "@/hooks/useMultiplayer";
import OtherPlayer from "../Multiplayer/OtherPlayer";

interface LoadingSpinnerRef {
  completeLoading: () => void;
}

export default function Scene() {
  const [walkSpeed, setWalkSpeed] = useState(11);
  const [jumpHeight, setJumpHeight] = useState(9);
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const [showDebug, setShowDebug] = useState(true);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(true);
  const [debugData, setDebugData] = useState<{
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
  } | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef<number>(0);
  const lastRequestTimeRef = useRef<number>(0);
  const loadingSpinnerRef = useRef<LoadingSpinnerRef>(null);

  // マルチプレイヤー機能
  const { players, isConnected, connect, updatePosition } = useMultiplayer();
  const hasConnectedRef = useRef(false);

  // 状態同期とクリーンアップ
  useEffect(() => {
    // 定期的にブラウザの実際の状態とReactのstateを同期
    const syncInterval = setInterval(() => {
      const actuallyLocked = document.pointerLockElement !== null;
      if (actuallyLocked !== isPointerLocked) {
        setIsPointerLocked(actuallyLocked);
        if (actuallyLocked) {
          setIsRequestPending(false); // ロックされたらペンディング状態を解除
        }
      }
    }, 100);

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      clearInterval(syncInterval);
    };
  }, [isPointerLocked, isRequestPending]);

  const requestPointerLock = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return Promise.reject(new Error("Canvas not found"));

    return canvas.requestPointerLock();
  };

  const handleStartPointerLock = () => {
    const actuallyLocked = document.pointerLockElement !== null;
    const now = Date.now();

    // 実際にロックされているのにstateが同期していない場合は修正
    if (actuallyLocked && !isPointerLocked) {
      setIsPointerLocked(true);
      setIsRequestPending(false);
      retryCountRef.current = 0;
      return;
    }

    // 既にロックされているか、リクエスト中の場合は何もしない
    if (actuallyLocked || isRequestPending) {
      return;
    }

    // 連続リクエストを防ぐため、最後のリクエストから最低200ms待つ
    if (now - lastRequestTimeRef.current < 200) {
      retryTimeoutRef.current = setTimeout(
        () => {
          handleStartPointerLock();
        },
        200 - (now - lastRequestTimeRef.current),
      );
      return;
    }

    // 既存の再試行タイマーをクリア
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    setIsRequestPending(true);
    lastRequestTimeRef.current = now;
    retryCountRef.current = 0;

    const attemptPointerLock = () => {
      requestPointerLock()
        .then(() => {
          const nowLocked = document.pointerLockElement !== null;
          setIsPointerLocked(nowLocked);
          setIsRequestPending(false);
          retryCountRef.current = 0;
        })
        .catch((error) => {
          // セキュリティエラーの場合のみ再試行（最大5回）
          if (error.name === "SecurityError" && retryCountRef.current < 5) {
            retryCountRef.current++;
            const waitTime = 200 + retryCountRef.current * 150; // 350ms, 500ms, 650ms, 800ms, 950ms

            retryTimeoutRef.current = setTimeout(() => {
              retryTimeoutRef.current = null;
              const stillLocked = document.pointerLockElement !== null;
              const stillPending = !stillLocked && !isPointerLocked;

              if (stillPending) {
                attemptPointerLock();
              } else {
                setIsPointerLocked(stillLocked);
                setIsRequestPending(false);
                retryCountRef.current = 0;
              }
            }, waitTime);
          } else {
            setIsRequestPending(false);
            retryCountRef.current = 0;
            if (error.name !== "SecurityError") {
              console.warn("PointerLock request failed:", error);
            }
          }
        });
    };

    attemptPointerLock();
  };

  // キーボード設定
  const keyMap = [
    { name: "forward", keys: ["KeyW"] },
    { name: "backward", keys: ["KeyS"] },
    { name: "leftward", keys: ["KeyA"] },
    { name: "rightward", keys: ["KeyD"] },
    { name: "jump", keys: ["Space"] },
  ];

  return (
    <div className="w-full h-screen">
      <KeyboardControls map={keyMap}>
        {showLoadingSpinner && (
          <LoadingSpinner
            ref={loadingSpinnerRef}
            onComplete={() => setShowLoadingSpinner(false)}
          />
        )}
        <Suspense fallback={null}>
          <Canvas
            camera={{
              fov: 75,
              near: 0.1,
              far: 1000,
            }}
            className="bg-gradient-to-b from-blue-50 to-gray-100"
            gl={{ antialias: true }}
            dpr={[1, 2]}
            onClick={handleStartPointerLock}
          >
            <Suspense fallback={null}>
              {/* ライティング */}
              <ambientLight intensity={2.0} />
              <directionalLight
                position={[50, 100, 50]}
                intensity={2.0}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
              />
              <directionalLight position={[-50, 100, -50]} intensity={1.5} />
              <directionalLight position={[0, 100, 100]} intensity={1.2} />
              <directionalLight position={[0, 100, -100]} intensity={1.2} />
              <hemisphereLight
                intensity={1.2}
                color="#ffffff"
                groundColor="#f0f0f0"
              />
              {/* 追加の点光源 */}
              <pointLight
                position={[0, 50, 0]}
                intensity={0.8}
                distance={200}
              />

              {/* GLBモデル */}
              <Model
                onLoad={() => {
                  // LoadingSpinnerの完了処理を呼び出し
                  loadingSpinnerRef.current?.completeLoading();
                  // 即座にモデル読み込み完了状態に（ローディングフェードアウトと並行してメインUI表示）
                  setIsModelLoaded(true);
                  // マルチプレイヤー接続（1回のみ）
                  if (!hasConnectedRef.current) {
                    hasConnectedRef.current = true;
                    connect();
                  }
                }}
              />

              {/* FPSプレイヤーコントロール */}
              <Player
                walkSpeed={walkSpeed}
                jumpHeight={jumpHeight}
                onLockChange={setIsPointerLocked}
                onDebugUpdate={setDebugData}
                onPositionUpdate={updatePosition}
              />

              {/* 他のプレイヤー */}
              {players.map((player) => (
                <OtherPlayer key={player.id} player={player} />
              ))}
            </Suspense>
          </Canvas>
        </Suspense>

        {/* デバッグ情報 */}
        {isModelLoaded && showDebug && (
          <DebugInfo 
            isVisible={showDebug} 
            debugData={debugData || undefined}
            multiplayerStatus={{
              isConnected,
              playerCount: players.length
            }}
          />
        )}

        {/* 操作説明とUI */}
        {isModelLoaded && (
          <Instructions
            walkSpeed={walkSpeed}
            jumpHeight={jumpHeight}
            onWalkSpeedChange={setWalkSpeed}
            onJumpHeightChange={setJumpHeight}
            showDebug={showDebug}
            onDebugToggle={setShowDebug}
          />
        )}

        {/* ポインターロック開始のオーバーレイ */}
        {isModelLoaded && !isPointerLocked && (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-40 cursor-pointer"
            onClick={handleStartPointerLock}
          >
            <div className="bg-black/80 border border-gray-600 p-8 rounded-lg text-center max-w-md mx-4 backdrop-blur-sm">
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2 text-white">
                  3D マップを探索
                </h2>
                {isRequestPending ? (
                  <p className="text-blue-200 mb-4">準備中...</p>
                ) : (
                  <p className="text-blue-200 mb-4">クリックして操作を開始</p>
                )}
              </div>

              <div className="space-y-3 text-sm">
                <div className="border border-gray-600 rounded-lg p-3 bg-gray-900/50">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="text-center">
                      <div className="font-mono bg-blue-600/20 text-blue-300 px-2 py-1 rounded mb-1">
                        WASD
                      </div>
                      <div className="text-gray-300">移動</div>
                    </div>
                    <div className="text-center">
                      <div className="font-mono bg-blue-600/20 text-blue-300 px-2 py-1 rounded mb-1">
                        Space
                      </div>
                      <div className="text-gray-300">ジャンプ</div>
                    </div>
                    <div className="text-center">
                      <div className="font-mono bg-blue-600/20 text-blue-300 px-2 py-1 rounded mb-1">
                        マウス
                      </div>
                      <div className="text-gray-300">視点</div>
                    </div>
                    <div className="text-center">
                      <div className="font-mono bg-blue-600/20 text-blue-300 px-2 py-1 rounded mb-1">
                        ESC
                      </div>
                      <div className="text-gray-300">一時停止</div>
                    </div>
                  </div>
                </div>

                {isRequestPending && (
                  <div className="flex items-center justify-center gap-2 text-blue-400">
                    <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
                    <span className="text-sm">少々お待ちください...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </KeyboardControls>
    </div>
  );
}
