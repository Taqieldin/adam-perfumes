import React, { FC, useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { Category } from '../../../../shared/types/category';
import { ProductFilters as IProductFilters } from '../../services/products';

interface ProductFiltersProps {
  filters: IProductFilters;
  categories: Category[];
  onFiltersChange: (filters: IProductFilters) => void;
}

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FilterSection: FC<FilterSectionProps> = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
      >
        {title}
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isOpen && <div className="space-y-3">{children}</div>}
    </div>
  );
};

const ProductFilters: FC<ProductFiltersProps> = ({ filters, categories, onFiltersChange }) => {
  const updateFilter = (key: keyof IProductFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
      delete newFilters[key];
    }
    onFiltersChange(newFilters);
  };

  const toggleArrayFilter = (key: keyof IProductFilters, value: string) => {
    const currentValues = (filters[key] as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    updateFilter(key, newValues.length > 0 ? newValues : undefined);
  };

  const brands = [
    'Tom Ford', 'Creed', 'Maison Francis Kurkdjian', 'Byredo', 'Le Labo',
    'Diptyque', 'Amouage', 'Montale', 'Mancera', 'Parfums de Marly'
  ];

  const genders = ['Men', 'Women', 'Unisex'];
  const fragranceTypes = ['Eau de Parfum', 'Eau de Toilette', 'Parfum', 'Eau Fraiche'];
  const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
  const occasions = ['Daily', 'Evening', 'Office', 'Special Events', 'Date Night', 'Casual'];

  return (
    <div className="space-y-6">
      {/* Categories */}
      <FilterSection title="Categories">
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center">
              <input
                type="radio"
                name="category"
                checked={filters.categoryId === category.id}
                onChange={(e) => updateFilter('categoryId', e.target.checked ? category.id : undefined)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">{category.name}</span>
              {category.productCount && (
                <span className="ml-auto text-xs text-gray-500">({category.productCount})</span>
              )}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Min Price (OMR)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={filters.minPrice || ''}
                onChange={(e) => updateFilter('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Max Price (OMR)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={filters.maxPrice || ''}
                onChange={(e) => updateFilter('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="1000"
              />
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand">
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center">
              <input
                type="radio"
                name="brand"
                checked={filters.brand === brand}
                onChange={(e) => updateFilter('brand', e.target.checked ? brand : undefined)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">{brand}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Gender */}
      <FilterSection title="Gender">
        <div className="space-y-2">
          {genders.map((gender) => (
            <label key={gender} className="flex items-center">
              <input
                type="radio"
                name="gender"
                checked={filters.gender === gender}
                onChange={(e) => updateFilter('gender', e.target.checked ? gender : undefined)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">{gender}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Fragrance Type */}
      <FilterSection title="Fragrance Type">
        <div className="space-y-2">
          {fragranceTypes.map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="radio"
                name="fragranceType"
                checked={filters.fragranceType === type}
                onChange={(e) => updateFilter('fragranceType', e.target.checked ? type : undefined)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Season */}
      <FilterSection title="Season">
        <div className="space-y-2">
          {seasons.map((season) => (
            <label key={season} className="flex items-center">
              <input
                type="checkbox"
                checked={(filters.season || []).includes(season)}
                onChange={() => toggleArrayFilter('season', season)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">{season}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Occasion */}
      <FilterSection title="Occasion">
        <div className="space-y-2">
          {occasions.map((occasion) => (
            <label key={occasion} className="flex items-center">
              <input
                type="checkbox"
                checked={(filters.occasion || []).includes(occasion)}
                onChange={() => toggleArrayFilter('occasion', occasion)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">{occasion}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Availability & Features */}
      <FilterSection title="Availability & Features">
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.inStock || false}
              onChange={(e) => updateFilter('inStock', e.target.checked || undefined)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="ml-2 text-sm text-gray-700">In Stock</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.featured || false}
              onChange={(e) => updateFilter('featured', e.target.checked || undefined)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="ml-2 text-sm text-gray-700">Featured</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.onSale || false}
              onChange={(e) => updateFilter('onSale', e.target.checked || undefined)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="ml-2 text-sm text-gray-700">On Sale</span>
          </label>
        </div>
      </FilterSection>

      {/* Active Filters */}
      {Object.keys(filters).length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">Active Filters</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;
              
              const displayValue = Array.isArray(value) ? value.join(', ') : value.toString();
              const displayKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                >
                  {displayKey}: {displayValue}
                  <button
                    onClick={() => updateFilter(key as keyof IProductFilters, undefined)}
                    className="hover:text-purple-900"
                  >
                    <X size={12} />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;