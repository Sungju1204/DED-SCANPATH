import { reactive, ref } from 'vue'
import gcodes from '../constants/gcodes.js'

export function useButtonManagement() {
  const buttonCodes = reactive({
    C1: gcodes.C1,
    C2: gcodes.C2,
    C3: gcodes.C3,
    C4: gcodes.C4,
    F1: gcodes.F1,
    F2: gcodes.F2,
    F3: gcodes.F3,
    F4: gcodes.F4,
  })
  
  const selectedButton = ref(null)
  const customButtonLists = reactive({})
  const allButtons = ref(['C1', 'C2', 'C3', 'C4', 'F1', 'F2', 'F3', 'F4'])
  
  const defaultButtons = ['C1', 'C2', 'C3', 'C4', 'F1', 'F2', 'F3', 'F4']
  
  const addButton = (selectedList, buttonName) => {
    if (selectedList === 'C' || selectedList === 'F') {
      if (!customButtonLists[selectedList]) {
        customButtonLists[selectedList] = []
      }
      customButtonLists[selectedList].push(buttonName)
    } else {
      customButtonLists[selectedList].push(buttonName)
    }
    
    allButtons.value.push(buttonName)
  }
  
  const deleteButtons = (listType, buttons) => {
    // 기본 버튼들은 삭제 불가
    const deletableButtons = buttons.filter(button => !defaultButtons.includes(button))
    
    if (deletableButtons.length === 0) {
      throw new Error('기본 버튼(C1-C4, F1-F4)은 삭제할 수 없습니다.')
    }
    
    // customButtonLists에서 버튼 제거
    if (customButtonLists[listType]) {
      customButtonLists[listType] = customButtonLists[listType].filter(
        button => !deletableButtons.includes(button)
      )
    }
    
    // allButtons에서도 제거
    deletableButtons.forEach(button => {
      const index = allButtons.value.indexOf(button)
      if (index > -1) {
        allButtons.value.splice(index, 1)
      }
    })
    
    // buttonCodes에서도 제거
    deletableButtons.forEach(button => {
      delete buttonCodes[button]
    })
    
    // 선택된 버튼이 삭제된 버튼 중 하나라면 선택 해제
    if (deletableButtons.includes(selectedButton.value)) {
      selectedButton.value = null
    }
    
    return deletableButtons
  }
  
  const selectButton = (button, updateTextArea) => {
    selectedButton.value = button
    updateTextArea(buttonCodes[button] || '')
  }
  
  const saveCode = (buttonName, content) => {
    if (!content.trim()) {
      throw new Error('저장할 코드가 없습니다.')
    }
    
    if (!buttonName) {
      throw new Error('먼저 버튼을 선택해주세요.')
    }
    
    buttonCodes[buttonName] = content
  }
  

  
  const loadButtonData = () => {
    const savedButtonCodes = localStorage.getItem('buttonCodes')
    if (savedButtonCodes) {
      const savedCodes = JSON.parse(savedButtonCodes)
      // 기본 버튼 코드들은 항상 gcodes에서 가져오고, 사용자 추가 코드만 localStorage에서 복원
      Object.assign(buttonCodes, {
        C1: gcodes.C1,
        C2: gcodes.C2,
        C3: gcodes.C3,
        C4: gcodes.C4,
        F1: gcodes.F1,
        F2: gcodes.F2,
        F3: gcodes.F3,
        F4: gcodes.F4,
        ...savedCodes // 사용자 추가 코드들
      })
    }
    
    const savedCustomLists = localStorage.getItem('customButtonLists')
    if (savedCustomLists) {
      const customLists = JSON.parse(savedCustomLists)
      Object.assign(customButtonLists, customLists)
      
      // 테스트1 관련 데이터 제거
      if (customButtonLists['테스트1']) {
        delete customButtonLists['테스트1']
      }
      // 사용자가 추가한 C2 제거
      if (customButtonLists['C'] && customButtonLists['C'].includes('C2')) {
        customButtonLists['C'] = customButtonLists['C'].filter(button => button !== 'C2')
      }
      
    }
  }
  
  const saveButtonData = () => {
    localStorage.setItem('buttonCodes', JSON.stringify(buttonCodes))
    localStorage.setItem('customButtonLists', JSON.stringify(customButtonLists))
  }
  
  return {
    buttonCodes,
    selectedButton,
    customButtonLists,
    allButtons,
    defaultButtons,
    addButton,
    deleteButtons,
    selectButton,
    saveCode,
    loadButtonData,
    saveButtonData
  }
}
