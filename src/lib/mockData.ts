import { Colaborador } from '@/types/apontamento';

export const colaboradoresMock: Colaborador[] = [
  {
    id: '1',
    nome: 'João da Silva',
    cpf: '123.456.789-00',
    fazenda: 'Fazenda Santa Rita',
    ativo: true
  },
  {
    id: '2',
    nome: 'Maria Santos',
    cpf: '987.654.321-00',
    fazenda: 'Fazenda Santa Rita',
    ativo: true
  },
  {
    id: '3',
    nome: 'Pedro Oliveira',
    cpf: '456.789.123-00',
    fazenda: 'Fazenda Santa Rita',
    ativo: true
  },
  {
    id: '4',
    nome: 'Ana Costa',
    cpf: '321.654.987-00',
    fazenda: 'Fazenda Santa Rita',
    ativo: true
  },
  {
    id: '5',
    nome: 'Carlos Pereira',
    cpf: '789.123.456-00',
    fazenda: 'Fazenda Boa Vista',
    ativo: true
  },
  {
    id: '6',
    nome: 'Lucia Ferreira',
    cpf: '654.987.321-00',
    fazenda: 'Fazenda Boa Vista',
    ativo: true
  }
];

export const fazendasMock = [
  'Fazenda Santa Rita',
  'Fazenda Boa Vista',
  'Fazenda São José',
  'Fazenda Esperança'
];

export const parcelasMock = [
  'P01', 'P02', 'P03', 'P04', 'P05',
  'A01', 'A02', 'B01', 'B02', 'C01'
];