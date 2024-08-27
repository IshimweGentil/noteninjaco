import React from 'react'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Pricing from '../components/Pricing'
import Footer from '../components/Footer'

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </>
  )
}

export default Home