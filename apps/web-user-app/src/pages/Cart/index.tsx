import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { MainLayout } from '../../layouts/MainLayout';
import CartItemComponent, { CartItem } from '../../components/Cart/CartItem';

interface CartState {
  cart: {
    items: CartItem[];
    totalAmount: number;
    totalQuantity: number;
  };
}

const CartPage: FC = () => {
  const cartItems = useSelector((state: CartState) => state.cart.items);
  const totalAmount = useSelector((state: CartState) => state.cart.totalAmount);
  const currency = cartItems.length > 0 ? cartItems[0].currency : 'OMR';

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Cart</h1>
        {cartItems.length === 0 ? (
          <div className="text-center">
            <p className="text-xl mb-6 text-gray-500">Your cart is empty.</p>
            <Link href="/products">
              <div className="inline-block bg-black text-white font-bold py-3 px-6 rounded hover:bg-gray-800 transition-colors cursor-pointer">
                Continue Shopping
              </div>
            </Link>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow-md rounded-lg p-6">
              {cartItems.map((item) => (
                <CartItemComponent key={item.id} item={item} />
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <div className="w-full md:w-1/2 lg:w-1/3">
                <div className="bg-white shadow-md rounded-lg p-6">
                  <div className="flex justify-between font-bold text-xl mb-4">
                    <span>Total</span>
                    <span>{currency} {totalAmount.toFixed(2)}</span>
                  </div>
                  <button className="w-full bg-black text-white font-bold py-3 px-4 rounded hover:bg-gray-800 transition-colors">
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CartPage;
