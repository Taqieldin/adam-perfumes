import React, { FC } from 'react';
import { ChevronDown } from 'lucide-react';
import { ProductSort as IProductSort } from '../../services/products';

interface ProductSortProps {
  sort: IProductSort;
  onSortChange: (sort: IProductSort) => void;
}

const ProductSort: FC<ProductSortProps> = ({ sort, onSortChange }) => {
  const sortOptions = [
    { field: 'createdAt', direction: 'desc', label: 'Newest First' },
    { field: 'createdAt', direction: 'asc', label: 'Oldest First' },
    { field: 'name', direction: 'asc', label: 'Name: A to Z' },
    { field: 'name', direction: 'desc', label: 'Name: Z to A' },
    { field: 'price', direction: 'asc', label: 'Price: Low to High' },
    { field: 'price', direction: 'desc', label: 'Price: High to Low' },
    { field: 'rating', direction: 'desc', label: 'Highest Rated' },
    { field: 'rating', direction: 'asc', label: 'Lowest Rated' },
  ] as const;

  const currentSortLabel = sortOptions.find(
    option => option.field === sort.field && option.direction === sort.direction
  )?.label || 'Newest First';

  const handleSortChange = (field: IProductSort['field'], direction: IProductSort['direction']) => {
    onSortChange({ field, direction });
  };

  return (
    <div className="relative">
      <select
        value={`${sort.field}-${sort.direction}`}
        onChange={(e) => {
          const [field, direction] = e.target.value.split('-') as [IProductSort['field'], IProductSort['direction']];
          handleSortChange(field, direction);
        }}
        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      >
        {sortOptions.map((option) => (
          <option 
            key={`${option.field}-${option.direction}`} 
            value={`${option.field}-${option.direction}`}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <ChevronDown size={16} className="text-gray-400" />
      </div>
    </div>
  );
};

export default ProductSort;