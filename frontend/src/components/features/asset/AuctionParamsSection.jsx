import Input from '../../ui/Input';
import Toggle from '../../ui/Toggle';

const SectionHeading = ({ title }) => (
  <div className="flex items-center gap-3 mb-8">
    <span className="w-1 h-6 bg-black shrink-0" aria-hidden="true" />
    <h2 className="text-xl font-black tracking-tight text-black">{title}</h2>
  </div>
);

const durationOptions = [
  { value: '', label: 'Select duration' },
  { value: '3', label: '3 Days' },
  { value: '5', label: '5 Days' },
  { value: '7', label: '7 Days' },
  { value: '14', label: '14 Days' },
];

const mutedInputProps = {
  labelClassName: 'text-gray-500',
  placeholderClassName: 'placeholder:text-gray-300',
  selectIconClassName: 'text-gray-400',
};

const AuctionParamsSection = ({ values, onChange }) => {
  const handleChange = (field) => (event) => {
    onChange({ ...values, [field]: event.target.value });
  };

  return (
    <section>
      <SectionHeading title="Auction Parameters" />

      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <Input
            {...mutedInputProps}
            label="Reserve Price (CHF)"
            placeholder="Confidential minimum"
            value={values.reservePrice}
            onChange={handleChange('reservePrice')}
          />
          <Input
            {...mutedInputProps}
            label="Opening Bid (CHF)"
            placeholder="CHF Starting price shown to bidders"
            value={values.openingBid}
            onChange={handleChange('openingBid')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <Input
            {...mutedInputProps}
            label="Bid Increment Step (CHF)"
            placeholder="CHF 100,000 to bidders"
            value={values.bidIncrement}
            onChange={handleChange('bidIncrement')}
          />
          <Input
            {...mutedInputProps}
            label="Auction Duration"
            as="select"
            options={durationOptions}
            value={values.duration}
            onChange={handleChange('duration')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-end">
          <Input
            {...mutedInputProps}
            label="Auction Start Date"
            type="date"
            value={values.startDate}
            onChange={handleChange('startDate')}
          />
          <div className="flex items-center justify-between pb-2.5 border-b border-gray-400">
            <span className="text-[11px] tracking-[0.15em] uppercase font-medium text-gray-500">
              Enable Buy Now Price
            </span>
            <Toggle
              checked={values.buyNowEnabled}
              onChange={(event) =>
                onChange({ ...values, buyNowEnabled: event.target.checked })
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuctionParamsSection;
