

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
      
      // 2-1. 선택된 사이클의 버튼 코드들을 현재 Z 높이에 맞춰 생성
      generatedCode += generateCycleButtonCodes(
        cycleButtonCodes,
        cycle.selectedItems,
        currentZ,
        dwellTime,
        buttonCodes,
        layerThickness,
        selectedFeeder
      )
    }
    
    // 3. 프로그램 푸터 생성
    generatedCode += generateProgramFooter(selectedFeeder, dwellTime)
    
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
  
  const generateProgramFooter = (selectedFeeder, dwellTime) => {
    let code = ''
    
    code += '; === 프로그램 푸터 ===\n'
    code += `${selectedFeeder.off}\n`
    code += 'M41\n'
    code += 'M51\n'
    code += 'M53\n'
    code += 'G0 X0.0 Y0.0\n'
    code += `G4 P${dwellTime}\n`
    code += 'M90\n'
    code += 'G53\n'
    code += 'M30\n'
    
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
    
    return code
  }
  
  const generateCycleButtonCodes = (cycleButtonCodes, selectedItems, currentZ, dwellTime, buttonCodes, layerThickness, selectedFeeder) => {
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
    
    if (selectedGroup.length > 0) {
      const firstItem = selectedGroup[0]
      const firstButtonCode = buttonCodes[firstItem.name] || `; ${firstItem.name} - No code assigned`
      
      // 첫 번째 버튼 코드를 줄별로 분리
      const codeLines = firstButtonCode.split('\n')
      
      // 첫 번째 G0 명령어만 찾아서 처리
      let firstG0Found = false
      let remainingCode = ''
      
      for (const line of codeLines) {
        if (!firstG0Found && line.trim().startsWith('G0')) {
          // 첫 번째 G0 명령어를 현재 Z 높이에 맞춰 수정
          let modifiedG0 = line
            .replace(/Z[0-9]*\.?[0-9]+/g, `Z${currentZ}`)
            .replace(/G4 P[0-9]+/g, `G4 P${dwellTime}`)
          
          code += `; ${firstItem.name}\n`
          code += modifiedG0 + '\n'
          firstG0Found = true
          
          // 첫 번째 G0 명령어 다음에 레이어 변경 블록 추가 (첫 번째 레이어 제외)
          if (layerNumber > 1) {
            code += generateLayerChangeBlock(selectedFeeder, dwellTime)
            code += '; 나머지 동작 코드\n'
          }
          
          // 나머지 코드는 그대로 추가
          remainingCode = codeLines.slice(codeLines.indexOf(line) + 1).join('\n')
          break
        }
      }
      
      // 첫 번째 G0를 찾지 못한 경우 전체 코드를 그대로 사용
      if (!firstG0Found) {
        code += `; ${firstItem.name}\n`
        let modifiedCode = firstButtonCode
          .replace(/Z[0-9]*\.?[0-9]+/g, `Z${currentZ}`)
          .replace(/G4 P[0-9]+/g, `G4 P${dwellTime}`)
        code += modifiedCode + '\n'
      } else if (remainingCode.trim()) {
        // 나머지 코드가 있으면 Z 높이와 dwell time만 수정해서 추가
        let modifiedRemainingCode = remainingCode
          .replace(/Z[0-9]*\.?[0-9]+/g, `Z${currentZ}`)
          .replace(/G4 P[0-9]+/g, `G4 P${dwellTime}`)
        code += modifiedRemainingCode + '\n'
      }
      
      // 나머지 아이템들의 코드 생성
      for (let i = 1; i < selectedGroup.length; i++) {
        const item = selectedGroup[i]
        const buttonCode = buttonCodes[item.name] || `; ${item.name} - No code assigned`
        code += `; ${item.name}\n`
        
        // 버튼 코드를 현재 Z 높이에 맞춰 수정
        let modifiedCode = buttonCode
          // Z 값 교체
          .replace(/Z[0-9]*\.?[0-9]+/g, `Z${currentZ}`)
          // G4 P 값 교체
          .replace(/G4 P[0-9]+/g, `G4 P${dwellTime}`)
        
        code += modifiedCode + '\n\n'
      }
    }
    
    return code
  }
  
  return {
    generate3DPrintingCode,
    generateCodeContent
  }
}
