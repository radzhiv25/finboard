import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
              {/* <BarChart3 className="h-5 w-5 text-primary-foreground" /> */}
              <Wallet className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">FinBoard</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
            >
              <Link to="/login">
                Sign In
              </Link>
            </Button>
            <Button
              size="sm"
              asChild
            >
              <Link to="/signup">
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
