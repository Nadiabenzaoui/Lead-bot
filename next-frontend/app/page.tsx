"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Users, Zap, CheckCircle2, TrendingUp, Sparkles, PlayCircle, BarChart3, Settings2, Globe, Command, Shield } from 'lucide-react';

export default function HomePage() {
  const [view, setView] = useState<'week' | 'month'>('week');

  return (
    <div className="min-h-screen bg-indigo-50/60 flex flex-col relative overflow-hidden">
      {/* Background Shape */}
      <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full bg-indigo-200/50 blur-3xl" 
        />
      </div>

      {/* Navigation */}
      <header className="flex h-20 items-center justify-between px-6 lg:px-12 backdrop-blur-md bg-transparent z-10">
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-800 text-white font-bold shadow-sm"
          >
            <Sparkles size={16} className="text-white" />
          </motion.div>
          <span className="text-xl font-bold tracking-tight text-slate-900">LeadBot AI</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="#features" className="hover:text-violet-700 transition-colors">Features</Link>
          <Link href="#solutions" className="hover:text-violet-700 transition-colors">Solutions</Link>
          <Link href="#pricing" className="hover:text-violet-700 transition-colors">Pricing</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-slate-900 hover:text-violet-700 transition-colors hidden sm:block">
            Login
          </Link>
          <Link href="/login">
            <Button variant="primary">Request Demo</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto w-full px-6 flex flex-col lg:flex-row items-center pt-20 pb-20 z-10 gap-16">
        
        {/* Left Text Content */}
        <motion.div 
          className="flex-1 w-full"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-6">
            Automate your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-700 to-indigo-600">B2B Prospection</span>
          </h1>

          <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
            Find the right leads and scale your outreach effortlessly with AI.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/login">
              <Button size="lg" variant="primary" className="h-12 px-8 text-base shadow-lg shadow-violet-200">
                Get Started Free
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-12 px-6 text-base border-slate-300 text-slate-700">
              <PlayCircle size={18} className="mr-2 text-violet-600" />
              Watch Video
            </Button>
          </div>
        </motion.div>

        {/* Right Abstract/Dashboard Mockup */}
        <motion.div 
          className="flex-1 w-full relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Abstract Floating Graphic (Replacing 3D wave with dashboard elements in violet theme) */}
          <div className="absolute inset-0 bg-violet-400/20 blur-[100px] rounded-full mix-blend-multiply" />
          
          <div className="relative bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_30px_60px_-15px_rgba(109,40,217,0.15)] rounded-2xl overflow-hidden min-h-[400px]">
            {/* Window header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-indigo-100/50 bg-white/40">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200/80" />
                <div className="w-3 h-3 rounded-full bg-slate-200/80" />
                <div className="w-3 h-3 rounded-full bg-slate-200/80" />
              </div>
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-violet-500" />
                <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">AI Engine Status</span>
              </div>
            </div>

            {/* Mockup content */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100/50">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <BarChart3 size={24} className="text-violet-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">Total Leads Found</p>
                  <p className="text-xs text-slate-500 mt-0.5">128 new signatures predicted</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-violet-700">+24%</span>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <Settings2 size={24} className="text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">Campaigns Active</p>
                  <p className="text-xs text-slate-500 mt-0.5">4 sequences running smoothly</p>
                </div>
                <div className="text-right flex items-center gap-1 text-emerald-500 font-medium text-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Online
                </div>
              </div>
              {/* Decorative nodes */}
              <div className="absolute -right-6 -bottom-6 opacity-30 pointer-events-none">
                <Command size={140} strokeWidth={0.5} className="text-violet-800" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Client Logos */}
      <div className="w-full bg-white/50 border-y border-slate-200/50 py-12 z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold tracking-wider text-slate-500 uppercase mb-8">
            Client Logos
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
              <Command size={24} /> TECHCORP
            </div>
            <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
              <Globe size={24} /> GLOBALSYNC
            </div>
            <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
              <Zap size={24} /> INNOVATE
            </div>
            <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
              <Shield size={24} /> SECUREFLOW
            </div>
          </div>
        </div>
      </div>

      {/* Core Features */}
      <div className="max-w-7xl mx-auto w-full px-6 py-24 z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Core Features</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-8 border-transparent shadow-sm hover:shadow-xl hover:shadow-violet-100 transition-all group bg-white">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-violet-600 group-hover:scale-110 transition-transform">
              <BarChart3 size={28} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">AI-Powered Analytics</h3>
            <p className="text-slate-600 leading-relaxed">
              Leverage data insights to analyze trends and drive actionable B2B intelligence automatically.
            </p>
          </Card>

          <Card className="p-8 border-transparent shadow-sm hover:shadow-xl hover:shadow-violet-100 transition-all group bg-white">
            <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mb-6 text-violet-600 group-hover:scale-110 transition-transform">
              <Settings2 size={28} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Automated Workflow</h3>
            <p className="text-slate-600 leading-relaxed">
              Streamline processes and automate data-flow to free up your team for strategic growth.
            </p>
          </Card>

          <Card className="p-8 border-transparent shadow-sm hover:shadow-xl hover:shadow-violet-100 transition-all group bg-white">
            <div className="w-14 h-14 bg-fuchsia-50 rounded-2xl flex items-center justify-center mb-6 text-fuchsia-600 group-hover:scale-110 transition-transform">
              <TrendingUp size={28} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Predictive Modeling</h3>
            <p className="text-slate-600 leading-relaxed">
              Forecast trends to connect opportunities and optimize your conversion pipeline efficiently.
            </p>
          </Card>
        </div>
      </div>

    </div>
  );
}
