import Input from '../../ui/Input';

const SectionHeading = ({ title }) => (
  <div className="flex items-center gap-3 mb-8">
    <span className="w-1 h-6 bg-black shrink-0" aria-hidden="true" />
    <h2 className="text-xl font-black tracking-tight text-black">{title}</h2>
  </div>
);

const mutedInputProps = {
  labelClassName: 'text-gray-500',
  placeholderClassName: 'placeholder:text-gray-300',
};

const FixedPriceSection = ({ values, onChange }) => {
  return (
    <section>
      <SectionHeading title="Fixed Sale Price" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
        <Input
          {...mutedInputProps}
          label="Asking Price"
          placeholder="0.00"
          value={values.askingPrice}
          onChange={(event) => onChange({ ...values, askingPrice: event.target.value })}
          inputClassName="text-2xl md:text-3xl font-mono py-3"
        />
        <p className="text-[13px] leading-relaxed font-medium text-gray-500 pt-7 md:pt-8">
          Vaulted charges a 2.5% seller commission upon successful acquisition.
          Final settlement via secured wire transfer.
        </p>
      </div>
    </section>
  );
};

export default FixedPriceSection;
