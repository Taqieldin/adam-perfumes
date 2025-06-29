import React, { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { InferType } from 'yup';
import toast from 'react-hot-toast';
import addressService from '../../services/address.service';
import type { Address } from '@shared/types/user';
import { Button } from '../ui/Button';

const addressSchema = yup.object({
  addressLine1: yup.string().required('Address is required'),
  addressLine2: yup.string().nullable(),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  postalCode: yup.string().required('Postal code is required'),
  country: yup.string().required('Country is required'),
  isDefault: yup.boolean().required(),
});

type AddressFormData = InferType<typeof addressSchema>;

interface AddEditAddressModalProps {
  address?: Address | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddEditAddressModal: FC<AddEditAddressModalProps> = ({ address, isOpen, onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormData>({
    resolver: yupResolver(addressSchema),
  });

  useEffect(() => {
    if (isOpen) {
      reset(address || { isDefault: false });
    } 
  }, [address, isOpen, reset]);

  const onSubmit = async (data: AddressFormData) => {
    try {
      if (address) {
        await addressService.updateAddress(address.id, data);
        toast.success('Address updated successfully');
      } else {
        await addressService.createAddress(data);
        toast.success('Address added successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to save address.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {address ? 'Edit Address' : 'Add New Address'}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address Line 1</label>
                  <input {...register('addressLine1')} id="addressLine1" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                  {errors.addressLine1 && <p className="text-red-500 text-xs mt-1">{errors.addressLine1.message}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address Line 2 (Optional)</label>
                  <input {...register('addressLine2')} id="addressLine2" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                  <input {...register('city')} id="city" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300">State / Province</label>
                  <input {...register('state')} id="state" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                </div>

                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Postal Code</label>
                  <input {...register('postalCode')} id="postalCode" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                  {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode.message}</p>}
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Country</label>
                  <input {...register('country')} id="country" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
                </div>
              </div>
              <div className="flex items-center mt-4">
                <input {...register('isDefault')} id="isDefault" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Set as default address</label>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Address'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditAddressModal;
