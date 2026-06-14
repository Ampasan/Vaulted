import { useState } from 'react';
import { Lock } from 'lucide-react';
import Input from '../../ui/Input';
import Badge from '../../ui/Badge';

const cardBrands = ['VISA', 'MC', 'AMEX', 'JCB'];

const CardForm = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

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
          </div>

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
