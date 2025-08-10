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
    
    savedCycles.value.push(cycle)
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
    if (saved) {
      savedCycles.value = JSON.parse(saved)
    }
  }
  
  const saveCyclesToStorage = () => {
    localStorage.setItem('savedCycles', JSON.stringify(savedCycles.value))
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
