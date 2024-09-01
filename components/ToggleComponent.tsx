import React, { useState } from 'react';
import { Chat } from '../components/Chat';

const ToggleComponent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const closeChat = () => {
    setIsVisible(false);
  };

  return (
    <div>
      <button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? 'Hide Chat' : 'Show Chat'}
      </button>
      <Chat 
        isVisible={isVisible} 
        setIsVisible={setIsVisible} 
        closeChat={closeChat}
      />
    </div>
  );
};

export default ToggleComponent;