import { ref } from 'vue'
import { CycleService } from '../services/cycleService'

export function useCycleManagement() {
  const savedCycles = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  
  const saveCycle = async (cycleName, content, selectedItems) => {
    if (!content.trim()) {
      throw new Error('저장할 NC 코드가 없습니다.')
    }
    
    if (!cycleName || cycleName.trim() === '') {
      throw new Error('사이클 이름을 입력해주세요.')
    }
    
    try {
      isLoading.value = true
      error.value = null
      
      const cycleData = {
        name: cycleName.trim(),
        content: content,
        selectedItems: [...selectedItems]
      }
      
      console.log('사이클 저장 중:', cycleData)
      
      // Supabase에 저장
      const savedCycle = await CycleService.saveCycle(cycleData)
      
      // 로컬 상태 업데이트 (데이터 형식 통일)
      const formattedCycle = {
        id: savedCycle.id,
        name: savedCycle.name,
        content: savedCycle.content,
        date: new Date(savedCycle.created_at || Date.now()).toLocaleString(),
        selectedItems: savedCycle.selected_items || savedCycle.selectedItems || []
      }
      
      savedCycles.value.unshift(formattedCycle)
      
      console.log('사이클 저장 완료:', formattedCycle)
      return formattedCycle
    } catch (err) {
      error.value = err.message
      console.error('사이클 저장 실패:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const deleteCycle = async (id) => {
    try {
      isLoading.value = true
      error.value = null
      
      // Supabase에서 삭제
      await CycleService.deleteCycle(id)
      
      // 로컬 상태에서 제거
      const index = savedCycles.value.findIndex(cycle => cycle.id === id)
      if (index > -1) {
        savedCycles.value.splice(index, 1)
      }
      
      console.log('사이클 삭제 완료:', id)
    } catch (err) {
      error.value = err.message
      console.error('사이클 삭제 실패:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const showCycleContent = (cycle, updateTextArea, updateTitle) => {
    updateTextArea(cycle.content)
    updateTitle(`사이클: ${cycle.name}`)
    
    // 3초 후 제목 복원
    setTimeout(() => {
      updateTitle('NC Code')
    }, 3000)
  }
  
  const loadCycles = async (forceRefresh = false) => {
    try {
      isLoading.value = true
      error.value = null
      
      console.log('Supabase에서 사이클 로드 중...', forceRefresh ? '(강제 새로고침)' : '')
      const cycles = await CycleService.getAllCycles()
      
      // 데이터 형식 변환 (Supabase 응답을 기존 형식에 맞춤)
      const formattedCycles = cycles.map(cycle => ({
        id: cycle.id,
        name: cycle.name,
        content: cycle.content,
        date: new Date(cycle.created_at).toLocaleString(),
        selectedItems: cycle.selected_items || []
      }))
      
      // 강제 새로고침이거나 데이터가 변경된 경우에만 상태 업데이트
      if (forceRefresh || JSON.stringify(formattedCycles) !== JSON.stringify(savedCycles.value)) {
        savedCycles.value = formattedCycles
        console.log('사이클 목록 업데이트됨:', savedCycles.value)
      } else {
        console.log('사이클 목록 변경 없음, 상태 유지')
      }
      
      return formattedCycles
    } catch (err) {
      error.value = err.message
      console.error('사이클 로드 실패:', err)
      
      // 오류 발생 시 빈 배열로 초기화
      savedCycles.value = []
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const updateCycle = async (id, cycleData) => {
    try {
      isLoading.value = true
      error.value = null
      
      // Supabase에서 수정
      const updatedCycle = await CycleService.updateCycle(id, cycleData)
      
      // 로컬 상태 업데이트
      const index = savedCycles.value.findIndex(cycle => cycle.id === id)
      if (index > -1) {
        savedCycles.value[index] = {
          ...updatedCycle,
          date: new Date(updatedCycle.updated_at || updatedCycle.created_at).toLocaleString(),
          selectedItems: updatedCycle.selected_items || []
        }
      }
      
      console.log('사이클 수정 완료:', updatedCycle)
      return updatedCycle
    } catch (err) {
      error.value = err.message
      console.error('사이클 수정 실패:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // 로컬 스토리지 백업 (선택사항)
  const saveCyclesToStorage = () => {
    console.log('localStorage에 사이클 백업 중:', savedCycles.value)
    localStorage.setItem('savedCycles', JSON.stringify(savedCycles.value))
    console.log('localStorage 백업 완료')
  }
  
  // 로컬 스토리지에서 복원 (선택사항)
  const loadCyclesFromStorage = () => {
    const saved = localStorage.getItem('savedCycles')
    console.log('localStorage에서 사이클 백업 복원:', saved)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        savedCycles.value = parsed
        console.log('백업에서 복원된 사이클 목록:', savedCycles.value)
      } catch (err) {
        console.error('백업 복원 실패:', err)
      }
    }
  }
  
  return {
    savedCycles,
    isLoading,
    error,
    saveCycle,
    deleteCycle,
    showCycleContent,
    loadCycles,
    updateCycle,
    saveCyclesToStorage,
    loadCyclesFromStorage
  }
}
