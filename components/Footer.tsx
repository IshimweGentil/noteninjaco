import React from 'react'

const Footer: React.FC = () => (
  <footer className=" text-gray-300 py-8">
    <div className="container mx-auto px-4 text-center">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
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
          <p>Phone: (123) 456-7890</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
          <div className="flex justify-center space-x-4">
            {/* Add social media icons here */}
          </div>
        </div>
      </div>
      <div>
        <p>&copy; 2024 NoteNinja.co. All rights reserved.</p>
      </div>
    </div>
  </footer>
)

export default Footer