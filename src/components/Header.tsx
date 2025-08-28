import { Wheat, Truck, QrCode } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  icon?: "fiscal" | "motorista" | "qr";
}

export const Header = ({ title, subtitle, icon }: HeaderProps) => {
  const IconComponent = {
    fiscal: Wheat,
    motorista: Truck,
    qr: QrCode
  }[icon || "fiscal"];

  return (
    <header className="bg-[var(--gradient-primary)] text-white p-6 shadow-[var(--shadow-strong)]">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
          <IconComponent className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && (
            <p className="text-white/90 text-sm">{subtitle}</p>
          )}
        </div>
      </div>
    </header>
  );
};