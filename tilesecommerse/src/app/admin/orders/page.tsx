import Link from "next/link";
import {
  HiEye,
  HiClipboardList,
  HiCalendar,
  HiUser,
  HiMail,
  HiCurrencyRupee,
} from "react-icons/hi";

async function getAllOrders() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1'}/admin/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch orders:', errorText);
      return [];
    }

    const data = await response.json();
    console.log('Orders data:', data);
    return data.orders || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Orders Management</h1>
          <p className="text-slate-600 mt-1">
            View and manage all customer orders
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200">
          <HiClipboardList className="w-5 h-5 text-slate-600" />
          <span className="font-semibold text-slate-900">{orders.length}</span>
          <span className="text-slate-600 text-sm">Total Orders</span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200">
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <HiClipboardList className="w-20 h-20 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No Orders Yet
            </h3>
            <p className="text-slate-600">
              Customer orders will appear here when they make purchases
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">
                    Order ID
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">
                    Customer
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">
                    Order Date
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">
                    Items
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-slate-700">
                    Amount
                  </th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => {
                  const statusColors: Record<string, string> = {
                    'Processing': 'bg-yellow-100 text-yellow-800',
                    'Shipped': 'bg-blue-100 text-blue-800',
                    'Delivered': 'bg-green-100 text-green-800',
                  };

                  return (
                  <tr
                    key={order._id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-mono text-sm text-slate-900">
                          {order._id.slice(-8)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <HiUser className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-900">
                            {order.user?.name || "Guest User"}
                          </span>
                        </div>
                        {order.shippingInfo?.phoneNo && (
                          <span className="text-xs text-slate-500 ml-6">
                            {order.shippingInfo.phoneNo}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <HiCalendar className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600 text-sm">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-800'}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {order.orderItems?.length || 0} items
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <HiCurrencyRupee className="w-4 h-4 text-slate-600" />
                        <span className="font-semibold text-slate-900">
                          {Number(order.totalPrice || 0).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                      >
                        <HiEye className="w-4 h-4" />
                        View
                      </Link>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
