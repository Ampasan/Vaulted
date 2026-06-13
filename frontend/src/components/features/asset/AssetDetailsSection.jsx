import { Tag } from 'lucide-react';
import Input from '../../ui/Input';

const SectionHeading = ({ title }) => (
  <div className="flex items-center gap-3 mb-8">
    <span className="w-1 h-6 bg-black shrink-0" aria-hidden="true" />
    <h2 className="text-xl font-black tracking-tight text-black">{title}</h2>
  </div>
);

const categoryOptions = [
  { value: '', label: 'Select category' },
  { value: 'horology', label: 'Horology' },
  { value: 'automobiles', label: 'Automobiles' },
  { value: 'fine-art', label: 'Fine Art' },
  { value: 'jewelry', label: 'Jewelry' },
  { value: 'real-estate', label: 'Real Estate' },
];

const conditionOptions = [
  { value: '', label: 'Select condition' },
  { value: 'mint', label: 'Mint / Unworn' },
  { value: 'excellent', label: 'Excellent' },
  { value: 'very-good', label: 'Very Good' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
];

const buyerTierOptions = [
  { value: '', label: 'Select tier' },
  { value: 'standard', label: 'Standard Verified' },
  { value: 'premium', label: 'Premium Collector' },
  { value: 'institutional', label: 'Institutional' },
];

const extrasRatingOptions = [
  { value: '', label: 'Select requirement' },
  { value: 'none', label: 'None Required' },
  { value: 'tier-2', label: 'Tier 2 Verified' },
  { value: 'tier-3', label: 'Tier 3 Accredited' },
  { value: 'institutional', label: 'Institutional Only' },
];

const mutedInputProps = {
  labelClassName: 'text-gray-500',
  placeholderClassName: 'placeholder:text-gray-300',
  selectIconClassName: 'text-gray-400',
};

const AssetDetailsSection = ({ listingType, values, onChange }) => {
  const handleChange = (field) => (event) => {
    onChange({ ...values, [field]: event.target.value });
  };

  return (
    <section>
      {listingType === 'sell' && (
        <div className="flex items-center gap-2 mb-6">
          <Tag size={14} strokeWidth={2} className="text-gray-400" />
          <p className="text-[12px] tracking-[0.2em] uppercase font-bold font-mono text-gray-400">
            Private Sale Listing Form
          </p>
        </div>
      )}

      <SectionHeading title="Asset Details" />

      <div className="flex flex-col gap-8">
        <Input
          {...mutedInputProps}
          label="Asset Title"
          placeholder={
            listingType === 'auction'
              ? 'e.g., Patek Philippe Grandmaster Chime Ref. 6300A'
              : 'e.g., Patek Philippe Nautilus Ref. 5711'
          }
          value={values.title}
          onChange={handleChange('title')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <Input
            {...mutedInputProps}
            label="Category"
            as="select"
            options={categoryOptions}
            value={values.category}
            onChange={handleChange('category')}
          />
          <Input
            {...mutedInputProps}
            label="Year of Origin"
            placeholder="YYYY"
            value={values.year}
            onChange={handleChange('year')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <Input
            {...mutedInputProps}
            label="Condition"
            as="select"
            options={conditionOptions}
            value={values.condition}
            onChange={handleChange('condition')}
          />
          {listingType === 'sell' ? (
            <Input
              {...mutedInputProps}
              label="Minimum Buyer Tier"
              as="select"
              options={buyerTierOptions}
              value={values.buyerTier}
              onChange={handleChange('buyerTier')}
            />
          ) : (
            <Input
              {...mutedInputProps}
              label="Extras Rating Requirement"
              as="select"
              options={extrasRatingOptions}
              value={values.extrasRating}
              onChange={handleChange('extrasRating')}
            />
          )}
        </div>

        <Input
          {...mutedInputProps}
          label="Description & Provenance"
          as="textarea"
          placeholder="Detail prior ownership, exhibition history, authentication markers, and notable features..."
          value={values.description}
          onChange={handleChange('description')}
        />
      </div>
    </section>
  );
};

export default AssetDetailsSection;
