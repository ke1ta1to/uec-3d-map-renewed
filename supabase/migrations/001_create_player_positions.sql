-- 匿名ユーザーの位置情報を管理するテーブル
create table player_positions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null unique,
  position_x real not null default 100,
  position_y real not null default 2,
  position_z real not null default -100,
  rotation_y real not null default 0,
  nickname text default 'Player',
  color text default '#3B82F6',
  updated_at timestamp with time zone default now()
);

-- updated_atのインデックス（クリーンアップ処理用）
create index idx_player_positions_updated_at on player_positions(updated_at);

-- 古いデータを自動削除する関数
create or replace function clean_old_positions()
returns void as $$
begin
  delete from player_positions
  where updated_at < now() - interval '30 seconds';
end;
$$ language plpgsql;

-- RLS (Row Level Security) を一時的に無効化（デバッグ用）
-- alter table player_positions enable row level security;

-- 誰でも全員の位置を見れる
-- create policy "Anyone can view positions"
--   on player_positions for select 
--   using (true);

-- 自分の位置だけ更新できる（匿名ユーザー対応）
-- create policy "Users can update own position"
--   on player_positions for all 
--   using (
--     auth.uid() is not null and 
--     auth.uid()::text = user_id::text
--   );

-- リアルタイムを有効化
alter publication supabase_realtime add table player_positions;