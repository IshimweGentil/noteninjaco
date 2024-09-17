import React, { useState } from 'react';
import Link from 'next/link';
import { CardSpotlight } from './ui/card-spotlight';
import { basicPrice, proPrice } from '@/app/data/index';
import NotAvailablePopup from './ui/NotAvailablePopup';

interface PricingCardProps {
  title: string;
  price: number;
  features: string[];
  isFree: boolean;
  onProPlanClick: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ title, price, features, isFree, onProPlanClick }) => (
  <CardSpotlight className="w-full max-w-xs mx-auto mb-8 md:mb-0 p-4">
    <div className="flex-grow mb-6">
      <h3 className="text-2xl font-bold text-white mb-4 relative z-20">{title}</h3>
      <p className="text-4xl font-bold text-blue-100 mb-6 relative z-20">${price}/month</p>
      <ul className="text-left mb-6 relative z-20">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-300 mb-2">
            <CheckIcon className="mr-2" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="flex-shrink-0">
      {isFree ? (
        <Link href="/sign-up" passHref>
          <button className="bg-slate-400 text-slate-950 px-6 py-2 rounded-full hover:bg-slate-500 transition duration-300 w-full relative z-20">
            Sign Up
          </button>
        </Link>
      ) : (
        <button 
          className="bg-slate-400 text-slate-950 px-6 py-2 rounded-full hover:bg-slate-500 transition duration-300 w-full relative z-20" 
          onClick={onProPlanClick}
        >
          Choose Plan
        </button>
      )}
    </div>
  </CardSpotlight>
);

const Pricing: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleProPlanClick = () => {
    setShowPopup(true);
  };

  return (
    <section className="py-12 px-4 mb-10 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-blue-100 text-center mb-8 sm:mb-12">Pricing Plans</h2>
      <div className="flex flex-col md:flex-row md:justify-center md:space-x-4 space-y-8 md:space-y-0 max-w-2xl mx-auto">
        <PricingCard 
          title="Free" 
          price={basicPrice}
          features={['Basic note conversion', 'Limited to 3 projects', 'Access to AI flashcards and summaries']}
          isFree={true}
          onProPlanClick={() => {}}
        />
        <PricingCard 
          title="Pro" 
          price={proPrice}
          features={['Unlimited note conversion', 'Access to free tier features including NEW FEATURES COMING SOON', 'Unlimited Projects']}
          isFree={false}
          onProPlanClick={handleProPlanClick}
        />
      </div>
      <NotAvailablePopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
    </section>
  );
};

interface CheckIconProps {
  className?: string;
}

const CheckIcon: React.FC<CheckIconProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`h-4 w-4 text-gray-400 flex-shrink-0 ${className}`}
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

export default Pricing;