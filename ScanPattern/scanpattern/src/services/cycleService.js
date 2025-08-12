import { supabase } from '../config/supabase'

export class CycleService {
  // 모든 사이클 조회
  static async getAllCycles() {
    try {
      // Supabase가 설정되지 않은 경우 로컬 스토리지 사용
      if (!supabase) {
        console.warn('Supabase가 설정되지 않아 로컬 스토리지를 사용합니다.')
        const localCycles = localStorage.getItem('savedCycles')
        return localCycles ? JSON.parse(localCycles) : []
      }

      const { data, error } = await supabase
        .from('cycles')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('사이클 조회 오류:', error)
      // 오류 발생 시 로컬 스토리지에서 복원 시도
      try {
        const localCycles = localStorage.getItem('savedCycles')
        return localCycles ? JSON.parse(localCycles) : []
      } catch (localError) {
        console.error('로컬 스토리지 복원 실패:', localError)
        return []
      }
    }
  }

  // 사이클 저장
  static async saveCycle(cycleData) {
    try {
      // Supabase가 설정되지 않은 경우 로컬 스토리지 사용
      if (!supabase) {
        console.warn('Supabase가 설정되지 않아 로컬 스토리지를 사용합니다.')
        const localCycles = JSON.parse(localStorage.getItem('savedCycles') || '[]')
        const newCycle = {
          id: Date.now(),
          name: cycleData.name,
          content: cycleData.content,
          selected_items: cycleData.selectedItems,
          created_at: new Date().toISOString()
        }
        localCycles.unshift(newCycle)
        localStorage.setItem('savedCycles', JSON.stringify(localCycles))
        return newCycle
      }

      const { data, error } = await supabase
        .from('cycles')
        .insert([{
          name: cycleData.name,
          content: cycleData.content,
          selected_items: cycleData.selectedItems,
          created_at: new Date().toISOString()
        }])
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('사이클 저장 오류:', error)
      // 오류 발생 시 로컬 스토리지에 저장
      try {
        const localCycles = JSON.parse(localStorage.getItem('savedCycles') || '[]')
        const newCycle = {
          id: Date.now(),
          name: cycleData.name,
          content: cycleData.content,
          selected_items: cycleData.selectedItems,
          created_at: new Date().toISOString()
        }
        localCycles.unshift(newCycle)
        localStorage.setItem('savedCycles', JSON.stringify(localCycles))
        return newCycle
      } catch (localError) {
        console.error('로컬 스토리지 저장 실패:', localError)
        throw new Error('사이클 저장에 실패했습니다.')
      }
    }
  }

  // 사이클 수정
  static async updateCycle(id, cycleData) {
    try {
      // Supabase가 설정되지 않은 경우 로컬 스토리지 사용
      if (!supabase) {
        console.warn('Supabase가 설정되지 않아 로컬 스토리지를 사용합니다.')
        const localCycles = JSON.parse(localStorage.getItem('savedCycles') || '[]')
        const index = localCycles.findIndex(cycle => cycle.id === id)
        if (index > -1) {
          localCycles[index] = {
            ...localCycles[index],
            name: cycleData.name,
            content: cycleData.content,
            selected_items: cycleData.selectedItems,
            updated_at: new Date().toISOString()
          }
          localStorage.setItem('savedCycles', JSON.stringify(localCycles))
          return localCycles[index]
        }
        throw new Error('사이클을 찾을 수 없습니다.')
      }

      const { data, error } = await supabase
        .from('cycles')
        .update({
          name: cycleData.name,
          content: cycleData.content,
          selected_items: cycleData.selectedItems,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('사이클 수정 오류:', error)
      throw new Error('사이클 수정에 실패했습니다.')
    }
  }

  // 사이클 삭제
  static async deleteCycle(id) {
    try {
      // Supabase가 설정되지 않은 경우 로컬 스토리지 사용
      if (!supabase) {
        console.warn('Supabase가 설정되지 않아 로컬 스토리지를 사용합니다.')
        const localCycles = JSON.parse(localStorage.getItem('savedCycles') || '[]')
        const filteredCycles = localCycles.filter(cycle => cycle.id !== id)
        localStorage.setItem('savedCycles', JSON.stringify(filteredCycles))
        return true
      }

      const { error } = await supabase
        .from('cycles')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return true
    } catch (error) {
      console.error('사이클 삭제 오류:', error)
      throw new Error('사이클 삭제에 실패했습니다.')
    }
  }

  // 사이클 ID로 조회
  static async getCycleById(id) {
    try {
      // Supabase가 설정되지 않은 경우 로컬 스토리지 사용
      if (!supabase) {
        console.warn('Supabase가 설정되지 않아 로컬 스토리지를 사용합니다.')
        const localCycles = JSON.parse(localStorage.getItem('savedCycles') || '[]')
        return localCycles.find(cycle => cycle.id === id)
      }

      const { data, error } = await supabase
        .from('cycles')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('사이클 조회 오류:', error)
      throw new Error('사이클을 찾을 수 없습니다.')
    }
  }
}
