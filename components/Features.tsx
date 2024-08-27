const Features = () => (
    <section className="py-20">
      <h2 className="text-3xl font-bold text-white text-center mb-12">Key Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {['Convert notes to flashcards', 'Efficient review system', 'Organize study material'].map((feature, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-purple-400 mb-4">{feature}</h3>
            <p className="text-gray-300">Streamline your study process with our intuitive tools designed to enhance learning and retention.</p>
          </div>
        ))}
      </div>
    </section>
  );
  
  export default Features