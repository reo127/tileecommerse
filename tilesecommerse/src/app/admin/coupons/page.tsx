"use client";

import { useState, useEffect } from "react";
import { HiPlus, HiPencil, HiTrash, HiX, HiCheck, HiTicket } from "react-icons/hi";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';

interface Coupon {
  _id: string;
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  minOrderAmount: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  description?: string;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    discount: 0,
    discountType: 'percentage' as 'percentage' | 'fixed',
    minOrderAmount: 0,
    maxDiscount: 0,
    expiryDate: '',
    usageLimit: 1,
    description: '',
    isActive: true,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      const mockCoupons: Coupon[] = [
        {
          _id: '1',
          code: 'WELCOME10',
          discount: 10,
          discountType: 'percentage',
          minOrderAmount: 1000,
          maxDiscount: 500,
          expiryDate: '2026-12-31',
          usageLimit: 100,
          usedCount: 25,
          isActive: true,
          description: 'Welcome discount for new customers'
        },
        {
          _id: '2',
          code: 'SAVE500',
          discount: 500,
          discountType: 'fixed',
          minOrderAmount: 5000,
          expiryDate: '2026-06-30',
          usageLimit: 50,
          usedCount: 10,
          isActive: true,
          description: 'Flat ₹500 off on orders above ₹5000'
        }
      ];
      setCoupons(mockCoupons);
    } catch (error) {
      showAlert('error', 'Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleOpenModal = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        discount: coupon.discount,
        discountType: coupon.discountType,
        minOrderAmount: coupon.minOrderAmount,
        maxDiscount: coupon.maxDiscount || 0,
        expiryDate: coupon.expiryDate,
        usageLimit: coupon.usageLimit,
        description: coupon.description || '',
        isActive: coupon.isActive,
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        discount: 0,
        discountType: 'percentage',
        minOrderAmount: 0,
        maxDiscount: 0,
        expiryDate: '',
        usageLimit: 1,
        description: '',
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCoupon(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Mock save - replace with actual API call
      if (editingCoupon) {
        setCoupons(coupons.map(c => c._id === editingCoupon._id ? { ...c, ...formData } : c));
        showAlert('success', 'Coupon updated successfully!');
      } else {
        const newCoupon: Coupon = {
          _id: Date.now().toString(),
          ...formData,
          usedCount: 0,
        };
        setCoupons([newCoupon, ...coupons]);
        showAlert('success', 'Coupon created successfully!');
      }
      handleCloseModal();
    } catch (error) {
      showAlert('error', 'Failed to save coupon');
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete coupon "${code}"?`)) return;

    setDeleteLoading(id);
    try {
      // Mock delete - replace with actual API call
      setCoupons(coupons.filter(c => c._id !== id));
      showAlert('success', 'Coupon deleted successfully!');
    } catch (error) {
      showAlert('error', 'Failed to delete coupon');
    } finally {
      setDeleteLoading(null);
    }
  };

  const toggleStatus = async (coupon: Coupon) => {
    try {
      setCoupons(coupons.map(c => c._id === coupon._id ? { ...c, isActive: !c.isActive } : c));
      showAlert('success', `Coupon ${!coupon.isActive ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      showAlert('error', 'Failed to update coupon status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading coupons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Coupons Management</h1>
          <p className="text-slate-600 mt-1">
            Manage discount coupons and promotional codes ({coupons.length} coupons)
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl"
        >
          <HiPlus className="w-5 h-5" />
          <span className="font-medium">Add Coupon</span>
        </button>
      </div>

      {/* Alert */}
      {alert && (
        <div className={`p-4 rounded-lg border ${alert.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-red-50 border-red-200 text-red-700'
          } flex items-center gap-3`}>
          {alert.type === 'success' ? (
            <HiCheck className="w-5 h-5 flex-shrink-0" />
          ) : (
            <HiX className="w-5 h-5 flex-shrink-0" />
          )}
          <p>{alert.message}</p>
        </div>
      )}

      {/* Coupons Grid */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200">
        {coupons.length === 0 ? (
          <div className="text-center py-20">
            <HiTicket className="w-20 h-20 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No Coupons Yet
            </h3>
            <p className="text-slate-600 mb-6">
              Start creating discount coupons for your customers
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <HiPlus className="w-5 h-5" />
              <span className="font-medium">Add Your First Coupon</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Min Order
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Expiry
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-slate-900">{coupon.code}</div>
                        {coupon.description && (
                          <div className="text-sm text-slate-500 mt-1">{coupon.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                        {coupon.discountType === 'percentage' ? `${coupon.discount}%` : `₹${coupon.discount}`}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      ₹{coupon.minOrderAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-slate-900 font-medium">{coupon.usedCount} / {coupon.usageLimit}</div>
                        <div className="text-slate-500">
                          {Math.round((coupon.usedCount / coupon.usageLimit) * 100)}% used
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(coupon)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${coupon.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                          }`}
                      >
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(coupon)}
                          className="p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <HiPencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon._id, coupon.code)}
                          disabled={deleteLoading === coupon._id}
                          className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deleteLoading === coupon._id ? (
                            <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <HiTrash className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <HiX className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all uppercase"
                    placeholder="WELCOME10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Discount Type *
                  </label>
                  <select
                    required
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'percentage' | 'fixed' })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder={formData.discountType === 'percentage' ? '10' : '500'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Minimum Order Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="1000"
                  />
                </div>

                {formData.discountType === 'percentage' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Maximum Discount (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Usage Limit *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                    placeholder="Brief description of the coupon..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-5 h-5 text-orange-500 rounded focus:ring-2 focus:ring-orange-500"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Activate this coupon immediately
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-3 px-6 bg-white border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
