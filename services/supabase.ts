import { createClient } from '@supabase/supabase-js';

// Substitua estas variáveis pelas suas chaves reais do projeto Supabase
// Em produção no Vercel, use Variáveis de Ambiente (Environment Variables)
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://seu-projeto.supabase.co'; 
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'sua-chave-anonima';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);