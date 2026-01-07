import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://snxdqlfskmhhisezaxhq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNueGRxbGZza21oaGlzZXpheGhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MjgwNjAsImV4cCI6MjA4MzIwNDA2MH0.KvZCh6sr9qIEB9UyN8d1Owts11tw-jSv0z8UeqiFafo'

export const supabase = createClient(supabaseUrl, supabaseKey)