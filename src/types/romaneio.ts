export interface RomaneioFiscal {
  id: string;
  fazenda: string;
  numeroRomaneio: string;
  parcelas: string[];
  quantidadeDeclarada: number;
  destino: string;
  dataHoraCriacao: string;
  fiscal?: string;
}

export interface RomaneioCompleto extends RomaneioFiscal {
  motorista: string;
  cpfMotorista: string;
  placaVeiculo: string;
  transportadora: string;
  dataHoraChegada: string;
  qrCodeFinal?: string;
  status: 'pendente' | 'completo' | 'entregue';
}

export interface RomaneioStorage {
  romaneiosFiscal: RomaneioFiscal[];
  romaneiosCompletos: RomaneioCompleto[];
  lastSync: string;
}