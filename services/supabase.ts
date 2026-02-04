import { createClient } from '@supabase/supabase-js';

// --- CONFIGURAÇÃO DO SUPABASE ---
// INSTRUÇÃO: Substitua as strings abaixo pelas suas chaves do painel do Supabase (Project Settings > API)
// Se estiver usando variáveis de ambiente do Vite (.env), elas serão lidas automaticamente.

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://ohqbphgvjppaqlrxtpeu.supabase.co'; 
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ocWJwaGd2anBwYXFscnh0cGV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMzkxMDEsImV4cCI6MjA4NTcxNTEwMX0.OJEcZ1htxp7GuhdowLy9A8nyfTrnw3OOVm9jcEpvVyY';

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