<template>
  <div class="main-frame" :class="{ 'sidebar-open': sidebarOpen }">
    <div class="glow-effect-1"></div>
    <div class="glow-effect-2"></div>
    
    <div class="title">HBNU_DED M250 Scan Pattern</div>
    <div v-show="currentPage === 1 && selectedItems.length > 0" class="slash-button" @click="addToBottomPanel('/')">/</div>
    
    <div class="hamburger-menu" @click="toggleSidebar" :class="{ 'hidden': sidebarOpen }">
      <div class="hamburger-line"></div>
      <div class="hamburger-line"></div>
      <div class="hamburger-line"></div>
    </div>

    <div :class="['sidebar', { 'sidebar-open': sidebarOpen }]">
      <div class="sidebar-header">
        <div class="logo-section">
          <div class="logo">3DP</div>
          <div class="logo-subtitle">Scan Pattern</div>
        </div>
        <button class="sidebar-close" @click="toggleSidebar">×</button>
      </div>
      
      <div class="sidebar-menu">
        <div
          v-for="(item, index) in menuItems"
          :key="index + 1"
          :class="['sidebar-item', { active: currentPage === index + 1 }]"
          @click="switchPage(index + 1)"
        >
          <div :class="['sidebar-icon', item.icon]"></div>
          <span class="sidebar-text">{{ item.text }}</span>
        </div>
      </div>

      <div class="sidebar-footer">
        <div class="footer-info">
          <div class="version">v1.0.0</div>
          <div class="copyright">© 2025 HBNU</div>
        </div>
      </div>
    </div>

    <div class="content-wrapper">
      <!-- Page 1: Main Dashboard -->
      <MainDashboard
        v-show="currentPage === 1"
        :selected-items="selectedItems"
        :custom-button-lists="customButtonLists"
        @add-item="addToBottomPanel"
        @remove-item="removeFromBottomPanel"
        @add-button="handleAddButton"
        @clear-all-items="clearAllItems"
        @delete-buttons="handleDeleteButtons"
        @show-button-code="handleShowButtonCode"
      />

      <!-- Page 2: Code Assignment -->
      <CodeAssignment 
        v-show="currentPage === 2"
        :custom-button-lists="customButtonLists"
        :button-codes="buttonCodes"
        :selected-button="selectedButton"
        @add-button="handleAddButton"
        @select-button="handleSelectButton"
        @delete-buttons="handleDeleteButtons"
        @show-button-code="handleShowButtonCode"
      />

      <!-- Page 3: Cycle Management -->
      <CycleManagement 
        v-show="currentPage === 3"
        :saved-cycles="savedCycles"
        @show-cycle="handleShowCycle"
        @delete-cycle="handleDeleteCycle"
      />

      <!-- Page 4: 3D Printing Code Generator -->
      <PrintingCodeGenerator 
        v-show="currentPage === 4"
        :saved-cycles="savedCycles"
        :button-codes="buttonCodes"
        @generate-code="handleGenerateCode"
      />

      <!-- Page 5: Placeholder -->
      <div v-show="currentPage === 5" class="page-content">
        <div class="code-assignment-container">
          <div class="code-assignment-title">페이지 5</div>
          <div style="color: #2D3E8F; text-align: center; margin-top: 100px;">준비 중...</div>
        </div>
      </div>

      <RightPanel 
        :content="textAreaContent"
        :title="rightPanelTitle"
        :placeholder="textAreaPlaceholder"
        :show-save-cycle="currentPage === 1"
        :show-save-code="currentPage === 2"
        :readonly="currentPage === 1"
        @update:content="updateContent"
        @save-cycle="handleSaveCycle"
        @save-code="handleSaveCode"
        @clear="clearContent"
      />
    </div>
  </div>
</template>

<script>
import MainDashboard from './components/MainDashboard.vue'
import CodeAssignment from './components/CodeAssignment.vue'
import CycleManagement from './components/CycleManagement.vue'
import PrintingCodeGenerator from './components/PrintingCodeGenerator.vue'
import RightPanel from './components/RightPanel.vue'

// Composables
import { useAppState } from './composables/useAppState'
import { useSidebar } from './composables/useSidebar'
import { useTextArea } from './composables/useTextArea'
import { useCycleManagement } from './composables/useCycleManagement'
import { useButtonManagement } from './composables/useButtonManagement'
import { useCodeGeneration } from './composables/useCodeGeneration'

export default {
  name: 'App',
  components: {
    MainDashboard,
    CodeAssignment,
    CycleManagement,
    PrintingCodeGenerator,
    RightPanel
  },
  setup() {
    // Composables 초기화
    const {
      currentPage,
      selectedItems,
      savedCycles,
      buttonCodes,
      selectedButton,
      customButtonLists,
      allButtons,
      menuItems
    } = useAppState()
    
    const { sidebarOpen, toggleSidebar } = useSidebar()
    
    const {
      textAreaContent,
      rightPanelTitle,
      textAreaPlaceholder,
      updateContent,
      updateTitle,
      clearContent,
      updateTextAreaForPage,
      showButtonCode
    } = useTextArea()
    
    const {
      saveCycle: saveCycleToStorage,
      deleteCycle,
      showCycleContent,
      loadCycles,
      saveCyclesToStorage
    } = useCycleManagement()
    
    const {
      addButton,
      deleteButtons,
      selectButton,
      saveCode,
      loadButtonData,
      saveButtonData
    } = useButtonManagement()
    
    const { generate3DPrintingCode } = useCodeGeneration()
    
    // 데이터 로드
    const loadData = () => {
      loadCycles()
      loadButtonData()
    }
    
    // 데이터 저장
    const saveData = () => {
      saveCyclesToStorage()
      saveButtonData()
    }
    
    // 페이지 전환
    const switchPage = (pageNumber) => {
      currentPage.value = pageNumber
      updateTextAreaForPage(pageNumber)
    }
    
    // 하단 패널에 아이템 추가
    const addToBottomPanel = (itemName) => {
      const timestamp = Date.now()
      const uniqueId = `${itemName}_${timestamp}`
      selectedItems.value.push({ id: uniqueId, name: itemName })
    }
    
    // 하단 패널에서 아이템 제거
    const removeFromBottomPanel = (itemId) => {
      const index = selectedItems.value.findIndex(item => item.id === itemId)
      if (index > -1) {
        selectedItems.value.splice(index, 1)
        updateNCCode()
      }
    }
    
    // NC 코드 업데이트
    const updateNCCode = () => {
      let ncCode = ''
      selectedItems.value.forEach(item => {
        if (buttonCodes[item.name]) {
          if (ncCode !== '') {
            ncCode += '\n'
          }
          ncCode += buttonCodes[item.name]
        }
      })
      updateContent(ncCode)
    }
    
    // 모든 아이템 삭제
    const clearAllItems = () => {
      selectedItems.value = []
      clearContent()
    }
    
    // 버튼 추가 처리
    const handleAddButton = ({ selectedList, buttonName }) => {
      try {
        addButton(selectedList, buttonName)
        saveData()
      } catch (error) {
        alert(error.message)
      }
    }
    
    // 버튼 삭제 처리
    const handleDeleteButtons = ({ listType, buttons }) => {
      try {
        deleteButtons(listType, buttons)
        saveData()
        alert('선택된 버튼들이 삭제되었습니다.')
      } catch (error) {
        alert(error.message)
      }
    }
    
    // 버튼 선택 처리
    const handleSelectButton = (button) => {
      selectButton(button, updateContent)
    }
    
    // 버튼 코드 표시 처리
    const handleShowButtonCode = (buttonName) => {
      showButtonCode(buttonName, buttonCodes)
    }
    
    // 사이클 저장 처리
    const handleSaveCycle = () => {
      try {
        const cycleName = prompt('사이클 이름을 입력하세요:', `Cycle_${savedCycles.value.length + 1}`)
        if (!cycleName || cycleName.trim() === '') {
          alert('사이클 이름을 입력해주세요.')
          return
        }
        
        saveCycleToStorage(cycleName, textAreaContent.value, selectedItems.value)
        saveData()
        alert('사이클이 저장되었습니다.')
      } catch (error) {
        alert(error.message)
      }
    }
    
    // 코드 저장 처리
    const handleSaveCode = () => {
      try {
        saveCode(selectedButton.value, textAreaContent.value)
        saveData()
        alert('코드가 저장되었습니다.')
      } catch (error) {
        alert(error.message)
      }
    }
    
    // 사이클 표시 처리
    const handleShowCycle = (cycle) => {
      showCycleContent(cycle, updateContent, updateTitle)
    }
    
    // 사이클 삭제 처리
    const handleDeleteCycle = (index) => {
      deleteCycle(index)
      saveData()
    }
    
    // 3D 프린팅 코드 생성 처리
    const handleGenerateCode = (params) => {
      try {
        generate3DPrintingCode(params, buttonCodes, updateContent)
        alert(`3D 프린팅 코드가 생성되었습니다. (선택된 피더: ${params.selectedFeeder})`)
      } catch (error) {
        alert(error.message)
      }
    }
    
    // 컴포넌트 마운트 시 데이터 로드
    loadData()
    
    return {
      // 상태
      currentPage,
      selectedItems,
      savedCycles,
      buttonCodes,
      selectedButton,
      customButtonLists,
      allButtons,
      sidebarOpen,
      menuItems,
      
      // 텍스트 영역
      textAreaContent,
      rightPanelTitle,
      textAreaPlaceholder,
      
      // 메서드
      toggleSidebar,
      switchPage,
      addToBottomPanel,
      removeFromBottomPanel,
      clearAllItems,
      updateContent,
      clearContent,
      handleAddButton,
      handleDeleteButtons,
      handleSelectButton,
      handleShowButtonCode,
      handleSaveCycle,
      handleSaveCode,
      handleShowCycle,
      handleDeleteCycle,
      handleGenerateCode
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #F8F9FA;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  padding: 0;
}

.main-frame {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  background: #F8F9FA;
  overflow: hidden;
  transform-origin: center center;
  transform: scale(var(--scale-factor, 1));
  transition: none;
}

.main-frame.sidebar-open {
  transform: scale(var(--scale-factor, 1));
}

.glow-effect-1 {
  position: absolute;
  width: 118px;
  height: 102px;
  left: -21px;
  top: -51px;
  background: rgba(27, 175, 169, 0.8);
  filter: blur(80px);
  border-radius: 50%;
}

.glow-effect-2 {
  position: absolute;
  width: 132px;
  height: 91px;
  left: -21px;
  top: 597px;
  background: rgba(175, 98, 27, 0.2);
  filter: blur(80px);
  border-radius: 50%;
}

.title {
  position: absolute;
  width: 461px;
  height: 27px;
  left: 267px;
  top: 24px;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 29px;
  color: #1A1A1A;
  letter-spacing: -0.02em;
  transition: left 0.3s ease;
  z-index: 100;
}

.main-frame.sidebar-open .title {
  left: 517px;
}

.slash-button {
  position: absolute;
  left: 255px;
  top: 543px;
  width: 36px;
  height: 36px;
  background: #007BFF;
  border: none;
  border-radius: 8px;
  color: #FFFFFF;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 1002;
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.2);
}

.main-frame.sidebar-open .slash-button {
  left: 505px;
}

.slash-button:hover {
  background: #0056B3;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

.slash-button:active {
  transform: translateY(0);
}

.hamburger-menu {
  position: fixed;
  top: 20px;
  left: 20px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 5px 0;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.hamburger-menu.hidden {
  opacity: 0;
  visibility: hidden;
}

.hamburger-line {
  width: 100%;
  height: 3px;
  background: #2D3E8F;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.sidebar {
  position: fixed;
  left: -250px;
  top: 0;
  width: 250px;
  height: 100vh;
  background: #FFFFFF;
  border-right: 1px solid #E9ECEF;
  transition: left 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 16px rgba(0, 0, 0, 0.08);
}

.sidebar-open {
  left: 0;
}

.sidebar-header {
  padding: 16px 20px;
  border-bottom: 1px solid #E9ECEF;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #F8F9FA;
}

.logo-section {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.logo {
  color: #007BFF;
  font-size: 20px;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.01em;
}

.logo-subtitle {
  color: #6C757D;
  font-size: 12px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.02em;
}

.sidebar-close {
  background: none;
  border: none;
  color: #6C757D;
  font-size: 20px;
  cursor: pointer;
  padding: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.sidebar-close:hover {
  background: #F8F9FA;
  color: #495057;
}

.sidebar-menu {
  flex: 1;
  padding: 8px 0;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 1px 8px 1px 0;
  border-radius: 0 8px 8px 0;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.sidebar-item:hover {
  background: #F8F9FA;
  color: #007BFF;
  transform: translateX(4px);
}

.sidebar-item.active {
  background: #E3F2FD;
  color: #007BFF;
  border-left: 3px solid #007BFF;
  font-weight: 600;
}

.sidebar-icon {
  width: 20px;
  height: 20px;
  margin-right: 15px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.7;
}

.sidebar-item.active .sidebar-icon {
  opacity: 1;
}

.dashboard-icon {
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>');
}

.clients-icon {
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/></svg>');
}

.messages-icon {
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v-2m0 0V5a2 2 0 012-2h6l2 2h6a2 2 0 012 2v1M3 7l9 6 9-6"/></svg>');
}

.schedule-icon {
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>');
}

.sidebar-text {
  font-family: 'Inter', sans-serif;
}

.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid #E9ECEF;
  background: #F8F9FA;
}

.footer-info {
  text-align: center;
}

.version {
  color: #007BFF;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
}

.copyright {
  color: #6C757D;
  font-size: 10px;
  font-weight: 400;
}

.content-wrapper {
  flex: 1;
  position: relative;
  transform: translateX(0);
  transition: transform 0.3s ease;
}

.main-frame.sidebar-open .content-wrapper {
  transform: translateX(250px);
}
</style>



