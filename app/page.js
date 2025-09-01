"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Star, Users, Zap, Shield, Mic, Calendar, Brain, Check, X, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('features');

  const pricingPlans = [
    {
      name: 'Starter',
      credits: 10,
      price: 9.99,
      icon: Star,
      popular: false,
      features: ['10 Interview Credits', 'Basic Support', 'Standard Questions', 'Email Support']
    },
    {
      name: 'Professional',
      credits: 50,
      price: 39.99,
      icon: Zap,
      popular: true,
      features: ['50 Interview Credits', 'Priority Support', 'Advanced Questions', 'Custom Templates', 'Phone Support']
    },
    {
      name: 'Enterprise',
      credits: 200,
      price: 149.99,
      icon: Shield,
      popular: false,
      features: ['200 Interview Credits', '24/7 Support', 'Premium Questions', 'Custom Templates', 'Analytics Dashboard', 'Dedicated Manager']
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Interviews",
      description: "Conduct intelligent interviews with natural language processing and real-time analysis"
    },
    {
      icon: Mic,
      title: "Voice-First Experience",
      description: "Natural voice interactions that feel human and engaging for candidates"
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Automated interview scheduling with intelligent time slot optimization"
    },
    {
      icon: Zap,
      title: "Instant Feedback",
      description: "Get comprehensive candidate assessments and feedback in real-time"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamless collaboration between recruiters and hiring managers"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with compliance and data protection standards"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">AI Recruiter</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => setActiveTab('features')}
              className={`text-gray-300 hover:text-white transition-colors ${activeTab === 'features' ? 'text-white' : ''}`}
            >
              Features
            </button>
            <button 
              onClick={() => setActiveTab('pricing')}
              className={`text-gray-300 hover:text-white transition-colors ${activeTab === 'pricing' ? 'text-white' : ''}`}
            >
              Pricing
            </button>
            <button 
              onClick={() => setActiveTab('about')}
              className={`text-gray-300 hover:text-white transition-colors ${activeTab === 'about' ? 'text-white' : ''}`}
            >
              About
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
            <Link href="/auth">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-white">AI-Powered Recruitment Revolution</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Transform Your
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Hiring Process
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience the future of recruitment with our AI-powered voice agent that conducts intelligent interviews, 
            schedules meetings, and provides instant feedback - all through natural conversation.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/auth">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/20 text-white bg-purple-600 hover:bg-purple-700 px-8 py-4 text-lg"
              onClick={() => setIsDemoOpen(true)}
            >
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="relative z-10 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Features Section */}
          {activeTab === 'features' && (
            <section className="py-20">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-4">Why Choose AI Recruiter?</h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Cutting-edge AI technology that streamlines your recruitment workflow
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <div key={index} className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>

              {/* AI Interviewer Demo Section */}
              <div className="mt-20 bg-gradient-to-r from-blue-500/10 to-purple-600/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold text-white mb-4">Experience AI Interviewer in Action</h3>
                  <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    See how our AI conducts intelligent interviews with real-time analysis and feedback
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <div className="bg-slate-800 rounded-2xl p-6 border border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-white">AI Interview Session</h4>
                        <div className="flex items-center space-x-2 text-white">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm">00:05:23</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {/* AI Interviewer Video Panel */}
                        <div className="relative bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl p-4 aspect-video">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl"></div>
                          <div className="relative z-10 h-full flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          </div>
                          <div className="absolute bottom-2 left-2 bg-slate-800/80 text-white text-xs px-2 py-1 rounded-full">
                            AI Interviewer
                          </div>
                        </div>
                        
                        {/* User Video Panel */}
                        <div className="relative bg-gradient-to-br from-green-600 to-blue-700 rounded-xl p-4 aspect-video">
                          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-600/20 rounded-xl"></div>
                          <div className="relative z-10 h-full flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          </div>
                          <div className="absolute bottom-2 left-2 bg-slate-800/80 text-white text-xs px-2 py-1 rounded-full">
                            You
                          </div>
                        </div>
                      </div>
                      
                      {/* Interview Controls */}
                      <div className="flex items-center justify-center space-x-4 mt-4">
                        <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                          <div className="absolute w-12 h-12 border-2 border-red-500 rounded-full" style={{transform: 'rotate(45deg)'}}></div>
                        </div>
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 00-2-2V8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <div className="absolute w-12 h-12 border-2 border-white rounded-full" style={{transform: 'rotate(45deg)'}}></div>
                        </div>
                      </div>
                      
                      <div className="text-center mt-4">
                        <p className="text-sm text-gray-300">Interview in progress...</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <Mic className="w-16 h-16 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-2">Live Video Interview</h4>
                    <p className="text-gray-300 mb-4">Experience real-time AI interviews with live video, audio, and instant feedback</p>
                    <Button 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      onClick={() => setIsDemoOpen(true)}
                    >
                      Try Live Demo
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Pricing Section */}
          {activeTab === 'pricing' && (
            <section className="py-20">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Choose the plan that fits your recruitment needs. No hidden fees, no surprises.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pricingPlans.map((plan, index) => (
                  <div 
                    key={index} 
                    className={`bg-white/5 backdrop-blur-sm rounded-2xl p-8 border relative ${
                      plan.popular ? 'border-blue-500 shadow-lg shadow-blue-500/25' : 'border-white/10'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center mb-8">
                      <div className={`inline-flex p-4 rounded-2xl mb-6 ${
                        plan.popular ? 'bg-blue-500/20' : 'bg-white/10'
                      }`}>
                        <plan.icon className={`h-10 w-10 ${
                          plan.popular ? 'text-blue-400' : 'text-white'
                        }`} />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-white">${plan.price}</span>
                        <span className="text-gray-400">/month</span>
                      </div>
                      <div className="text-xl font-semibold text-blue-400">
                        {plan.credits} Credits
                      </div>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href="/auth">
                      <Button 
                        className={`w-full ${
                          plan.popular 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' 
                            : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                        }`}
                      >
                        Get {plan.name}
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Credit Usage Info */}
              <div className="mt-16 bg-gradient-to-r from-blue-500/10 to-purple-600/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <h3 className="text-2xl font-semibold text-white mb-6 text-center">How Credits Work</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-2xl font-bold text-blue-400">1</span>
                    </div>
                    <p className="text-white font-medium">1 credit = 1 interview creation</p>
                  </div>
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-2xl font-bold text-purple-400">∞</span>
                    </div>
                    <p className="text-white font-medium">Unlimited candidates per interview</p>
                  </div>
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-2xl font-bold text-green-400">✓</span>
                    </div>
                    <p className="text-white font-medium">Credits never expire</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* About Section */}
          {activeTab === 'about' && (
            <section className="py-20">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-4">About AI Recruiter</h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  We're revolutionizing the recruitment industry with cutting-edge AI technology
                </p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-6">Our Mission</h3>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    To democratize access to intelligent recruitment tools, making it possible for companies of all sizes 
                    to conduct professional, AI-powered interviews that identify the best talent efficiently and fairly.
                  </p>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    We believe that every company deserves access to enterprise-level recruitment technology, 
                    and we're committed to making that vision a reality.
                  </p>
                </div>
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <Brain className="w-12 h-12 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-4">Powered by Advanced AI</h4>
                    <p className="text-gray-300">
                      Our platform leverages state-of-the-art natural language processing and machine learning 
                      to deliver human-like interview experiences with superhuman consistency and insight.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-blue-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">10,000+</h4>
                  <p className="text-gray-300">Companies Trust Us</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mic className="w-8 h-8 text-purple-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">500,000+</h4>
                  <p className="text-gray-300">Interviews Conducted</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-green-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">99.9%</h4>
                  <p className="text-gray-300">Uptime Guarantee</p>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Revolutionize Your Hiring?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of companies already using AI Recruiter to find the best talent faster
            </p>
            <Link href="/auth">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-10 py-4 text-lg">
                Get Started Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Mic className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">AI Recruiter</span>
              </div>
              <p className="text-gray-400">
                Transforming recruitment with AI-powered voice technology
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => setActiveTab('features')} className="hover:text-white transition-colors">Features</button></li>
                <li><button onClick={() => setActiveTab('pricing')} className="hover:text-white transition-colors">Pricing</button></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => setActiveTab('about')} className="hover:text-white transition-colors">About</button></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Status</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AI Recruiter. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Demo Modal */}
      {isDemoOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">AI Interviewer Demo</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                  onClick={() => setIsDemoOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-2xl p-6 mb-6">
                <h4 className="text-xl font-semibold text-white mb-4">Live Video Interview Experience</h4>
                <p className="text-gray-300 mb-6">
                  Experience our AI interviewer in a real-time video call. The AI conducts live interviews with real-time analysis and feedback.
                </p>
                
                {/* Live Video Interface Demo */}
                <div className="bg-slate-800 rounded-2xl p-6 border border-white/10 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-lg font-semibold text-white">AI Interview Session</h5>
                    <div className="flex items-center space-x-2 text-white">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">00:05:23</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* AI Interviewer Video Panel */}
                    <div className="relative bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl p-4 aspect-video">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl"></div>
                      <div className="relative z-10 h-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-slate-800/80 text-white text-xs px-2 py-1 rounded-full">
                        AI Interviewer
                      </div>
                    </div>
                    
                    {/* User Video Panel */}
                    <div className="relative bg-gradient-to-br from-green-600 to-blue-700 rounded-xl p-4 aspect-video">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-600/20 rounded-xl"></div>
                      <div className="relative z-10 h-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-slate-800/80 text-white text-xs px-2 py-1 rounded-full">
                        You
                      </div>
                    </div>
                  </div>
                  
                  {/* Interview Controls */}
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                      <div className="absolute w-12 h-12 border-2 border-red-500 rounded-full" style={{transform: 'rotate(45deg)'}}></div>
                    </div>
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 00-2-2V8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <div className="absolute w-12 h-12 border-2 border-white rounded-full" style={{transform: 'rotate(45deg)'}}></div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-300">Interview in progress...</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-gray-300 mb-6">
                  This is just a preview. Sign up to experience the full live AI interviewer with real-time video, 
                  audio analysis, and comprehensive feedback.
                </p>
                <Link href="/auth">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3">
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
