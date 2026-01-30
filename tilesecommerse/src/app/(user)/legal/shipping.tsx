export default function ShippingPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Shipping & Delivery Policy</h1>
                    <p className="text-sm text-slate-500 mb-8">Last updated: January 31, 2026</p>

                    <div className="prose prose-slate max-w-none">
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-slate-800 mb-4">1. Shipping Overview</h2>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                At SLN Tiles Showroom, we are committed to delivering your tiles and fittings safely and on time.
                                We understand that tiles are fragile and heavy products that require special handling and care during shipping.
                            </p>
                            <p className="text-slate-600 leading-relaxed">
                                This policy outlines our shipping procedures, delivery timelines, and important information about receiving your order.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-slate-800 mb-4">2. Shipping Coverage</h2>

                            <h3 className="text-xl font-medium text-slate-700 mb-3 mt-6">2.1 Delivery Locations</h3>
                            <p className="text-slate-600 leading-relaxed mb-3">
                                We currently deliver to:
                            </p>
                            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4 mb-4">
                                <li>All major cities across India</li>
                                <li>Most tier-2 and tier-3 cities</li>
                                <li>Select rural areas (subject to courier serviceability)</li>
                            </ul>
                            <p className="text-slate-600 leading-relaxed">
                                Please enter your PIN code at checkout to verify delivery availability in your area.
                            </p>

                            <h3 className="text-xl font-medium text-slate-700 mb-3 mt-6">2.2 Non-Serviceable Areas</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Some remote locations may not be serviceable. We will notify you within 24 hours if we cannot deliver to your address
                                and offer alternative solutions or a full refund.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-slate-800 mb-4">3. Delivery Timeline</h2>

                            <h3 className="text-xl font-medium text-slate-700 mb-3 mt-6">3.1 Processing Time</h3>
                            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4 mb-4">
                                <li><strong>In-Stock Items:</strong> 1-2 business days for order processing</li>
                                <li><strong>Custom Orders:</strong> 5-7 business days for processing</li>
                                <li><strong>Bulk Orders:</strong> 3-5 business days for processing</li>
                            </ul>

                            <h3 className="text-xl font-medium text-slate-700 mb-3 mt-6">3.2 Shipping Time</h3>
                            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-4">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-300">
                                            <th className="pb-3 text-slate-700 font-semibold">Location</th>
                                            <th className="pb-3 text-slate-700 font-semibold">Delivery Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-slate-600">
                                        <tr className="border-b border-slate-200">
                                            <td className="py-3">Metro Cities</td>
                                            <td className="py-3">3-5 business days</td>
                                        </tr>
                                        <tr className="border-b border-slate-200">
                                            <td className="py-3">Tier-2 Cities</td>
                                            <td className="py-3">5-7 business days</td>
                                        </tr>
                                        <tr className="border-b border-slate-200">
                                            <td className="py-3">Tier-3 Cities</td>
                                            <td className="py-3">7-10 business days</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3">Remote Areas</td>
                                            <td className="py-3">10-15 business days</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-sm text-slate-500 italic">
                                * Delivery times are estimates and may vary during peak seasons, festivals, or due to unforeseen circumstances.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-slate-800 mb-4">4. Shipping Charges</h2>

                            <h3 className="text-xl font-medium text-slate-700 mb-3 mt-6">4.1 Standard Shipping</h3>
                            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4 mb-4">
                                <li><strong>Free Shipping:</strong> On orders above ₹50,000</li>
                                <li><strong>Orders ₹25,000 - ₹49,999:</strong> ₹500 shipping fee</li>
                                <li><strong>Orders below ₹25,000:</strong> ₹800 shipping fee</li>
                            </ul>

                            <h3 className="text-xl font-medium text-slate-700 mb-3 mt-6">4.2 Express Shipping</h3>
                            <p className="text-slate-600 leading-relaxed mb-3">
                                Express delivery available in select cities:
                            </p>
                            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4 mb-4">
                                <li>Delivery within 24-48 hours</li>
                                <li>Additional charge: ₹1,500 - ₹3,000 (based on location and weight)</li>
                                <li>Available for in-stock items only</li>
                            </ul>

                            <h3 className="text-xl font-medium text-slate-700 mb-3 mt-6">4.3 Bulk Order Shipping</h3>
                            <p className="text-slate-600 leading-relaxed">
                                For bulk orders (above ₹1,00,000), we offer customized shipping solutions. Contact our sales team for a quote.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-slate-800 mb-4">5. Packaging and Handling</h2>

                            <h3 className="text-xl font-medium text-slate-700 mb-3 mt-6">5.1 Secure Packaging</h3>
                            <p className="text-slate-600 leading-relaxed mb-3">
                                We take extra care in packaging tiles to prevent damage:
                            </p>
                            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4 mb-4">
                                <li>Original manufacturer packaging retained</li>
                                <li>Additional bubble wrap and corner protection</li>
                                <li>Sturdy corrugated boxes for outer packaging</li>
                                <li>Palletized shipping for bulk orders</li>
                                <li>Fragile and "Handle with Care" labels</li>
                            </ul>

                            <h3 className="text-xl font-medium text-slate-700 mb-3 mt-6">5.2 Weight Considerations</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Tiles are heavy products. A typical box can weigh 20-30 kg. Please ensure someone is available to receive
                                and handle the delivery. Unloading assistance may be required.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-slate-800 mb-4">6. Order Tracking</h2>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                Stay updated on your order status:
                            </p>
                            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4 mb-4">
                                <li>Order confirmation email with order number</li>
                                <li>Shipping confirmation with tracking number</li>
                                <li>Real-time tracking via courier partner website</li>
                                <li>SMS and email updates at each delivery milestone</li>
                                <li>Track order status in your account dashboard</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-slate-800 mb-4">7. Delivery Process</h2>

                            <h3 className="text-xl font-medium text-slate-700 mb-3 mt-6">7.1 Before Delivery</h3>
                            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4 mb-4">
                                <li>Delivery partner will call 1-2 hours before arrival</li>
                                <li>Ensure someone is available to receive the delivery</li>
                                <li>Prepare a suitable space for unloading heavy boxes</li>
                                <li>Keep your order number and ID proof ready</li>
                            </ul>

                            <h3 className="text-xl font-medium text-slate-700 mb-3 mt-6">7.2 During Delivery</h3>
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-4">
                                <p className="text-slate-700 font-medium mb-2">⚠️ Important: Inspect Before Accepting</p>
                                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                                    <li>Check the number of boxes against the invoice</li>
                                    <li>Inspect outer packaging for visible damage</li>
                                    <li>Open boxes and check for broken or damaged tiles</li>
                                    <li>Note any discrepancies on the delivery receipt</li>
                                    <li>Take photos if damage is found</li>
                                    <li>Do not accept delivery if major damage is visible</li>
                                </ul>
                            </div>

                            <h3 className="text-xl font-medium text-slate-700 mb-3 mt-6">7.3 After Delivery</h3>
                            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                                <li>Store tiles in a dry, flat area</li>
                                <li>Keep boxes sealed until installation</li>
                                <li>Report any hidden damage within 48 hours</li>
                                <li>Retain all packaging materials until installation is complete</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-slate-800 mb-4">8. Delivery Attempts</h2>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                Our delivery partners will make up to 3 delivery attempts:
                            </p>
                            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4 mb-4">
                                <li><strong>1st Attempt:</strong> Scheduled delivery date</li>
                                <li><strong>2nd Attempt:</strong> Next business day</li>
                                <li><strong>3rd Attempt:</strong> Within 2 business days</li>
                            </ul>
                            <p className="text-slate-600 leading-relaxed">
                                If all attempts fail, the order will be returned to our warehouse. You may be charged return shipping fees
                                for re-delivery.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-slate-800 mb-4">9. Delivery Issues</h2>

                            <h3 className="text-xl font-medium text-slate-700 mb-3 mt-6">9.1 Damaged Delivery</h3>
                            <p className="text-slate-600 leading-relaxed mb-3">
                                If tiles arrive damaged:
                            </p>
                            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4 mb-4">
                                <li>Note damage on delivery receipt</li>
                                <li>Take clear photos of damaged items and packaging</li>
                                <li>Contact us immediately at shipping@slntiles.com</li>
                                <li>We will arrange replacement or refund within 48 hours</li>
                            </ul>

                            <h3 className="text-xl font-medium text-slate-700 mb-3 mt-6">9.2 Missing Items</h3>
                            <p className="text-slate-600 leading-relaxed mb-3">
                                If you receive fewer boxes than ordered:
                            </p>
                            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4 mb-4">
                                <li>Check the delivery receipt for quantity</li>
                                <li>Contact us within 24 hours</li>
                                <li>Provide order number and delivery receipt</li>
                                <li>We will ship missing items at no extra cost</li>
                            </ul>

                            <h3 className="text-xl font-medium text-slate-700 mb-3 mt-6">9.3 Delayed Delivery</h3>
                            <p className="text-slate-600 leading-relaxed">
                                If your order is delayed beyond the estimated delivery date, please contact our customer service.
                                We will track your shipment and provide updates.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-slate-800 mb-4">10. Special Delivery Services</h2>

                            <h3 className="text-xl font-medium text-slate-700 mb-3 mt-6">10.1 White Glove Delivery</h3>
                            <p className="text-slate-600 leading-relaxed mb-3">
                                Premium delivery service available for an additional fee:
                            </p>
                            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4 mb-4">
                                <li>Scheduled delivery at your preferred time</li>
                                <li>Delivery to room of choice (ground floor only)</li>
                                <li>Unpacking and debris removal</li>
                                <li>Additional charge: ₹2,000 - ₹5,000</li>
                            </ul>

                            <h3 className="text-xl font-medium text-slate-700 mb-3 mt-6">10.2 Installation Coordination</h3>
                            <p className="text-slate-600 leading-relaxed">
                                We can coordinate delivery with your contractor or installer. Contact us to schedule delivery timing
                                that aligns with your installation schedule.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-slate-800 mb-4">11. International Shipping</h2>
                            <p className="text-slate-600 leading-relaxed">
                                Currently, we only ship within India. International shipping is not available at this time.
                                Please contact us for bulk export inquiries.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-slate-800 mb-4">12. Contact Shipping Support</h2>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                For shipping and delivery inquiries:
                            </p>
                            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                                <p className="text-slate-700 font-medium mb-2">SLN Tiles Showroom - Shipping Department</p>
                                <p className="text-slate-600">Email: shipping@slntiles.com</p>
                                <p className="text-slate-600">Phone: +91 XXX XXX XXXX</p>
                                <p className="text-slate-600">WhatsApp: +91 XXX XXX XXXX</p>
                                <p className="text-slate-600">Hours: Monday - Saturday, 9:00 AM - 6:00 PM</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
