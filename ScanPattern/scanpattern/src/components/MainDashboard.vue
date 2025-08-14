<template>
  <div class="page-content">
    <div class="content-grid">
      <!-- C 버튼들 섹션 -->
      <div class="button-section">
        <div class="section-header">
          <div class="section-title">C 버튼 목록</div>
          <div class="header-buttons">
            <button class="add-button-btn-small" @click="showAddModalForList('C')">+</button>
            <button class="edit-button-btn-small" @click="showEditModalForList('C')">✏️</button>
            <button class="trash-button-small" @click="showDeleteModalForList('C')">🗑️</button>
          </div>
        </div>
        <div class="button-scroll-container">
          <div class="grid-row">
            <div 
              v-for="item in ['C1', 'C2', 'C3', 'C4']" 
              :key="item"
              class="grid-item" 
              :data-item="item"
              @click="addToBottomPanel(item)"
            >
              <div class="grid-item-label">{{ item }}</div>
              <div class="grid-item-image" style="position: relative;">
                <img v-if="hasButtonImage(item)" :src="getButtonImage(item)" :alt="item" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; position: absolute; top: 0; left: 0;" />
                <div v-else class="default-button-icon" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #f0f0f0; border-radius: 8px; position: absolute; top: 0; left: 0;">
                  <span style="font-size: 24px; color: #666;">{{ item }}</span>
                </div>
              </div>
            </div>
            <!-- 사용자가 추가한 C 버튼들 -->
            <div 
              v-for="button in customButtonLists.C || []" 
              :key="button"
              class="grid-item" 
              :data-item="button"
              @click="addToBottomPanel(button)"
            >
              <div class="grid-item-label">{{ button }}</div>
              <div class="grid-item-image" style="position: relative;">
                <img v-if="hasButtonImage(button)" :src="getButtonImage(button)" :alt="button" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; position: absolute; top: 0; left: 0;" />
                <div v-else class="default-button-icon" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #f0f0f0; border-radius: 8px; position: absolute; top: 0; left: 0;">
                  <span style="font-size: 24px; color: #666;">{{ button }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- F 버튼들 섹션 -->
      <div class="button-section">
        <div class="section-header">
          <div class="section-title">F 버튼 목록</div>
          <div class="header-buttons">
            <button class="add-button-btn-small" @click="showAddModalForList('F')">+</button>
            <button class="edit-button-btn-small" @click="showEditModalForList('F')">✏️</button>
            <button class="trash-button-small" @click="showDeleteModalForList('F')">🗑️</button>
          </div>
        </div>
        <div class="button-scroll-container">
          <div class="grid-row">
            <div 
              v-for="item in ['F1', 'F2', 'F3', 'F4']" 
              :key="item"
              class="grid-item" 
              :data-item="item"
              @click="addToBottomPanel(item)"
            >
              <div class="grid-item-label">{{ item }}</div>
              <div class="grid-item-image" style="position: relative;">
                <img v-if="hasButtonImage(item)" :src="getButtonImage(item)" :alt="item" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; position: absolute; top: 0; left: 0;" />
                <div v-else class="default-button-icon" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #f0f0f0; border-radius: 8px; position: absolute; top: 0; left: 0;">
                  <span style="font-size: 24px; color: #666;">{{ item }}</span>
                </div>
              </div>
            </div>
            <!-- 사용자가 추가한 F 버튼들 -->
            <div 
              v-for="button in customButtonLists.F || []" 
              :key="button"
              class="grid-item" 
              :data-item="button"
              @click="addToBottomPanel(button)"
            >
              <div class="grid-item-label">{{ button }}</div>
              <div class="grid-item-image" style="position: relative;">
                <img v-if="hasButtonImage(button)" :src="getButtonImage(button)" :alt="button" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; position: absolute; top: 0; left: 0;" />
                <div v-else class="default-button-icon" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #f0f0f0; border-radius: 8px; position: absolute; top: 0; left: 0;">
                  <span style="font-size: 24px; color: #666;">{{ button }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 기타 사용자 추가 버튼들 -->
      <div 
        v-for="(buttons, listName) in otherCustomLists" 
        :key="listName"
        class="button-section"
      >
        <div class="section-title">{{ listName }} 버튼 목록</div>
        <div class="button-scroll-container">
          <div class="grid-row">
            <div 
              v-for="button in buttons" 
              :key="button"
              class="grid-item" 
              :data-item="button"
              @click="addToBottomPanel(button)"
            >
              <div class="grid-item-label">{{ button }}</div>
              <div class="grid-item-image" style="position: relative;">
                <img v-if="hasButtonImage(button)" :src="getButtonImage(button)" :alt="button" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; position: absolute; top: 0; left: 0;" />
                <div v-else class="default-button-icon" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #f0f0f0; border-radius: 8px; position: absolute; top: 0; left: 0;">
                  <span style="font-size: 24px; color: #666;">{{ button }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>



    <div class="bottom-panel" id="bottomPanel">
      <div class="bottom-panel-header" v-if="selectedItems.length > 0">
        <button class="clear-all-button" @click="clearAllItems">전체 삭제</button>
      </div>
      <div class="bottom-panel-content">
        <div 
          v-for="item in selectedItems" 
          :key="item.id"
          class="bottom-item"
          @click="removeFromBottomPanel(item.id)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>

    <!-- 추가 모달창 -->
    <div v-if="showAddModal" class="modal-overlay" @click="showAddModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ currentList }} 버튼 추가</h3>
          <button class="modal-close" @click="showAddModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="add-button-section">
            <div class="section-title">새 버튼 추가</div>
            <div class="add-button-input">
              <input
                v-model="newButtonName"
                type="text"
                :placeholder="`버튼 이름 (예: ${currentList}5, ${currentList}6...)`"
                maxlength="10"
              >
            </div>
            
            <div class="button-code-section">
              <div class="section-title">버튼 코드 (선택사항)</div>
              <textarea
                v-model="newButtonCode"
                placeholder="버튼에 할당할 코드를 입력하세요..."
                rows="6"
                class="code-textarea"
              ></textarea>
            </div>
            
            <div class="button-image-section">
              <div class="section-title">버튼 이미지 (선택사항)</div>
              <div class="image-upload-area">
                <input
                  ref="imageInput"
                  type="file"
                  accept="image/*"
                  @change="handleImageUpload"
                  style="display: none;"
                >
                <div 
                  class="image-preview"
                  @click="$refs.imageInput.click()"
                >
                  <img v-if="imagePreview" :src="imagePreview" alt="미리보기" class="preview-image">
                  <div v-else class="upload-placeholder">
                    <span>이미지 업로드</span>
                    <small>클릭하여 이미지 선택</small>
                  </div>
                </div>
                <button v-if="imagePreview" @click="removeImage" class="remove-image-btn">이미지 제거</button>
              </div>
            </div>
            
            <div class="modal-actions">
              <button @click="addButton" class="add-button-btn">버튼 추가</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 삭제 모달창 -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ currentList }} 버튼 삭제</h3>
          <button class="modal-close" @click="showDeleteModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="button-list-section">
            <div class="section-title">삭제할 버튼 선택</div>
            <div class="button-controls">
              <button
                v-if="selectedForDeletion.length > 0"
                class="delete-confirm-button"
                @click="deleteSelectedButtons"
              >
                선택된 버튼 삭제 ({{ selectedForDeletion.length }}개)
              </button>
            </div>
            <div class="button-list">
              <div
                v-for="button in deletableButtons"
                :key="button"
                :class="['button-item', 'delete-mode', { 'selected': selectedForDeletion.includes(button) }]"
                @click="toggleDeleteSelection(button)"
              >
                <input
                  type="checkbox"
                  :checked="selectedForDeletion.includes(button)"
                  class="delete-checkbox"
                  @click.stop="toggleDeleteSelection(button)"
                >
                {{ button }}
              </div>
            </div>
            <div v-if="deletableButtons.length === 0" class="no-buttons-message">
              삭제할 수 있는 버튼이 없습니다.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 버튼 수정 모달창 -->
    <div v-if="showEditModal" class="modal-overlay" @click="showEditModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ currentList }} 버튼 수정</h3>
          <button class="modal-close" @click="showEditModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="edit-button-section">
            <div class="section-title">수정할 버튼 선택</div>
            
            <div class="button-selection-section">
              <div class="button-list">
                <div
                  v-for="button in editableButtons"
                  :key="button"
                  :class="['button-item', 'edit-mode', { 'selected': currentButton === button }]"
                  @click="selectButtonForEdit(button)"
                >
                  {{ button }}
                </div>
              </div>
              <div v-if="editableButtons.length === 0" class="no-buttons-message">
                수정할 수 있는 버튼이 없습니다.
              </div>
            </div>
            
            <div v-if="currentButton" class="button-edit-form">
              <div class="section-title">버튼 정보 수정</div>
              
              <div class="button-name-section">
                <div class="section-title">버튼 이름</div>
                <div class="add-button-input">
                  <input
                    v-model="editButtonName"
                    type="text"
                    :placeholder="`버튼 이름 (예: ${currentList}5, ${currentList}6...)`"
                    maxlength="10"
                  >
                </div>
              </div>
              
              <div class="button-code-section">
                <div class="section-title">버튼 코드</div>
                <textarea
                  v-model="editButtonCode"
                  placeholder="버튼에 할당할 코드를 입력하세요..."
                  rows="6"
                  class="code-textarea"
                ></textarea>
              </div>
              
              <div class="button-image-section">
                <div class="section-title">버튼 이미지</div>
                <div class="image-upload-area">
                  <input
                    ref="editImageInput"
                    type="file"
                    accept="image/*"
                    @change="handleEditImageUpload"
                    style="display: none;"
                  >
                  <div 
                    class="image-preview"
                    @click="$refs.editImageInput.click()"
                  >
                    <img v-if="editImagePreview" :src="editImagePreview" alt="미리보기" class="preview-image">
                    <div v-else-if="hasButtonImage(currentButton)" class="current-image">
                      <img :src="getButtonImage(currentButton)" alt="현재 이미지" class="preview-image">
                      <div class="image-overlay">
                        <span>클릭하여 변경</span>
                      </div>
                    </div>
                    <div v-else class="upload-placeholder">
                      <span>이미지 업로드</span>
                      <small>클릭하여 이미지 선택</small>
                    </div>
                  </div>
                  <button v-if="editImagePreview || hasButtonImage(currentButton)" @click="removeEditImage" class="remove-image-btn">이미지 제거</button>
                </div>
              </div>
              
              <div class="modal-actions">
                <button @click="updateButton" class="update-button-btn">버튼 수정</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainDashboard',
  props: {
    selectedItems: {
      type: Array,
      default: () => []
    },
    customButtonLists: {
      type: Object,
      default: () => ({})
    },
    buttonImages: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      showAddModal: false,
      showDeleteModal: false,
      showEditModal: false,
      newButtonName: '',
      newButtonCode: '',
      currentList: '',
      currentButton: '',
      selectedForDeletion: [],
      imagePreview: null,
      uploadedImage: null,
      editButtonName: '',
      editButtonCode: '',
      editImagePreview: null,
      editUploadedImage: null,
      defaultButtons: {
        C: ['C1', 'C2', 'C3', 'C4'],
        F: ['F1', 'F2', 'F3', 'F4']
      }
    }
  },
  computed: {
    otherCustomLists() {
      const otherLists = {}
      Object.keys(this.customButtonLists).forEach(listName => {
        if (listName !== 'C' && listName !== 'F') {
          otherLists[listName] = this.customButtonLists[listName]
        }
      })
      return otherLists
    },
    deletableButtons() {
      if (!this.currentList) return []
      // 기본 버튼은 삭제할 수 없으므로 사용자 추가 버튼만 반환
      return this.customButtonLists[this.currentList] || []
    },
    editableButtons() {
      if (!this.currentList) return []
      // 기본 버튼은 수정할 수 없으므로 사용자 추가 버튼만 반환
      return this.customButtonLists[this.currentList] || []
    }
  },
  emits: ['add-item', 'remove-item', 'add-button', 'clear-all-items', 'delete-buttons', 'update-button'],
  methods: {
    addToBottomPanel(itemName) {
      this.$emit('add-item', itemName)
      // 버튼 클릭 시 해당 버튼의 코드를 text-area에 표시
      this.$emit('show-button-code', itemName)
    },
    removeFromBottomPanel(itemId) {
      this.$emit('remove-item', itemId)
    },
    clearAllItems() {
      if (confirm('모든 항목을 삭제하시겠습니까?')) {
        this.$emit('clear-all-items')
      }
    },
    showAddModalForList(listType) {
      this.currentList = listType
      this.showAddModal = true
    },
    showEditModalForList(listType) {
      this.currentList = listType
      this.currentButton = ''
      this.editButtonName = ''
      this.editButtonCode = ''
      this.editImagePreview = null
      this.editUploadedImage = null
      this.showEditModal = true
    },
    showDeleteModalForList(listType) {
      this.currentList = listType
      this.selectedForDeletion = []
      this.showDeleteModal = true
    },
    addButton() {
      const selectedList = this.currentList
      const buttonName = this.newButtonName.trim().toUpperCase()

      if (!buttonName) {
        alert('버튼 이름을 입력해주세요.')
        return
      }

      // 기본 버튼과 중복 검사
      if (this.defaultButtons[selectedList] && this.defaultButtons[selectedList].includes(buttonName)) {
        alert(`"${buttonName}"은 기본 버튼 이름입니다. 다른 이름을 사용해주세요.`)
        return
      }

      // 사용자 추가 버튼과 중복 검사
      if (this.customButtonLists[selectedList] && this.customButtonLists[selectedList].includes(buttonName)) {
        alert(`"${buttonName}"은 이미 존재하는 버튼입니다. 다른 이름을 사용해주세요.`)
        return
      }

      this.$emit('add-button', { 
        selectedList, 
        buttonName, 
        buttonCode: this.newButtonCode.trim(),
        buttonImage: this.uploadedImage
      })
      
      // 폼 초기화
      this.newButtonName = ''
      this.newButtonCode = ''
      this.imagePreview = null
      this.uploadedImage = null
      this.currentList = ''
      this.showAddModal = false
      
      alert(`버튼 "${buttonName}"이 목록 "${selectedList}"에 추가되었습니다.`)
    },
    toggleDeleteSelection(button) {
      const index = this.selectedForDeletion.indexOf(button)
      if (index > -1) {
        this.selectedForDeletion.splice(index, 1)
      } else {
        this.selectedForDeletion.push(button)
      }
    },
    deleteSelectedButtons() {
      if (this.selectedForDeletion.length === 0) {
        alert('삭제할 버튼을 선택해주세요.')
        return
      }

      if (confirm(`선택된 ${this.selectedForDeletion.length}개의 버튼을 삭제하시겠습니까?`)) {
        this.$emit('delete-buttons', {
          listType: this.currentList,
          buttons: this.selectedForDeletion
        })
        this.selectedForDeletion = []
        this.showDeleteModal = false
      }
    },
    hasButtonImage(buttonName) {
      // 기본 버튼들 또는 사용자 추가 이미지가 있는 경우
      const defaultButtons = ['C1', 'C2', 'C3', 'C4', 'F1', 'F2', 'F3', 'F4']
      return defaultButtons.includes(buttonName) || this.buttonImages[buttonName]
    },
    getButtonImage(buttonName) {
      // 사용자 추가 이미지가 있으면 먼저 반환
      if (this.buttonImages[buttonName]) {
        return this.buttonImages[buttonName]
      }
      
      // 기본 이미지가 있으면 반환
      try {
        return require(`@/assets/${buttonName}.jpg`)
      } catch (error) {
        return null
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0]
      if (file) {
        // 파일 크기 제한 (5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('이미지 파일 크기는 5MB 이하여야 합니다.')
          return
        }
        
        // 이미지 파일 타입 확인
        if (!file.type.startsWith('image/')) {
          alert('이미지 파일만 업로드 가능합니다.')
          return
        }
        
        this.uploadedImage = file
        
        // 미리보기 생성
        const reader = new FileReader()
        reader.onload = (e) => {
          this.imagePreview = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    removeImage() {
      this.imagePreview = null
      this.uploadedImage = null
      if (this.$refs.imageInput) {
        this.$refs.imageInput.value = ''
      }
    },
    showEditModalForButton(listType, buttonName) {
      this.currentList = listType
      this.currentButton = buttonName
      this.editButtonName = buttonName
      this.editButtonCode = this.customButtonLists[listType].find(b => b === buttonName).code || '' // 기존 코드 가져오기
      this.editImagePreview = null
      this.editUploadedImage = null
      this.showEditModal = true
    },
    selectButtonForEdit(buttonName) {
      this.currentButton = buttonName
      this.editButtonName = buttonName
      // 기존 코드 가져오기 (실제 구현에서는 버튼 객체에서 코드를 가져와야 함)
      this.editButtonCode = ''
      this.editImagePreview = null
      this.editUploadedImage = null
    },
    handleEditImageUpload(event) {
      const file = event.target.files[0]
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert('이미지 파일 크기는 5MB 이하여야 합니다.')
          return
        }
        if (!file.type.startsWith('image/')) {
          alert('이미지 파일만 업로드 가능합니다.')
          return
        }
        this.editUploadedImage = file
        const reader = new FileReader()
        reader.onload = (e) => {
          this.editImagePreview = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    removeEditImage() {
      this.editImagePreview = null
      this.editUploadedImage = null
      if (this.$refs.editImageInput) {
        this.$refs.editImageInput.value = ''
      }
    },
    updateButton() {
      const selectedList = this.currentList
      const buttonName = this.editButtonName.trim().toUpperCase()
      const buttonCode = this.editButtonCode.trim()
      const buttonImage = this.editUploadedImage || null

      if (!buttonName) {
        alert('버튼 이름을 입력해주세요.')
        return
      }

      // 기본 버튼과 중복 검사
      if (this.defaultButtons[selectedList] && this.defaultButtons[selectedList].includes(buttonName)) {
        alert(`"${buttonName}"은 기본 버튼 이름입니다. 다른 이름을 사용해주세요.`)
        return
      }

      // 사용자 추가 버튼과 중복 검사
      if (this.customButtonLists[selectedList] && this.customButtonLists[selectedList].some(b => b.name === buttonName)) {
        alert(`"${buttonName}"은 이미 존재하는 버튼입니다. 다른 이름을 사용해주세요.`)
        return
      }

      this.$emit('update-button', {
        listType: selectedList,
        buttonName: buttonName,
        buttonCode: buttonCode,
        buttonImage: buttonImage
      })

      this.showEditModal = false
      this.editButtonName = ''
      this.editButtonCode = ''
      this.editImagePreview = null
      this.editUploadedImage = null
      this.currentList = ''
      this.currentButton = ''
    }
  }
}
</script>

<style scoped>
.page-content {
  position: relative;
  background: #F8F9FA;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.content-grid {
  position: absolute;
  width: 653px;
  height: 450px;
  left: 135px;
  top: 100px;
  max-width: calc(100vw - 600px);
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: left 0.3s ease;
}

.content-grid.sidebar-open {
  left: 517px;
}

.button-section {
  margin: 15px 15px 25px 15px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 0;
}

.header-buttons {
  display: flex;
  gap: 8px;
}

.section-title {
  color: #1A1A1A;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.button-scroll-container {
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 12px;
}

.button-scroll-container::-webkit-scrollbar {
  height: 6px;
}

.button-scroll-container::-webkit-scrollbar-track {
  background: #F1F3F4;
  border-radius: 8px;
}

.button-scroll-container::-webkit-scrollbar-thumb {
  background: #007BFF;
  border-radius: 8px;
}

.button-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #8B30F2;
}

.grid-row {
  display: flex;
  gap: 20px;
  min-width: max-content;
  padding-right: 20px;
}

.grid-item {
  width: 121px;
  height: 135px;
  background: #FFFFFF;
  border: 1px solid #E9ECEF;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  border-radius: 12px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.grid-item:hover {
  background: #F8F9FA;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
  border-color: #007BFF;
}

.grid-item:active {
  transform: translateY(0);
}

.grid-item-label {
  position: absolute;
  top: 16px;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
  color: #1A1A1A;
  letter-spacing: -0.01em;
}

.grid-item-image {
  width: 85px;
  height: 85px;
  background: #F1F3F4;
  border-radius: 8px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6C757D;
  font-size: 12px;
  font-weight: 500;
}

.grid-item-image::before {
  content: "Image";
}

.grid-item[data-item="/"] .grid-item-image::before {
  content: "";
}

.grid-item[data-item="/"] .grid-item-image {
  background: transparent;
  border: 2px solid #7B20E2;
  color: #7B20E2;
  font-size: 24px;
  font-weight: bold;
}

.add-button-btn-small {
  padding: 6px 10px;
  background: #007BFF;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-button-btn-small:hover {
  background: #0056B3;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

.add-button-btn-small:active {
  transform: translateY(0);
}

.edit-button-btn-small {
  padding: 6px 10px;
  background: #FFC107;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-button-btn-small:hover {
  background: #FFB300;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(255, 193, 7, 0.3);
}

.edit-button-btn-small:active {
  transform: translateY(0);
}

.trash-button-small {
  padding: 6px 10px;
  background: #DC3545;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.trash-button-small:hover {
  background: #C82333;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
}

.trash-button-small:active {
  transform: translateY(0);
}

.bottom-panel {
  position: absolute;
  width: 653px;
  min-height: 125px;
  left: 135px;
  top: 570px;
  background: #FFFFFF;
  border: 1px solid #E9ECEF;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  padding: 20px;
  max-width: calc(100vw - 600px);
}

.bottom-panel::-webkit-scrollbar {
  display: none;
}

.bottom-panel {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.bottom-panel-header {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #333;
  padding-right: 20px;
}

.clear-all-button {
  padding: 8px 16px;
  background: #DC3545;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-all-button:hover {
  background: #C82333;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
}

.clear-all-button:active {
  transform: translateY(0);
}

.bottom-item {
  display: inline-block;
  background: #F8F9FA;
  color: #495057;
  padding: 10px 16px;
  margin: 6px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #DEE2E6;
}

.bottom-item:hover {
  background: #E9ECEF;
  border-color: #DC3545;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(220, 53, 69, 0.2);
}

.bottom-item:active {
  transform: translateY(0);
}

.bottom-panel:empty::before {
  content: "버튼을 클릭하여 항목을 추가하세요";
  color: #666;
  font-size: 14px;
  display: block;
  text-align: center;
  margin-top: 50px;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 20px;
  width: 450px;
  max-width: 90vw;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid #E9ECEF;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #E9ECEF;
}

.modal-header h3 {
  color: #1A1A1A;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.02em;
}

.modal-close {
  background: none;
  border: none;
  color: #6C757D;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #F8F9FA;
  color: #495057;
}

.modal-body {
  color: #495057;
}

.add-button-section {
  margin-bottom: 16px;
  padding: 12px;
  background: #F8F9FA;
  border-radius: 8px;
  border: 1px solid #E9ECEF;
}

.edit-button-section {
  margin-bottom: 16px;
  padding: 12px;
  background: #F8F9FA;
  border-radius: 8px;
  border: 1px solid #E9ECEF;
}

.button-list-section {
  padding: 12px;
  background: #F8F9FA;
  border-radius: 8px;
  border: 1px solid #E9ECEF;
}

.section-title {
  color: #495057;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
}

.add-button-input {
  display: flex;
  gap: 10px;
  align-items: center;
}

.add-button-input input, .add-button-input select {
  flex: 1;
  padding: 10px 12px;
  background: #FFFFFF;
  border: 1px solid #DEE2E6;
  border-radius: 6px;
  color: #495057;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
}

.add-button-input input:focus, .add-button-input select:focus {
  outline: none;
  border-color: #007BFF;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

.add-button-input button {
  padding: 10px 16px;
  background: #007BFF;
  color: #FFFFFF;
  border: none;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.add-button-input button:hover {
  background: #0056B3;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

.add-button-input button:active {
  transform: translateY(0);
}

.button-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  align-items: center;
}

.trash-button {
  padding: 6px 12px;
  background: #E74C3C;
  color: #FFFFFF;
  border: none;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.trash-button:hover {
  background: #C0392B;
}

.trash-button.active {
  background: #C0392B;
  transform: scale(1.05);
}

.delete-confirm-button {
  padding: 6px 12px;
  background: #FF6B6B;
  color: #FFFFFF;
  border: none;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.delete-confirm-button:hover {
  background: #FF5252;
}

.button-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.button-selection-section {
  margin-bottom: 16px;
  padding: 12px;
  background: #FFFFFF;
  border-radius: 8px;
  border: 1px solid #E9ECEF;
}

.button-edit-form {
  margin-top: 16px;
  padding: 12px;
  background: #FFFFFF;
  border-radius: 8px;
  border: 1px solid #E9ECEF;
}

.button-item {
  display: inline-block;
  background: #444;
  color: #FFFFFF;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
}

.button-item:hover {
  background: #555;
  border-color: #7B20E2;
}

.button-item.delete-mode {
  cursor: pointer;
}

.button-item.delete-mode:hover {
  background: #E74C3C;
  border-color: #E74C3C;
}

.button-item.edit-mode {
  cursor: pointer;
}

.button-item.edit-mode:hover {
  background: #FFC107;
  border-color: #FFC107;
}

.delete-checkbox {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 16px;
  height: 16px;
  cursor: pointer;
  z-index: 10;
}

.button-item.selected {
  background: #E74C3C;
  border-color: #E74C3C;
}

/* 새로운 모달 스타일 */
.button-code-section,
.button-image-section {
  margin-top: 20px;
}

.button-name-section {
  margin-bottom: 20px;
}

.code-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  resize: vertical;
  min-height: 120px;
}

.code-textarea:focus {
  outline: none;
  border-color: #007BFF;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.image-upload-area {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.image-preview {
  width: 120px;
  height: 120px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.image-preview:hover {
  border-color: #007BFF;
  background: #f0f8ff;
}

.upload-placeholder {
  text-align: center;
  color: #666;
}

.upload-placeholder span {
  display: block;
  font-weight: 600;
  margin-bottom: 4px;
}

.upload-placeholder small {
  font-size: 12px;
  color: #999;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.current-image {
  position: relative;
  width: 100%;
  height: 100%;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.current-image:hover .image-overlay {
  opacity: 1;
}

.image-overlay span {
  color: white;
  font-weight: 600;
  font-size: 12px;
  text-align: center;
}

.remove-image-btn {
  padding: 6px 12px;
  background: #E74C3C;
  color: #FFFFFF;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-image-btn:hover {
  background: #C0392B;
}

.modal-actions {
  margin-top: 16px;
  text-align: center;
}

.add-button-btn {
  padding: 12px 24px;
  background: #007BFF;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-button-btn:hover {
  background: #0056b3;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.update-button-btn {
  padding: 12px 24px;
  background: #28A745;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.update-button-btn:hover {
  background: #218838;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.no-buttons-message {
  text-align: center;
  color: #666;
  font-size: 14px;
  padding: 20px;
  font-style: italic;
}
</style> 












