import React from "react";
import { FaLocationArrow } from "react-icons/fa6";
import MagicButton from "./ui/MagicButton";
import { TextGenerateEffect } from "./ui/TextGenerationEffect";
import Link from "next/link";
import {
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import GetStarted from "./ui/GetStarted";

const Hero = () => {
  return (
    <div className="relative h-[40rem] w-full overflow-hidden">
      {/* Custom grid background with fading effect */}
      <div className="absolute inset-0 h-full w-full">
        <div
          className="h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
          style={{
            maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)'
          }}
        ></div>
      </div>
      
      {/* Hero content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
          <p className="uppercase tracking-widest text-s text-center text-blue-100 max-w-90">
            Transform Your Documents into Studyable material
          </p>
          <TextGenerateEffect
            words="Streamline Your Studying Process"
            className="text-center text-[40px] md:text-5xl lg:text-6xl text-white"
          />
          <p className="pb-10 tracking-widest text-xs text-center text-blue-100 max-w-80">
            Designed and developed by 
            Ishimwe Gentil,
            Mounir Mkhallati,
            and Kyle Huang.
          </p>
          
          <SignedIn>
            <Link href={`/dashboard/generate`}>
              <MagicButton
                title="Get Started"
                icon={<FaLocationArrow />}
                position="right"
              />
            </Link>
          </SignedIn>
          <SignedOut>
            <GetStarted />
          </SignedOut>
        </div>
      </div>
    </div>
  );
};

export default Hero;