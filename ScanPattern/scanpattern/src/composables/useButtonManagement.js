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
  const buttonImages = reactive({}) // 버튼 이미지 저장용
  
  const defaultButtons = ['C1', 'C2', 'C3', 'C4', 'F1', 'F2', 'F3', 'F4']
  
  const addButton = (selectedList, buttonName) => {
    // 선택된 목록이 존재하지 않으면 빈 배열로 초기화
    if (!customButtonLists[selectedList]) {
      customButtonLists[selectedList] = []
    }
    
    // 버튼 추가
    customButtonLists[selectedList].push(buttonName)
    
    // allButtons에도 추가
    allButtons.value.push(buttonName)
    
    // buttonCodes는 나중에 saveCode로 설정할 수 있음
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
    
    // buttonCodes와 buttonImages에서도 제거
    deletableButtons.forEach(button => {
      delete buttonCodes[button]
      delete buttonImages[button]
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
  
  const saveButtonImage = (buttonName, imageFile) => {
    if (!buttonName) {
      throw new Error('먼저 버튼을 선택해주세요.')
    }
    
    if (!imageFile) {
      throw new Error('이미지 파일이 없습니다.')
    }
    
    // 이미지를 base64로 변환하여 저장
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        buttonImages[buttonName] = e.target.result
        resolve(e.target.result)
      }
      reader.onerror = () => reject(new Error('이미지 로드 실패'))
      reader.readAsDataURL(imageFile)
    })
  }
  

  
  const loadButtonData = () => {
    // 기본 버튼 코드들은 항상 gcodes에서 가져오기
    Object.assign(buttonCodes, {
      C1: gcodes.C1,
      C2: gcodes.C2,
      C3: gcodes.C3,
      C4: gcodes.C4,
      F1: gcodes.F1,
      F2: gcodes.F2,
      F3: gcodes.F3,
      F4: gcodes.F4
    })
    
    // localStorage에서 사용자 추가 코드 로드
    const savedButtonCodes = localStorage.getItem('buttonCodes')
    if (savedButtonCodes) {
      const savedCodes = JSON.parse(savedButtonCodes)
      // 기본 버튼이 아닌 사용자 추가 코드만 추가
      Object.keys(savedCodes).forEach(key => {
        if (!['C1', 'C2', 'C3', 'C4', 'F1', 'F2', 'F3', 'F4'].includes(key)) {
          buttonCodes[key] = savedCodes[key]
        }
      })
    }
    
    // localStorage에서 사용자 추가 버튼 목록 로드
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
    
    // localStorage에서 사용자 추가 이미지 로드
    const savedButtonImages = localStorage.getItem('buttonImages')
    if (savedButtonImages) {
      const savedImages = JSON.parse(savedButtonImages)
      Object.assign(buttonImages, savedImages)
    }
    
    // allButtons 배열 업데이트
    allButtons.value = ['C1', 'C2', 'C3', 'C4', 'F1', 'F2', 'F3', 'F4']
    Object.values(customButtonLists).forEach(buttons => {
      allButtons.value = allButtons.value.concat(buttons)
    })
  }
  
  const saveButtonData = () => {
    localStorage.setItem('buttonCodes', JSON.stringify(buttonCodes))
    localStorage.setItem('customButtonLists', JSON.stringify(customButtonLists))
    localStorage.setItem('buttonImages', JSON.stringify(buttonImages))
  }
  
  return {
    buttonCodes,
    selectedButton,
    customButtonLists,
    allButtons,
    buttonImages,
    defaultButtons,
    addButton,
    deleteButtons,
    selectButton,
    saveCode,
    saveButtonImage,
    loadButtonData,
    saveButtonData
  }
}
