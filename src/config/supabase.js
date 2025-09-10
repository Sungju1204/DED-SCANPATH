import { createClient } from '@supabase/supabase-js'

// 환경 변수에서 Supabase 설정 가져오기
const supabaseUrl = process.env.VUE_APP_SUPABASE_URL
const supabaseAnonKey = process.env.VUE_APP_SUPABASE_ANON_KEY

// 환경 변수가 설정되지 않은 경우 임시로 null 반환
let supabase = null

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL') {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
    console.log('Supabase 클라이언트가 성공적으로 생성되었습니다.')
  } catch (error) {
    console.error('Supabase 클라이언트 생성 실패:', error)
    supabase = null
  }
} else {
  console.warn('Supabase 환경 변수가 설정되지 않았습니다. .env 파일을 확인해주세요.')
  console.warn('VUE_APP_SUPABASE_URL과 VUE_APP_SUPABASE_ANON_KEY를 설정해야 합니다.')
}

export { supabase }
