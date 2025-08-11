import { ref } from 'vue'

export function useTextArea() {
  const textAreaContent = ref('')
  const rightPanelTitle = ref('NC Code')
  const textAreaPlaceholder = ref('여기에 NC 코드를 작성하세요...')
  
  const updateContent = (content) => {
    textAreaContent.value = content
  }
  
  const updateTitle = (title) => {
    rightPanelTitle.value = title
  }
  
  const clearContent = () => {
    textAreaContent.value = ''
  }
  
  const appendContent = (content) => {
    if (textAreaContent.value && textAreaContent.value.trim() !== '') {
      textAreaContent.value += '\n\n' + content
    } else {
      textAreaContent.value = content
    }
  }
  
  const updateTextAreaForPage = (pageNumber) => {
    switch (pageNumber) {
      case 1:
        textAreaPlaceholder.value = '여기에 NC 코드를 작성하세요...'
        textAreaContent.value = ''
        break
      case 2:
        textAreaPlaceholder.value = '선택한 버튼에 할당할 NC 코드를 입력하세요...'
        textAreaContent.value = ''
        break
      case 3:
        textAreaPlaceholder.value = '사이클을 선택하면 코드가 표시됩니다...'
        textAreaContent.value = ''
        break
      default:
        textAreaPlaceholder.value = 'NC Code'
        textAreaContent.value = ''
    }
  }
  
  const showButtonCode = (buttonName, buttonCodes) => {
    if (buttonCodes[buttonName]) {
      // 기존 내용을 지우고 새로운 코드로 교체
      textAreaContent.value = buttonCodes[buttonName]
    } else {
      textAreaContent.value = `// ${buttonName} 버튼에 할당된 코드가 없습니다.`
    }
  }
  
  return {
    textAreaContent,
    rightPanelTitle,
    textAreaPlaceholder,
    updateContent,
    updateTitle,
    clearContent,
    appendContent,
    updateTextAreaForPage,
    showButtonCode
  }
}
