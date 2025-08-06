<template>
  <div class="page-content">
    <div class="code-assignment-container">
      <div class="code-assignment-title">코드 할당</div>
      
      <div class="button-management-section">
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
        <div class="button-controls">
          <button 
            class="toggle-button" 
            :class="{ active: showCButtons }"
            @click="showCButtons = !showCButtons"
          >
            {{ showCButtons ? 'C 버튼 목록 숨기기' : 'C 버튼 목록' }}
          </button>
          <button 
            v-show="showCButtons"
            class="trash-button" 
            @click="toggleDeleteMode('C')"
            :class="{ active: deleteMode === 'C' }"
          >
            🗑️
          </button>
        </div>
        <div v-show="showCButtons" class="button-list">
          <div 
            v-for="button in cButtons" 
            :key="button"
            :class="['button-item', { selected: selectedButton === button }]"
            @click="selectButton(button)"
          >
            <input 
              v-if="deleteMode === 'C'"
              type="checkbox" 
              :checked="selectedForDeletion.includes(button)"
              @click.stop="toggleDeleteSelection(button)"
              class="delete-checkbox"
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
          <button 
            v-show="showFButtons"
            class="trash-button" 
            @click="toggleDeleteMode('F')"
            :class="{ active: deleteMode === 'F' }"
          >
            🗑️
          </button>
        </div>
        <div v-show="showFButtons" class="button-list">
          <div 
            v-for="button in fButtons" 
            :key="button"
            :class="['button-item', { selected: selectedButton === button }]"
            @click="selectButton(button)"
          >
            <input 
              v-if="deleteMode === 'F'"
              type="checkbox" 
              :checked="selectedForDeletion.includes(button)"
              @click.stop="toggleDeleteSelection(button)"
              class="delete-checkbox"
            >
            {{ button }}
          </div>
        </div>
        
        <button 
          v-if="deleteMode && selectedForDeletion.length > 0"
          class="complete-delete-button"
          @click="deleteSelectedButtons"
        >
          완료
        </button>
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
  emits: ['add-button', 'select-button', 'delete-buttons'],
  data() {
    return {
      newButtonName: '',
      selectedListForButton: '',
      showCButtons: false,
      showFButtons: false,
      deleteMode: null,
      selectedForDeletion: []
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
      if (this.deleteMode) return // 삭제 모드에서는 버튼 선택 비활성화
      this.$emit('select-button', button)
    },
    
    toggleDeleteMode(listType) {
      if (this.deleteMode === listType) {
        // 같은 리스트의 휴지통 버튼을 다시 클릭하면 삭제 모드 해제
        this.deleteMode = null
        this.selectedForDeletion = []
      } else {
        // 다른 리스트의 휴지통 버튼을 클릭하면 해당 리스트로 삭제 모드 변경
        this.deleteMode = listType
        this.selectedForDeletion = []
      }
    },
    
    toggleDeleteSelection(button) {
      const index = this.selectedForDeletion.indexOf(button)
      if (index > -1) {
        this.selectedForDeletion.splice(index, 1)
      } else {
        this.selectedForDeletion.push(button)
      }
    },
    
    deleteSelectedButtons() {
      if (this.selectedForDeletion.length === 0) {
        alert('삭제할 버튼을 선택해주세요.')
        return
      }
      
      if (confirm(`선택된 ${this.selectedForDeletion.length}개의 버튼을 삭제하시겠습니까?`)) {
        this.$emit('delete-buttons', {
          listType: this.deleteMode,
          buttons: this.selectedForDeletion
        })
        this.deleteMode = null
        this.selectedForDeletion = []
        alert('선택된 버튼들이 삭제되었습니다.')
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

.trash-button {
  padding: 10px 12px;
  background: #666;
  color: #FFFFFF;
  border: none;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 40px;
}

.trash-button:hover {
  background: #777;
}

.trash-button.active {
  background: #E74C3C;
}

.complete-delete-button {
  width: 100%;
  padding: 10px 12px;
  background: #E74C3C;
  color: #FFFFFF;
  border: none;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.complete-delete-button:hover {
  background: #C0392B;
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

.delete-checkbox {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 16px;
  height: 16px;
  cursor: pointer;
  z-index: 10;
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
