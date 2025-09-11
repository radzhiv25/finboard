import { BarChart3, DollarSign, TrendingUp, PieChart, Settings, Shield, Wallet } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {/* Dashboard Card */}
          <div className="bg-background border rounded-lg p-4 hover:shadow-sm transition-shadow">
            <BarChart3 className="h-6 w-6 text-primary mb-2" />
            <h3 className="font-medium text-sm mb-1">Dashboard</h3>
            <p className="text-xs text-muted-foreground">Financial overview</p>
          </div>

          {/* Transactions Card */}
          <div className="bg-background border rounded-lg p-4 hover:shadow-sm transition-shadow">
            <DollarSign className="h-6 w-6 text-green-600 mb-2" />
            <h3 className="font-medium text-sm mb-1">Transactions</h3>
            <p className="text-xs text-muted-foreground">Track expenses</p>
          </div>

          {/* Analytics Card */}
          <div className="bg-background border rounded-lg p-4 hover:shadow-sm transition-shadow">
            <TrendingUp className="h-6 w-6 text-blue-600 mb-2" />
            <h3 className="font-medium text-sm mb-1">Analytics</h3>
            <p className="text-xs text-muted-foreground">Spending insights</p>
          </div>

          {/* Reports Card */}
          <div className="bg-background border rounded-lg p-4 hover:shadow-sm transition-shadow">
            <PieChart className="h-6 w-6 text-purple-600 mb-2" />
            <h3 className="font-medium text-sm mb-1">Reports</h3>
            <p className="text-xs text-muted-foreground">Visual reports</p>
          </div>

          {/* Settings Card */}
          <div className="bg-background border rounded-lg p-4 hover:shadow-sm transition-shadow">
            <Settings className="h-6 w-6 text-gray-600 mb-2" />
            <h3 className="font-medium text-sm mb-1">Settings</h3>
            <p className="text-xs text-muted-foreground">Preferences</p>
          </div>

          {/* Security Card */}
          <div className="bg-background border rounded-lg p-4 hover:shadow-sm transition-shadow">
            <Shield className="h-6 w-6 text-orange-600 mb-2" />
            <h3 className="font-medium text-sm mb-1">Security</h3>
            <p className="text-xs text-muted-foreground">Data protection</p>
          </div>
        </div>

        {/* Brand and Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <Wallet className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">FinBoard</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; 2025 FinBoard. Your personal finance companion.
          </p>
        </div>
      </div>
    </footer>
  )
}
