import { ref } from 'vue'

export function useAppState() {
  // 기본 상태
  const currentPage = ref(1)
  const sidebarOpen = ref(false)
  
  // 사이클 관련 상태
  const selectedItems = ref([])
  const savedCycles = ref([])
  

  

  
  // 메뉴 아이템
  const menuItems = [
    { text: '사이클 생성', icon: 'dashboard-icon' },
    { text: '사이클 관리', icon: 'messages-icon' },
    { text: '코드 파일 생성', icon: 'schedule-icon' }
  ]
  
  // localStorage에서 데이터 로드
  const loadAppState = (onLoadComplete) => {
    try {
      console.log('loadAppState 실행됨')
      const savedSelectedItems = localStorage.getItem('selectedItems')
      console.log('localStorage에서 가져온 selectedItems:', savedSelectedItems)
      if (savedSelectedItems) {
        selectedItems.value = JSON.parse(savedSelectedItems)
        console.log('selectedItems 복원됨:', selectedItems.value)
      } else {
        console.log('저장된 selectedItems 없음')
      }
      
      // 로드 완료 후 콜백 실행
      if (onLoadComplete && typeof onLoadComplete === 'function') {
        console.log('콜백 함수 실행')
        onLoadComplete()
      } else {
        console.log('콜백 함수 없음')
      }
    } catch (error) {
      console.error('앱 상태 로드 중 오류:', error)
    }
  }
  
  // localStorage에 데이터 저장
  const saveAppState = () => {
    try {
      localStorage.setItem('selectedItems', JSON.stringify(selectedItems.value))
    } catch (error) {
      console.error('앱 상태 저장 중 오류:', error)
    }
  }
  
  // 초기 데이터 로드 (콜백 없이)
  loadAppState()
  
  return {
    // 상태
    currentPage,
    sidebarOpen,
    selectedItems,
    savedCycles,
    menuItems,
    
    // 함수
    loadAppState,
    saveAppState
  }
}
