import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sjlyvhgtmsxuwiwflcfi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqbHl2aGd0bXN4dXdpd2ZsY2ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMjQwOTcsImV4cCI6MjA2MjgwMDA5N30.LrZuwry8um605uaTTkBf6zAEJZBmUxut0D_1DagXHV4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);