import React from 'react'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Pricing from '../components/Pricing'
import Footer from '../components/Footer'

const Home: React.FC = () => {
  return (
    <>
      <main className="relative flex justify-center items-center flex-col mx-auto sm:px-10 px-5">
        <div className="max-w-7xl w-full">
        <Hero />
        <Features />
        <Pricing />
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Home