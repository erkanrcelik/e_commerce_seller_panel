/**
 * Seller Panel Footer
 *
 * Simple footer component displaying company information
 *
 * @returns Footer component
 */
export function SellerFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">P</span>
            </div>
            <span className="text-sm text-gray-600">
              © 2024 playableFactory. All rights reserved.
            </span>
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <span>Seller Panel v1.0</span>
            <span>•</span>
            <span>Powered by Next.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
