<template>
  <div class="page-content">
    <div class="code-assignment-container">
      <div class="code-assignment-title">코드 할당</div>
      
      <div class="button-management-section">
        <div class="add-list-section">
          <div class="section-title">새 목록 추가</div>
          <div class="add-list-input">
            <input 
              v-model="newListName" 
              type="text" 
              placeholder="목록 이름 (예: M, S, T...)" 
              maxlength="10"
            >
            <button @click="addList">목록 추가</button>
          </div>
        </div>
        
        <div class="add-button-section">
          <div class="section-title">새 버튼 추가</div>
          <div class="add-button-input">
            <select v-model="selectedListForButton">
              <option value="">목록 선택</option>
              <option v-for="list in availableLists" :key="list" :value="list">
                {{ list }}
              </option>
            </select>
            <input 
              v-model="newButtonName" 
              type="text" 
              placeholder="버튼 이름 (예: M1, S1...)" 
              maxlength="10"
            >
            <button @click="addButton">버튼 추가</button>
          </div>
        </div>
      </div>
      
      <div class="button-list-container">
        <button 
          class="toggle-button" 
          :class="{ active: showCButtons }"
          @click="showCButtons = !showCButtons"
        >
          {{ showCButtons ? 'C 버튼 목록 숨기기' : 'C 버튼 목록' }}
        </button>
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
        
        <button 
          class="toggle-button" 
          :class="{ active: showFButtons }"
          @click="showFButtons = !showFButtons"
        >
          {{ showFButtons ? 'F 버튼 목록 숨기기' : 'F 버튼 목록' }}
        </button>
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
  emits: ['add-list', 'add-button', 'select-button'],
  data() {
    return {
      newListName: '',
      newButtonName: '',
      selectedListForButton: '',
      showCButtons: false,
      showFButtons: false
    }
  },
  computed: {
    availableLists() {
      return ['C', 'F', ...Object.keys(this.customButtonLists)]
    },
    cButtons() {
      return ['C1', 'C2', 'C3', 'C4', ...(this.customButtonLists.C || [])]
    },
    fButtons() {
      return ['F1', 'F2', 'F3', 'F4', ...(this.customButtonLists.F || [])]
    }
  },
  methods: {
    addList() {
      const listName = this.newListName.trim().toUpperCase()
      
      if (!listName) {
        alert('목록 이름을 입력해주세요.')
        return
      }
      
      if (this.customButtonLists[listName]) {
        alert('이미 존재하는 목록 이름입니다.')
        return
      }
      
      this.$emit('add-list', listName)
      this.newListName = ''
      alert(`목록 "${listName}"이 추가되었습니다.`)
    },
    
    addButton() {
      const selectedList = this.selectedListForButton
      const buttonName = this.newButtonName.trim().toUpperCase()
      
      if (!selectedList) {
        alert('목록을 선택해주세요.')
        return
      }
      
      if (!buttonName) {
        alert('버튼 이름을 입력해주세요.')
        return
      }
      
      this.$emit('add-button', { selectedList, buttonName })
      this.newButtonName = ''
      alert(`버튼 "${buttonName}"이 목록 "${selectedList}"에 추가되었습니다.`)
    },
    
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

.button-management-section {
  margin-bottom: 20px;
  padding: 15px;
  background: #333;
  border-radius: 10px;
  border: 2px solid #444;
}

.add-list-section, .add-button-section {
  margin-bottom: 15px;
}

.section-title {
  color: #7B20E2;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.add-list-input, .add-button-input {
  display: flex;
  gap: 10px;
  align-items: center;
}

.add-list-input input, .add-button-input input, .add-button-input select {
  flex: 1;
  padding: 8px 12px;
  background: #1D1D1D;
  border: 1px solid #555;
  border-radius: 6px;
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
}

.add-list-input input:focus, .add-button-input input:focus, .add-button-input select:focus {
  outline: none;
  border-color: #7B20E2;
}

.add-list-input button, .add-button-input button {
  padding: 8px 12px;
  background: #7B20E2;
  color: #FFFFFF;
  border: none;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.add-list-input button:hover, .add-button-input button:hover {
  background: #8B30F2;
}

.add-list-input button:active, .add-button-input button:active {
  transform: translateY(1px);
}

.button-list-container {
  margin-bottom: 20px;
}

.toggle-button {
  width: 100%;
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
  margin-bottom: 8px;
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