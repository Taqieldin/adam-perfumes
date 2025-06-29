import React, { FC } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Image from 'next/image';
import orderService from '../../services/order.service';
import { Order } from '@shared/types/order';

const fetcher = (_: string, id: string) => orderService.getOrderById(id);

const OrderDetailPage: FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: order, error } = useSWR<Order>(id ? [`/orders/${id}`, id as string] : null, fetcher);

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">Failed to load order details.</div>;
  }

  if (!order) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-center">Order #{order.orderNumber}</h1>
      <p className="text-gray-500 mb-8 text-center">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 border-b pb-4">Order Summary</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b py-4">
              <div className="flex items-center space-x-4">
                <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                  <Image 
                    src={item.productImage || '/placeholder.png'}
                    alt={item.productName.en}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{item.productName.en}</h3>
                  <p className="text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="font-semibold">{order.currency} {(item.unitPrice * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-4 border-t space-y-2 text-right">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>{order.currency} {order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span>{order.currency} {order.shippingAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Discount</span>
            <span>- {order.currency} {order.discountAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-xl mt-4">
            <span>Total</span>
            <span>{order.currency} {order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
