import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { CheckCircle, Send, User, Mail, MessageSquare, DollarSign } from "lucide-react"

const contactFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    message: z.string().min(10, "Message must be at least 10 characters"),
    budget: z.string().min(1, "Please select a budget range"),
    interests: z.array(z.string()).min(1, "Please select at least one interest"),
    newsletter: z.boolean(),
    priority: z.string().min(1, "Please select a priority level"),
    budgetAmount: z.number().min(0).max(1000000),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

export function ContactForm() {
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [budgetAmount, setBudgetAmount] = useState([5000])

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
            budget: "",
            interests: [],
            newsletter: false,
            priority: "",
            budgetAmount: 5000,
        },
    })

    const onSubmit = (data: ContactFormValues) => {
        console.log("Form submitted:", data)
        setIsSubmitted(true)
        // Reset form after 3 seconds
        setTimeout(() => {
            setIsSubmitted(false)
            form.reset()
            setBudgetAmount([5000])
        }, 3000)
    }

    const interests = [
        "Personal Finance",
        "Investment Tracking",
        "Budget Planning",
        "Expense Analytics",
        "Goal Setting",
        "Family Sharing"
    ]

    if (isSubmitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
                >
                    <CheckCircle className="h-8 w-8 text-green-600" />
                </motion.div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">Thank you!</h3>
                <p className="text-muted-foreground">Your message has been sent successfully.</p>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Contact Us
                    </CardTitle>
                    <CardDescription>
                        Fill out the form below and we'll get back to you within 24 hours.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Name and Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="Your full name"
                                    {...form.register("name")}
                                />
                                {form.formState.errors.name && (
                                    <p className="text-sm text-destructive">
                                        {form.formState.errors.name.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    {...form.register("email")}
                                />
                                {form.formState.errors.email && (
                                    <p className="text-sm text-destructive">
                                        {form.formState.errors.email.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                placeholder="Tell us about your financial goals and how we can help..."
                                className="min-h-[100px]"
                                {...form.register("message")}
                            />
                            {form.formState.errors.message && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.message.message}
                                </p>
                            )}
                        </div>

                        {/* Budget Range */}
                        <div className="space-y-2">
                            <Label>Budget Range</Label>
                            <Select onValueChange={(value) => form.setValue("budget", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your budget range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="under-1k">Under $1,000</SelectItem>
                                    <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
                                    <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                                    <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                                    <SelectItem value="25k-plus">$25,000+</SelectItem>
                                </SelectContent>
                            </Select>
                            {form.formState.errors.budget && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.budget.message}
                                </p>
                            )}
                        </div>

                        {/* Budget Slider */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                Specific Budget Amount: ${budgetAmount[0].toLocaleString()}
                            </Label>
                            <Slider
                                value={budgetAmount}
                                onValueChange={(value) => {
                                    setBudgetAmount(value)
                                    form.setValue("budgetAmount", value[0])
                                }}
                                max={100000}
                                step={1000}
                                className="w-full"
                            />
                        </div>

                        {/* Interests */}
                        <div className="space-y-2">
                            <Label>Areas of Interest</Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {interests.map((interest) => (
                                    <div key={interest} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={interest}
                                            onCheckedChange={(checked) => {
                                                const currentInterests = form.getValues("interests")
                                                if (checked) {
                                                    form.setValue("interests", [...currentInterests, interest])
                                                } else {
                                                    form.setValue(
                                                        "interests",
                                                        currentInterests.filter((item) => item !== interest)
                                                    )
                                                }
                                            }}
                                        />
                                        <Label htmlFor={interest} className="text-sm">
                                            {interest}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            {form.formState.errors.interests && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.interests.message}
                                </p>
                            )}
                        </div>

                        {/* Priority Level */}
                        <div className="space-y-2">
                            <Label>Priority Level</Label>
                            <RadioGroup
                                onValueChange={(value) => form.setValue("priority", value)}
                                className="flex flex-col space-y-2"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="low" id="low" />
                                    <Label htmlFor="low">Low - Just exploring options</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="medium" id="medium" />
                                    <Label htmlFor="medium">Medium - Planning to start soon</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="high" id="high" />
                                    <Label htmlFor="high">High - Need immediate assistance</Label>
                                </div>
                            </RadioGroup>
                            {form.formState.errors.priority && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.priority.message}
                                </p>
                            )}
                        </div>

                        {/* Newsletter Subscription */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="newsletter">Subscribe to our newsletter</Label>
                                <p className="text-sm text-muted-foreground">
                                    Get the latest financial tips and updates
                                </p>
                            </div>
                            <Switch
                                id="newsletter"
                                checked={form.watch("newsletter")}
                                onCheckedChange={(checked) => form.setValue("newsletter", checked)}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button type="submit" className="flex-1" size="lg">
                                <Send className="mr-2 h-4 w-4" />
                                Send Message
                            </Button>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" type="button">
                                        Preview Data
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Form Data Preview</DialogTitle>
                                        <DialogDescription>
                                            This is what will be submitted:
                                        </DialogDescription>
                                    </DialogHeader>
                                    <pre className="bg-muted p-4 rounded-md text-sm overflow-auto max-h-96">
                                        {JSON.stringify(form.watch(), null, 2)}
                                    </pre>
                                </DialogContent>
                            </Dialog>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" type="button">
                                        Clear Form
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will clear all form data. This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => {
                                                form.reset()
                                                setBudgetAmount([5000])
                                            }}
                                        >
                                            Clear Form
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    )
}
