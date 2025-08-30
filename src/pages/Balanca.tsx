import { Header } from "@/components/Header";
import { BalancaSimulator } from "@/components/BalancaSimulator";

const Balanca = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Operador de Balança" 
        subtitle="Pesagem e validação de romaneios"
        icon="balanca"
      />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <BalancaSimulator />
      </main>
    </div>
  );
};

export default Balanca;