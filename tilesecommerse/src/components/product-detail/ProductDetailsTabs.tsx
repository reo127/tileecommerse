"use client";

import { useState } from "react";

export const ProductDetailsTabs = () => {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "Description" },
    { id: "specifications", label: "Specifications" },
    { id: "installation", label: "Installation Guide" },
    { id: "care", label: "Care Instructions" },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 bg-slate-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === tab.id
                ? "bg-white text-orange-500 border-b-2 border-orange-500"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "description" && (
          <div className="space-y-4 text-slate-700">
            <p>
              Premium quality tiles designed to enhance the beauty of your spaces. These tiles combine
              durability with aesthetic appeal, making them perfect for both residential and commercial
              applications.
            </p>
            <p>
              Manufactured using advanced technology and high-quality materials, these tiles offer
              excellent resistance to wear, stains, and moisture. The polished finish adds a luxurious
              touch to any room.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>High durability and longevity</li>
              <li>Easy to clean and maintain</li>
              <li>Resistant to stains and scratches</li>
              <li>Suitable for high-traffic areas</li>
              <li>Eco-friendly manufacturing process</li>
            </ul>
          </div>
        )}

        {activeTab === "specifications" && (
          <div className="space-y-3 text-slate-700">
            <p className="font-semibold text-slate-800">Technical Specifications:</p>
            <ul className="space-y-2">
              <li><strong>Material:</strong> Vitrified Ceramic</li>
              <li><strong>Finish:</strong> Polished Glazed</li>
              <li><strong>Thickness:</strong> 8-10 mm</li>
              <li><strong>Water Absorption:</strong> Less than 0.5%</li>
              <li><strong>Breaking Strength:</strong> 1200+ N</li>
              <li><strong>Chemical Resistance:</strong> High</li>
              <li><strong>Frost Resistance:</strong> Yes</li>
            </ul>
          </div>
        )}

        {activeTab === "installation" && (
          <div className="space-y-4 text-slate-700">
            <p className="font-semibold text-slate-800">Installation Steps:</p>
            <ol className="list-decimal list-inside space-y-3 ml-4">
              <li>Ensure the surface is clean, dry, and level</li>
              <li>Apply tile adhesive evenly using a notched trowel</li>
              <li>Place tiles with spacers to maintain uniform gaps</li>
              <li>Press tiles firmly and check alignment</li>
              <li>Allow adhesive to dry for 24-48 hours</li>
              <li>Apply grout in the gaps between tiles</li>
              <li>Clean excess grout with a damp sponge</li>
              <li>Allow to cure completely before use</li>
            </ol>
            <p className="bg-orange-50 border-l-4 border-orange-500 p-4 mt-4">
              <strong>Note:</strong> Professional installation is recommended for best results.
            </p>
          </div>
        )}

        {activeTab === "care" && (
          <div className="space-y-4 text-slate-700">
            <p className="font-semibold text-slate-800">Maintenance Guidelines:</p>
            <ul className="space-y-3 ml-4">
              <li><strong>Daily Cleaning:</strong> Sweep or vacuum regularly to remove dust and debris</li>
              <li><strong>Wet Cleaning:</strong> Mop with mild detergent and warm water</li>
              <li><strong>Stain Removal:</strong> Use appropriate tile cleaner for stubborn stains</li>
              <li><strong>Avoid:</strong> Harsh chemicals, abrasive cleaners, and acidic substances</li>
              <li><strong>Polishing:</strong> Use tile polish occasionally to maintain shine</li>
            </ul>
            <p className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
              <strong>Tip:</strong> Regular maintenance will keep your tiles looking new for years.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
