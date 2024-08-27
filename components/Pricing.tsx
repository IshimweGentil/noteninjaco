import React from 'react'

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
}

const PricingCard: React.FC<PricingCardProps> = ({ title, price, features }) => (
  <div className="bg-gray-800 p-6 rounded-lg text-center shadow-lg transform hover:scale-105 transition duration-300">
    <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
    <p className="text-4xl font-bold text-purple-400 mb-6">{price}</p>
    <ul className="text-left mb-6">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-gray-300 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {feature}
        </li>
      ))}
    </ul>
    <button className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition duration-300">Choose Plan</button>
  </div>
)

const Pricing: React.FC = () => (
  <section className="py-20">
    <h2 className="text-3xl font-bold text-white text-center mb-12">Pricing Plans</h2>
    <div className="flex justify-center space-x-8">
      <PricingCard 
        title="Free" 
        price="$0/month"
        features={['Basic note conversion', 'Limited flashcards', 'Standard support']}
      />
      <PricingCard 
        title="Pro" 
        price="$2.99/month"
        features={['Unlimited note conversion', 'Advanced flashcard features', 'Priority support']}
      />
    </div>
  </section>
)

export default Pricing