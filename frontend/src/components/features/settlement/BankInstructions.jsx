import { Lock, Copy } from 'lucide-react';

const defaultFields = [
  { label: 'Beneficiary Bank', value: 'Swiss Central Trust', highlight: false },
  { label: 'Swift Code', value: 'SCTBCH22', highlight: false },
  { label: 'Account Number', value: '0098 7762 1109', highlight: false },
  { label: 'Required Reference', value: '#VLT-982X-77', highlight: true },
];

const CopyField = ({ label, value, highlight = false }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <div className="py-4 border-b border-[#dcd9ce] last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[12px] tracking-[0.2em] uppercase font-bold text-[#888888] mb-2">
            {label}
          </p>
          <p
            className={`text-base  font-mono font-medium break-all ${
              highlight ? 'text-[#B22222]' : 'text-black'
            }`}
          >
            {value}
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 text-[#888888] hover:text-black transition-colors mt-1"
          aria-label={`Copy ${label}`}
        >
          <Copy size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

const BankInstructions = ({ virtualAccountDetails }) => {
  let fields = defaultFields;

  if (virtualAccountDetails) {
    const displayBankName = virtualAccountDetails.bankCode?.replace('_VIRTUAL_ACCOUNT', '');
    fields = [
      { label: 'Beneficiary Bank', value: displayBankName, highlight: false },
      { label: 'Account Name', value: virtualAccountDetails.name, highlight: false },
      { label: 'Account Number (VA)', value: virtualAccountDetails.accountNumber, highlight: true },
      { label: 'Amount to Pay', value: `IDR ${virtualAccountDetails.expectedAmount.toLocaleString()}`, highlight: false },
    ];
  }

  return (
    <section className="mb-12">
      <div className="flex border border-[#dcd9ce] bg-cream-light">
        <div className="w-1 bg-black shrink-0" aria-hidden="true" />

        <div className="flex-1 p-6 md:p-8">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#dcd9ce]">
            <h3 className="text-lg font-black tracking-tight text-black">Bank Instructions</h3>
            <Lock size={14} strokeWidth={2} className="text-[#888888]" aria-hidden="true" />
          </div>

          <p className="text-[12px] leading-relaxed text-[#888888] font-medium mb-6">
            Initiate a wire transfer to the beneficiary account below. Include the required
            reference exactly as shown — settlement is released upon verified receipt within 48
            business hours.
          </p>

          <div>
            {fields.map((field) => (
              <CopyField
                key={field.label}
                label={field.label}
                value={field.value}
                highlight={field.highlight}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BankInstructions;
