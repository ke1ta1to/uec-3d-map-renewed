"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { Vector3, Raycaster, Euler } from "three";

interface PlayerProps {
  walkSpeed?: number;
  jumpHeight?: number;
  onLockChange?: (locked: boolean) => void;
  onDebugUpdate?: (data: {
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
  }) => void;
  onPositionUpdate?: (position: { x: number, y: number, z: number }, rotation: { y: number }) => void;
}

export default function Player({
  walkSpeed = 11,
  jumpHeight = 9,
  onLockChange,
  onDebugUpdate,
  onPositionUpdate,
}: PlayerProps) {
  const { camera, scene } = useThree();

  // KeyboardControlsのhookを使用
  const [, get] = useKeyboardControls();

  // プレイヤーの状態
  const [isLocked, setIsLocked] = useState(false);
  const velocity = useRef(new Vector3());
  const direction = useRef(new Vector3());
  const isOnGround = useRef(true);
  const lastUpdateTimeRef = useRef<number>(0);

  // レイキャスター（地面判定用）
  const raycaster = useRef(new Raycaster());

  // マウス操作用の変数
  const euler = useRef(new Euler(0, 0, 0, "YXZ"));

  // カメラ初期位置設定
  useEffect(() => {
    // 指定された位置と回転に設定
    camera.position.set(100, 2, -100);

    // 回転を度数からラジアンに変換して設定
    camera.rotation.set(
      (-20 * Math.PI) / 180, // X: -20度
      (77 * Math.PI) / 180, // Y: 77度
      (20 * Math.PI) / 180, // Z: 20度
    );

    // PointerLockイベントリスナー
    const handlePointerLockChange = () => {
      const isCurrentlyLocked = document.pointerLockElement !== null;
      setIsLocked(isCurrentlyLocked);
      onLockChange?.(isCurrentlyLocked);

      // ロックが成功した場合、Eulerをリセット（カメラの向きを保持）
      if (isCurrentlyLocked) {
        euler.current.setFromQuaternion(camera.quaternion);
      }
    };

    const handlePointerLockError = () => {
      // 実際に問題がある場合のみ警告
      if (document.pointerLockElement) {
        console.warn("PointerLock error occurred while locked");
      }
      setIsLocked(false);
      onLockChange?.(false);
    };

    // マウス移動ハンドラー
    const handleMouseMove = (event: MouseEvent) => {
      if (!document.pointerLockElement) return;

      const movementX = event.movementX || 0;
      const movementY = event.movementY || 0;

      euler.current.setFromQuaternion(camera.quaternion);
      euler.current.y -= movementX * 0.002;
      euler.current.x -= movementY * 0.002;
      euler.current.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, euler.current.x),
      );

      camera.quaternion.setFromEuler(euler.current);
    };

    document.addEventListener("pointerlockchange", handlePointerLockChange);
    document.addEventListener("pointerlockerror", handlePointerLockError);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener(
        "pointerlockchange",
        handlePointerLockChange,
      );
      document.removeEventListener("pointerlockerror", handlePointerLockError);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [camera, onLockChange]);

  useFrame((state, delta) => {
    if (!isLocked) return;

    // KeyboardControlsから入力を取得
    const { forward, backward, leftward, rightward, jump } = get();

    // 移動方向の計算
    direction.current.set(0, 0, 0);

    if (forward) direction.current.z -= 1;
    if (backward) direction.current.z += 1;
    if (leftward) direction.current.x -= 1;
    if (rightward) direction.current.x += 1;

    // 正規化（斜め移動が早くならないように）
    if (direction.current.length() > 0) {
      direction.current.normalize();
    }

    // カメラの向きに基づいて移動方向を調整
    const cameraDirection = new Vector3();
    camera.getWorldDirection(cameraDirection);
    cameraDirection.y = 0; // Y軸回転のみ
    cameraDirection.normalize();

    const rightDirection = new Vector3();
    rightDirection.crossVectors(cameraDirection, new Vector3(0, 1, 0));

    // 移動ベクトル計算
    const moveVector = new Vector3();
    moveVector.addScaledVector(cameraDirection, -direction.current.z);
    moveVector.addScaledVector(rightDirection, direction.current.x);

    // 重力
    velocity.current.y -= 30 * delta;

    // ジャンプ
    if (jump && isOnGround.current) {
      velocity.current.y = jumpHeight;
      isOnGround.current = false;
    }

    // 水平移動
    velocity.current.x = moveVector.x * walkSpeed;
    velocity.current.z = moveVector.z * walkSpeed;

    // 地面判定
    raycaster.current.set(camera.position, new Vector3(0, -1, 0));
    const intersects = raycaster.current.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const groundY = intersects[0].point.y + 1.7; // 目線の高さ

      if (camera.position.y <= groundY && velocity.current.y <= 0) {
        camera.position.y = groundY;
        velocity.current.y = 0;
        isOnGround.current = true;
      }
    }

    // 位置更新
    camera.position.addScaledVector(velocity.current, delta);

    // デバッグ情報更新（毎フレーム）
    if (onDebugUpdate) {
      const position = camera.position;
      const rotation = camera.rotation;
      onDebugUpdate({
        position: {
          x: Math.round(position.x * 100) / 100,
          y: Math.round(position.y * 100) / 100,
          z: Math.round(position.z * 100) / 100,
        },
        rotation: {
          x: Math.round(((rotation.x * 180) / Math.PI) * 100) / 100,
          y: Math.round(((rotation.y * 180) / Math.PI) * 100) / 100,
          z: Math.round(((rotation.z * 180) / Math.PI) * 100) / 100,
        },
      });
    }

    // マルチプレイヤー位置更新（常に更新、レート制限付き）
    if (onPositionUpdate) {
      const now = Date.now();
      if (!lastUpdateTimeRef.current || now - lastUpdateTimeRef.current > 50) { // 50ms間隔（20FPS）
        onPositionUpdate(
          { x: camera.position.x, y: camera.position.y, z: camera.position.z },
          { y: camera.rotation.y }
        );
        lastUpdateTimeRef.current = now;
      }
    }
  });

  return null;
}
