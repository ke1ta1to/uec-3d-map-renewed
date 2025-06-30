'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

type PlayerPosition = Database['public']['Tables']['player_positions']['Row']

export function useMultiplayer() {
  const [players, setPlayers] = useState<Map<string, PlayerPosition>>(new Map())
  const [userId, setUserId] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [nickname, setNickname] = useState<string>(() => {
    // ローカルストレージから保存されたニックネームを取得
    if (typeof window !== 'undefined') {
      return localStorage.getItem('uec-3d-map-nickname') || 'Player'
    }
    return 'Player'
  })
  
  const supabase = createClient()
  const channelRef = useRef<RealtimeChannel | null>(null)
  const cleanupIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isConnectingRef = useRef(false)

  // 匿名認証
  const connect = useCallback(async () => {
    // 既に接続中または接続試行中の場合はスキップ
    if (isConnected || isConnectingRef.current) return
    
    isConnectingRef.current = true
    setIsConnected(false)
    
    try {
      // 既存のセッションを確認
      const { data: { session } } = await supabase.auth.getSession()
      
      let user = session?.user
      
      if (!user) {
        const { data: { user: newUser }, error } = await supabase.auth.signInAnonymously()
        if (error) throw error
        if (!newUser) throw new Error('Failed to sign in')
        user = newUser
      }
      
      setUserId(user.id)

      // 既存のプレイヤーデータを削除してから初期位置を登録
      await supabase.from('player_positions').delete().eq('user_id', user.id)
      
      const { error: insertError } = await supabase.from('player_positions').insert({
        user_id: user.id,
        position_x: 100,
        position_y: 2,
        position_z: -100,
        rotation_y: 0,
        nickname: nickname,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`, // ランダムカラー
        updated_at: new Date().toISOString()
      })
      
      if (insertError) throw insertError

      // 古いデータをクリーンアップ
      await supabase.rpc('clean_old_positions')
      
      // 既存のプレイヤーを取得（1分以内に更新されたもののみ）
      const { data: existingPlayers } = await supabase
        .from('player_positions')
        .select('*')
        .gte('updated_at', new Date(Date.now() - 60000).toISOString())
      
      if (existingPlayers) {
        const playersMap = new Map<string, PlayerPosition>()
        existingPlayers.forEach(player => {
          if (player.user_id !== user.id) {
            playersMap.set(player.user_id, player)
          }
        })
        setPlayers(playersMap)
      }

      // リアルタイムサブスクリプション
      const channel = supabase
        .channel('player-positions')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'player_positions' },
          (payload) => {
            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
              const newPlayer = payload.new as PlayerPosition
              if (newPlayer && newPlayer.user_id !== user.id) {
                setPlayers(prev => new Map(prev).set(newPlayer.user_id, newPlayer))
              }
            } else if (payload.eventType === 'DELETE') {
              const oldPlayer = payload.old as { user_id: string }
              if (oldPlayer && oldPlayer.user_id) {
                setPlayers(prev => {
                  const newMap = new Map(prev)
                  newMap.delete(oldPlayer.user_id)
                  return newMap
                })
              }
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setIsConnected(true)
          }
        })
      
      channelRef.current = channel

      // 定期的に古いプレイヤーを削除（10秒ごと）
      cleanupIntervalRef.current = setInterval(async () => {
        const { data: activePlayers } = await supabase
          .from('player_positions')
          .select('*')
          .gte('updated_at', new Date(Date.now() - 60000).toISOString())
        
        if (activePlayers) {
          const activePlayerIds = new Set(activePlayers.map(p => p.user_id))
          setPlayers(prev => {
            const newMap = new Map(prev)
            for (const [id] of newMap) {
              if (id !== userId && !activePlayerIds.has(id)) {
                newMap.delete(id)
              }
            }
            return newMap
          })
        }
      }, 10000)

    } catch (error) {
      setIsConnected(false)
    } finally {
      isConnectingRef.current = false
    }
  }, [supabase, isConnected, nickname])

  // 位置を更新
  const updatePosition = useCallback(async (
    position: { x: number; y: number; z: number },
    rotation: { y: number }
  ) => {
    const { data: { user } } = await supabase.auth.getUser()
    const currentUserId = user?.id
    
    if (!currentUserId) return

    try {
      await supabase
        .from('player_positions')
        .update({
          position_x: Math.round(position.x * 10) / 10,
          position_y: Math.round(position.y * 10) / 10,
          position_z: Math.round(position.z * 10) / 10,
          rotation_y: Math.round(rotation.y * 100) / 100,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', currentUserId)
    } catch (error) {
      console.error('Position update failed:', error)
    }
  }, [supabase])

  // 切断処理
  const disconnect = useCallback(async () => {
    try {
      if (cleanupIntervalRef.current) {
        clearInterval(cleanupIntervalRef.current)
        cleanupIntervalRef.current = null
      }
      
      if (userId) {
        await supabase.from('player_positions').delete().eq('user_id', userId)
      }
      
      if (channelRef.current) {
        await supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
      
      // signOutは行わない（エラーの原因となるため）
      // ページリロード時は自動的にセッションがクリアされる
    } catch (error) {
      console.error('Disconnect error:', error)
    } finally {
      setIsConnected(false)
      setUserId(null)
      setPlayers(new Map())
    }
  }, [userId, supabase])

  // セッション監視とクリーンアップ
  useEffect(() => {
    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setIsConnected(false)
        setUserId(null)
        setPlayers(new Map())
      }
    })

    // クリーンアップ
    return () => {
      subscription.unsubscribe()
      disconnect()
    }
  }, [disconnect, supabase])

  // ニックネームを更新
  const updateNickname = useCallback(async (newNickname: string) => {
    setNickname(newNickname)
    
    // ローカルストレージに保存
    if (typeof window !== 'undefined') {
      localStorage.setItem('uec-3d-map-nickname', newNickname)
    }
    
    const { data: { user } } = await supabase.auth.getUser()
    const currentUserId = user?.id
    
    if (!currentUserId) return
    
    try {
      await supabase
        .from('player_positions')
        .update({ 
          nickname: newNickname,
          updated_at: new Date().toISOString() // updated_atも更新してリアルタイムイベントを確実に発生させる
        })
        .eq('user_id', currentUserId)
    } catch (error) {
      console.error('Failed to update nickname:', error)
    }
  }, [supabase])

  return {
    players: Array.from(players.values()),
    isConnected,
    connect,
    disconnect,
    updatePosition,
    updateNickname,
    userId,
    nickname
  }
}