import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { HiArrowLeft, HiUser, HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";
import { ordersRepository } from "@/lib/db/drizzle/repositories";

async function getOrderDetails(id: number) {
  try {
    const order = await ordersRepository.findById(id);
    return order;
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const orderId = parseInt(params.id, 10);
  const order = await getOrderDetails(orderId);

  if (!order) {
    notFound();
  }

  const address = order.customerInfo?.address;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/orders"
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <HiArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Order #{order.orderNumber}
          </h1>
          <p className="text-slate-600 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.orderProducts?.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 border border-slate-200 rounded-lg"
                >
                  <div className="relative w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.variant?.product?.img ? (
                      <Image
                        src={item.variant.product.img}
                        alt={item.variant.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">
                      {item.variant?.product?.name}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Color: <span className="font-medium">{item.variant?.color}</span>
                    </p>
                    <p className="text-sm text-slate-600">
                      Size: <span className="font-medium">{item.size}</span>
                    </p>
                    <p className="text-sm text-slate-600">
                      Quantity: <span className="font-medium">{item.quantity}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">
                      ₹{Number(item.variant?.product?.price || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer & Order Info */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Customer Information</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <HiUser className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-600">Name</p>
                  <p className="font-medium text-slate-900">
                    {order.customerInfo?.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <HiMail className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="font-medium text-slate-900">
                    {order.customerInfo?.email}
                  </p>
                </div>
              </div>
              {order.customerInfo?.phone && (
                <div className="flex items-center gap-3">
                  <HiPhone className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-600">Phone</p>
                    <p className="font-medium text-slate-900">
                      {order.customerInfo.phone}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Shipping Address</h2>
            {address && (
              <div className="flex gap-3">
                <HiLocationMarker className="w-5 h-5 text-slate-400 flex-shrink-0 mt-1" />
                <div className="text-sm text-slate-700 leading-relaxed">
                  <p>{address.line1}</p>
                  {address.line2 && <p>{address.line2}</p>}
                  <p>{address.city}, {address.state}</p>
                  <p>{address.postal_code}</p>
                  <p className="font-medium">{address.country}</p>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Delivery Date</span>
                <span className="font-medium text-slate-900">
                  {new Date(order.deliveryDate).toLocaleDateString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Items</span>
                <span className="font-medium text-slate-900">
                  {order.orderProducts?.length || 0}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-900">Total Amount</span>
                  <span className="text-xl font-bold text-orange-500">
                    ₹
                    {(Number(order.customerInfo?.totalPrice || 0) / 100).toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
