import React from 'react'

const Footer: React.FC = () => (
  <footer className="text-gray-300 py-8">
    <div className="container mx-auto px-4 text-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 max-w-3xl mx-auto">
        <div>
          <h3 className="text-lg font-semibold mb-2">NoteNinja.co</h3>
          <p>Transforming your study process</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul>
            <li><a href="#" className="hover:text-white transition duration-300">Home</a></li>
            <li><a href="#" className="hover:text-white transition duration-300">About</a></li>
            <li><a href="#" className="hover:text-white transition duration-300">Features</a></li>
            <li><a href="#" className="hover:text-white transition duration-300">Pricing</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact</h3>
          <p>Email: info@noteninja.co</p>
        </div>
      </div>
      <div>
        <p>&copy; 2024 NoteNinja.co. All rights reserved.</p>
      </div>
    </div>
  </footer>
)

export default Footer