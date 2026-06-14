import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Button from "../components/ui/Button";
import SettlementAssetCard from "../components/features/settlement/SettlementAssetCard";
import VerificationProtocols from "../components/features/settlement/VerificationProtocols";
import PaymentMethodSelector from "../components/features/settlement/PaymentMethodSelector";
import BankInstructions from "../components/features/settlement/BankInstructions";
import CardForm from "../components/features/settlement/CardForm";

const defaultSettlementAsset = {
  image:
    "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=400",
  title: "Patek Philippe Grandmaster Chime",
  currency: "CHF",
  amount: "31,190,400",
};

const SettlementPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const settlementAsset = location.state?.asset ?? defaultSettlementAsset;
  const returnTo = location.state?.returnTo ?? "/marketplace";
  const [paymentMethod, setPaymentMethod] = useState("bank");

  const confirmLabel =
    paymentMethod === "bank"
      ? "Confirm Bank Transfer Initiation →"
      : "Confirm Card Payment →";

  const handleConfirm = () => {
    console.log("Confirm settlement", { paymentMethod });
  };

  return (
    <div className="flex flex-col min-h-screen bg-cream text-ink">
      <Navbar />

      <main className="flex-1 w-full max-w-360 mx-auto px-6 lg:px-12 py-8 lg:py-12">
        <Button
          variant="ghost"
          size="link"
          onClick={() => navigate(returnTo)}
          className="px-0 mb-6 text-[12px] tracking-[0.2em] text-[#888888] hover:text-black normal-case font-bold flex items-center gap-2"
        >
          <ArrowLeft size={16} strokeWidth={2} /> Cancel Settlement
        </Button>

        <Header
          title="Asset Acquisition Settlement"
          description="Secure clearing and escrow allocation for high-value physical assets."
        />

        <div className="border-t border-[#dcd9ce] mb-12" />

        <SettlementAssetCard
          image={settlementAsset.image}
          title={settlementAsset.title}
          currency={settlementAsset.currency}
          amount={settlementAsset.amount}
        />

        <VerificationProtocols />

        <PaymentMethodSelector
          value={paymentMethod}
          onChange={setPaymentMethod}
        />

        {paymentMethod === "bank" && <BankInstructions />}
        {paymentMethod === "card" && <CardForm />}

        <div className="mt-4">
          <Button variant="primary" size="lg" fullWidth onClick={handleConfirm}>
            {confirmLabel}
          </Button>
          <p className="text-center text-[13px] text-[#888888] font-medium mt-5">
            A digitally signed copy of this document will be sent to your secure
            vault inbox.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SettlementPage;
