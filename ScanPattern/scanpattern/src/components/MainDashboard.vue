<template>
  <div class="page-content">
    <div class="content-grid">
      <div class="grid-row">
        <div 
          v-for="item in ['C1', 'C2', 'C3', 'C4']" 
          :key="item"
          class="grid-item" 
          :data-item="item"
          @click="addToBottomPanel(item)"
        >
          <div class="grid-item-label">{{ item }}</div>
          <div class="grid-item-image"></div>
        </div>
      </div>
      
      <div class="grid-row">
        <div 
          v-for="item in ['F1', 'F2', 'F3', 'F4']" 
          :key="item"
          class="grid-item" 
          :data-item="item"
          @click="addToBottomPanel(item)"
        >
          <div class="grid-item-label">{{ item }}</div>
          <div class="grid-item-image"></div>
        </div>
      </div>
    </div>

    <div class="bottom-panel" id="bottomPanel">
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
</template>

<script>
export default {
  name: 'MainDashboard',
  props: {
    selectedItems: {
      type: Array,
      default: () => []
    }
  },
  emits: ['add-item', 'remove-item'],
  methods: {
    addToBottomPanel(itemName) {
      this.$emit('add-item', itemName)
    },
    removeFromBottomPanel(itemId) {
      this.$emit('remove-item', itemId)
    }
  }
}
</script>

<style scoped>
.page-content {
  position: relative;
}

.content-grid {
  position: absolute;
  width: 653px;
  height: 280px;
  left: 135px;
  top: 100px;
  max-width: calc(100vw - 600px);
}

.grid-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.grid-item {
  width: 121px;
  height: 135px;
  background: #1D1D1D;
  box-shadow: 0px 4px 8px 2px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.grid-item:hover {
  background: #2A2A2A;
  transform: translateY(-2px);
  box-shadow: 0px 6px 12px 4px rgba(0, 0, 0, 0.3);
}

.grid-item:active {
  transform: translateY(0px);
}

.grid-item-label {
  position: absolute;
  top: 15px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  color: #FFFFFF;
}

.grid-item-image {
  width: 85px;
  height: 85px;
  background: #333;
  border-radius: 10px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 12px;
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

.bottom-panel {
  position: absolute;
  width: 653px;
  height: 125px;
  left: 111px;
  top: 491px;
  background: #1D1D1D;
  box-shadow: 0px 4px 8px 2px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  padding: 15px;
  overflow-y: auto;
  max-width: calc(100vw - 600px);
}

.bottom-item {
  display: inline-block;
  background: #333;
  color: #FFFFFF;
  padding: 8px 16px;
  margin: 5px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.bottom-item:hover {
  background: #444;
  border-color: #ff4444;
  transform: scale(1.05);
}

.bottom-item:active {
  transform: scale(0.95);
}

.bottom-panel:empty::before {
  content: "버튼을 클릭하여 항목을 추가하세요";
  color: #666;
  font-size: 14px;
  display: block;
  text-align: center;
  margin-top: 40px;
}
</style> 