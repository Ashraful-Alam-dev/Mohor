'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const router = useRouter();
  const { logout, user } = useAuth();

  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const [orders, setOrders] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // BLOCK ADMIN
  useEffect(() => {
    if (user?.role === 'admin') {
      router.replace('/');
    }
  }, [user]);

  // LOAD DATA
  useEffect(() => {
    const load = async () => {
      try {
        const [meRes, orderRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/orders/my-orders')
        ]);

        if (meRes.data?.success) {
          setProfile(meRes.data.user);
        }

        if (orderRes.data?.success) {
          setOrders(orderRes.data.orders || []);
        }

      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // PROFILE UPDATE
  const updateProfile = async () => {
    setSaving(true);
    try {
      await api.put('/auth/profile/update', profile);
      toast.success('Profile updated');
      setEditMode(false);
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setSaving(false);
    }
  };

  // PASSWORD CHANGE
  const changePassword = async () => {
    if (!currentPassword || !newPassword) {
      return toast.error('Fill all password fields');
    }

    setChangingPassword(true);
    try {
      await api.patch('/auth/profile/change-password', {
        currentPassword,
        newPassword
      });

      toast.success('Password updated');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black">My Profile</h1>
            <p className="text-sm text-neutral-500">
              Manage account, orders & security
            </p>
          </div>

          <button
            onClick={() => router.push('/')}
            className="text-sm px-4 py-2 bg-black text-white rounded-lg"
          >
            Back to Shop
          </button>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* PROFILE CARD */}
          <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">

            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg">Profile Info</h2>

              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="text-sm text-blue-600 font-semibold"
                >
                  Edit
                </button>
              ) : (
                <button
                  onClick={() => setEditMode(false)}
                  className="text-sm text-red-500 font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>

            {!editMode ? (
              <div className="space-y-3 text-sm">
                <p><span className="font-bold">Name:</span> {profile.name}</p>
                <p><span className="font-bold">Phone:</span> {profile.phone}</p>
                <p><span className="font-bold">Address:</span> {profile.address}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  className="w-full border p-2 rounded"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  placeholder="Name"
                />

                <input
                  className="w-full border p-2 rounded"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  placeholder="Phone"
                />

                <textarea
                  className="w-full border p-2 rounded"
                  value={profile.address}
                  onChange={(e) =>
                    setProfile({ ...profile, address: e.target.value })
                  }
                  placeholder="Address"
                />

                <button
                  onClick={updateProfile}
                  disabled={saving}
                  className="w-full bg-black text-white py-2 rounded"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>

          {/* ORDER HISTORY */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border shadow-sm">
            <h2 className="font-bold text-lg mb-4">Order History</h2>

            <div className="space-y-4 max-h-[420px] overflow-y-auto">

              {orders.map((order) => (
                <div
                  key={order.order_id}
                  className="border rounded-xl p-4 bg-neutral-50"
                >

                  <div className="flex justify-between">
                    <div>
                      <p className="font-bold">
                        Order #{order.order_id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {new Date(order.ordertime).toLocaleString()}
                      </p>
                    </div>

                    <p className="font-bold">
                      ৳ {parseFloat(order.total_price).toLocaleString()}
                    </p>
                  </div>

                  <div className="mt-2 text-sm space-y-1">
                    {(typeof order.items === 'string'
                      ? JSON.parse(order.items)
                      : order.items
                    ).map((item, idx) => (
                      <p key={idx}>
                        • {item.product_name} × {item.quantity}
                      </p>
                    ))}
                  </div>

                </div>
              ))}

              {orders.length === 0 && (
                <p className="text-center text-neutral-400 py-10">
                  No orders yet
                </p>
              )}
            </div>
          </div>

        </div>

        {/* DANGER ZONE */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <h2 className="font-bold text-red-700 mb-4">
            Security Zone
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            {/* PASSWORD */}
            <div className="space-y-3">
              <input
                type="password"
                className="w-full border p-2 rounded"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(e.target.value)
                }
              />

              <input
                type="password"
                className="w-full border p-2 rounded"
                placeholder="New password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
              />

              <button
                onClick={changePassword}
                disabled={changingPassword}
                className="w-full bg-red-600 text-white py-2 rounded"
              >
                {changingPassword
                  ? 'Updating...'
                  : 'Change Password'}
              </button>
            </div>

            {/* LOGOUT */}
            <div className="flex items-center justify-center">
              <button
                onClick={logout}
                className="bg-black text-white px-6 py-3 rounded-lg"
              >
                Logout
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}