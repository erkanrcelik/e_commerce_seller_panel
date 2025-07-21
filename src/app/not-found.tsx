import { Home, Search } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

/**
 * Not Found Page
 * 
 * Modern 404 page with clean design and helpful navigation.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-6">
          {/* 404 Icon */}
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <Search className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">404</span>
            </div>
          </div>
          
          {/* Content */}
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Sayfa Bulunamadı
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Aradığınız sayfa mevcut değil veya taşınmış olabilir.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full">
            <Link href="/" className="flex-1">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg" size="lg">
                <Home className="w-4 h-4 mr-2" />
                Ana Sayfa
              </Button>
            </Link>
            <Link href="/search" className="flex-1">
              <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700" size="lg">
                <Search className="w-4 h-4 mr-2" />
                Ürün Ara
              </Button>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="w-full pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Popüler Kategoriler:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link href="/categories/electronics">
                <Button variant="ghost" size="sm" className="text-xs">
                  Elektronik
                </Button>
              </Link>
              <Link href="/categories/smartphones">
                <Button variant="ghost" size="sm" className="text-xs">
                  Telefonlar
                </Button>
              </Link>
              <Link href="/categories/laptops">
                <Button variant="ghost" size="sm" className="text-xs">
                  Laptoplar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
} 