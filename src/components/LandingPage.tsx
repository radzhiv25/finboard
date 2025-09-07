import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ContactForm } from "@/components/ContactForm"
import { ArrowRight, BarChart3, Shield, Zap, Users, TrendingUp, CheckCircle } from "lucide-react"

export function LandingPage() {
    console.log('LandingPage rendering...')
    
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <Badge variant="secondary" className="mb-4">
                            <Zap className="h-3 w-3 mr-1" />
                            New: AI-Powered Analytics
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                            Take Control of Your
                            <span className="text-primary"> Financial Future</span>
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            FinBoard is the all-in-one financial dashboard that helps you track expenses,
                            analyze spending patterns, and make smarter money decisions.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                className="text-lg px-8"
                                asChild
                            >
                                <Link to="/signup">
                                    Get Started Free
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="text-lg px-8"
                                asChild
                            >
                                <Link to="/login">
                                    Sign In
                                </Link>
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">
                            No credit card required • 14-day free trial
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-muted/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to manage your finances</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Powerful features designed to give you complete control over your financial life
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card>
                            <CardHeader>
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <BarChart3 className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Smart Analytics</CardTitle>
                                <CardDescription>
                                    Get insights into your spending patterns with AI-powered analytics and visual reports.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <Shield className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Bank-Level Security</CardTitle>
                                <CardDescription>
                                    Your financial data is protected with enterprise-grade encryption and security measures.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <TrendingUp className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Investment Tracking</CardTitle>
                                <CardDescription>
                                    Monitor your investments and portfolio performance with real-time market data.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <Users className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Family Sharing</CardTitle>
                                <CardDescription>
                                    Share financial goals and budgets with family members for better collaboration.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <Zap className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Automated Categorization</CardTitle>
                                <CardDescription>
                                    Transactions are automatically categorized and tagged for effortless expense tracking.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <CheckCircle className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Goal Setting</CardTitle>
                                <CardDescription>
                                    Set and track financial goals with personalized recommendations and progress monitoring.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <Card className="max-w-4xl mx-auto">
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl mb-4">Ready to transform your financial life?</CardTitle>
                            <CardDescription className="text-lg">
                                Join thousands of users who are already taking control of their finances with FinBoard.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                                <Button
                                    size="lg"
                                    className="text-lg px-8"
                                    asChild
                                >
                                    <Link to="/signup">
                                        Get Started Free
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="text-lg px-8"
                                    asChild
                                >
                                    <Link to="/login">
                                        Sign In
                                    </Link>
                                </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                By signing up, you agree to our Terms of Service and Privacy Policy.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-20 bg-muted/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Have questions about FinBoard? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>
                    <ContactForm />
                </div>
            </section>

            <Footer />
        </div>
    )
}
