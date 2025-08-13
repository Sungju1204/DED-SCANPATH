

export function useCodeGeneration() {
  const feederCodes = {
    1: { on: 'M60', off: 'M70' },
    2: { on: 'M61', off: 'M71' },
    3: { on: 'M62', off: 'M72' }
  }
  
  const generate3DPrintingCode = (params, buttonCodes, updateTextArea) => {
    const {
      layerThickness,
      dwellTime,
      target,
      selectedFeeder,
      selectedCycle,
      scanSpeed
    } = params
    
    console.log('피더 선택:', selectedFeeder)
    const generatedCode = generateCodeContent(
      layerThickness,
      dwellTime,
      target,
      selectedFeeder,
      selectedCycle,
      scanSpeed,
      buttonCodes
    )
    
    updateTextArea(generatedCode)
    return generatedCode
  }
  
  const generateCodeContent = (
    layerThickness,
    dwellTime,
    target,
    feeder,
    cycle,
    scanSpeed,
    buttonCodes
  ) => {
    console.log('generateCodeContent 호출됨:', { 
      layerThickness, 
      dwellTime, 
      target, 
      feeder, 
      cycle, 
      scanSpeed
    })
    
    // 총 레이어 수 계산
    const totalLayers = Math.ceil(target / layerThickness)
    
    // 선택된 사이클의 버튼 코드들 가져오기
    let cycleButtonCodes = []
    if (cycle.selectedItems && cycle.selectedItems.length > 0) {
      cycleButtonCodes = cycle.selectedItems.map(item => {
        return buttonCodes[item.name] || `; ${item.name} - No code assigned`
      })
    } else {
      // 기본 C1 사이클 템플릿 사용
      cycleButtonCodes = [buttonCodes['C1'] || `; C1 - No code assigned`]
    }
    
    // 피더 값을 숫자로 변환
    const feederNumber = parseInt(feeder) || 1
    const selectedFeeder = feederCodes[feederNumber] || feederCodes[1]
    
    console.log('피더 매개변수:', feeder)
    console.log('피더 타입:', typeof feeder)
    console.log('선택된 피더 코드:', selectedFeeder)
    
    let generatedCode = ''
    
    // 1. 프로그램 헤더 생성
    generatedCode += generateProgramHeader(selectedFeeder, dwellTime, scanSpeed)
    
    // 2. 레이어 루프 시작
    for (let layer = 1; layer <= totalLayers; layer++) {
      const currentZ = ((layer - 1) * layerThickness).toFixed(3)
      
      generatedCode += generateLayerHeader(layer, currentZ)
      
      // 2-1. 레이어 변경 블록 (첫 번째 레이어 제외)
      if (layer > 1) {
        generatedCode += generateLayerChangeBlock(selectedFeeder, dwellTime)
      }
      
      // 2-2. 선택된 사이클의 버튼 코드들을 현재 Z 높이에 맞춰 생성
      generatedCode += generateCycleButtonCodes(
        cycleButtonCodes,
        cycle.selectedItems,
        currentZ,
        dwellTime,
        buttonCodes,
        layerThickness
      )
    }
    
    // 3. 프로그램 푸터 생성
    generatedCode += generateProgramFooter(selectedFeeder)
    
    return generatedCode.trim()
  }
  
  const generateProgramHeader = (selectedFeeder, dwellTime, scanSpeed) => {
    let code = ''
    
    code += '; === 프로그램 헤더 ===\n'
    code += 'G90\n'
    code += 'M50\n'
    code += `F${scanSpeed}\n`
    code += 'G54\n'
    code += 'M40\n'
    code += `${selectedFeeder.on}\n`
    code += `G4 P${dwellTime}\n`
    code += '\n'
    
    return code
  }
  
  const generateLayerHeader = (layer, currentZ) => {
    let code = ''
    
    code += `; === Layer ${layer} (Z = ${currentZ}) ===\n`
    
    return code
  }
  
  const generateLayerChangeBlock = (selectedFeeder, dwellTime) => {
    let code = ''
    
    code += '; 레이어 변경 블록\n'
    code += 'M51\n'
    code += `${selectedFeeder.off}\n`
    code += 'M41\n'
    code += `G4 P${dwellTime}\n`
    code += 'M50\n'
    code += 'M40\n'
    code += `${selectedFeeder.on}\n`
    code += `G4 P${dwellTime}\n`
    code += '\n'
    
    return code
  }
  
  const generateCycleButtonCodes = (cycleButtonCodes, selectedItems, currentZ, dwellTime, buttonCodes, layerThickness) => {
    let code = ''
    
    // 슬래시로 구분된 그룹들을 찾기
    const groups = []
    let currentGroup = []
    
    selectedItems.forEach(item => {
      if (item.name === '/') {
        if (currentGroup.length > 0) {
          groups.push(currentGroup)
          currentGroup = []
        }
      } else {
        currentGroup.push(item)
      }
    })
    
    // 마지막 그룹 추가
    if (currentGroup.length > 0) {
      groups.push(currentGroup)
    }
    
    // 그룹이 없으면 전체를 하나의 그룹으로 처리
    if (groups.length === 0) {
      groups.push(selectedItems.filter(item => item.name !== '/'))
    }
    
    // 현재 Z 높이에서 레이어 번호 계산 (layerThickness로 나누어서)
    // 예: Z=0.1, layerThickness=0.1이면 layer=1, Z=0.2면 layer=2
    const layerNumber = Math.floor(parseFloat(currentZ) / layerThickness) + 1
    
    // 레이어 번호로 그룹 선택 (1부터 시작하는 레이어 번호 사용)
    // 레이어 1: 그룹 0, 레이어 2: 그룹 1, 레이어 3: 그룹 0, 레이어 4: 그룹 1...
    const groupIndex = (layerNumber - 1) % groups.length
    const selectedGroup = groups[groupIndex] || groups[0] || []
    
    console.log(`레이어 ${layerNumber} (Z=${currentZ}), 선택된 그룹 ${groupIndex}:`, selectedGroup)
    
    selectedGroup.forEach((item) => {
      const buttonCode = buttonCodes[item.name] || `; ${item.name} - No code assigned`
      code += `; ${item.name}\n`
      
      // 버튼 코드를 현재 Z 높이에 맞춰 수정
      let modifiedCode = buttonCode
        // Z 값 교체
        .replace(/Z[0-9]*\.?[0-9]+/g, `Z${currentZ}`)
        // G4 P 값 교체
        .replace(/G4 P[0-9]+/g, `G4 P${dwellTime}`)
      
      code += modifiedCode + '\n\n'
    })
    
    return code
  }
  
  const generateProgramFooter = (selectedFeeder) => {
    let code = ''
    
    code += '; === 프로그램 푸터 ===\n'
    code += 'M51\n'
    code += `${selectedFeeder.off}\n`
    code += 'M41\n'
    code += 'M30\n'
    
    return code
  }
  
  return {
    generate3DPrintingCode,
    generateCodeContent
  }
}
