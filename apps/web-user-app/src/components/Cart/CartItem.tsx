import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import { addItemToCart, removeItemFromCart } from '../../store/cartSlice';
import { Product } from '@shared/types/product';

export interface CartItem extends Product {
  quantity: number;
  totalPrice: number;
}

interface CartItemProps {
  item: CartItem;
}

const CartItem: FC<CartItemProps> = ({ item }) => {
  const dispatch = useDispatch();

  const handleAddItem = () => {
    dispatch(addItemToCart(item));
  };

  const handleRemoveItem = () => {
    dispatch(removeItemFromCart(item.id));
  };

  const imageUrl = item.images?.[0]?.url || '/placeholder.png';

  return (
    <div className="flex items-center justify-between border-b border-gray-200 py-4">
      <div className="flex items-center space-x-4">
        <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
          <Image 
            src={imageUrl}
            alt={item.name.en}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div>
          <h3 className="font-semibold text-black">{item.name.en}</h3>
          <p className="text-gray-500">{item.currency} {item.price.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center border border-gray-300 rounded-md">
          <button onClick={handleRemoveItem} className="px-3 py-1 text-black hover:bg-gray-100 transition-colors">-</button>
          <span className="px-4 py-1 text-black font-medium">{item.quantity}</span>
          <button onClick={handleAddItem} className="px-3 py-1 text-black hover:bg-gray-100 transition-colors">+</button>
        </div>
        <p className="font-semibold text-black w-24 text-right">{item.currency} {item.totalPrice.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default CartItem;
