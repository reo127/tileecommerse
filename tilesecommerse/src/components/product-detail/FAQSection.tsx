"use client";

import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How much coverage should I expect per box?",
      answer: "Each box covers approximately 12 square feet. We recommend ordering 10% extra to account for cutting and wastage during installation.",
    },
    {
      question: "What is the warranty on this tile?",
      answer: "We offer a manufacturer's warranty of 10 years against manufacturing defects. This does not cover damage from improper installation or maintenance.",
    },
    {
      question: "Does it require grout/joint filler?",
      answer: "Yes, grout is essential for proper installation. We recommend using high-quality epoxy grout for best results and longevity.",
    },
    {
      question: "Can I use these tiles outdoors?",
      answer: "Yes, these tiles are suitable for both indoor and outdoor use. They have excellent weather resistance and are frost-proof.",
    },
    {
      question: "Can this tile be used on my floor?",
      answer: "Absolutely! These tiles are designed for both floor and wall applications. They have high breaking strength and are perfect for high-traffic areas.",
    },
  ];

  return (
    <div className="bg-slate-900 text-white rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">FAQ's</h2>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-slate-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex justify-between items-center p-4 hover:bg-slate-800 transition-colors text-left"
            >
              <span className="font-semibold pr-4">{faq.question}</span>
              {openIndex === index ? (
                <FaChevronUp className="flex-shrink-0 text-orange-500" />
              ) : (
                <FaChevronDown className="flex-shrink-0 text-slate-400" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-4 pb-4 text-slate-300 bg-slate-800">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
