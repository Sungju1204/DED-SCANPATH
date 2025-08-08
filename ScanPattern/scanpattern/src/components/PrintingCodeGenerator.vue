<template>
  <div class="page-content">
    <div class="code-assignment-container">
      <div class="code-assignment-title">3D 프린팅 코드 생성</div>
      
      <div class="printing-settings-section">
        <div class="settings-group">
          <div class="setting-item">
            <label for="layerThickness">Layer (mm)</label>
            <input 
              v-model="printingSettings.layerThickness"
              type="number" 
              step="0.001" 
              min="0.001" 
              max="10" 
              placeholder="0.250"
            >
          </div>
          
          <div class="setting-item">
            <label for="dwellTime">Dwell Time (ms)</label>
            <input 
              v-model="printingSettings.dwellTime"
              type="number" 
              step="100" 
              min="0" 
              max="10000" 
              placeholder="3500"
            >
          </div>
          
          <div class="setting-item">
            <label for="target">Target (mm)</label>
            <input 
              v-model="printingSettings.target"
              type="number" 
              step="0.1" 
              min="0" 
              max="1000" 
              placeholder="5.0"
            >
          </div>
          <div class="setting-item">
            <label for="scanSpeed">Scan Speed</label>
            <input 
              v-model="printingSettings.scanSpeed"
              type="number" 
              step="1" 
              min="1" 
              max="10000" 
              placeholder="850"
            >
          </div>
          <div class="setting-item">
            <label for="includeComments">주석 포함</label>
            <input 
              v-model="printingSettings.includeComments"
              type="checkbox"
              id="includeComments"
            >
            <span class="checkbox-label">NC 코드에 주석 포함</span>
          </div>
        </div>
        
        <div class="feeder-selection">
          <div class="setting-title">Feeder 선택</div>
          <div class="feeder-info">
            <p class="feeder-description">피더 선택에 따라 NC 코드의 M60/M70, M61/M71, M62/M72 코드가 변경됩니다.</p>
          </div>
          <div class="feeder-options">
            <label 
              v-for="feeder in 3" 
              :key="feeder"
              class="feeder-option"
            >
              <input 
                type="radio" 
                :value="feeder" 
                v-model="printingSettings.selectedFeeder"
              >
              <span class="feeder-label">피더{{ feeder }} (M{{ 59 + feeder }}/M{{ 69 + feeder }})</span>
            </label>
          </div>
        </div>
      </div>
      
      <div class="cycle-selection-section">
        <div class="section-title">사이클 선택</div>
        <div class="cycle-dropdown">
          <select v-model="selectedCycleIndex">
            <option value="">사이클을 선택하세요</option>
            <option 
              v-for="(cycle, index) in savedCycles" 
              :key="cycle.id"
              :value="index"
            >
              {{ cycle.name }}
              <span v-if="cycle.selectedItems && cycle.selectedItems.length > 0">
                ({{ cycle.selectedItems.map(item => item.name).join(' ') }})
              </span>
            </option>
          </select>
        </div>
        <div v-if="selectedCycleIndex === ''" class="cycle-info">
          <p>사이클을 선택하면 해당 사이클의 버튼들을 기반으로 NC 코드를 생성합니다.</p>
          <p>프로그램 헤더 - [레이어 변경] - [선택된 사이클 버튼들] - 프로그램 푸터 구조로 생성됩니다.</p>
        </div>
      </div>
      
      <div class="generate-section">
        <button @click="generateCode" class="generate-button">
          코드 파일 생성
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrintingCodeGenerator',
  props: {
    savedCycles: {
      type: Array,
      default: () => []
    },
    buttonCodes: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['generate-code'],
  data() {
    return {
      printingSettings: {
        layerThickness: 0.250,
        dwellTime: 3500,
        target: 5.0,
        scanSpeed: 850,
        selectedFeeder: 1,
        includeComments: true
      },
      selectedCycleIndex: ''
    }
  },
  methods: {
    generateCode() {
      const { layerThickness, dwellTime, target, selectedFeeder, includeComments } = this.printingSettings
      
      if (!layerThickness || !dwellTime || !target) {
        alert('Layer Thickness, Dwell Time, Target을 모두 입력해주세요.')
        return
      }
      
      if (this.selectedCycleIndex === '') {
        alert('사이클을 선택해주세요.')
        return
      }
      
      const selectedCycle = this.savedCycles[this.selectedCycleIndex]
      if (!selectedCycle) {
        alert('선택된 사이클을 찾을 수 없습니다.')
        return
      }
      
      console.log('PrintingCodeGenerator에서 피더 선택:', selectedFeeder)
      
      this.$emit('generate-code', {
        layerThickness,
        dwellTime,
        target,
        selectedFeeder: parseInt(selectedFeeder),
        selectedCycle,
        scanSpeed: this.printingSettings.scanSpeed,
        includeComments
      })
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

.code-assignment-container {
  position: absolute;
  width: 653px;
  min-height: 450px;
  left: 135px;
  top: 100px;
  background: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #E9ECEF;
}

.code-assignment-title {
  color: #1A1A1A;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
  text-align: center;
  letter-spacing: -0.02em;
}

.printing-settings-section {
  margin-bottom: 20px;
  padding: 16px;
  background: #F8F9FA;
  border-radius: 8px;
  border: 1px solid #E9ECEF;
}

.settings-group {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.setting-item {
  flex: 1;
}

.setting-item label {
  display: block;
  color: #495057;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.setting-item input {
  width: 100%;
  padding: 10px 12px;
  background: #FFFFFF;
  border: 1px solid #DEE2E6;
  border-radius: 6px;
  color: #495057;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
}

.setting-item input:focus {
  outline: none;
  border-color: #007BFF;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

.setting-item input[type="checkbox"] {
  width: auto;
  margin-right: 8px;
}

.checkbox-label {
  color: #495057;
  font-size: 14px;
  font-weight: 500;
}

.feeder-selection {
  margin-top: 15px;
}

.setting-title {
  color: #495057;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
}

.feeder-options {
  display: flex;
  gap: 15px;
}

.feeder-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  background: #FFFFFF;
  border: 1px solid #DEE2E6;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.feeder-option:hover {
  background: #F8F9FA;
  border-color: #007BFF;
}

.feeder-option input[type="radio"] {
  margin-right: 8px;
  accent-color: #007BFF;
}

.feeder-label {
  color: #495057;
  font-size: 14px;
  font-weight: 500;
}

.feeder-info {
  margin-bottom: 12px;
}

.feeder-description {
  color: #6C757D;
  font-size: 12px;
  margin: 0;
  line-height: 1.4;
  background: #E3F2FD;
  padding: 8px 12px;
  border-radius: 6px;
  border-left: 3px solid #007BFF;
}

.cycle-selection-section {
  margin-bottom: 20px;
  padding: 16px;
  background: #F8F9FA;
  border-radius: 8px;
  border: 1px solid #E9ECEF;
}

.section-title {
  color: #495057;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}



.cycle-dropdown select {
  width: 100%;
  padding: 10px 12px;
  background: #FFFFFF;
  border: 1px solid #DEE2E6;
  border-radius: 6px;
  color: #495057;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
}

.cycle-dropdown select:focus {
  outline: none;
  border-color: #007BFF;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

.cycle-info {
  padding: 12px;
  background: #E3F2FD;
  border: 1px solid #BBDEFB;
  border-radius: 6px;
  margin-top: 10px;
}

.cycle-info p {
  color: #1976D2;
  font-size: 14px;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.cycle-info p:last-child {
  margin-bottom: 0;
}

.generate-section {
  text-align: center;
}

.generate-button {
  padding: 15px 30px;
  background: #007BFF;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.generate-button:hover {
  background: #0056B3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

.generate-button:active {
  transform: translateY(0);
}
</style> 
