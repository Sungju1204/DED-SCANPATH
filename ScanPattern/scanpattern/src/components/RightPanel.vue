<template>
  <div class="right-panel">
    <div class="right-panel-title">{{ title }}</div>
    <div class="text-area-container">
      <textarea 
        :value="content"
        class="text-area" 
        :placeholder="placeholder"
        @input="onInput"
      ></textarea>
      <div class="button-container">
        <button 
          v-show="showSaveCycle"
          class="action-button" 
          @click="saveCycle"
        >
          사이클 저장
        </button>
        <button 
          v-show="showSaveCode"
          class="action-button" 
          @click="saveCode"
        >
          코드 저장
        </button>
        <button 
          class="action-button clear-button" 
          @click="clearText"
        >
          지우기
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RightPanel',
  props: {
    content: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: 'NC Code'
    },
    placeholder: {
      type: String,
      default: '여기에 NC 코드를 작성하세요...'
    },
    showSaveCycle: {
      type: Boolean,
      default: false
    },
    showSaveCode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:content', 'save-cycle', 'save-code', 'clear'],
  methods: {
    onInput(event) {
      this.$emit('update:content', event.target.value)
    },
    
    saveCycle() {
      this.$emit('save-cycle')
    },
    
    saveCode() {
      this.$emit('save-code')
    },
    
    clearText() {
      if (confirm('정말로 모든 텍스트를 지우시겠습니까?')) {
        this.$emit('clear')
      }
    }
  }
}
</script>

<style scoped>
.right-panel {
  position: absolute;
  width: 399px;
  height: 604px;
  left: 850px;
  top: 44px;
  background: #1D1D1D;
  box-shadow: 0px 4px 8px 2px rgba(0, 0, 0, 0.25);
  border-radius: 17px;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.right-panel-title {
  color: #FFFFFF;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  text-align: center;
}

.text-area-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.text-area {
  flex: 1;
  background: #262525;
  border: 2px solid #333;
  border-radius: 10px;
  padding: 15px;
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  outline: none;
  transition: border-color 0.3s ease;
}

.text-area:focus {
  border-color: #7B20E2;
}

.text-area::placeholder {
  color: #666;
}

.button-container {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

.action-button {
  flex: 1;
  padding: 10px;
  background: #7B20E2;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button:hover {
  background: #8B30F2;
  transform: translateY(-1px);
}

.action-button:active {
  transform: translateY(0px);
}

.clear-button {
  background: #444;
}

.clear-button:hover {
  background: #555;
}
</style> 
