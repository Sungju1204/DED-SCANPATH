# Scan Pattern - 3D 프린팅 스캔 패턴 관리 시스템

## 개요
HBNU_DED M250 3D 프린터를 위한 스캔 패턴 관리 시스템입니다. NC 코드를 생성하고, 사이클을 관리하며, 3D 프린팅 코드를 생성할 수 있습니다.

## 주요 기능
- 메인 대시보드에서 스캔 패턴 구성
- NC 코드 할당 및 관리
- 사이클 생성 및 관리 (Supabase 데이터베이스 연동 + 로컬 백업)
- 3D 프린팅 코드 생성
- 반응형 사이드바 네비게이션

## 기술 스택
- **Frontend**: Vue.js 3, Vue CLI
- **Database**: Supabase (PostgreSQL) + 로컬 스토리지 백업
- **Styling**: CSS3 with modern design patterns
- **State Management**: Vue 3 Composition API

## 설치 및 설정

### 1. 의존성 설치
```bash
npm install
```

### 2. Supabase 설정 (선택사항)

#### 2.1 Supabase 프로젝트 생성
1. [Supabase](https://supabase.com)에 가입하고 새 프로젝트를 생성합니다.
2. 프로젝트 설정에서 API URL과 anon key를 확인합니다.

#### 2.2 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가합니다:

```env
VUE_APP_SUPABASE_URL=https://your-project-ref.supabase.co
VUE_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

**중요**: 
- URL은 `https://`로 시작해야 합니다
- anon key는 `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` 형식입니다
- 환경 변수 이름은 정확히 `VUE_APP_`으로 시작해야 합니다

#### 2.3 데이터베이스 스키마 생성
Supabase SQL 편집기에서 `database/schema.sql` 파일의 내용을 실행하여 테이블을 생성합니다:

```sql
-- 사이클 테이블 생성
CREATE TABLE IF NOT EXISTS cycles (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  selected_items JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 및 RLS 설정
CREATE INDEX IF NOT EXISTS idx_cycles_created_at ON cycles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cycles_name ON cycles(name);
ALTER TABLE cycles ENABLE ROW LEVEL SECURITY;

-- 모든 사용자에게 권한 부여 (개발용)
CREATE POLICY "Allow all operations for all users" ON cycles
  FOR ALL USING (true) WITH CHECK (true);
```

### 3. 개발 서버 실행
```bash
npm run serve
```

### 4. 프로덕션 빌드
```bash
npm run build
```

## 데이터베이스 구조

### cycles 테이블
- `id`: 고유 식별자 (자동 증가)
- `name`: 사이클 이름
- `content`: NC 코드 내용
- `selected_items`: 선택된 아이템들의 JSON 배열
- `created_at`: 생성 시간
- `updated_at`: 수정 시간

## 주요 컴포넌트

### 1. MainDashboard
메인 대시보드로, 스캔 패턴을 구성하고 NC 코드를 생성합니다.

### 2. CycleManagement
사이클을 생성, 수정, 삭제하고 관리합니다. Supabase와 연동되어 데이터를 영구 저장하며, 연결 실패 시 자동으로 로컬 스토리지를 사용합니다.

### 3. CodeAssignment
NC 코드를 버튼에 할당하고 관리합니다.

### 4. PrintingCodeGenerator
3D 프린팅에 필요한 코드를 생성합니다.

## 사이클 관리 기능

### 사이클 저장
- NC 코드와 선택된 아이템들을 포함하여 사이클을 저장
- Supabase 데이터베이스에 자동 저장 (설정된 경우)
- Supabase 연결 실패 시 로컬 스토리지에 자동 백업
- 데이터 손실 방지

### 사이클 수정
- 기존 사이클의 이름과 NC 코드를 수정
- 실시간 데이터베이스 업데이트 또는 로컬 스토리지 업데이트

### 사이클 삭제
- 데이터베이스에서 사이클을 영구 삭제
- 확인 대화상자로 실수 방지

## 오류 처리 및 복구

### Supabase 연결 실패
- 환경 변수가 설정되지 않은 경우 자동으로 로컬 스토리지 사용
- 네트워크 오류 시 자동으로 로컬 백업에서 복원
- 콘솔에 경고 메시지 표시

### 데이터 동기화
- 로컬 상태와 데이터베이스 상태를 자동 동기화
- 오프라인 상태에서도 로컬 데이터 사용 가능
- Supabase 연결 복구 시 자동 동기화

## 문제 해결

### "Failed to construct 'URL': Invalid URL" 에러
1. `.env` 파일이 프로젝트 루트에 있는지 확인
2. `VUE_APP_SUPABASE_URL`이 올바른 형식인지 확인 (https://로 시작)
3. 환경 변수 이름이 정확한지 확인
4. 개발 서버 재시작

### Supabase 연결 실패
1. 프로젝트 URL과 anon key가 올바른지 확인
2. Supabase 프로젝트가 활성 상태인지 확인
3. 네트워크 연결 상태 확인
4. 일시적으로 로컬 스토리지 사용 가능

## 개발 가이드

### 새로운 기능 추가
1. `src/composables/`에 관련 로직 추가
2. `src/components/`에 UI 컴포넌트 추가
3. `src/services/`에 API 서비스 추가

### 데이터베이스 스키마 변경
1. `database/schema.sql` 파일 수정
2. Supabase SQL 편집기에서 실행
3. 관련 서비스 코드 업데이트

## 라이센스
© 2025 HBNU. All rights reserved.

## 지원
문제가 발생하거나 기능 요청이 있으시면 이슈를 등록해 주세요.
