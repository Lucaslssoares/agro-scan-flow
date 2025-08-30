import { Apontamento, ConsolidacaoParcela, BalancaData } from '@/types/apontamento';
import { colaboradoresMock } from '@/lib/mockData';

const APONTAMENTOS_KEY = 'apontamentos_agro_app';
const BALANCA_KEY = 'balanca_agro_app';

export const apontamentoStorage = {
  getApontamentos(): Apontamento[] {
    try {
      const data = localStorage.getItem(APONTAMENTOS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao carregar apontamentos:', error);
      return [];
    }
  },

  saveApontamento(apontamento: Apontamento): void {
    try {
      const apontamentos = this.getApontamentos();
      apontamentos.push(apontamento);
      localStorage.setItem(APONTAMENTOS_KEY, JSON.stringify(apontamentos));
    } catch (error) {
      console.error('Erro ao salvar apontamento:', error);
    }
  },

  getColaboradores(fazenda?: string) {
    if (fazenda) {
      return colaboradoresMock.filter(c => c.fazenda === fazenda && c.ativo);
    }
    return colaboradoresMock.filter(c => c.ativo);
  },

  consolidarParcela(fazenda: string, parcela: string, data: string): ConsolidacaoParcela {
    const apontamentos = this.getApontamentos();
    const apontamentosParcela = apontamentos.filter(a => 
      a.fazenda === fazenda && 
      a.parcela === parcela && 
      a.data === data
    );

    const colaboradoresMap = new Map();
    
    apontamentosParcela.forEach(apontamento => {
      const colaboradorId = apontamento.colaboradorId;
      if (colaboradoresMap.has(colaboradorId)) {
        colaboradoresMap.get(colaboradorId).caixas += apontamento.quantidadeCaixas;
      } else {
        colaboradoresMap.set(colaboradorId, {
          id: colaboradorId,
          nome: apontamento.colaboradorNome,
          caixas: apontamento.quantidadeCaixas
        });
      }
    });

    const colaboradores = Array.from(colaboradoresMap.values());
    const totalCaixas = colaboradores.reduce((total, col) => total + col.caixas, 0);

    return {
      fazenda,
      parcela,
      data,
      totalCaixas,
      colaboradores
    };
  },

  getRelatorioColaborador(colaboradorId: string, dataInicio: string, dataFim: string) {
    const apontamentos = this.getApontamentos();
    const colaborador = colaboradoresMock.find(c => c.id === colaboradorId);
    
    const apontamentosColaborador = apontamentos.filter(a => 
      a.colaboradorId === colaboradorId &&
      a.data >= dataInicio &&
      a.data <= dataFim
    );

    const totalCaixas = apontamentosColaborador.reduce((total, a) => total + a.quantidadeCaixas, 0);

    return {
      colaborador,
      apontamentos: apontamentosColaborador,
      totalCaixas,
      diasTrabalhados: new Set(apontamentosColaborador.map(a => a.data)).size
    };
  },

  getRelatorioFazenda(fazenda: string, dataInicio: string, dataFim: string) {
    const apontamentos = this.getApontamentos();
    
    const apontamentosFazenda = apontamentos.filter(a => 
      a.fazenda === fazenda &&
      a.data >= dataInicio &&
      a.data <= dataFim
    );

    const parcelasMap = new Map();
    
    apontamentosFazenda.forEach(apontamento => {
      const parcela = apontamento.parcela;
      if (parcelasMap.has(parcela)) {
        parcelasMap.get(parcela).caixas += apontamento.quantidadeCaixas;
      } else {
        parcelasMap.set(parcela, {
          parcela,
          caixas: apontamento.quantidadeCaixas
        });
      }
    });

    const parcelas = Array.from(parcelasMap.values());
    const totalCaixas = parcelas.reduce((total, p) => total + p.caixas, 0);

    return {
      fazenda,
      parcelas,
      totalCaixas,
      periodo: { dataInicio, dataFim }
    };
  },

  // Balança
  getBalancaData(): BalancaData[] {
    try {
      const data = localStorage.getItem(BALANCA_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao carregar dados da balança:', error);
      return [];
    }
  },

  saveBalancaData(balanca: BalancaData): void {
    try {
      const dados = this.getBalancaData();
      const existingIndex = dados.findIndex(d => d.romaneioId === balanca.romaneioId);
      
      if (existingIndex >= 0) {
        dados[existingIndex] = balanca;
      } else {
        dados.push(balanca);
      }
      
      localStorage.setItem(BALANCA_KEY, JSON.stringify(dados));
    } catch (error) {
      console.error('Erro ao salvar dados da balança:', error);
    }
  },

  getBalancaByRomaneio(romaneioId: string): BalancaData | null {
    const dados = this.getBalancaData();
    return dados.find(d => d.romaneioId === romaneioId) || null;
  }
};