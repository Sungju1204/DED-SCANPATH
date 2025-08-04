<template>
  <div class="page-content">
    <div class="code-assignment-container">
      <div class="code-assignment-title">3D 프린팅 코드 생성</div>
      
      <div class="printing-settings-section">
        <div class="settings-group">
          <div class="setting-item">
            <label for="layerThickness">Layer Thickness (mm)</label>
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
        </div>
        
        <div class="feeder-selection">
          <div class="setting-title">Feeder 선택</div>
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
              <span class="feeder-label">Feeder {{ feeder }}</span>
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
        selectedFeeder: 1
      },
      selectedCycleIndex: ''
    }
  },
  methods: {
    generateCode() {
      const { layerThickness, dwellTime, target, selectedFeeder } = this.printingSettings
      
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
      
      this.$emit('generate-code', {
        layerThickness,
        dwellTime,
        target,
        selectedFeeder,
        selectedCycle,
        scanSpeed: this.printingSettings.scanSpeed
      })
    }
  }
}
</script>

<style scoped>
.page-content {
  position: relative;
}

.code-assignment-container {
  position: absolute;
  width: 653px;
  height: 280px;
  left: 135px;
  top: 100px;
  background: #1D1D1D;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0px 4px 8px 2px rgba(0, 0, 0, 0.25);
}

.code-assignment-title {
  color: #FFFFFF;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
}

.printing-settings-section {
  margin-bottom: 20px;
  padding: 15px;
  background: #333;
  border-radius: 10px;
  border: 2px solid #444;
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
  color: #7B20E2;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.setting-item input {
  width: 100%;
  padding: 10px 12px;
  background: #1D1D1D;
  border: 1px solid #555;
  border-radius: 6px;
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
}

.setting-item input:focus {
  outline: none;
  border-color: #7B20E2;
}

.feeder-selection {
  margin-top: 15px;
}

.setting-title {
  color: #7B20E2;
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
  background: #1D1D1D;
  border: 1px solid #555;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.feeder-option:hover {
  background: #2A2A2A;
  border-color: #7B20E2;
}

.feeder-option input[type="radio"] {
  margin-right: 8px;
  accent-color: #7B20E2;
}

.feeder-label {
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 500;
}

.cycle-selection-section {
  margin-bottom: 20px;
  padding: 15px;
  background: #333;
  border-radius: 10px;
  border: 2px solid #444;
}

.section-title {
  color: #7B20E2;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.cycle-dropdown select {
  width: 100%;
  padding: 10px 12px;
  background: #1D1D1D;
  border: 1px solid #555;
  border-radius: 6px;
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
}

.cycle-dropdown select:focus {
  outline: none;
  border-color: #7B20E2;
}

.generate-section {
  text-align: center;
}

.generate-button {
  padding: 15px 30px;
  background: #7B20E2;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.generate-button:hover {
  background: #8B30F2;
  transform: translateY(-2px);
}

.generate-button:active {
  transform: translateY(0px);
}
</style> 