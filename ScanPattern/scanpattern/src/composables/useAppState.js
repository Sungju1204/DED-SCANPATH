import { ref, reactive } from 'vue'
import gcodes from '../constants/gcodes.js'

export function useAppState() {
  // 기본 상태
  const currentPage = ref(1)
  const sidebarOpen = ref(false)
  
  // 사이클 관련 상태
  const selectedItems = ref([])
  const savedCycles = ref([])
  
  // 버튼 관련 상태
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
  
  // 텍스트 영역 상태
  const textAreaContent = ref('')
  const rightPanelTitle = ref('NC Code')
  const textAreaPlaceholder = ref('여기에 NC 코드를 작성하세요...')
  
  // 메뉴 아이템
  const menuItems = [
    { text: '사이클 생성', icon: 'dashboard-icon' },
    { text: '코드 할당', icon: 'clients-icon' },
    { text: '사이클 관리', icon: 'messages-icon' },
    { text: '코드 파일 생성', icon: 'schedule-icon' }
  ]
  
  return {
    // 상태
    currentPage,
    sidebarOpen,
    selectedItems,
    savedCycles,
    buttonCodes,
    selectedButton,
    customButtonLists,
    allButtons,
    textAreaContent,
    rightPanelTitle,
    textAreaPlaceholder,
    menuItems
  }
}
