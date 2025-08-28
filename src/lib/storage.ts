import { RomaneioFiscal, RomaneioCompleto, RomaneioStorage } from '@/types/romaneio';

const STORAGE_KEY = 'romaneios_agro_app';

export const storage = {
  get(): RomaneioStorage {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do localStorage:', error);
    }
    
    return {
      romaneiosFiscal: [],
      romaneiosCompletos: [],
      lastSync: new Date().toISOString()
    };
  },

  save(data: RomaneioStorage): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar dados no localStorage:', error);
    }
  },

  addRomaneioFiscal(romaneio: RomaneioFiscal): void {
    const data = this.get();
    data.romaneiosFiscal.push(romaneio);
    this.save(data);
  },

  updateRomaneioCompleto(romaneio: RomaneioCompleto): void {
    const data = this.get();
    
    // Remove o romaneio fiscal original
    data.romaneiosFiscal = data.romaneiosFiscal.filter(r => r.id !== romaneio.id);
    
    // Adiciona ou atualiza o romaneio completo
    const existingIndex = data.romaneiosCompletos.findIndex(r => r.id === romaneio.id);
    if (existingIndex >= 0) {
      data.romaneiosCompletos[existingIndex] = romaneio;
    } else {
      data.romaneiosCompletos.push(romaneio);
    }
    
    this.save(data);
  },

  getRomaneioById(id: string): RomaneioFiscal | RomaneioCompleto | null {
    const data = this.get();
    
    const fiscal = data.romaneiosFiscal.find(r => r.id === id);
    if (fiscal) return fiscal;
    
    const completo = data.romaneiosCompletos.find(r => r.id === id);
    if (completo) return completo;
    
    return null;
  }
};