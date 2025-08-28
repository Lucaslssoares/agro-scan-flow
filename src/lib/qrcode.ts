import QRCode from 'qrcode';
import { RomaneioFiscal, RomaneioCompleto } from '@/types/romaneio';

export const generateQRCode = async (data: RomaneioFiscal | RomaneioCompleto): Promise<string> => {
  try {
    const qrData = JSON.stringify(data);
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      width: 256,
      margin: 2,
      color: {
        dark: '#1a5a3a', // Verde escuro do design system
        light: '#ffffff'
      }
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    throw new Error('Falha ao gerar QR Code');
  }
};

export const parseQRCode = (qrData: string): RomaneioFiscal | RomaneioCompleto | null => {
  try {
    const data = JSON.parse(qrData);
    
    // Validação básica dos campos obrigatórios
    if (!data.id || !data.fazenda || !data.numeroRomaneio) {
      throw new Error('Dados inválidos no QR Code');
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao interpretar QR Code:', error);
    return null;
  }
};