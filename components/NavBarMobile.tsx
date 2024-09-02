"use client";

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { SignInButton, SignUpButton, UserButton, useUser,  } from "@clerk/nextjs";
import { motion, useCycle } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { MenuItemWithSubMenuProps } from '@/styles/types';

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 1100% 0)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2
    }
  }),
  closed: {
    clipPath: "circle(0px at 100% 0px)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40
    },
  },
};

const variants = {
  open: {
    transition: { staggerChildren: 0.02, delayChildren: 0.15 },
  },
  closed: {
    transition: { staggerChildren: 0.01, staggerDirection: -1 },
  },
};

const NavBarMobile = () => {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const { height } = useDimensions(containerRef);
  const [isOpen, toggleOpen] = useCycle(false, true);
  const { isSignedIn } = useUser();

  

  return (
    <div className={`relative ${isOpen ? 'overflow-hidden' : ''}`}>
      {isOpen && (
        <div className="fixed inset-0  backdrop-blur-md z-40" />
      )}

      <motion.nav
        initial={false}
        animate={isOpen ? "open" : "closed"}
        custom={height}
        className={`fixed inset-0 z-50 w-full md:hidden ${isOpen ? "" : "pointer-events-none"}`}
        ref={containerRef}
      >
        <motion.div
          className="absolute inset-0 w-full"
          variants={sidebar}
        />

        <motion.ul
          className="absolute inset-0 flex flex-col items-center justify-center w-full"
          variants={variants}
        >
          <MenuItem>
            <Link href="/" onClick={() => toggleOpen()} className="flex w-full text-2xl">
              Home
            </Link>
          </MenuItem>

          {isSignedIn && (
            <>
              <MenuItem className="my-3 h-px w-full bg-gray-700" />

              <MenuItem>
                <Link href="/dashboard/generate" onClick={() => toggleOpen()} className="flex w-full text-2xl">
                  Generate
                </Link>
              </MenuItem>

              <MenuItem>
                <Link href="/dashboard/study" onClick={() => toggleOpen()} className="flex w-full text-2xl">
                  Study
                </Link>
              </MenuItem>

              <MenuItem className="mt-3">
                <UserButton
                  afterSignOutUrl="/"
                />
              </MenuItem>
            </>
          )}

          {!isSignedIn && (
            <>
              <MenuItem >
                <SignInButton  mode="modal">
                  <button className="w-full text-left bg-slate-700 text-white px-4 py-2 my-4 rounded hover:bg-slate-800 transition duration-300">
                    Sign In
                  </button>
                </SignInButton>
              </MenuItem>
              <MenuItem>
                <SignUpButton mode="modal">
                  <button className="w-full text-left bg-white border text-slate-700 px-4 py-2 rounded hover:bg-slate-800 hover:text-white transition duration-300">
                    Sign Up
                  </button>
                </SignUpButton>
              </MenuItem>
            </>
          )}
        </motion.ul>

        <MenuToggle toggle={toggleOpen} />
      </motion.nav>
    </div>
  );
};

export default NavBarMobile;

const MenuToggle = ({ toggle }: { toggle: any }) => (
  <button onClick={toggle} className="pointer-events-auto absolute right-4 top-[14px] z-30">
  <svg width="23" height="23" viewBox="0 0 23 23">
    <Path 
      variants={{ closed: { d: "M 2 2.5 L 20 2.5" }, open: { d: "M 3 16.5 L 17 2.5" } }} 
      stroke="white"  // Set stroke to white
    />
    <Path 
      d="M 2 9.423 L 20 9.423" 
      variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }} 
      stroke="white"  // Set stroke to white
    />
    <Path 
      variants={{ closed: { d: "M 2 16.346 L 20 16.346" }, open: { d: "M 3 2.5 L 17 16.346" } }} 
      stroke="white"  // Set stroke to white
    />
  </svg>
</button>
);

const Path = (props: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
    {...props}
  />
);

const MenuItemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: { y: { stiffness: 1000, velocity: -100 } },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: { y: { stiffness: 1000 }, duration: 0.2 },
  },
};

const MenuItem = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <motion.li variants={MenuItemVariants} className={className}>
      {children}
    </motion.li>
    
  );
};

const MenuItemWithSubMenu: React.FC<MenuItemWithSubMenuProps> = ({
  item,
  toggleOpen,
}) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  return (
    <>
      <MenuItem>
        <button
          className="flex w-full text-2xl"
          onClick={() => setSubMenuOpen(!subMenuOpen)}
        >
          <div className="flex flex-row justify-between w-full items-center">
            <span className={`${pathname.includes(item.path) ? 'font-bold' : ''}`}>
              {item.title}
            </span>

            <div className={`${subMenuOpen ? 'rotate-180' : ''}`}>
              <Icon icon="majesticons:menu-line" width="24" height="24" />
            </div>
          </div>
        </button>
      </MenuItem>

      <div className={`mt-2 ml-2 flex flex-col space-y-2 ${subMenuOpen ? 'block' : 'hidden'}`}>
        {item.subMenuItems?.map((subitem, subIdx) => (
          <MenuItem key={subIdx}>
            <Link
              href={subitem.path}
              onClick={() => toggleOpen()}
              className={`${subitem.path === pathname ? 'font-bold' : ''}`}
            >
              {subitem.title}
            </Link>
          </MenuItem>
        ))}
      </div>
    </>
  );
};

const useDimensions = (ref: any) => {
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (ref.current) {
      dimensions.current.width = ref.current.offsetWidth;
      dimensions.current.height = ref.current.offsetHeight;
    }
  }, [ref]);

  return dimensions.current;
};

