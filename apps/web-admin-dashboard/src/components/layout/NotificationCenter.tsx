import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X } from 'lucide-react';
import { RootState, AppDispatch } from '../../store';
import { removeNotification } from '../../store/slices/uiSlice';
import { cn } from '../../utils/cn';

const NotificationCenter: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications } = useSelector((state: RootState) => state.ui);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            'max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden',
            'animate-in slide-in-from-right-full duration-300'
          )}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className={cn(
                  'h-2 w-2 rounded-full mt-2',
                  notification.type === 'success' && 'bg-green-500',
                  notification.type === 'error' && 'bg-red-500',
                  notification.type === 'warning' && 'bg-yellow-500',
                  notification.type === 'info' && 'bg-blue-500'
                )} />
              </div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {notification.title}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {notification.message}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className="bg-white dark:bg-gray-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={() => dispatch(removeNotification(notification.id))}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationCenter;