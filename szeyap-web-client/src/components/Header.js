'use client';

import { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from 'next/link';

// Single source of truth for menu items
const menuItems = [
  { title: "ABOUT", href: "/about" },
  { title: "RESOURCES", href: "/resources" },
  { title: "MAP", href: "/map" },
  { title: "STORE", href: "/store" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/hoisan_sauce_logo.webp" 
              alt="台山醬 Hoisan Sauce" 
              className="h-14 w-auto object-contain"
            />
          </div>

          {/* Desktop Navigation Menu */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="flex items-center space-x-1">
              {menuItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link 
                      href={item.href} 
                      className={`${navigationMenuTriggerStyle()} text-gray-800 hover:text-gray-900 font-medium tracking-wider text-[20px]`}
                    >
                      {item.title}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right side - Search + Mobile Menu */}
          <div className="flex items-center space-x-2">
            {/* Mobile Hamburger Menu - Always visible on mobile */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button 
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors md:hidden border border-gray-300 rounded-md bg-white hover:bg-gray-100 shadow-sm cursor-pointer"
                  aria-label="Open navigation menu"
                >
                  <Menu size={24} />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-3">
                    <img 
                      src="/hoisan_sauce_logo.webp" 
                      alt="台山醬 Hoisan Sauce" 
                      className="h-16 w-auto object-contain ml-2"
                    />
                    <div>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                
                {/* Mobile Menu Items */}
                <nav className="">
                  <ul className="space-y-4">
                    {menuItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="block py-3 px-8 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors tracking-wider"
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
