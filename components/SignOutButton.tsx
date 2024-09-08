import React from 'react'
import { useClerk } from "@clerk/nextjs";

const SignOutButton: React.FC = () => {
  const { signOut } = useClerk();

  return (
    <button
      className="text-gray-300 hover:text-white transition duration-300"
      onClick={() => signOut()}
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;