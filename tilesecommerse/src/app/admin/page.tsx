import Link from "next/link";
import {
  HiShoppingBag,
  HiClipboardList,
  HiCurrencyRupee,
  HiUsers,
  HiPlus,
  HiArrowRight,
} from "react-icons/hi";
import { productsRepository, ordersRepository } from "@/lib/db/drizzle/repositories";

async function getAdminStats() {
  try {
    const [products, orders] = await Promise.all([
      productsRepository.findAll(),
      ordersRepository.findAll(),
    ]);

    const totalProducts = products?.length || 0;
    const totalOrders = orders?.length || 0;

    // Calculate total revenue from orders
    let totalRevenue = 0;
    if (orders) {
      for (const order of orders) {
        if (order.customerInfo?.totalPrice) {
          totalRevenue += Number(order.customerInfo.totalPrice);
        }
      }
    }

    // Get recent orders (last 5)
    const recentOrders = orders?.slice(0, 5) || [];

    return {
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue / 100, // Convert from paise to rupees
      recentOrders,
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      recentOrders: [],
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: HiShoppingBag,
      color: "bg-blue-500",
      href: "/admin/products",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: HiClipboardList,
      color: "bg-green-500",
      href: "/admin/orders",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: HiCurrencyRupee,
      color: "bg-orange-500",
      href: "/admin/orders",
    },
    {
      title: "Total Customers",
      value: "-",
      icon: HiUsers,
      color: "bg-purple-500",
      href: "/admin/customers",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">
            Welcome to SRI LAKSHMI NARASIMHA TRADERS Admin Panel
          </p>
        </div>
        <Link
          href="/admin/products/create"
          className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl"
        >
          <HiPlus className="w-5 h-5" />
          <span className="font-medium">Add Product</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-slate-200 hover:border-slate-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <HiArrowRight className="w-5 h-5 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-sm font-medium text-slate-600 mb-1">
                {stat.title}
              </h3>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </Link>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-orange-500 hover:text-orange-600 font-medium text-sm flex items-center gap-1"
          >
            View All
            <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="text-center py-12">
            <HiClipboardList className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 text-lg">No orders yet</p>
            <p className="text-slate-400 text-sm mt-1">
              Orders will appear here when customers make purchases
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                    Order #
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                    Date
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm font-medium text-slate-900">
                      #{order.orderNumber}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {order.customerInfo?.name || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-slate-900 text-right">
                      ₹
                      {(
                        Number(order.customerInfo?.totalPrice || 0) / 100
                      ).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/products/create"
          className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-slate-200 hover:border-orange-300 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
              <HiPlus className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Add Product</h3>
              <p className="text-sm text-slate-600">Create new tile product</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-slate-200 hover:border-green-300 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <HiClipboardList className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Manage Orders</h3>
              <p className="text-sm text-slate-600">View and process orders</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/blogs"
          className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-slate-200 hover:border-blue-300 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <HiPlus className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Create Blog</h3>
              <p className="text-sm text-slate-600">Add new blog post</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
