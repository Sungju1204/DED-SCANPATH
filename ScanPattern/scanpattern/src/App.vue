<template>
    <div class="main-frame" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="glow-effect-1"></div>
      <div class="glow-effect-2"></div>
      
      <div class="title">HBNU_DED M250 Scan Pattern</div>
      <div v-show="currentPage === 1" class="slash-button" @click="addToBottomPanel('/')">/</div>
      
      <div class="hamburger-menu" @click="toggleSidebar" :class="{ 'hidden': sidebarOpen }">
        <div class="hamburger-line"></div>
        <div class="hamburger-line"></div>
        <div class="hamburger-line"></div>
      </div>

      <div :class="['sidebar', { 'sidebar-open': sidebarOpen }]">
        <div class="sidebar-header">
          <div class="logo">3DP</div>
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
      </div>

      <div class="content-wrapper">
        <!-- Page 1: Main Dashboard -->
        <MainDashboard 
          v-show="currentPage === 1"
          :selected-items="selectedItems"
          :custom-button-lists="customButtonLists"
          @add-item="addToBottomPanel"
          @remove-item="removeFromBottomPanel"
          @add-button="addButton"
        />

        <!-- Page 2: Code Assignment -->
        <CodeAssignment 
          v-show="currentPage === 2"
          :custom-button-lists="customButtonLists"
          :button-codes="buttonCodes"
          :selected-button="selectedButton"
          @add-button="addButton"
          @select-button="selectButton"
          @delete-buttons="deleteButtons"
        />

        <!-- Page 3: Cycle Management -->
        <CycleManagement 
          v-show="currentPage === 3"
          :saved-cycles="savedCycles"
          @show-cycle="showCycleContent"
          @delete-cycle="deleteCycle"
        />

        <!-- Page 4: 3D Printing Code Generator -->
        <PrintingCodeGenerator 
          v-show="currentPage === 4"
          :saved-cycles="savedCycles"
          :button-codes="buttonCodes"
          @generate-code="generate3DPrintingCode"
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
          @update:content="textAreaContent = $event"
          @save-cycle="saveCycle"
          @save-code="saveCode"
          @clear="clearTextArea"
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

export default {
  name: 'App',
  components: {
    MainDashboard,
    CodeAssignment,
    CycleManagement,
    PrintingCodeGenerator,
    RightPanel
  },
  data() {
    return {
      currentPage: 1,
      selectedItems: [],
      savedCycles: [],
      buttonCodes: {},
      selectedButton: null,
      customButtonLists: {},
      allButtons: ['C1', 'C2', 'C3', 'C4', 'F1', 'F2', 'F3', 'F4'],
      sidebarOpen: false,
      
      menuItems: [
        { text: '사이클 생성', icon: 'dashboard-icon' },
        { text: '코드 할당', icon: 'clients-icon' },
        { text: '사이클 관리', icon: 'messages-icon' },
        { text: '코드 파일 생성', icon: 'schedule-icon' },
        { text: 'PAGE 5', icon: 'page5-icon' }
      ],
      
      // Text area data
      textAreaContent: '',
      rightPanelTitle: 'NC Code',
      textAreaPlaceholder: '여기에 NC 코드를 작성하세요...'
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    switchPage(pageNumber) {
      this.currentPage = pageNumber
      this.updateTextAreaForPage(pageNumber)
    },
    
    addToBottomPanel(itemName) {
      const timestamp = Date.now()
      const uniqueId = `${itemName}_${timestamp}`
      
      this.selectedItems.push({ id: uniqueId, name: itemName })
      this.updateNCCode()
    },
    
    removeFromBottomPanel(itemId) {
      const index = this.selectedItems.findIndex(item => item.id === itemId)
      if (index > -1) {
        this.selectedItems.splice(index, 1)
        this.updateNCCode()
      }
    },
    
    updateNCCode() {
      let ncCode = ''
      this.selectedItems.forEach(item => {
        if (this.buttonCodes[item.name]) {
          if (ncCode !== '') {
            ncCode += '\n'
          }
          ncCode += this.buttonCodes[item.name]
        }
      })
      this.textAreaContent = ncCode
    },
    
    updateTextAreaForPage(pageNumber) {
      if (pageNumber === 1) {
        this.textAreaPlaceholder = '여기에 NC 코드를 작성하세요...'
        this.textAreaContent = ''
      } else if (pageNumber === 2) {
        this.textAreaPlaceholder = '선택한 버튼에 할당할 NC 코드를 입력하세요...'
        this.textAreaContent = ''
      } else if (pageNumber === 3) {
        this.textAreaPlaceholder = '사이클을 선택하면 코드가 표시됩니다...'
        this.textAreaContent = ''
      } else {
        this.textAreaPlaceholder = 'NC Code'
        this.textAreaContent = ''
      }
    },
    
    selectButton(button) {
      this.selectedButton = button
      this.textAreaContent = this.buttonCodes[button] || ''
    },
    

    
    addButton({ selectedList, buttonName }) {
      if (selectedList === 'C' || selectedList === 'F') {
        if (!this.customButtonLists[selectedList]) {
          this.customButtonLists[selectedList] = []
        }
        this.customButtonLists[selectedList].push(buttonName)
      } else {
        this.customButtonLists[selectedList].push(buttonName)
      }
      
      this.allButtons.push(buttonName)
      this.saveData()
    },
    
    saveCycle() {
      const text = this.textAreaContent.trim()
      
      if (!text) {
        alert('저장할 NC 코드가 없습니다.')
        return
      }
      
      const cycleName = prompt('사이클 이름을 입력하세요:', `Cycle_${this.savedCycles.length + 1}`)
      if (!cycleName || cycleName.trim() === '') {
        alert('사이클 이름을 입력해주세요.')
        return
      }
      
      const cycle = {
        id: Date.now(),
        name: cycleName.trim(),
        content: text,
        date: new Date().toLocaleString(),
        selectedItems: [...this.selectedItems]
      }
      
      this.savedCycles.push(cycle)
      this.saveData()
      alert('사이클이 저장되었습니다.')
    },
    
    saveCode() {
      const text = this.textAreaContent.trim()
      
      if (!text) {
        alert('저장할 코드가 없습니다.')
        return
      }
      
      if (!this.selectedButton) {
        alert('먼저 버튼을 선택해주세요.')
        return
      }
      
      this.buttonCodes[this.selectedButton] = text
      this.saveData()
      alert('코드가 저장되었습니다.')
    },
    
    clearTextArea() {
      this.textAreaContent = ''
    },
    
    showCycleContent(cycle) {
      this.textAreaContent = cycle.content
      this.rightPanelTitle = `사이클: ${cycle.name}`
      
      setTimeout(() => {
        this.rightPanelTitle = 'NC Code'
      }, 3000)
    },
    
    deleteCycle(index) {
      this.savedCycles.splice(index, 1)
      this.saveData()
    },
    
    deleteButtons({ listType, buttons }) {
      // 기본 버튼들 (C1-C4, F1-F4)은 삭제 불가
      const defaultButtons = ['C1', 'C2', 'C3', 'C4', 'F1', 'F2', 'F3', 'F4']
      const deletableButtons = buttons.filter(button => !defaultButtons.includes(button))
      
      if (deletableButtons.length === 0) {
        alert('기본 버튼(C1-C4, F1-F4)은 삭제할 수 없습니다.')
        return
      }
      
      // customButtonLists에서 버튼 제거
      if (this.customButtonLists[listType]) {
        this.customButtonLists[listType] = this.customButtonLists[listType].filter(
          button => !deletableButtons.includes(button)
        )
      }
      
      // allButtons에서도 제거
      deletableButtons.forEach(button => {
        const index = this.allButtons.indexOf(button)
        if (index > -1) {
          this.allButtons.splice(index, 1)
        }
      })
      
      // buttonCodes에서도 제거
      deletableButtons.forEach(button => {
        delete this.buttonCodes[button]
      })
      
      // 선택된 버튼이 삭제된 버튼 중 하나라면 선택 해제
      if (deletableButtons.includes(this.selectedButton)) {
        this.selectedButton = null
        this.textAreaContent = ''
      }
      
      this.saveData()
    },
    
    generate3DPrintingCode({ layerThickness, dwellTime, target, selectedFeeder, selectedCycle, scanSpeed }) {
      const generatedCode = this.generateCodeContent(layerThickness, dwellTime, target, selectedFeeder, selectedCycle, scanSpeed)
      this.textAreaContent = generatedCode
      alert('3D 프린팅 코드가 생성되었습니다.')
    },
    
    generateCodeContent(layerThickness, dwellTime, target, feeder, cycle, scanSpeed) {
      if (!cycle.selectedItems || cycle.selectedItems.length === 0) {
        return cycle.content
      }
      
      const items = cycle.selectedItems.map(item => item.name)
      const groups = []
      let currentGroup = []
      
      for (let i = 0; i < items.length; i++) {
        if (items[i] === '/') {
          if (currentGroup.length > 0) {
            groups.push(currentGroup)
            currentGroup = []
          }
        } else {
          currentGroup.push(items[i])
        }
      }
      if (currentGroup.length > 0) {
        groups.push(currentGroup)
      }
      
      if (groups.length <= 1) {
        return cycle.content
      }
      
      let newCode = ''
      newCode += 'G90\n'
      newCode += 'M50\n'
      newCode += `F${scanSpeed}\n`
      newCode += 'G54\n'
      newCode += 'M40\n'
      newCode += 'M60\n'
      newCode += `G4 P${dwellTime}\n`
      newCode += '\n'
      
      const thickness = parseFloat(layerThickness)
      const targetZ = parseFloat(target)
      let z = 0
      
      while (z < targetZ) {
        groups.forEach((group, groupIndex) => {
          const zOffset = (z + groupIndex * thickness).toFixed(3)
          group.forEach((buttonName, buttonIndex) => {
            if (this.buttonCodes[buttonName]) {
              let buttonCode = this.buttonCodes[buttonName]
              const zPattern = /Z([0-9]*\.?[0-9]+)/g
              buttonCode = buttonCode.replace(zPattern, function(match, zValue) {
                const newZ = (parseFloat(zValue) + parseFloat(zOffset)).toFixed(3)
                return `Z${newZ}`
              })
              
              const g4Pattern = /G4 P[0-9]+/g
              buttonCode = buttonCode.replace(g4Pattern, `G4 P${dwellTime}`)
              
              if (buttonIndex === 0 && parseFloat(zOffset) !== 0) {
                buttonCode = buttonCode.replace(
                  /(G0 X[0-9.-]+ Y[0-9.-]+ Z[0-9.-]+)\n(G4 P[0-9]+)/g,
                  `$1\nM51\nM70\nM41\nG4 P${dwellTime}\nM50\nM40\nM60\n$2`
                )
              }
              
              newCode += buttonCode + '\n'
            } else {
              newCode += `; ${buttonName} - No code assigned\n`
            }
          })
        })
        z += thickness * groups.length
      }
      
      let codeBody = newCode
      if (feeder === 2) {
        codeBody = codeBody.replace(/M60/g, 'M61').replace(/M70/g, 'M71')
      } else if (feeder === 3) {
        codeBody = codeBody.replace(/M60/g, 'M62').replace(/M70/g, 'M72')
      }
      
      codeBody += '\n'
      codeBody += 'M70\n'
      codeBody += 'M70\n'
      codeBody += 'M71\n'
      codeBody += 'G0 X0.0 Y0.0\n'
      codeBody += `G4 P${dwellTime}\n`
      codeBody += 'M90\n'
      codeBody += 'G53\n'
      codeBody += 'M30\n'
      
      return codeBody
    },
    
    loadData() {
      const savedCycles = localStorage.getItem('savedCycles')
      if (savedCycles) {
        this.savedCycles = JSON.parse(savedCycles)
      }
      
      const buttonCodes = localStorage.getItem('buttonCodes')
      if (buttonCodes) {
        this.buttonCodes = JSON.parse(buttonCodes)
      }
      
      const customButtonLists = localStorage.getItem('customButtonLists')
      if (customButtonLists) {
        this.customButtonLists = JSON.parse(customButtonLists)
        // 테스트1 관련 데이터 제거
        if (this.customButtonLists['테스트1']) {
          delete this.customButtonLists['테스트1']
        }
        this.updateAllButtonsArray()
      }
    },
    
    saveData() {
      localStorage.setItem('savedCycles', JSON.stringify(this.savedCycles))
      localStorage.setItem('buttonCodes', JSON.stringify(this.buttonCodes))
      localStorage.setItem('customButtonLists', JSON.stringify(this.customButtonLists))
    },
    
    updateAllButtonsArray() {
      this.allButtons = ['C1', 'C2', 'C3', 'C4', 'F1', 'F2', 'F3', 'F4']
      Object.values(this.customButtonLists).forEach(buttons => {
        this.allButtons = this.allButtons.concat(buttons)
      })
    },
    
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
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
  font-family: 'Inter', sans-serif;
  background: #000000;
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
  background: #262525;
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
  font-family: 'Inter';
  font-style: normal;
  font-weight: 900;
  font-size: 24px;
  line-height: 29px;
  color: #FFFFFF;
  transition: left 0.3s ease;
}

.main-frame.sidebar-open .title {
  left: 517px;
}

.slash-button {
  position: absolute;
  left: 758px;
  top: 523px;
  width: 30px;
  height: 30px;
  background: #7B20E2;
  border: 2px solid #7B20E2;
  border-radius: 6px;
  color: #FFFFFF;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: left 0.3s ease;
  z-index: 1002;
}

.main-frame.sidebar-open .slash-button {
  left: 1008px;
}

.slash-button:hover {
  background: #8B30F2;
  border-color: #8B30F2;
  transform: scale(1.1);
}

.slash-button:active {
  transform: scale(0.95);
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
  background: linear-gradient(180deg, #3B4CB8 0%, #2D3E8F 100%);
  transition: left 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar-open {
  left: 0;
}

.sidebar-header {
  padding: 30px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  color: #4ECDC4;
  font-size: 24px;
  font-weight: bold;
  font-family: 'Inter', sans-serif;
}

.logo-suffix {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  vertical-align: super;
}

.sidebar-menu {
  flex: 1;
  padding: 20px 0;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 2px 10px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sidebar-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #FFFFFF;
}

.sidebar-item.active {
  background: #FFFFFF;
  color: #2D3E8F;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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

.page5-icon {
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>');
}

.logout-icon {
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>');
}

.sidebar-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
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

.sidebar-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #FFFFFF;
}


.sidebar-text {
  font-family: 'Inter', sans-serif;
}

.content-wrapper {
  flex: 1;
  position: relative;
  transform: translateX(0);
  transition: transform 0.3s ease;
}content-wrapper {
  flex: 1;
  position: relative;
  transform: translateX(0);
  transition: transform 0.3s ease;
}


.main-frame.sidebar-open .content-wrapper {
  transform: translateX(250px);
}
</style>
























