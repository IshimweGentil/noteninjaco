import { SignUp } from "@clerk/nextjs";
import React from "react";
import '../../globals.css';

export default function SignUpPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-slate-950 px-2 sm:px-6 lg:px-8">
      <div className="w-full max-w-[95%] xs:max-w-[90%] sm:max-w-[80%] md:max-w-md">
        <SignUp 
          redirectUrl="/dashboard/generate"
          appearance={{
            elements: {
              rootBox: "bg-slate-950 border border-slate-800 bg-opacity-90 backdrop-blur-lg rounded-lg p-3 sm:p-6 shadow-xl",
              card: "bg-transparent",
              headerTitle: "text-white text-lg sm:text-xl md:text-2xl font-bold",
              headerSubtitle: "text-gray-300 text-xs sm:text-sm",
              formButtonPrimary: "bg-purple-600 hover:bg-purple-700 text-white transition duration-300 text-xs sm:text-sm py-2 px-3 sm:px-4",
              formFieldLabel: "text-gray-300 text-xs sm:text-sm",
              formFieldInput: "bg-slate-800 text-white border-slate-700 text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-3",
              footerActionLink: "text-purple-400 hover:text-purple-300 text-xs sm:text-sm",
              dividerLine: "bg-slate-700",
              dividerText: "text-slate-400 text-xs sm:text-sm",
              socialButtonsBlockButton: "border-slate-700 text-white hover:bg-slate-800 transition duration-300 text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-4",
              socialButtonsBlockButtonText: "text-white text-xs sm:text-sm",
            },
            layout: {
              socialButtonsPlacement: "bottom",
              socialButtonsVariant: "iconButton",
            },
          }}
        />
      </div>
    </div>
  );
}
