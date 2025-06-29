import React, { FC } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import orderService from '../../services/order.service';
import { Order, OrderStatus } from '@shared/types/order';

const fetcher = () => orderService.getOrders();

const getStatusClass = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.DELIVERED:
      return 'bg-gray-200 text-black';
    case OrderStatus.CANCELLED:
    case OrderStatus.FAILED:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const OrdersPage: FC = () => {
  const { data: orders, error } = useSWR<Order[]>('/orders', fetcher);

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">Failed to load orders.</div>;
  }

  if (!orders) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Orders</h1>
      {orders.length === 0 ? (
        <p className="text-center">You have no orders yet.</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-6 text-left font-semibold">Order #</th>
                <th className="py-3 px-6 text-left font-semibold">Date</th>
                <th className="py-3 px-6 text-left font-semibold">Status</th>
                <th className="py-3 px-6 text-right font-semibold">Total</th>
                <th className="py-3 px-6 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">{order.orderNumber}</td>
                  <td className="py-4 px-6">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusClass(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">{order.currency} {order.totalAmount.toFixed(2)}</td>
                  <td className="py-4 px-6 text-center">
                    <Link href={`/orders/${order.id}`}>
                      <div className="text-black hover:underline cursor-pointer font-medium">View</div>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
