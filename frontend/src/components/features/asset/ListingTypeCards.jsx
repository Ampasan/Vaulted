import { Gavel, Tag } from 'lucide-react';
import Badge from '../../ui/Badge';

const listingTypes = [
  {
    id: 'sell',
    title: 'Sell Item',
    description:
      'List at a fixed price for immediate private acquisition. No bidding. Buyer acquires instantly at your asking price.',
    icon: Tag,
  },
  {
    id: 'auction',
    title: 'Auction Item',
    description:
      'Submit a lot for live competitive bidding. Set a confidential reserve price, opening bid, increment step, and auction window.',
    icon: Gavel,
  },
];

const ListingTypeCards = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {listingTypes.map((type) => {
        const Icon = type.icon;
        const isSelected = value === type.id;

        return (
          <button
            key={type.id}
            type="button"
            onClick={() => onChange(type.id)}
            className={`relative text-left p-6 md:p-8 border transition-colors ${
              isSelected
                ? 'bg-black text-white border-black'
                : 'bg-cream-light text-black border-[#dcd9ce] hover:border-black'
            }`}
          >
            {isSelected && (
              <Badge
                variant="default"
                size="sm"
                className="absolute top-5 right-5 bg-white text-black border-0"
              >
                Selected
              </Badge>
            )}
            <Icon
              size={16}
              strokeWidth={2}
              className={`mb-6 ${isSelected ? 'text-white' : 'text-black'}`}
            />
            <h3 className="text-xl font-black tracking-tight mb-3">{type.title}</h3>
            <p
              className={`text-[13px] leading-relaxed font-medium ${
                isSelected ? 'text-[#aaaaaa]' : 'text-gray-500'
              }`}
            >
              {type.description}
            </p>
          </button>
        );
      })}
    </div>
  );
};

export default ListingTypeCards;
