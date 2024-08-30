import React from 'react'
import { Spotlight } from '@/components/ui/Spotlight';

const Hero: React.FC = () => (
  <div className="relative overflow-hidden">
    {/* Spotlight containers */}
    <div className="absolute inset-0">
      <Spotlight className="-top-40 -left-10 md:left-32 md:-top-20 h-screen" fill="white"/>
      <Spotlight className="-top-10 -left-full h-[80vh] w-[50vw]" fill="purple"/>
      <Spotlight className="-top-28 -left-80 h-[80vh] w-[50vw]" fill="blue"/>
    </div>
    
    {/* Hero content */}
    <div className="relative z-10 pb-20 pt-36 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
        Transform Your Notes into Powerful Flashcards
      </h1>
      <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
        NoteNinja helps you streamline your study process, turning your notes into effective flashcards for quick and efficient review.
      </p>
      <button className="bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-700 transition duration-300">
        Get Started
      </button>
    </div>
  </div>
)

export default Hero