<template>
  <div class="page-content">
    <div class="code-assignment-container">
      <div class="code-assignment-title">사이클 관리</div>
      
      <!-- 로딩 상태 -->
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <div class="loading-text">사이클을 불러오는 중...</div>
      </div>
      
      <!-- 오류 메시지 -->
      <div v-else-if="error" class="error-container">
        <div class="error-icon">⚠️</div>
        <div class="error-text">{{ error }}</div>
        <button class="retry-btn" @click="retryLoad">다시 시도</button>
      </div>
      
      <!-- 사이클 목록 -->
      <div v-else class="cycle-list-container">
        <div v-if="savedCycles.length === 0" class="empty-cycle-message">
          저장된 사이클이 없습니다.
        </div>
        <div v-else class="cycle-list">
          <div 
            v-for="(cycle, index) in savedCycles" 
            :key="cycle.id"
            class="cycle-item"
            @click="showCycleContent(cycle)"
          >
            <div class="cycle-header">
              <div class="cycle-name">
                {{ cycle.name }}
                <span v-if="cycle.selectedItems && cycle.selectedItems.length > 0">
                  ({{ cycle.selectedItems.map(item => item.name).join(' ') }})
                </span>
              </div>
              <div class="cycle-date">{{ cycle.date }}</div>
              <div class="cycle-actions">
                <button 
                  class="cycle-edit-btn"
                  @click.stop="editCycle(cycle)"
                  title="사이클 수정"
                >
                  ✏️
                </button>
                <button 
                  class="cycle-delete-btn"
                  @click.stop="deleteCycle(index)"
                  title="사이클 삭제"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 사이클 수정 모달 -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>사이클 수정</h3>
          <button class="modal-close" @click="closeEditModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>사이클 이름:</label>
            <input 
              v-model="editingCycle.name" 
              type="text" 
              class="form-input"
              placeholder="사이클 이름을 입력하세요"
            />
          </div>
          <div class="form-group">
            <label>NC 코드:</label>
            <textarea 
              v-model="editingCycle.content" 
              class="form-textarea"
              placeholder="NC 코드를 입력하세요"
              rows="8"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeEditModal">취소</button>
          <button class="btn btn-primary" @click="saveEdit" :disabled="isSaving">
            {{ isSaving ? '저장 중...' : '저장' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CycleManagement',
  props: {
    savedCycles: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: null
    }
  },
  emits: ['show-cycle', 'delete-cycle', 'update-cycle', 'retry-load'],
  data() {
    return {
      showEditModal: false,
      editingCycle: {
        id: null,
        name: '',
        content: '',
        selectedItems: []
      },
      isSaving: false
    }
  },
  mounted() {
    console.log('CycleManagement 컴포넌트 마운트됨, savedCycles:', this.savedCycles)
  },
  updated() {
    console.log('CycleManagement 컴포넌트 업데이트됨, savedCycles:', this.savedCycles)
  },
  methods: {
    showCycleContent(cycle) {
      console.log('사이클 클릭됨:', cycle)
      this.$emit('show-cycle', cycle)
    },
    
    deleteCycle(index) {
      if (confirm(`사이클 "${this.savedCycles[index].name}"을 삭제하시겠습니까?`)) {
        this.$emit('delete-cycle', index)
      }
    },
    
    editCycle(cycle) {
      this.editingCycle = {
        id: cycle.id,
        name: cycle.name,
        content: cycle.content,
        selectedItems: cycle.selectedItems || []
      }
      this.showEditModal = true
    },
    
    closeEditModal() {
      this.showEditModal = false
      this.editingCycle = {
        id: null,
        name: '',
        content: '',
        selectedItems: []
      }
    },
    
    saveEdit() {
      if (!this.editingCycle.name.trim()) {
        alert('사이클 이름을 입력해주세요.')
        return
      }
      
      if (!this.editingCycle.content.trim()) {
        alert('NC 코드를 입력해주세요.')
        return
      }
      
      this.isSaving = true
      this.$emit('update-cycle', this.editingCycle.id, this.editingCycle)
      this.closeEditModal()
      this.isSaving = false
    },
    
    retryLoad() {
      this.$emit('retry-load')
    }
  }
}
</script>

<style scoped>
.page-content {
  position: relative;
  background: #F8F9FA;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.code-assignment-container {
  position: absolute;
  width: 653px;
  min-height: 280px;
  left: 135px;
  top: 100px;
  background: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #E9ECEF;
}

.code-assignment-title {
  color: #1A1A1A;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
  text-align: center;
  letter-spacing: -0.02em;
}

.cycle-list-container {
  margin-top: 20px;
}

.cycle-list {
  max-height: 400px;
  overflow-y: auto;
}

.cycle-item {
  background: #F8F9FA;
  border: 1px solid #DEE2E6;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.cycle-item:hover {
  background: #E9ECEF;
  border-color: #007BFF;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.15);
}

.cycle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.cycle-name {
  color: #007BFF;
  font-size: 16px;
  font-weight: 600;
}

.cycle-date {
  color: #6C757D;
  font-size: 12px;
}

.cycle-delete-btn {
  background: #DC3545;
  color: #FFFFFF;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cycle-delete-btn:hover {
  background: #C82333;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(220, 53, 69, 0.3);
}

.empty-cycle-message {
  color: #666;
  text-align: center;
  margin-top: 100px;
  font-size: 14px;
}

/* 로딩 상태 스타일 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007BFF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #6C757D;
  font-size: 14px;
  font-weight: 500;
}

/* 오류 상태 스타일 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-text {
  color: #DC3545;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;
  max-width: 300px;
}

.retry-btn {
  background: #007BFF;
  color: #FFFFFF;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background: #0056B3;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

/* 사이클 액션 버튼 스타일 */
.cycle-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.cycle-edit-btn {
  background: #28A745;
  color: #FFFFFF;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cycle-edit-btn:hover {
  background: #218838;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #FFFFFF;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #E9ECEF;
}

.modal-header h3 {
  margin: 0;
  color: #1A1A1A;
  font-size: 18px;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  color: #6C757D;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #F8F9FA;
  color: #495057;
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #1A1A1A;
  font-weight: 500;
  font-size: 14px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #DEE2E6;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #007BFF;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #E9ECEF;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6C757D;
  color: #FFFFFF;
}

.btn-secondary:hover:not(:disabled) {
  background: #5A6268;
  transform: translateY(-1px);
}

.btn-primary {
  background: #007BFF;
  color: #FFFFFF;
}

.btn-primary:hover:not(:disabled) {
  background: #0056B3;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}
</style> 