import { Inter } from "next/font/google"
import Link from "next/link"
import { Home, Menu, ShoppingCart, User, MapPin } from "lucide-react"

import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Toaster } from "sonner"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"
import { SettingsProvider } from "@/contexts/settings-context"
import CartIcon from "@/components/cart-icon"
import ContactInfo from "@/components/contact-info"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "China Express | Authentic Chinese Restaurant",
  description:
    "Experience authentic Chinese cuisine with our carefully crafted dishes, available for dine-in, takeout, or delivery.",
  generator: "v0.dev",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AuthProvider>
            <SettingsProvider>
              <CartProvider>
                <div className="flex min-h-screen flex-col">
                  <header className="sticky top-0 z-50 border-b bg-white">
                    <div className="container mx-auto flex h-16 items-center justify-between px-4">
                      <Link href="/" className="flex items-center gap-2 font-bold text-secondary">
                        <span className="text-xl">China Express</span>
                      </Link>

                      <nav className="hidden md:flex md:items-center md:gap-6">
                        <Link href="/" className="text-sm font-medium transition-colors hover:text-secondary">
                          Home
                        </Link>
                        <Link href="/menu" className="text-sm font-medium transition-colors hover:text-secondary">
                          Menu
                        </Link>
                        <Link href="/order" className="text-sm font-medium transition-colors hover:text-secondary">
                          Order Online
                        </Link>
                        <Link href="/about" className="text-sm font-medium transition-colors hover:text-secondary">
                          About Us
                        </Link>
                        <Link href="/contact" className="text-sm font-medium transition-colors hover:text-secondary">
                          Contact
                        </Link>
                        <Link
                          href="/track-order"
                          className="text-sm font-medium transition-colors hover:text-secondary"
                        >
                          Track Order
                        </Link>
                      </nav>

                      <div className="flex items-center gap-4">
                        <Link href="/order">
                          <CartIcon />
                        </Link>
                        <Link href="/checkout">
                          <Button className="hidden bg-secondary hover:bg-secondary/90 md:inline-flex">
                            Order Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </header>

                  <main className="flex-1">{children}</main>

                  <footer className="border-t bg-gray-50">
                    <div className="container mx-auto px-4 py-8">
                      <div className="grid gap-8 md:grid-cols-3">
                        <div>
                          <h3 className="mb-4 text-lg font-bold">China Express</h3>
                          <p className="mb-4 text-sm text-gray-600">
                            Authentic Chinese cuisine made with fresh ingredients and traditional recipes.
                          </p>
                          <div className="flex gap-4">
                            <Link href="#" className="text-gray-600 hover:text-secondary">
                              <span className="sr-only">Facebook</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                              >
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                              </svg>
                            </Link>
                            <Link href="#" className="text-gray-600 hover:text-secondary">
                              <span className="sr-only">Instagram</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                              >
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                              </svg>
                            </Link>
                            <Link href="#" className="text-gray-600 hover:text-secondary">
                              <span className="sr-only">Twitter</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                              >
                                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                              </svg>
                            </Link>
                          </div>
                        </div>
                        <div>
                          <h3 className="mb-4 text-lg font-bold">Contact Us</h3>
                          <ContactInfo />
                        </div>
                        <div>
                          <h3 className="mb-4 text-lg font-bold">Quick Links</h3>
                          <nav className="flex flex-col gap-2">
                            <Link href="/" className="text-sm text-gray-600 hover:text-secondary">
                              Home
                            </Link>
                            <Link href="/menu" className="text-sm text-gray-600 hover:text-secondary">
                              Menu
                            </Link>
                            <Link href="/order" className="text-sm text-gray-600 hover:text-secondary">
                              Order Online
                            </Link>
                            <Link href="/about" className="text-sm text-gray-600 hover:text-secondary">
                              About Us
                            </Link>
                            <Link href="/contact" className="text-sm text-gray-600 hover:text-secondary">
                              Contact
                            </Link>
                            <Link href="/track-order" className="text-sm text-gray-600 hover:text-secondary">
                              Track Order
                            </Link>
                          </nav>
                        </div>
                      </div>
                      <div className="mt-8 border-t pt-6 text-center">
                        <p className="text-sm text-gray-600">
                          © {new Date().getFullYear()} China Express Restaurant. All rights reserved.
                        </p>
                      </div>
                    </div>
                  </footer>

                  {/* Mobile Navigation */}
                  <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white md:hidden">
                    <div className="grid grid-cols-5">
                      <Link href="/" className="flex flex-col items-center py-2">
                        <Home className="h-5 w-5" />
                        <span className="text-xs">Home</span>
                      </Link>
                      <Link href="/menu" className="flex flex-col items-center py-2">
                        <Menu className="h-5 w-5" />
                        <span className="text-xs">Menu</span>
                      </Link>
                      <Link href="/order" className="flex flex-col items-center py-2">
                        <ShoppingCart className="h-5 w-5" />
                        <span className="text-xs">Cart</span>
                      </Link>
                      <Link href="/track-order" className="flex flex-col items-center py-2">
                        <MapPin className="h-5 w-5" />
                        <span className="text-xs">Track</span>
                      </Link>
                      <Link href="/account" className="flex flex-col items-center py-2">
                        <User className="h-5 w-5" />
                        <span className="text-xs">Account</span>
                      </Link>
                    </div>
                  </div>

                  <Toaster richColors position="top-right" />
                </div>
              </CartProvider>
            </SettingsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
