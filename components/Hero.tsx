import React from 'react'

const Hero: React.FC = () => (
  <section className="text-center py-20">
    <h1 className="text-5xl font-bold text-white mb-4">
      Transforming Notes into <br></br><span className="text-purple-400">Seamless Learning Experiences</span>
    </h1>
    <p className="text-xl text-gray-300 mb-8">
      NoteNinja.co: Your ultimate companion for mastering any subject
    </p>
    <button className="bg-purple-600 text-white px-6 py-3 rounded-full text-lg flex items-center mx-auto hover:bg-purple-700 transition duration-300">
      Get Started 
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
  </section>
)

export default Hero