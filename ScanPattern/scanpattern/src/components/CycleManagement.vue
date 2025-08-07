<template>
  <div class="page-content">
    <div class="code-assignment-container">
      <div class="code-assignment-title">사이클 관리</div>
      
      <div class="cycle-list-container">
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
              <button 
                class="cycle-delete-btn"
                @click.stop="deleteCycle(index)"
              >
                삭제
              </button>
            </div>
          </div>
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
    }
  },
  emits: ['show-cycle', 'delete-cycle'],
  methods: {
    showCycleContent(cycle) {
      this.$emit('show-cycle', cycle)
    },
    
    deleteCycle(index) {
      if (confirm(`사이클 "${this.savedCycles[index].name}"을 삭제하시겠습니까?`)) {
        this.$emit('delete-cycle', index)
      }
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
</style> 