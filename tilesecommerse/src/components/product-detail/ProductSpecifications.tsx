interface ProductSpecificationsProps {
  category?: string;
}

export const ProductSpecifications = ({ category }: ProductSpecificationsProps) => {
  const specifications = [
    { label: "Application", value: "Floor & Wall" },
    { label: "Type", value: "Vitrified Tiles" },
    { label: "Finish", value: "Polished Glazed" },
    { label: "Thickness", value: "8-10 mm" },
    { label: "Material", value: "Ceramic" },
    { label: "Color", value: "Multiple Options" },
    { label: "Usage", value: "Indoor & Outdoor" },
    { label: "Water Absorption", value: "< 0.5%" },
    { label: "Surface Treatment", value: "Glazed" },
    { label: "Breaking Strength", value: "High" },
    { label: "Slip Resistance", value: "R10" },
    { label: "Country of Origin", value: "India" },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Product Specifications</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {specifications.map((spec, index) => (
          <div key={index} className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-slate-600 font-medium">{spec.label}:</span>
            <span className="text-slate-800 font-semibold">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
