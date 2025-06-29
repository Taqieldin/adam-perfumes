import React, { FC, useState } from 'react';
import useSWR from 'swr';
import EditProfileModal from '../../components/profile/EditProfileModal';
import userService from '../../services/user.service';
import addressService from '../../services/address.service';
import toast from 'react-hot-toast';
import { User, Edit, Mail, Phone, Calendar, KeyRound, ShieldCheck, Home, PlusCircle, Trash2 } from 'lucide-react';
import AddEditAddressModal from '../../components/address/AddEditAddressModal';
import { Card, CardHeader, CardContent, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { ProfileInfoRow } from '../../components/profile/ProfileInfoRow';
import type { User as UserType, Address } from '@shared/types/user';

const ProfilePage: FC = () => {
  const { data: user, error, mutate } = useSWR<UserType>('profile', userService.getProfile);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAddressModalOpen, setAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const handleProfileUpdate = (updatedUser: UserType) => {
    mutate(updatedUser, { revalidate: false });
  };

  const handleAddressSuccess = () => {
    mutate();
    setAddressModalOpen(false);
  };

  const handleOpenAddAddressModal = () => {
    setSelectedAddress(null);
    setAddressModalOpen(true);
  };

  const handleOpenEditAddressModal = (address: Address) => {
    setSelectedAddress(address);
    setAddressModalOpen(true);
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      await addressService.setDefaultAddress(addressId);
      toast.success('Default address updated');
      mutate();
    } catch (error) {
      toast.error('Failed to set default address.');
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await addressService.deleteAddress(addressId);
        toast.success('Address deleted successfully');
        mutate();
      } catch (error) {
        toast.error('Failed to delete address.');
      }
    }
  };

  if (error) return <div className="text-center text-red-500">Failed to load profile. Please try again later.</div>;
  if (!user) return <div className="text-center">Loading profile...</div>;

  return (
    <>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <Button className="mt-4 md:mt-0 px-4 py-2" onClick={() => setEditModalOpen(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Header Card */}
          <Card className="lg:col-span-3 flex flex-col md:flex-row items-center p-6 space-y-4 md:space-y-0 md:space-x-6">
            <Avatar 
              src={user.profilePicture} 
              alt={`${user.firstName} ${user.lastName}`}
              fallback={<User className="w-12 h-12 text-gray-500" />}
            />
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{`${user.firstName} ${user.lastName}`}</h2>
              <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
              <span className="mt-2 inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {user.role.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </Card>

          {/* Personal Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProfileInfoRow icon={<Mail className="w-5 h-5" />} label="Email Address" value={user.email} />
              <ProfileInfoRow icon={<Phone className="w-5 h-5" />} label="Phone Number" value={user.phone} />
              <ProfileInfoRow icon={<Calendar className="w-5 h-5" />} label="Date of Birth" value={user.dateOfBirth} />
              <ProfileInfoRow icon={<User className="w-5 h-5" />} label="Gender" value={user.gender} />
            </CardContent>
          </Card>

          {/* Security Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProfileInfoRow icon={<KeyRound className="w-5 h-5" />} label="Two-Factor Authentication" value={user.twoFactorEnabled ? 'Enabled' : 'Disabled'} />
              <ProfileInfoRow icon={<ShieldCheck className="w-5 h-5" />} label="Email Verified" value={user.emailVerified ? 'Verified' : 'Not Verified'} />
              <ProfileInfoRow icon={<ShieldCheck className="w-5 h-5" />} label="Phone Verified" value={user.phoneVerified ? 'Verified' : 'Not Verified'} />
            </CardContent>
          </Card>

          {/* Preferences Card */}
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProfileInfoRow icon={<User className="w-5 h-5" />} label="Language" value={user.language.toUpperCase()} />
              <ProfileInfoRow icon={<User className="w-5 h-5" />} label="Theme" value={user.preferences.theme} />
              <ProfileInfoRow icon={<User className="w-5 h-5" />} label="Currency" value={user.preferences.currency} />
            </CardContent>
          </Card>

          {/* Addresses Card */}
          <Card className="lg:col-span-3">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>My Addresses</CardTitle>
              <Button variant="outline" className="px-3 py-1 text-sm" onClick={handleOpenAddAddressModal}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Add New
              </Button>
            </CardHeader>
            <CardContent>
              {user.Addresses && user.Addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.Addresses.map((address) => (
                    <div key={address.id} className="relative p-4 border rounded-md bg-gray-50 dark:bg-gray-700">
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <Button variant="outline" className="h-7 w-7 p-0" onClick={() => handleOpenEditAddressModal(address)}>
                          <span className="sr-only">Edit Address</span>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="h-7 w-7 p-0 hover:bg-red-100 dark:hover:bg-red-900/50" onClick={() => handleDeleteAddress(address.id)}>
                          <span className="sr-only">Delete Address</span>
                          <Trash2 className="h-4 w-4 text-red-600 dark:text-red-500" />
                        </Button>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white pr-20">{address.addressLine1}</p>
                      {address.addressLine2 && <p className="text-gray-600 dark:text-gray-300">{address.addressLine2}</p>}
                      <p className="text-gray-600 dark:text-gray-300">{`${address.city}, ${address.state} ${address.postalCode}`}</p>
                      <p className="text-gray-600 dark:text-gray-300">{address.country}</p>
                      <div className="mt-2 flex items-center">
                        {address.isDefault ? (
                          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Default
                          </span>
                        ) : (
                          <Button variant="outline" className="px-2 py-1 text-xs" onClick={() => handleSetDefaultAddress(address.id)}>
                            Set as Default
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">You haven't added any addresses yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {user && (
        <EditProfileModal
          user={user}
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          onProfileUpdate={handleProfileUpdate}
        />
      )}

      <AddEditAddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        onSuccess={handleAddressSuccess}
        address={selectedAddress}
      />
    </>
  );
};

export default ProfilePage;