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
}

.code-assignment-container {
  position: absolute;
  width: 653px;
  height: 280px;
  left: 135px;
  top: 100px;
  background: #1D1D1D;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0px 4px 8px 2px rgba(0, 0, 0, 0.25);
}

.code-assignment-title {
  color: #FFFFFF;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
}

.cycle-list-container {
  margin-top: 20px;
}

.cycle-list {
  max-height: 400px;
  overflow-y: auto;
}

.cycle-item {
  background: #333;
  border: 2px solid #7B20E2;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.cycle-item:hover {
  background: #3A3A3A;
  transform: translateY(-2px);
}

.cycle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.cycle-name {
  color: #7B20E2;
  font-size: 16px;
  font-weight: 600;
}

.cycle-date {
  color: #666;
  font-size: 12px;
}

.cycle-delete-btn {
  background: #e74c3c;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cycle-delete-btn:hover {
  background: #c0392b;
}

.empty-cycle-message {
  color: #666;
  text-align: center;
  margin-top: 100px;
  font-size: 14px;
}
</style> 