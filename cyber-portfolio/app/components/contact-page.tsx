"use client"

import { Copy, Github, Linkedin, Mail, ExternalLink, Send, Calendar } from 'lucide-react'
import { useState, useEffect } from "react"
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
  const email = "takiso2b@gmail.com"
  const linkedinUrl = "https://www.linkedin.com/in/bereket-takiso"
  const githubUrl = "https://github.com/btakiso"
  const calendlyUrl = "https://calendly.com/btakiso2/30min"

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.body.appendChild(script)

    const link = document.createElement('link')
    link.href = 'https://assets.calendly.com/assets/external/widget.css'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
      if (link.parentNode) {
        link.parentNode.removeChild(link)
      }
    }
  }, [])

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
    toast({
      title: "Message sent!",
      description: "Thank you for your message. I'll get back to you soon.",
    })
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
        <div className="container px-4 md:px-6 pt-20 max-w-7xl mx-auto">
          <div className="space-y-6">
            {/* Contact Methods and Message Form - Side by Side */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Contact Methods Card */}
              <Card className="overflow-hidden backdrop-blur-sm bg-black/30 border-cyan-500/30 shadow-2xl shadow-cyan-500/20 rounded-3xl h-full">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
                <CardHeader className="space-y-2 relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
                  <CardTitle className="text-2xl font-bold tracking-tighter text-white text-center">
                    Contact Me
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-400 text-center">
                    Open to discussing new opportunities in cybersecurity. Reach out via:
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 relative p-6">
                  <TooltipProvider>
                    <div className="flex flex-col gap-3">
                      {/* Email Button */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full group relative flex items-center gap-2 transition-all duration-300 ease-in-out hover:bg-cyan-500 hover:text-black border-cyan-500/50 text-cyan-400 rounded-xl py-4"
                            onClick={handleCopyEmail}
                          >
                            <Mail className="h-5 w-5 transition-transform group-hover:scale-110 duration-300" />
                            <span>Email</span>
                            <Copy className="absolute right-4 h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 duration-300" />
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
                            className="w-full group relative flex items-center gap-2 transition-all duration-300 ease-in-out hover:bg-[#0077b5] hover:text-white border-[#0077b5]/50 text-[#0077b5] rounded-2xl py-6"
                            asChild
                          >
                            <a
                              href={linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 w-full"
                            >
                              <Linkedin className="h-6 w-6 transition-transform group-hover:scale-110 duration-300" />
                              <span className="text-lg">LinkedIn</span>
                              <ExternalLink className="absolute right-4 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                            className="w-full group relative flex items-center gap-2 transition-all duration-300 ease-in-out hover:bg-[#333] hover:text-white border-[#333]/50 text-gray-300 rounded-2xl py-6"
                            asChild
                          >
                            <a
                              href={githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 w-full"
                            >
                              <Github className="h-6 w-6 transition-transform group-hover:scale-110 duration-300" />
                              <span className="text-lg">GitHub</span>
                              <ExternalLink className="absolute right-4 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </a>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View GitHub profile</p>
                        </TooltipContent>
                      </Tooltip>

                      {/* Calendly Button */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full group relative flex items-center gap-2 transition-all duration-300 ease-in-out hover:bg-[#06b6d4] hover:text-white border-[#06b6d4]/50 text-[#06b6d4] rounded-2xl py-6"
                            onClick={() => (window as any).Calendly.initPopupWidget({
                              url: 'https://calendly.com/btakiso2/30min?hide_gdpr_banner=1&background_color=1f2937&text_color=ffffff&primary_color=06b6d4&hide_event_type_details=1'
                            })}
                          >
                            <Calendar className="h-6 w-6 transition-transform group-hover:scale-110 duration-300" />
                            <span className="text-lg">Schedule a Meeting</span>
                            <ExternalLink className="absolute right-4 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Schedule a meeting</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </CardContent>
              </Card>

              {/* Message Form Card */}
              <Card className="overflow-hidden backdrop-blur-sm bg-black/30 border-cyan-500/30 shadow-2xl shadow-cyan-500/20 rounded-3xl h-full">
                <CardHeader className="space-y-2 relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
                  <CardTitle className="text-2xl font-bold tracking-tighter text-white text-center">
                    Send a Message
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-400 text-center">
                    Have a question or want to discuss something?
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-3">
                      <Label htmlFor="name" className="text-white">Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        placeholder="Your name" 
                        required 
                        className="bg-white/10 border-cyan-500/30 text-white placeholder-gray-400 rounded-xl py-5" 
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="email" className="text-white">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        placeholder="Your email" 
                        required 
                        className="bg-white/10 border-cyan-500/30 text-white placeholder-gray-400 rounded-xl py-5" 
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="message" className="text-white">Message</Label>
                      <Textarea 
                        id="message" 
                        name="message" 
                        placeholder="Your message" 
                        required 
                        className="bg-white/10 border-cyan-500/30 text-white placeholder-gray-400 min-h-[150px] rounded-xl" 
                      />
                    </div>
                    <Button type="submit" className="w-full bg-cyan-500 text-black hover:bg-cyan-600 transition-colors rounded-xl py-5 text-base">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Calendly Section - Full Width Below */}
            <Card className="overflow-hidden backdrop-blur-sm bg-black/30 border-cyan-500/30 shadow-2xl shadow-cyan-500/20 rounded-3xl">
              <CardHeader className="space-y-2 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
                <CardTitle className="text-2xl font-bold tracking-tighter text-white text-center">
                  Schedule a Meeting
                </CardTitle>
                <CardDescription className="text-sm text-gray-400 text-center">
                  Book a time that works best for you.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative p-6">
                <div 
                  className="calendly-inline-widget" 
                  data-url="https://calendly.com/btakiso2/30min?hide_gdpr_banner=1&background_color=1f2937&text_color=ffffff&primary_color=06b6d4&hide_event_type_details=1"
                  style={{ minWidth: '320px', height: '700px' }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
} 