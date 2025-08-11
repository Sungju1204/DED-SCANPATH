import { ref } from 'vue'

export function useCycleManagement() {
  const savedCycles = ref([])
  
  const saveCycle = (cycleName, content, selectedItems) => {
    if (!content.trim()) {
      throw new Error('저장할 NC 코드가 없습니다.')
    }
    
    if (!cycleName || cycleName.trim() === '') {
      throw new Error('사이클 이름을 입력해주세요.')
    }
    
    const cycle = {
      id: Date.now(),
      name: cycleName.trim(),
      content: content,
      date: new Date().toLocaleString(),
      selectedItems: [...selectedItems]
    }
    
    console.log('사이클 저장 중:', cycle)
    savedCycles.value.push(cycle)
    console.log('저장된 사이클 목록:', savedCycles.value)
    return cycle
  }
  
  const deleteCycle = (index) => {
    savedCycles.value.splice(index, 1)
  }
  
  const showCycleContent = (cycle, updateTextArea, updateTitle) => {
    updateTextArea(cycle.content)
    updateTitle(`사이클: ${cycle.name}`)
    
    // 3초 후 제목 복원
    setTimeout(() => {
      updateTitle('NC Code')
    }, 3000)
  }
  
  const loadCycles = () => {
    const saved = localStorage.getItem('savedCycles')
    console.log('localStorage에서 사이클 로드:', saved)
    if (saved) {
      savedCycles.value = JSON.parse(saved)
      console.log('로드된 사이클 목록:', savedCycles.value)
    } else {
      console.log('저장된 사이클이 없습니다.')
    }
  }
  
  const saveCyclesToStorage = () => {
    console.log('localStorage에 사이클 저장 중:', savedCycles.value)
    localStorage.setItem('savedCycles', JSON.stringify(savedCycles.value))
    console.log('localStorage 저장 완료')
  }
  
  return {
    savedCycles,
    saveCycle,
    deleteCycle,
    showCycleContent,
    loadCycles,
    saveCyclesToStorage
  }
}
