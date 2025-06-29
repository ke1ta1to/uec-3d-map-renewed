"use client";

import { useState, useEffect } from "react";
import Card from "../common/Card";

interface DebugInfoProps {
  isVisible: boolean;
  debugData?: {
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
  };
}

export default function DebugInfo({ isVisible, debugData }: DebugInfoProps) {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let frameCount = 0;
    let lastTime = Date.now();

    const updateFps = () => {
      frameCount++;
      const now = Date.now();
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      if (isVisible) {
        requestAnimationFrame(updateFps);
      }
    };

    const animationId = requestAnimationFrame(updateFps);
    return () => cancelAnimationFrame(animationId);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <Card title="デバッグ情報" variant="darker" className="w-[240px]">
        <div className="space-y-3 text-sm font-mono">
          <div className="flex items-center justify-between">
            <span className="text-blue-200">FPS:</span>
            <span className="text-white font-bold">{fps}</span>
          </div>

          {debugData && (
            <>
              <div className="border-t border-gray-600 pt-3">
                <div className="text-blue-200 mb-2">位置</div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-gray-700/50 p-1 rounded text-center">
                    <div className="text-gray-400">X</div>
                    <div className="text-white">{debugData.position.x}</div>
                  </div>
                  <div className="bg-gray-700/50 p-1 rounded text-center">
                    <div className="text-gray-400">Y</div>
                    <div className="text-white">{debugData.position.y}</div>
                  </div>
                  <div className="bg-gray-700/50 p-1 rounded text-center">
                    <div className="text-gray-400">Z</div>
                    <div className="text-white">{debugData.position.z}</div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-600 pt-3">
                <div className="text-blue-200 mb-2">回転 (度)</div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-gray-700/50 p-1 rounded text-center">
                    <div className="text-gray-400">X</div>
                    <div className="text-white">{debugData.rotation.x}°</div>
                  </div>
                  <div className="bg-gray-700/50 p-1 rounded text-center">
                    <div className="text-gray-400">Y</div>
                    <div className="text-white">{debugData.rotation.y}°</div>
                  </div>
                  <div className="bg-gray-700/50 p-1 rounded text-center">
                    <div className="text-gray-400">Z</div>
                    <div className="text-white">{debugData.rotation.z}°</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
