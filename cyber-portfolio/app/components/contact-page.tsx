"use client"

import { Copy, Github, Linkedin, Mail, ExternalLink, Send, Calendar } from 'lucide-react'
import { useState } from "react"
import { Header } from './header'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function ContactPage() {
  const [copied, setCopied] = useState(false)
  const email = "your.email@example.com" // Replace with your email
  const linkedinUrl = "https://linkedin.com/in/your-profile" // Replace with your LinkedIn
  const githubUrl = "https://github.com/your-username" // Replace with your GitHub
  const calendlyUrl = "https://calendly.com/your-username" // Replace with your Calendly

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      toast({
        title: "Email copied!",
        description: "The email address has been copied to your clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try copying the email manually.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    // Here you would implement your form submission logic
    toast({
      title: "Message sent!",
      description: "Thank you for your message. I'll get back to you soon.",
    })
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
        <div className="container px-4 md:px-6 pt-20">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Contact Methods Card */}
            <Card className="col-span-1 overflow-hidden backdrop-blur-sm bg-black/30 border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
              <CardHeader className="space-y-2 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
                <CardTitle className="text-3xl font-bold tracking-tighter text-white">
                  Contact Me
                </CardTitle>
                <CardDescription className="text-base text-gray-400">
                  Open to discussing new opportunities in cybersecurity. Reach out via:
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 relative">
                <TooltipProvider>
                  <div className="grid gap-4">
                    {/* Email Button */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full group relative flex items-center gap-2 transition-all duration-300 ease-in-out hover:bg-cyan-500 hover:text-black border-cyan-500/50 text-cyan-400"
                          onClick={handleCopyEmail}
                        >
                          <Mail className="h-4 w-4 transition-transform group-hover:scale-110 duration-300" />
                          Email
                          <Copy className="absolute right-2 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100 duration-300" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click to copy email address</p>
                      </TooltipContent>
                    </Tooltip>

                    {/* LinkedIn Button */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full group relative flex items-center gap-2 transition-all duration-300 ease-in-out hover:bg-[#0077b5] hover:text-white border-[#0077b5]/50 text-[#0077b5]"
                          asChild
                        >
                          <a
                            href={linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 w-full"
                          >
                            <Linkedin className="h-4 w-4 transition-transform group-hover:scale-110 duration-300" />
                            LinkedIn
                            <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </a>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View LinkedIn profile</p>
                      </TooltipContent>
                    </Tooltip>

                    {/* GitHub Button */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full group relative flex items-center gap-2 transition-all duration-300 ease-in-out hover:bg-[#333] hover:text-white border-[#333]/50 text-gray-300"
                          asChild
                        >
                          <a
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 w-full"
                          >
                            <Github className="h-4 w-4 transition-transform group-hover:scale-110 duration-300" />
                            GitHub
                            <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </a>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View GitHub profile</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              </CardContent>
            </Card>

            {/* Message Form Card */}
            <Card className="col-span-1 overflow-hidden backdrop-blur-sm bg-black/30 border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
              <CardHeader className="space-y-2 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
                <CardTitle className="text-3xl font-bold tracking-tighter text-white">
                  Send a Message
                </CardTitle>
                <CardDescription className="text-base text-gray-400">
                  Have a question or want to discuss something? Send me a message.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-white">Name</Label>
                    <Input id="name" name="name" placeholder="Your name" required className="bg-white/10 border-cyan-500/30 text-white placeholder-gray-400" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="Your email" required className="bg-white/10 border-cyan-500/30 text-white placeholder-gray-400" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="message" className="text-white">Message</Label>
                    <Textarea id="message" name="message" placeholder="Your message" required className="bg-white/10 border-cyan-500/30 text-white placeholder-gray-400 min-h-[100px]" />
                  </div>
                  <Button type="submit" className="w-full bg-cyan-500 text-black hover:bg-cyan-600 transition-colors">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Calendar Card */}
            <Card className="col-span-1 lg:col-span-2 overflow-hidden backdrop-blur-sm bg-black/30 border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
              <CardHeader className="space-y-2 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
                <CardTitle className="text-3xl font-bold tracking-tighter text-white">
                  Schedule a Meeting
                </CardTitle>
                <CardDescription className="text-base text-gray-400">
                  Want to discuss something in detail? Schedule a meeting with me.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <Button className="w-full bg-purple-600 text-white hover:bg-purple-700 transition-colors" asChild>
                  <a href={calendlyUrl} target="_blank" rel="noopener noreferrer">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule on Calendly
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
} 