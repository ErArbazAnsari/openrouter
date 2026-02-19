import React, { useState } from 'react'
import { Button } from './ui/button'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useElysiaClient } from '@/providers/Eden'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isLoading, refetch } = useAuth()
  const elysiaClient = useElysiaClient()

  const isProtectedPage = ['/dashboard', '/credits', '/apikeys'].includes(location.pathname)

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // Call logout endpoint to clear cookie
      const response = await elysiaClient.auth.logout.post({})
      if (response.error) {
        throw new Error('Logout failed')
      }
      return response.data
    },
    onSuccess: () => {
      refetch()
      toast.success('Logged out successfully')
      navigate('/')
      setMobileMenuOpen(false)
    },
    onError: () => {
      toast.error('Failed to logout')
    },
  })

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Docs', href: '#docs' },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={"/"}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">OR</span>
              </div>
              <span className="font-bold text-xl hidden sm:inline">OpenRouter</span>
            </div>
          </Link>

          {/* Protected Page Navigation - Desktop */}
          {isProtectedPage && (
            <div className="hidden md:flex items-center gap-8">
              <Link
                to="/dashboard"
                className={`text-sm transition-colors ${location.pathname === '/dashboard'
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                Dashboard
              </Link>
              <Link
                to="/credits"
                className={`text-sm transition-colors ${location.pathname === '/credits'
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                Credits
              </Link>
              <Link
                to="/apikeys"
                className={`text-sm transition-colors ${location.pathname === '/apikeys'
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                API Keys Manager
              </Link>
            </div>
          )}

          {/* Desktop Navigation - Non Protected Pages */}
          {!isProtectedPage && (
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          {/* Right Side - Auth Buttons or Logout */}
          {!isProtectedPage ? (
            <div className="hidden md:flex items-center gap-3">
              {!isLoading && !isAuthenticated ? (
                <>
                  <Link to={"/signin"}>
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link to={"/signup"}>
                    <Button size="sm">
                      Get Started
                    </Button>
                  </Link>
                </>
              ) : isLoading ? (
                <div className="h-10 w-20 bg-muted rounded animate-pulse"></div>
              ) : (
                <>
                  <Link to={"/dashboard"}>
                    <Button variant="ghost" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                  >
                    {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {isProtectedPage ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  Dashboard
                </Link>
                <Link
                  to="/credits"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  Credits
                </Link>
                <Link
                  to="/apikeys"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  API Keys Manager
                </Link>
              </>
            ) : (
              <>
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    {link.label}
                  </a>
                ))}
              </>
            )}
            <div className="pt-4 flex gap-2">
              {!isProtectedPage && !isLoading && !isAuthenticated ? (
                <>
                  <Link to={"/signin"} className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to={"/signup"} className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </>
              ) : !isProtectedPage && isLoading ? (
                <div className="h-10 w-full bg-muted rounded animate-pulse"></div>
              ) : !isProtectedPage && !isLoading && isAuthenticated ? (
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                </Button>
              ) : isProtectedPage ? (
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                </Button>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar