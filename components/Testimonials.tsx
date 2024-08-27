const Testimonials = () => {
    const testimonials = [
      { name: 'Sarah J.', text: 'NoteNinja.co has revolutionized my study routine!', avatar: '/avatar1.jpg' },
      { name: 'Mike T.', text: 'Ive seen a significant improvement in my grades since using NoteNinja.co', avatar: '/avatar2.jpg' },
      { name: 'Emily R.', text: 'The easiest way to create and review flashcards. Highly recommended!', avatar: '/avatar3.jpg' },
    ]
  
    return (
      <div className="py-20 bg-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-teal-400">What Students Are Saying</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-700 p-6 rounded-lg">
                <p className="mb-4 text-gray-300">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                  <p className="font-semibold text-teal-400">{testimonial.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  export default Testimonials