export function TestComponent() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">FinBoard Test</h1>
        <p className="text-xl text-muted-foreground">If you can see this, the app is working!</p>
        <div className="text-sm text-muted-foreground">
          <p>Current URL: {window.location.href}</p>
          <p>Current Path: {window.location.pathname}</p>
          <p>Timestamp: {new Date().toISOString()}</p>
        </div>
      </div>
    </div>
  )
}
