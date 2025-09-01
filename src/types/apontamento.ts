export interface Colaborador {
  id: string;
  nome: string;
  cpf: string;
  fazenda: string;
  ativo: boolean;
}

export interface Apontamento {
  id: string;
  colaboradorId: string;
  colaboradorNome: string;
  fazenda: string;
  parcela: string;
  quantidadeCaixas: number;
  data: string;
  fiscalNome?: string;
  dataHoraCriacao: string;
}

export interface ConsolidacaoParcela {
  fazenda: string;
  parcela: string;
  data: string;
  totalCaixas: number;
  colaboradores: {
    id: string;
    nome: string;
    caixas: number;
  }[];
}

export interface BalancaData {
  romaneioId: string;
  pesoBruto: number;
  tara: number;
  pesoLiquido: number;
  dataHoraPesagem: string;
  operador: string;
  status: 'valido' | 'divergencia';
  observacoes?: string;
}