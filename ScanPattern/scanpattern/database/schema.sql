-- 사이클 테이블 생성
CREATE TABLE IF NOT EXISTS cycles (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  selected_items JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_cycles_created_at ON cycles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cycles_name ON cycles(name);

-- RLS (Row Level Security) 활성화
ALTER TABLE cycles ENABLE ROW LEVEL SECURITY;

-- 모든 사용자에게 읽기/쓰기 권한 부여 (개발용)
CREATE POLICY "Allow all operations for all users" ON cycles
  FOR ALL USING (true) WITH CHECK (true);

-- updated_at 자동 업데이트를 위한 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_cycles_updated_at
  BEFORE UPDATE ON cycles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 샘플 데이터 삽입 (선택사항)
INSERT INTO cycles (name, content, selected_items) VALUES
  ('기본 스캔 패턴', 'G21\nG90\nG0 Z5\nG1 Z-1 F100\nG1 X0 Y0 F500', '[{"id": "scan_1", "name": "스캔 시작"}]'),
  ('고속 스캔', 'G21\nG90\nG0 Z3\nG1 Z-0.5 F200\nG1 X0 Y0 F1000', '[{"id": "fast_1", "name": "고속 스캔"}]')
ON CONFLICT (id) DO NOTHING;
