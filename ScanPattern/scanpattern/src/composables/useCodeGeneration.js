

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
      scanSpeed,
      includeComments
    } = params
    
    console.log('피더 선택:', selectedFeeder)
    const generatedCode = generateCodeContent(
      layerThickness,
      dwellTime,
      target,
      selectedFeeder,
      selectedCycle,
      scanSpeed,
      includeComments,
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
    includeComments = true,
    buttonCodes
  ) => {
    console.log('generateCodeContent 호출됨:', { 
      layerThickness, 
      dwellTime, 
      target, 
      feeder, 
      cycle, 
      scanSpeed, 
      includeComments 
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
    generatedCode += generateProgramHeader(selectedFeeder, dwellTime, scanSpeed, includeComments)
    
    // 2. 레이어 루프 시작
    for (let layer = 1; layer <= totalLayers; layer++) {
      const currentZ = ((layer - 1) * layerThickness).toFixed(3)
      
      generatedCode += generateLayerHeader(layer, currentZ, includeComments)
      
      // 2-1. 레이어 변경 블록 (첫 번째 레이어 제외)
      if (layer > 1) {
        generatedCode += generateLayerChangeBlock(selectedFeeder, dwellTime, includeComments)
      }
      
      // 2-2. 선택된 사이클의 버튼 코드들을 현재 Z 높이에 맞춰 생성
      generatedCode += generateCycleButtonCodes(
        cycleButtonCodes,
        cycle.selectedItems,
        currentZ,
        dwellTime,
        includeComments
      )
    }
    
    // 3. 프로그램 푸터 생성
    generatedCode += generateProgramFooter(selectedFeeder, includeComments)
    
    return generatedCode.trim()
  }
  
  const generateProgramHeader = (selectedFeeder, dwellTime, scanSpeed, includeComments) => {
    let code = ''
    
    if (includeComments) {
      code += '; === 프로그램 헤더 ===\n'
    }
    code += 'G90\n'
    code += 'M50\n'
    code += `F${scanSpeed}\n`
    code += 'G54\n'
    code += 'M40\n'
    code += `${selectedFeeder.on}\n`
    code += `G4 P${dwellTime}\n`
    
    if (includeComments) {
      code += '\n'
    }
    
    return code
  }
  
  const generateLayerHeader = (layer, currentZ, includeComments) => {
    let code = ''
    
    if (includeComments) {
      code += `; === Layer ${layer} (Z = ${currentZ}) ===\n`
    }
    
    return code
  }
  
  const generateLayerChangeBlock = (selectedFeeder, dwellTime, includeComments) => {
    let code = ''
    
    if (includeComments) {
      code += '; 레이어 변경 블록\n'
    }
    code += 'M51\n'
    code += `${selectedFeeder.off}\n`
    code += 'M41\n'
    code += `G4 P${dwellTime}\n`
    code += 'M50\n'
    code += 'M40\n'
    code += `${selectedFeeder.on}\n`
    code += `G4 P${dwellTime}\n`
    
    if (includeComments) {
      code += '\n'
    }
    
    return code
  }
  
  const generateCycleButtonCodes = (cycleButtonCodes, selectedItems, currentZ, dwellTime, includeComments) => {
    let code = ''
    
    cycleButtonCodes.forEach((buttonCode, index) => {
      if (includeComments) {
        code += `; ${selectedItems[index]?.name || `Button ${index + 1}`}\n`
      }
      
      // 버튼 코드를 현재 Z 높이에 맞춰 수정
      let modifiedCode = buttonCode
        // Z 값 교체
        .replace(/Z[0-9]*\.?[0-9]+/g, `Z${currentZ}`)
        // G4 P 값 교체
        .replace(/G4 P[0-9]+/g, `G4 P${dwellTime}`)
      
      code += modifiedCode
      if (includeComments) {
        code += '\n\n'
      } else {
        code += '\n'
      }
    })
    
    return code
  }
  
  const generateProgramFooter = (selectedFeeder, includeComments) => {
    let code = ''
    
    if (includeComments) {
      code += '; === 프로그램 푸터 ===\n'
    }
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
