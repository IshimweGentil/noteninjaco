import React from 'react'

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      <p className="ml-4 text-xl">Loading...</p>
    </div>
  )
}

export default LoadingSpinner