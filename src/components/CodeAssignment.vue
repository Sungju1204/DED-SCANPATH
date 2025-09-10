<template>
  <div class="page-content">
    <div class="code-assignment-container">
      <div class="code-assignment-title">코드 할당</div>
      

      
      <div class="button-list-container">
        <div class="button-controls">
          <button
            class="toggle-button"
            :class="{ active: showCButtons }"
            @click="showCButtons = !showCButtons"
          >
            {{ showCButtons ? 'C 버튼 목록 숨기기' : 'C 버튼 목록' }}
          </button>
        </div>
        <div v-show="showCButtons" class="button-list">
          <div
            v-for="button in cButtons"
            :key="button"
            :class="['button-item', { selected: selectedButton === button }]"
            @click="selectButton(button)"
          >
            {{ button }}
          </div>
        </div>
        
        <div class="button-controls">
          <button
            class="toggle-button"
            :class="{ active: showFButtons }"
            @click="showFButtons = !showFButtons"
          >
            {{ showFButtons ? 'F 버튼 목록 숨기기' : 'F 버튼 목록' }}
          </button>
        </div>
        <div v-show="showFButtons" class="button-list">
          <div
            v-for="button in fButtons"
            :key="button"
            :class="['button-item', { selected: selectedButton === button }]"
            @click="selectButton(button)"
          >
            {{ button }}
          </div>
        </div>
      </div>
      
      <div class="selected-button-display">
        {{ selectedButton ? `선택된 버튼: ${selectedButton}` : '버튼을 선택하세요' }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CodeAssignment',
  props: {
    customButtonLists: {
      type: Object,
      default: () => ({})
    },
    buttonCodes: {
      type: Object,
      default: () => ({})
    },
    selectedButton: {
      type: String,
      default: ''
    }
  },
  emits: ['select-button'],
  data() {
    return {
      showCButtons: false,
      showFButtons: false
    }
  },
  computed: {
    availableLists() {
      return ['C', 'F']
    },
    cButtons() {
      return ['C1', 'C2', 'C3', 'C4', ...(this.customButtonLists.C || [])]
    },
    fButtons() {
      return ['F1', 'F2', 'F3', 'F4', ...(this.customButtonLists.F || [])]
    }
  },
  methods: {
    selectButton(button) {
      this.$emit('select-button', button)
      // 버튼 클릭 시 해당 버튼의 코드만 text-area에 표시
      this.$emit('show-button-code', button)
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
  min-height: 200px;
  left: 135px;
  top: 100px;
  background: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #E9ECEF;
  max-width: calc(100vw - 600px);
}

.code-assignment-title {
  color: #1A1A1A;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
  text-align: center;
  letter-spacing: -0.02em;
}



.button-list-container {
  margin-bottom: 20px;
}

.button-controls {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}

.toggle-button {
  flex: 1;
  padding: 12px 16px;
  background: #007BFF;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-button:hover {
  background: #0056B3;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

.toggle-button.active {
  background: #0056B3;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}



.button-list {
  margin-bottom: 16px;
  padding: 16px;
  background: #FFFFFF;
  border-radius: 8px;
  border: 1px solid #E9ECEF;
}

.button-item {
  display: inline-block;
  background: #F8F9FA;
  color: #495057;
  padding: 10px 16px;
  margin: 6px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #DEE2E6;
  position: relative;
}

.button-item:hover {
  background: #E9ECEF;
  border-color: #007BFF;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.2);
}

.button-item.selected {
  background: #007BFF;
  border-color: #007BFF;
  color: #FFFFFF;
  font-weight: 600;
}



.selected-button-display {
  color: #007BFF;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  text-align: center;
  padding: 16px;
  background: #F8F9FA;
  border-radius: 8px;
  border: 1px solid #E9ECEF;
  letter-spacing: -0.01em;
}
</style> 
