import React, { useState } from 'react';
import Link from 'next/link';
import { CardSpotlight } from './card-spotlight';
import NotAvailablePopup from './NotAvailablePopup';

interface PricingFeature {
  text: string;
}

interface PricingPlan {
  title: string;
  price: string;
  features: PricingFeature[];
  action: 'signup' | 'unavailable';
}

interface PricingCardProps {
  plan: PricingPlan;
  onAction: (action: 'signup' | 'unavailable') => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, onAction }) => (
  <CardSpotlight className="w-full mx-auto p-2 sm:p-4">
    <div className="flex justify-between items-center mb-1 sm:mb-2 relative z-20 ">
      <h3 className="text-base sm:text-lg font-bold text-white">{plan.title}</h3>
      <p className="text-lg sm:text-xl font-bold text-blue-100">{plan.price}</p>
    </div>
    <ul className="text-left mb-2 sm:mb-3 relative z-20">
      {plan.features.map((feature, index) => (
        <li key={index} className="flex items-center text-gray-300 mb-0.5 sm:mb-1">
          <CheckIcon />
          <span className="text-xs sm:text-sm">{feature.text}</span>
        </li>
      ))}
    </ul>
    {plan.action === 'signup' ? (
      <Link href="/sign-up" className="block w-full">
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition duration-300 w-full relative z-20 text-xs sm:text-sm">
          Sign Up
        </button>
      </Link>
    ) : (
      <button 
        className="bg-purple-600 hover:bg-purple-700 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition duration-300 w-full relative z-20 text-xs sm:text-sm"
        onClick={() => onAction('unavailable')}
      >
        Choose Plan
      </button>
    )}
  </CardSpotlight>
);

const CompactPricing: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleAction = (action: 'signup' | 'unavailable') => {
    if (action === 'unavailable') {
      setShowPopup(true);
    }
  };

  const plans: PricingPlan[] = [
    {
      title: "Free",
      price: "$0/month",
      features: [
        { text: "Basic note conversion" },
        { text: "Limited flashcards" },
        { text: "Standard support" }
      ],
      action: 'signup'
    },
    {
      title: "Pro",
      price: "$2.99/month",
      features: [
        { text: "Unlimited note conversion" },
        { text: "Advanced flashcard features" },
        { text: "Priority support" }
      ],
      action: 'unavailable'
    }
  ];

  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        {plans.map((plan, index) => (
          <PricingCard key={index} plan={plan} onAction={handleAction} />
        ))}
      </div>
      <NotAvailablePopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
    </div>
  );
};

const CheckIcon: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-400 mr-1 sm:mr-1.5 flex-shrink-0"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path
        d="M12 2c-.218 0 -.432 .002 -.642 .005l-.616 .017l-.299 .013l-.579 .034l-.553 .046c-4.785 .464 -6.732 2.411 -7.196 7.196l-.046 .553l-.034 .579c-.005 .098 -.01 .198 -.013 .299l-.017 .616l-.004 .318l-.001 .324c0 .218 .002 .432 .005 .642l.017 .616l.013 .299l.034 .579l.046 .553c.464 4.785 2.411 6.732 7.196 7.196l.553 .046l.579 .034c.098 .005 .198 .01 .299 .013l.616 .017l.642 .005l.642 -.005l.616 -.017l.299 -.013l.579 -.034l.553 -.046c4.785 -.464 6.732 -2.411 7.196 -7.196l.046 -.553l.034 -.579c.005 -.098 .01 -.198 .013 -.299l.017 -.616l.005 -.642l-.005 -.642l-.017 -.616l-.013 -.299l-.034 -.579l-.046 -.553c-.464 -4.785 -2.411 -6.732 -7.196 -7.196l-.553 -.046l-.579 -.034a28.058 28.058 0 0 0 -.299 -.013l-.616 -.017l-.318 -.004l-.324 -.001zm2.293 7.293a1 1 0 0 1 1.497 1.32l-.083 .094l-4 4a1 1 0 0 1 -1.32 .083l-.094 -.083l-2 -2a1 1 0 0 1 1.32 -1.497l.094 .083l1.293 1.292l3.293 -3.292z"
        fill="currentColor"
        strokeWidth="0"
      />
    </svg>
  );
};

export default CompactPricing;