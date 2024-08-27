import { SignUp } from "@clerk/nextjs";
import React from "react";
import '../../globals.css';


export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <SignUp 
        appearance={{
          elements: {
            rootBox: "bg-gray-800 p-8 rounded-lg shadow-xl",
            card: "bg-gray-800",
            headerTitle: "text-white text-2xl font-bold",
            headerSubtitle: "text-gray-300",
            formButtonPrimary: "bg-purple-600 hover:bg-purple-700 text-white",
            formFieldLabel: "text-gray-300",
            formFieldInput: "bg-gray-700 text-white",
            footerActionLink: "text-purple-400 hover:text-purple-300",
          },
        }}
      />
    </div>
  );
}
