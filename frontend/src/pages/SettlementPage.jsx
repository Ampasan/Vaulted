import { useState, useEffect } from "react";
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
import VerificationUploadSection from "../components/features/asset/VerificationUploadSection";
import assetService from "../services/assetService";
import paymentService from "../services/paymentService";
import useAuth from "../hooks/useAuth";

const SettlementPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const settlementAsset = location.state?.asset;
  const returnTo = location.state?.returnTo ?? "/marketplace";

  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [documents, setDocuments] = useState({ imageUrls: [], verificationDocument: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [selectedBank, setSelectedBank] = useState("BCA_VIRTUAL_ACCOUNT");
  const [virtualAccountDetails, setVirtualAccountDetails] = useState(null);

  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const [savedCards, setSavedCards] = useState([]);
  const [selectedSavedCardId, setSelectedSavedCardId] = useState("");

  console.log("SettlementPage asset:", settlementAsset);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.xendit.co/v1/xendit.min.js";
    script.async = true;
    script.onload = () => {
      if (window.Xendit) {
        window.Xendit.setPublishableKey(import.meta.env.VITE_XENDIT_PUBLIC_KEY);
      }
    };
    document.body.appendChild(script);

    const fetchSavedCards = async () => {
      try {
        const res = await paymentService.getSavedCards();
        if (res.success && res.data.length > 0) {
          setSavedCards(res.data);
          setSelectedSavedCardId(res.data[0].tokenId);
        }
      } catch (err) {
        console.error("Failed to fetch saved cards:", err);
      }
    };
    fetchSavedCards();

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const confirmLabel = loading
    ? "Processing Settlement..."
    : virtualAccountDetails
      ? "Return to Portfolio"
      : paymentMethod === "bank"
        ? "Confirm Bank Transfer Initiation →"
        : "Confirm Card Payment →";

  const tokenizeCard = () => {
    return new Promise((resolve, reject) => {
      if (!window.Xendit) {
        return reject(new Error("Xendit payment library is not loaded."));
      }

      const parts = expiryDate.split("/");
      if (parts.length !== 2) {
        return reject(new Error("Invalid expiry date. Format must be MM/YY."));
      }

      const month = parts[0].trim();
      const year = "20" + parts[1].trim();
      const rawAmount = settlementAsset.amount?.toString() || "0";
      const amount = Number(rawAmount.replace(/[^0-9.-]/g, ""));

      if (Number.isNaN(amount) || amount < 0) {
        return reject(new Error("Invalid settlement amount."));
      }

      const nameParts = cardholderName.trim().split(" ");
      const firstName = nameParts[0] || "Cardholder";
      const lastName = nameParts.slice(1).join(" ") || "Name";

      const cardData = {
        card_number: cardNumber.replace(/\s/g, ""),
        card_exp_month: month,
        card_exp_year: year,
        card_cvn: cvv.trim(),
        card_holder_first_name: firstName,
        card_holder_last_name: lastName,
        card_holder_email: user.email,
        is_multiple_use: saveCard,
        should_authenticate: true,
        amount,
      };

      console.log("Tokenizing card with data:", { ...cardData, card_number: "****" + cardData.card_number.slice(-4) });

      window.Xendit.card.createToken(cardData, (err, response) => {
        if (err) {
          console.error("Xendit Card Tokenization Error:", err);
          return reject(new Error(err.message || "Failed to tokenize card."));
        }
        console.log("Tokenization response:", response);
        console.log("Token ID:", response.id);
        console.log("Authentication ID:", response.authentication_id);
        resolve(response);
      });
    });
  };

  const handleConfirm = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      if (paymentMethod === "card") {
        const amountValue = typeof settlementAsset.amount === 'number'
          ? settlementAsset.amount
          : Number(settlementAsset.amount?.toString().replace(/[^0-9.-]/g, "") || 0);

        if (isNaN(amountValue) || amountValue <= 0) {
          throw new Error(`Invalid amount: ${settlementAsset.amount}`);
        }

        if (selectedSavedCardId && selectedSavedCardId !== "new_card") {
          console.log("Using saved card:", selectedSavedCardId);
          const chargeRes = await paymentService.chargeCard({
            tokenId: selectedSavedCardId,
            itemId: settlementAsset.id,
            amount: amountValue,
            saveCard: false,
            isMarketplacePurchase: settlementAsset.isMarketplacePurchase ?? false,
          });

          if (chargeRes.success && chargeRes.status === "completed") {
            setSuccess(true);
            setTimeout(() => {
              navigate("/portfolio");
            }, 2000);
          } else if (chargeRes.success && chargeRes.status === "pending" && chargeRes.actionUrl) {
            window.location.href = chargeRes.actionUrl;
          } else {
            throw new Error(chargeRes.message || "Payment failed");
          }
          return;
        }

        if (!cardNumber || !cardholderName || !expiryDate || !cvv) {
          throw new Error("All card details are required for new card purchase.");
        }

        const parts = expiryDate.split("/");
        if (parts.length !== 2) {
          throw new Error("Invalid expiry date. Format must be MM/YY.");
        }

        const month = parts[0].trim();
        const year = "20" + parts[1].trim();

        console.log("Sending card details to backend for V3 processing...");

        const chargePayload = {
          cardNumber: cardNumber.replace(/\s/g, ""),
          expiryMonth: month,
          expiryYear: year,
          cvv: cvv.trim(),
          cardholderName: cardholderName,
          cardholderEmail: user?.email || 'test.buyer@vaulted.com',
          itemId: settlementAsset.id,
          amount: amountValue,
          saveCard: saveCard,
          isMarketplacePurchase: settlementAsset.isMarketplacePurchase ?? false,
        };

        console.log("Charge payload:", chargePayload);

        const chargeRes = await paymentService.chargeCard(chargePayload);

        if (chargeRes.success && chargeRes.status === "completed") {
          setSuccess(true);
          setTimeout(() => {
            navigate("/portfolio");
          }, 2000);
        } else if (chargeRes.success && chargeRes.status === "pending" && chargeRes.actionUrl) {
          window.location.href = chargeRes.actionUrl;
        } else {
          throw new Error(chargeRes.message || "Payment failed");
        }
      } else {
        // Bank Transfer
        if (virtualAccountDetails) {
          navigate("/portfolio");
          return;
        }

        const res = await paymentService.createVirtualAccount({
          itemId: settlementAsset.id,
          bankCode: selectedBank
        });

        if (res.success && res.virtualAccount) {
          setVirtualAccountDetails(res.virtualAccount);
        } else {
          throw new Error(res.message || "Acquisition settlement failed.");
        }
      }
    } catch (err) {
      console.error("Settlement error:", err);
      setError(err.message || "An unexpected error occurred during settlement.");
    } finally {
      setLoading(false);
    }
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
          disabled={loading || success}
        >
          <ArrowLeft size={16} strokeWidth={2} /> Cancel Settlement
        </Button>

        <Header
          title="Asset Acquisition Settlement"
          description="Secure clearing and escrow allocation for high-value physical assets."
        />

        <div className="border-t border-[#dcd9ce] mb-12" />

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm border border-red-200 uppercase font-mono tracking-wider">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 text-sm border border-green-200 uppercase font-mono tracking-wider">
            Settlement confirmed! Redirecting to secure portfolio...
          </div>
        )}

        <SettlementAssetCard
          image={settlementAsset.image}
          title={settlementAsset.title}
          currency={settlementAsset.currency}
          amount={settlementAsset.amount}
        />

        <VerificationProtocols
          buyerIdentity={user.name}
        />

        <div className="mb-12">
          <VerificationUploadSection
            listingType="sell"
            onFilesChange={setDocuments}
          />
        </div>

        <PaymentMethodSelector
          value={paymentMethod}
          onChange={setPaymentMethod}
        />

        {paymentMethod === "bank" && (
          <div className="mb-6">
            {!virtualAccountDetails ? (
              <div className="p-6 bg-white border border-[#dcd9ce]">
                <label className="block text-[12px] uppercase font-bold tracking-[0.2em] text-[#888888] mb-2">
                  Select Beneficiary Bank
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full h-12 px-4 bg-transparent border border-black text-black font-medium focus:outline-none focus:ring-1 focus:ring-black rounded-none"
                >
                  <option value="BCA_VIRTUAL_ACCOUNT">BCA</option>
                  <option value="MANDIRI_VIRTUAL_ACCOUNT">MANDIRI</option>
                  <option value="BNI_VIRTUAL_ACCOUNT">BNI</option>
                  <option value="BRI_VIRTUAL_ACCOUNT">BRI</option>
                  <option value="PERMATA_VIRTUAL_ACCOUNT">PERMATA</option>
                </select>
              </div>
            ) : (
              <BankInstructions virtualAccountDetails={virtualAccountDetails} />
            )}
          </div>
        )}
        {paymentMethod === "card" && (
          <CardForm
            cardNumber={cardNumber}
            setCardNumber={setCardNumber}
            cardholderName={cardholderName}
            setCardholderName={setCardholderName}
            expiryDate={expiryDate}
            setExpiryDate={setExpiryDate}
            cvv={cvv}
            setCvv={setCvv}
            saveCard={saveCard}
            setSaveCard={setSaveCard}
            savedCards={savedCards}
            selectedSavedCardId={selectedSavedCardId}
            setSelectedSavedCardId={setSelectedSavedCardId}
          />
        )}

        <div className="mt-4">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleConfirm}
            disabled={loading || success}
          >
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
