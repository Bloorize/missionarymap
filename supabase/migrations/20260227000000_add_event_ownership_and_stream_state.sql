ALTER TABLE events
  ADD COLUMN IF NOT EXISTS owner_clerk_user_id TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS stream_status TEXT NOT NULL DEFAULT 'idle',
  ADD COLUMN IF NOT EXISTS livekit_room_name TEXT,
  ADD COLUMN IF NOT EXISTS stream_started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS stream_ended_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS active_broadcaster_identity TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'events_stream_status_check'
  ) THEN
    ALTER TABLE events
      ADD CONSTRAINT events_stream_status_check
      CHECK (stream_status IN ('idle', 'starting', 'live', 'ending', 'ended', 'error'));
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_events_livekit_room_name ON events(livekit_room_name) WHERE livekit_room_name IS NOT NULL;

DROP POLICY IF EXISTS "Allow all on events" ON events;
DROP POLICY IF EXISTS "Allow all on guesses" ON guesses;
