import AssetCard from './AssetCard';

const AssetGrid = ({ items, columns = 3, renderItem, className = '' }) => {
  const colsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };
  const renderCard = renderItem || ((item) => <AssetCard asset={item} />);

  return (
    <div className={`grid ${colsClass[columns] || colsClass[3]} gap-8 xl:gap-10 ${className}`}>
      {items.map((item) => (
        <div key={item.id}>
          {renderCard(item)}
        </div>
      ))}
    </div>
  );
};

export default AssetGrid;
