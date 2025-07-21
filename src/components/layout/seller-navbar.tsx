"use client";

import { Bell, User, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

/**
 * Seller Panel Navigation Bar
 *
 * Fixed header navigation for seller panel with:
 * - Company logo and branding
 * - Navigation links for different sections with active state
 * - User profile and notifications
 * - Mobile responsive menu
 *
 * @returns Seller navbar component
 */
export function SellerNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const getLinkClasses = (path: string) => {
    const baseClasses = "text-sm font-medium transition-colors";
    if (isActive(path)) {
      return `${baseClasses} text-purple-600 bg-purple-50 px-3 py-2 rounded-md`;
    }
    return `${baseClasses} text-gray-900 hover:text-purple-600`;
  };

  const getMobileLinkClasses = (path: string) => {
    const baseClasses = "px-3 py-2 text-sm transition-colors";
    if (isActive(path)) {
      return `${baseClasses} text-purple-600 bg-purple-50 rounded-md`;
    }
    return `${baseClasses} text-gray-700 hover:text-purple-600`;
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      {/* Main Navigation */}
      <nav className="bg-white">
        <div className="mx-auto px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  playableFactory
                </h1>
                <p className="text-xs text-gray-500">Seller Panel</p>
              </div>
            </div>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className={getLinkClasses("/")}>
                Dashboard
              </Link>
              <Link href="/products" className={getLinkClasses("/products")}>
                Products
              </Link>
              <Link href="/orders" className={getLinkClasses("/orders")}>
                Orders
              </Link>
              <Link href="/campaigns" className={getLinkClasses("/campaigns")}>
                Campaigns
              </Link>
              <Link href="/profile" className={getLinkClasses("/profile")}>
                Profile
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs">
                    2
                  </Badge>
                </Button>
              </div>

              {/* User Profile */}
              <Button
                size="sm"
                className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <User className="h-4 w-4" />
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-2">
                <Link href="/" className={getMobileLinkClasses("/")}>
                  Dashboard
                </Link>
                <Link
                  href="/products"
                  className={getMobileLinkClasses("/products")}
                >
                  Products
                </Link>
                <Link
                  href="/orders"
                  className={getMobileLinkClasses("/orders")}
                >
                  Orders
                </Link>
                <Link
                  href="/campaigns"
                  className={getMobileLinkClasses("/campaigns")}
                >
                  Campaigns
                </Link>
                <Link
                  href="/profile"
                  className={getMobileLinkClasses("/profile")}
                >
                  Profile
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
