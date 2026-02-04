import { createClient } from '@supabase/supabase-js';

// --- CONFIGURAÇÃO DO SUPABASE ---
// INSTRUÇÃO: Substitua as strings abaixo pelas suas chaves do painel do Supabase (Project Settings > API)
// Se estiver usando variáveis de ambiente do Vite (.env), elas serão lidas automaticamente.

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://seu-projeto.supabase.co'; 
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sua-chave-anonima';

// Validação básica para evitar erros silenciosos
if (SUPABASE_URL === 'https://seu-projeto.supabase.co') {
    console.warn('⚠️ AVISO: As chaves do Supabase não foram configuradas em services/supabase.ts');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});