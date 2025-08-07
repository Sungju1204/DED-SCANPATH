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
  height: 380px;
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
  padding: 10px 12px;
  background: #444;
  color: #FFFFFF;
  border: none;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-button:hover {
  background: #555;
}

.toggle-button.active {
  background: #7B20E2;
}



.button-list {
  margin-bottom: 15px;
  padding: 10px;
  background: #262525;
  border-radius: 8px;
  border: 1px solid #555;
}

.button-item {
  display: inline-block;
  background: #333;
  color: #FFFFFF;
  padding: 8px 16px;
  margin: 5px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
}

.button-item:hover {
  background: #444;
  border-color: #7B20E2;
}

.button-item.selected {
  background: #7B20E2;
  border-color: #7B20E2;
}



.selected-button-display {
  color: #7B20E2;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
  text-align: center;
  padding: 10px;
  background: #262525;
  border-radius: 8px;
  border: 2px solid #7B20E2;
}
</style> 
