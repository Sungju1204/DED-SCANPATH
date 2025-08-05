<template>
  <div class="page-content">
    <div class="content-grid">
      <!-- C 버튼들 섹션 -->
      <div class="button-section">
        <div class="section-header">
          <div class="section-title">C 버튼 목록</div>
          <button class="add-button-btn-small" @click="showModal = true">+</button>
        </div>
        <div class="button-scroll-container">
          <div class="grid-row">
            <div 
              v-for="item in ['C1', 'C2', 'C3', 'C4']" 
              :key="item"
              class="grid-item" 
              :data-item="item"
              @click="addToBottomPanel(item)"
            >
              <div class="grid-item-label">{{ item }}</div>
              <div class="grid-item-image"></div>
            </div>
            <!-- 사용자가 추가한 C 버튼들 -->
            <div 
              v-for="button in customButtonLists.C || []" 
              :key="button"
              class="grid-item" 
              :data-item="button"
              @click="addToBottomPanel(button)"
            >
              <div class="grid-item-label">{{ button }}</div>
              <div class="grid-item-image"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- F 버튼들 섹션 -->
      <div class="button-section">
        <div class="section-header">
          <div class="section-title">F 버튼 목록</div>
          <button class="add-button-btn-small" @click="showModal = true">+</button>
        </div>
        <div class="button-scroll-container">
          <div class="grid-row">
            <div 
              v-for="item in ['F1', 'F2', 'F3', 'F4']" 
              :key="item"
              class="grid-item" 
              :data-item="item"
              @click="addToBottomPanel(item)"
            >
              <div class="grid-item-label">{{ item }}</div>
              <div class="grid-item-image"></div>
            </div>
            <!-- 사용자가 추가한 F 버튼들 -->
            <div 
              v-for="button in customButtonLists.F || []" 
              :key="button"
              class="grid-item" 
              :data-item="button"
              @click="addToBottomPanel(button)"
            >
              <div class="grid-item-label">{{ button }}</div>
              <div class="grid-item-image"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 기타 사용자 추가 버튼들 -->
      <div 
        v-for="(buttons, listName) in otherCustomLists" 
        :key="listName"
        class="button-section"
      >
        <div class="section-title">{{ listName }} 버튼 목록</div>
        <div class="button-scroll-container">
          <div class="grid-row">
            <div 
              v-for="button in buttons" 
              :key="button"
              class="grid-item" 
              :data-item="button"
              @click="addToBottomPanel(button)"
            >
              <div class="grid-item-label">{{ button }}</div>
              <div class="grid-item-image"></div>
            </div>
          </div>
        </div>
      </div>
    </div>



    <div class="bottom-panel" id="bottomPanel">
      <div 
        v-for="item in selectedItems" 
        :key="item.id"
        class="bottom-item"
        @click="removeFromBottomPanel(item.id)"
      >
        {{ item.name }}
      </div>
    </div>

    <!-- 모달창 -->
    <div v-if="showModal" class="modal-overlay" @click="showModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>새 버튼 추가</h3>
          <button class="modal-close" @click="showModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="button-management-section">
            <div class="add-button-section">
              <div class="section-title">새 버튼 추가</div>
              <div class="add-button-input">
                <select v-model="selectedListForButton">
                  <option value="">목록 선택</option>
                  <option value="C">C</option>
                  <option value="F">F</option>
                </select>
                <input 
                  v-model="newButtonName" 
                  type="text" 
                  placeholder="버튼 이름 (예: C5, F5...)" 
                  maxlength="10"
                >
                <button @click="addButton">버튼 추가</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainDashboard',
  props: {
    selectedItems: {
      type: Array,
      default: () => []
    },
    customButtonLists: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      showModal: false,
      newButtonName: '',
      selectedListForButton: ''
    }
  },
  computed: {
    otherCustomLists() {
      const otherLists = {}
      Object.keys(this.customButtonLists).forEach(listName => {
        if (listName !== 'C' && listName !== 'F') {
          otherLists[listName] = this.customButtonLists[listName]
        }
      })
      return otherLists
    }
  },
  emits: ['add-item', 'remove-item', 'add-button'],
  methods: {
    addToBottomPanel(itemName) {
      this.$emit('add-item', itemName)
    },
    removeFromBottomPanel(itemId) {
      this.$emit('remove-item', itemId)
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
      this.selectedListForButton = ''
      this.showModal = false
      alert(`버튼 "${buttonName}"이 목록 "${selectedList}"에 추가되었습니다.`)
    }
  }
}
</script>

<style scoped>
.page-content {
  position: relative;
}

.content-grid {
  position: absolute;
  width: 653px;
  height: 280px;
  left: 135px;
  top: 80px;
  max-width: calc(100vw - 600px);
}

.button-section {
  margin-bottom: 25px;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding-left: 5px;
  gap: 15px;
}

.section-title {
  color: #7B20E2;
  font-size: 16px;
  font-weight: 600;
}

.button-scroll-container {
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 10px;
}

.button-scroll-container::-webkit-scrollbar {
  height: 8px;
}

.button-scroll-container::-webkit-scrollbar-track {
  background: #1D1D1D;
  border-radius: 4px;
}

.button-scroll-container::-webkit-scrollbar-thumb {
  background: #7B20E2;
  border-radius: 4px;
}

.button-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #8B30F2;
}

.grid-row {
  display: flex;
  gap: 20px;
  min-width: max-content;
  padding-right: 20px;
}

.grid-item {
  width: 121px;
  height: 135px;
  background: #1D1D1D;
  box-shadow: 0px 4px 8px 2px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.grid-item:hover {
  background: #2A2A2A;
  transform: translateY(-2px);
  box-shadow: 0px 6px 12px 4px rgba(0, 0, 0, 0.3);
}

.grid-item:active {
  transform: translateY(0px);
}

.grid-item-label {
  position: absolute;
  top: 15px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  color: #FFFFFF;
}

.grid-item-image {
  width: 85px;
  height: 85px;
  background: #333;
  border-radius: 10px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 12px;
}

.grid-item-image::before {
  content: "Image";
}

.grid-item[data-item="/"] .grid-item-image::before {
  content: "";
}

.grid-item[data-item="/"] .grid-item-image {
  background: transparent;
  border: 2px solid #7B20E2;
  color: #7B20E2;
  font-size: 24px;
  font-weight: bold;
}

.add-button-btn-small {
  padding: 4px 8px;
  background: #7B20E2;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-button-btn-small:hover {
  background: #8B30F2;
  transform: scale(1.1);
}

.add-button-btn-small:active {
  transform: scale(0.95);
}

.bottom-panel {
  position: absolute;
  width: 653px;
  height: 125px;
  left: 135px;
  top: 523px;
  background: #1D1D1D;
  box-shadow: 0px 4px 8px 2px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  padding: 15px;
  overflow-y: auto;
  max-width: calc(100vw - 600px);
}

.bottom-item {
  display: inline-block;
  background: #333;
  color: #FFFFFF;
  padding: 8px 16px;
  margin: 5px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.bottom-item:hover {
  background: #444;
  border-color: #ff4444;
  transform: scale(1.05);
}

.bottom-item:active {
  transform: scale(0.95);
}

.bottom-panel:empty::before {
  content: "버튼을 클릭하여 항목을 추가하세요";
  color: #666;
  font-size: 14px;
  display: block;
  text-align: center;
  margin-top: 50px;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: #1D1D1D;
  border-radius: 20px;
  padding: 20px;
  width: 500px;
  max-width: 90vw;
  box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #333;
}

.modal-header h3 {
  color: #FFFFFF;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: #666;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: #333;
  color: #FFFFFF;
}

.modal-body {
  color: #FFFFFF;
}

.button-management-section {
  margin-bottom: 20px;
  padding: 15px;
  background: #333;
  border-radius: 10px;
  border: 2px solid #444;
}

.add-button-section {
  margin-bottom: 15px;
}

.section-title {
  color: #7B20E2;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.add-button-input {
  display: flex;
  gap: 10px;
  align-items: center;
}

.add-button-input input, .add-button-input select {
  flex: 1;
  padding: 8px 12px;
  background: #1D1D1D;
  border: 1px solid #555;
  border-radius: 6px;
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
}

.add-button-input input:focus, .add-button-input select:focus {
  outline: none;
  border-color: #7B20E2;
}

.add-button-input button {
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

.add-button-input button:hover {
  background: #8B30F2;
}

.add-button-input button:active {
  transform: translateY(1px);
}
</style> 