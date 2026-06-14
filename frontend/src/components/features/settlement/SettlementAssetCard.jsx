import SettlementSectionLabel from './SettlementSectionLabel';

const SettlementAssetCard = ({
  image,
  title,
  currency = 'CHF',
  amount = '31,190,400',
}) => {
  return (
    <section className="mb-12">
      <SettlementSectionLabel title="Asset Details" />

      <div className="flex gap-5 md:gap-6 p-5 md:p-6 border border-[#dcd9ce] bg-cream-light">
        <div className="shrink-0 w-24 h-24 md:w-28 md:h-28 bg-[#e0dfd9] overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col justify-center min-w-0">
          <h3 className="text-lg md:text-xl font-black tracking-tight text-black mb-4">{title}</h3>
          <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#888888] mb-1">
            Settlement Amount
          </p>
          <p className="text-xl md:text-xl font-black tracking-tight text-[#B22222]">
            {currency} {amount}
          </p>
        </div>
      </div>
    </section>
  );
};

export default SettlementAssetCard;
