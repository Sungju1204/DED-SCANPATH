import { ref } from 'vue'

export function useTextArea() {
  const textAreaContent = ref('')
  const rightPanelTitle = ref('NC Code')
  const textAreaPlaceholder = ref('여기에 NC 코드를 작성하세요...')
  
  // localStorage에서 textAreaContent 복원
  const loadTextAreaContent = () => {
    try {
      const savedContent = localStorage.getItem('textAreaContent')
      if (savedContent) {
        textAreaContent.value = savedContent
      }
    } catch (error) {
      console.error('텍스트 영역 내용 로드 중 오류:', error)
    }
  }
  
  // 초기 로드
  loadTextAreaContent()
  
  const updateContent = (content) => {
    console.log('useTextArea updateContent 실행됨, content:', content)
    textAreaContent.value = content
    // localStorage에 자동 저장
    try {
      localStorage.setItem('textAreaContent', content)
      console.log('localStorage에 textAreaContent 저장됨')
    } catch (error) {
      console.error('텍스트 영역 내용 저장 중 오류:', error)
    }
  }
  
  const updateTitle = (title) => {
    rightPanelTitle.value = title
  }
  
  const clearContent = () => {
    console.log('useTextArea clearContent 실행됨')
    textAreaContent.value = ''
    // localStorage에서도 제거
    try {
      localStorage.removeItem('textAreaContent')
      console.log('localStorage에서 textAreaContent 제거됨')
    } catch (error) {
      console.error('텍스트 영역 내용 제거 중 오류:', error)
    }
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
        // 메인 대시보드로 돌아올 때는 내용 유지 (사이클 생성 중이므로)
        break
      case 2:
        textAreaPlaceholder.value = '선택한 버튼에 할당할 NC 코드를 입력하세요...'
        textAreaContent.value = ''
        break
      case 3:
        textAreaPlaceholder.value = '사이클을 선택하면 코드가 표시됩니다...'
        textAreaContent.value = ''
        break
      case 4:
        textAreaPlaceholder.value = '3D 프린팅 코드 생성...'
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
