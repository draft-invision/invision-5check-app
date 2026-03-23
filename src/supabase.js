import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rcpwujqugsklwfznwiag.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjcHd1anF1Z3NrbHdmem53aWFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMjAzMzUsImV4cCI6MjA4OTc5NjMzNX0.X0E2EUKnxrSF3iuOs-QAnIQ58cJF-woBSnEoMQ7q_YU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/** DBのスネークケース → JSのキャメルケース に変換 */
export function toUser(row) {
  if (!row) return null;
  const u = { ...row, habitHistory: row.habit_history };
  delete u.habit_history;
  return u;
}

/** JSのキャメルケース → DBのスネークケース に変換 */
export function toRow(u) {
  return {
    email: u.email,
    name: u.name || '',
    team: u.team || '',
    habit_history: u.habitHistory || [],
    checks: u.checks || {},
  };
}
