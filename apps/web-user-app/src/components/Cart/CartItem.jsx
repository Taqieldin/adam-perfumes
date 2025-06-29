import React from 'react';
import { useDispatch } from 'react-redux';
import { addItemToCart, removeItemFromCart } from '../../store/cartSlice';
import Image from 'next/image';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleAddItem = () => {
    dispatch(addItemToCart(item));
  };

  const handleRemoveItem = () => {
    dispatch(removeItemFromCart(item.id));
  };

  return (
    <div className="flex items-center justify-between border-b py-4">
      <div className="flex items-center space-x-4">
        <div className="relative w-20 h-20">
            <Image 
                src={item.images?.[0] || '/placeholder.png'}
                alt={item.name}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
            />
        </div>
        <div>
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-gray-500">${item.price.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center border rounded-md">
            <button onClick={handleRemoveItem} className="px-3 py-1 hover:bg-gray-100">-</button>
            <span className="px-4 py-1">{item.quantity}</span>
            <button onClick={handleAddItem} className="px-3 py-1 hover:bg-gray-100">+</button>
        </div>
        <p className="font-semibold">${item.totalPrice.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default CartItem;
