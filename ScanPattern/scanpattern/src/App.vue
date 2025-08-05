<template>
    <div class="main-frame">
      <div class="glow-effect-1"></div>
      <div class="glow-effect-2"></div>
      
      <div class="title">HBNU_DED M250 Scan Pattern</div>
      <div class="slash-button" @click="addToBottomPanel('/')">/</div>
      
      <div class="hamburger-menu" @click="toggleSidebar">
        <div class="hamburger-line"></div>
        <div class="hamburger-line"></div>
        <div class="hamburger-line"></div>
      </div>

      <div :class="['sidebar', { 'sidebar-open': sidebarOpen }]">
        <div 
          v-for="page in 5" 
          :key="page"
          :class="['sidebar-item', { active: currentPage === page }]"
          @click="switchPage(page)"
        >
          <div :class="['sidebar-icon', { active: currentPage === page }]"></div>
        </div>
      </div>

      <!-- Page 1: Main Dashboard -->
      <MainDashboard 
        v-show="currentPage === 1"
        :selected-items="selectedItems"
        @add-item="addToBottomPanel"
        @remove-item="removeFromBottomPanel"
      />

      <!-- Page 2: Code Assignment -->
      <CodeAssignment 
        v-show="currentPage === 2"
        :custom-button-lists="customButtonLists"
        :button-codes="buttonCodes"
        :selected-button="selectedButton"
        @add-list="addList"
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
          <div style="color: #FFFFFF; text-align: center; margin-top: 100px;">준비 중...</div>
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
    
    addList(listName) {
      this.customButtonLists[listName] = []
      this.saveData()
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
  padding: 0; /* 누락된 부분 보완 */
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
  left: 97px;
  top: 24px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 900;
  font-size: 24px;
  line-height: 29px;
  color: #FFFFFF;
}

.slash-button {
  position: absolute;
  left: 570px;
  top: 24px;
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
  transition: all 0.3s ease;
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
  position: absolute;
  width: 21px;
  height: 14px;
  left: 38px;
  top: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hamburger-menu:hover {
  opacity: 0.8;
}

.hamburger-line {
  position: absolute;
  background: #FFFFFF;
  height: 1.5px;
}

.hamburger-line:nth-child(1) {
  width: 21px;
  top: 0;
}

.hamburger-line:nth-child(2) {
  width: 15px;
  top: 7px;
}

.hamburger-line:nth-child(3) {
  width: 10px;
  top: 14px;
}

.sidebar {
  position: absolute;
  width: 56.14px;
  height: 393.78px;
  left: -56px;
  top: 100px;
  transition: left 0.3s ease;
}

.sidebar.sidebar-open {
  left: 44px;
}

.sidebar-item {
  position: absolute;
  width: 56.14px;
  height: 56.14px;
  background: rgba(65, 105, 225, 0.08);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sidebar-item:hover {
  background: rgba(123, 32, 226, 0.15);
  transform: scale(1.05);
}

.sidebar-item.active {
  background: rgba(123, 32, 226, 0.3);
  border: 2px solid #7B20E2;
}

.sidebar-item:nth-child(1) { top: 0; }
.sidebar-item:nth-child(2) { top: 88px; }
.sidebar-item:nth-child(3) { top: 176px; }
.sidebar-item:nth-child(4) { top: 264px; }
.sidebar-item:nth-child(5) { top: 352px; }

.sidebar-icon {
  width: 28px;
  height: 28px;
  border: 2px solid #A7A8AB;
  position: relative;
}

.sidebar-icon.active {
  border-color: #7B20E2;
}

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
</style>
