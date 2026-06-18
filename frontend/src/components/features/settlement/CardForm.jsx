import { Lock } from 'lucide-react';
import Input from '../../ui/Input';
import Badge from '../../ui/Badge';

const cardBrands = ['VISA', 'MC', 'AMEX', 'JCB'];

const CardForm = ({
  cardNumber,
  setCardNumber,
  cardholderName,
  setCardholderName,
  expiryDate,
  setExpiryDate,
  cvv,
  setCvv,
  saveCard,
  setSaveCard,
  savedCards = [],
  selectedSavedCardId,
  setSelectedSavedCardId,
}) => {
  const isUsingNewCard = !selectedSavedCardId || selectedSavedCardId === 'new_card';

  return (
    <section className="mb-12">
      <div className="flex border border-[#dcd9ce] bg-cream-light">
        <div className="w-1 bg-black shrink-0" aria-hidden="true" />

        <div className="flex-1 p-6 md:p-8">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#dcd9ce]">
            <h3 className="text-lg font-black tracking-tight text-black">Card Details</h3>
            <Lock size={14} strokeWidth={2} className="text-[#888888]" aria-hidden="true" />
          </div>

          <p className="text-[12px] leading-relaxed text-[#888888] font-medium mb-8">
            Your card details are encrypted end-to-end via PCI DSS Level 1 infrastructure. This
            transaction may trigger a 3D Secure verification.
          </p>

          {/* Saved Cards Selection */}
          {savedCards.length > 0 && (
            <div className="mb-8">
              <label className="block text-[11px] tracking-[0.15em] uppercase font-bold text-[#888888] mb-3">
                Saved Payment Methods
              </label>
              <div className="space-y-3">
                {savedCards.map((card) => (
                  <button
                    key={card.tokenId}
                    type="button"
                    onClick={() => setSelectedSavedCardId(card.tokenId)}
                    className={`w-full flex items-center justify-between p-4 border text-left transition-all ${
                      selectedSavedCardId === card.tokenId
                        ? 'border-black bg-[#faf8f5] shadow-sm'
                        : 'border-[#dcd9ce] bg-transparent hover:border-black'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border border-black flex items-center justify-center shrink-0">
                        {selectedSavedCardId === card.tokenId && (
                          <div className="w-2.5 h-2.5 rounded-full bg-black" />
                        )}
                      </div>
                      <span className="font-mono text-sm text-black">
                        {card.cardBrand.toUpperCase()} •••• {card.maskedCardNumber.slice(-4)}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#888888] font-mono">
                      Exp: {card.expiryMonth}/{card.expiryYear}
                    </span>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setSelectedSavedCardId('new_card')}
                  className={`w-full flex items-center gap-3 p-4 border text-left transition-all ${
                    isUsingNewCard
                      ? 'border-black bg-[#faf8f5] shadow-sm'
                      : 'border-[#dcd9ce] bg-transparent hover:border-black'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full border border-black flex items-center justify-center shrink-0">
                    {isUsingNewCard && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                  </div>
                  <span className="text-sm font-medium text-black">Use a new credit/debit card</span>
                </button>
              </div>
            </div>
          )}

          {/* New Card Fields */}
          {isUsingNewCard && (
            <div className="space-y-6">
              <Input
                label="Card Number"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={(event) => setCardNumber(event.target.value)}
                labelClassName="text-[#888888]"
                placeholderClassName="placeholder:text-gray-400"
              />

              <Input
                label="Cardholder Name"
                placeholder="Alexander V. Rothschild"
                value={cardholderName}
                onChange={(event) => setCardholderName(event.target.value)}
                labelClassName="text-[#888888]"
                placeholderClassName="placeholder:text-gray-400"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Expiry Date"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(event) => setExpiryDate(event.target.value)}
                  labelClassName="text-[#888888]"
                  placeholderClassName="placeholder:text-gray-400"
                />
                <Input
                  label="CVV"
                  placeholder="..."
                  type="password"
                  value={cvv}
                  onChange={(event) => setCvv(event.target.value)}
                  labelClassName="text-[#888888]"
                  placeholderClassName="placeholder:text-gray-400"
                />
              </div>

              {/* Save Card Checkbox */}
              <label className="flex items-center gap-3 cursor-pointer pt-2 select-none group">
                <input
                  type="checkbox"
                  checked={saveCard}
                  onChange={(e) => setSaveCard(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-4 h-4 border border-[#dcd9ce] peer-checked:border-black peer-checked:bg-black flex items-center justify-center transition-all">
                  {saveCard && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </div>
                <span className="text-[12px] text-[#888888] group-hover:text-black font-medium transition-colors">
                  Save card for future payments
                </span>
              </label>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-8">
            {cardBrands.map((brand) => (
              <Badge key={brand} variant="outline" size="xs">
                {brand}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardForm;
