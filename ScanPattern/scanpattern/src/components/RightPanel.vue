<template>
  <div class="right-panel">
    <div class="right-panel-title">{{ title }}</div>
    <div class="text-area-container">
      <!-- 주석 버튼 -->
      <div class="comment-button-container">
        <button 
          class="comment-button" 
          @click="toggleComments"
          :class="{ 'active': showComments }"
        >
          {{ showComments ? '주석 숨기기' : '주석 보기' }}
        </button>
      </div>
      
      <textarea 
        :value="displayContent"
        class="text-area" 
        :placeholder="placeholder"
        :readonly="readonly"
        @input="onInput"
      ></textarea>
      <div class="button-container">
        <button 
          v-show="showSaveCycle"
          class="action-button" 
          @click="saveCycle"
        >
          사이클 저장
        </button>
        <button 
          v-show="showSaveCode"
          class="action-button" 
          @click="saveCode"
        >
          코드 저장
        </button>
        <button 
          class="action-button clear-button" 
          @click="clearText"
        >
          지우기
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RightPanel',
  props: {
    content: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: 'NC Code'
    },
    placeholder: {
      type: String,
      default: '여기에 NC 코드를 작성하세요...'
    },
    showSaveCycle: {
      type: Boolean,
      default: false
    },
    showSaveCode: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showComments: false
    }
  },
  computed: {
    displayContent() {
      if (!this.showComments) {
        // 주석이 숨겨진 상태: 주석 라인과 빈 줄 제거
        const lines = this.content.split('\n')
        const filteredLines = lines.filter(line => {
          const trimmedLine = line.trim()
          
          // 주석 라인 제거 (//, ;, # 등으로 시작하는 라인)
          if (trimmedLine.startsWith('//') || 
              trimmedLine.startsWith(';') || 
              trimmedLine.startsWith('#') ||
              trimmedLine.startsWith('/*') ||
              trimmedLine.startsWith('*') ||
              trimmedLine.startsWith('*/')) {
            return false
          }
          
          // 빈 줄 제거
          if (trimmedLine === '') {
            return false
          }
          
          // 주석이 포함된 라인에서 주석 부분만 제거하고 코드 부분만 유지
          if (trimmedLine.includes('//') || trimmedLine.includes(';')) {
            const commentIndex = Math.min(
              trimmedLine.indexOf('//') !== -1 ? trimmedLine.indexOf('//') : Infinity,
              trimmedLine.indexOf(';') !== -1 ? trimmedLine.indexOf(';') : Infinity
            )
            if (commentIndex !== Infinity) {
              const codePart = trimmedLine.substring(0, commentIndex).trim()
              return codePart !== ''
            }
          }
          
          return true
        })
        
        const result = filteredLines.join('\n')
        console.log('주석 필터링 결과:', {
          원본_줄수: lines.length,
          필터링_줄수: filteredLines.length,
          원본_내용: this.content,
          필터링_내용: result
        })
        
        return result
      }
      
      console.log('주석 표시 모드:', this.content)
      return this.content
    }
  },
  emits: ['update:content', 'save-cycle', 'save-code', 'clear'],
  methods: {
    onInput(event) {
      this.$emit('update:content', event.target.value)
    },
    
    saveCycle() {
      this.$emit('save-cycle')
    },
    
    saveCode() {
      this.$emit('save-code')
    },
    
    clearText() {
      if (confirm('정말로 모든 텍스트를 지우시겠습니까?')) {
        this.$emit('clear')
      }
    },
    
    toggleComments() {
      this.showComments = !this.showComments
    }
  }
}
</script>

<style scoped>
.right-panel {
  position: absolute;
  width: 399px;
  height: 604px;
  left: 850px;
  top: 44px;
  background: #FFFFFF;
  border: 1px solid #E9ECEF;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.right-panel-title {
  color: #1A1A1A;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
  letter-spacing: -0.02em;
}

.text-area-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.comment-button-container {
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-start;
}

.comment-button {
  padding: 8px 16px;
  background: #6C757D;
  color: #FFFFFF;
  border: none;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.comment-button:hover {
  background: #5A6268;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(108, 117, 125, 0.3);
}

.comment-button.active {
  background: #007BFF;
}

.comment-button.active:hover {
  background: #0056B3;
}

.text-area {
  flex: 1;
  background: #F8F9FA;
  border: 1px solid #DEE2E6;
  border-radius: 8px;
  padding: 16px;
  color: #495057;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  outline: none;
  transition: all 0.2s ease;
}

.text-area:focus {
  border-color: #007BFF;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

.text-area::placeholder {
  color: #6C757D;
}

.button-container {
  margin-top: 20px;
  display: flex;
  gap: 12px;
}

.action-button {
  flex: 1;
  padding: 12px 16px;
  background: #007BFF;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button:hover {
  background: #0056B3;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

.action-button:active {
  transform: translateY(0);
}

.clear-button {
  background: #6C757D;
}

.clear-button:hover {
  background: #5A6268;
  box-shadow: 0 2px 8px rgba(108, 117, 125, 0.3);
}
</style> 
