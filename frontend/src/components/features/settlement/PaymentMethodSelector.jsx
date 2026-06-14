import { useState } from 'react';
import { Building2, CreditCard } from 'lucide-react';
import SettlementSectionLabel from './SettlementSectionLabel';

const paymentMethods = [
  {
    id: 'bank',
    title: 'Bank Transfer',
    description: 'Bank-to-bank • 48h settlement',
    icon: Building2,
  },
  {
    id: 'card',
    title: 'Credit / Debit Card',
    description: 'Visa, Mastercard, Amex',
    icon: CreditCard,
  },
];

const PaymentMethodSelector = ({ value, onChange, defaultValue = 'bank' }) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const selectedMethod = value ?? internalValue;

  const handleSelect = (methodId) => {
    if (value === undefined) {
      setInternalValue(methodId);
    }
    onChange?.(methodId);
  };

  return (
    <section className="mb-12">
      <SettlementSectionLabel title="Payment Method" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;

          return (
            <button
              key={method.id}
              type="button"
              onClick={() => handleSelect(method.id)}
              className={`text-left p-5 md:p-6 transition-colors bg-cream-light ${
                isSelected
                  ? 'border-2 border-black'
                  : 'border border-[#dcd9ce] hover:border-black/40'
              }`}
            >
              <Icon size={18} strokeWidth={1.75} className="text-black mb-3" />
              <h3 className="text-base font-black tracking-tight text-black mb-2">{method.title}</h3>
              <p className="text-[13px] font-mono text-[#888888]">{method.description}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default PaymentMethodSelector;
