'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Users, Zap, CheckCircle2, ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export default function HomePage() {
  const [view, setView] = useState<'week' | 'month'>('week');

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col relative overflow-hidden">
      {/* Soft background shape */}
      <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full bg-slate-50 blur-3xl" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white font-bold shadow-sm">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              LeadBot
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <span className="hidden md:inline text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">Product</span>
            <span className="hidden md:inline text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">Features</span>
            <span className="hidden md:inline text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">Pricing</span>
            <Link href="/login">
              <Button variant="secondary" size="sm" className="ml-4 gap-2">
                Create Account
              </Button>
            </Link>
          </nav>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="flex-1 pt-32 pb-20 z-10 flex flex-col justify-center">
        <section className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-16 items-center">

          {/* Left Column: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-sm font-medium text-slate-600 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Next-Gen B2B CRM
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
              Automate your <br />
              Lead Generation.
            </h1>

            <p className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed">
              LeadBot gives you a clear view of your prospecting pipeline. Track who was contacted, who replied, and close deals faster with our single unified dashboard.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/login">
                <Button size="lg" className="gap-2 group">
                  Create Account
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="gap-2">
                  <BarChart3 size={18} />
                  View Live Demo
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>100% Free for Demo</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Visual Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="hidden lg:block relative"
          >
            <Card className="relative z-10 border-slate-200 shadow-xl">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80 rounded-t-xl">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-slate-200" />
                    <div className="w-3 h-3 rounded-full bg-slate-200" />
                    <div className="w-3 h-3 rounded-full bg-slate-200" />
                  </div>
                  <span className="text-xs font-semibold tracking-wide text-slate-500 ml-2 uppercase">Pipeline Overview</span>
                </div>
                <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200/50">
                  <button
                    onClick={() => setView('week')}
                    className={cn("px-3 py-1 text-xs font-medium rounded-md transition-colors", view === 'week' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setView('month')}
                    className={cn("px-3 py-1 text-xs font-medium rounded-md transition-colors", view === 'month' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                  >
                    Month
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-5 bg-white rounded-b-xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 transition-all hover:bg-slate-100/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-500">Total Leads</span>
                      <Users size={14} className="text-slate-400" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">{view === 'week' ? '128' : '512'}</div>
                    <div className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                      <span>+14.2%</span> <span className="text-slate-400 font-normal">vs last {view}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 transition-all hover:bg-slate-100/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-500">Conversion Rate</span>
                      <Zap size={14} className="text-yellow-500" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">{view === 'week' ? '12.4%' : '15.8%'}</div>
                    <div className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                      <span>+2.1%</span> <span className="text-slate-400 font-normal">vs last {view}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
                  <h3 className="text-xs font-semibold text-slate-500 mb-4 uppercase tracking-wider">Recent Activity</h3>
                  <div className="space-y-4">
                    {[
                      { status: 'hot', name: 'Acme Corp', action: 'Requested Demo' },
                      { status: 'warm', name: 'Globex Inc', action: 'Opened Email' },
                      { status: 'cold', name: 'Initech', action: 'Added to sequence' }
                    ].map((lead, i) => (
                      <div key={i} className="flex items-center justify-between group cursor-pointer border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <Badge variant={lead.status as any}>{lead.status.toUpperCase()}</Badge>
                          <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{lead.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">{lead.action}</span>
                          <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
