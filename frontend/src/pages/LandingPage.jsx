import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Users,
  Sparkles,
  Flame,
  Activity,
  Award,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LandingPage({ onOpenIdealTeam }) {
  const { user } = useAuth();

  const features = [
    {
      icon: Flame,
      title: 'Team Gap Intelligence',
      badge: 'Novel Feature',
      desc: 'Automatically audits your existing team roster and identifies missing technical skills, deficit roles, and single-person bottlenecks.',
      color: 'text-rose-400 bg-rose-950/60 border-rose-800/60'
    },
    {
      icon: Sparkles,
      title: 'Skill Complementarity Engine',
      badge: 'Novel Feature',
      desc: 'Does not just match identical keywords. Prioritizes candidates whose skills complement the team and fill critical capability voids.',
      color: 'text-indigo-400 bg-indigo-950/60 border-indigo-800/60'
    },
    {
      icon: Activity,
      title: '11-Dimension Team DNA',
      badge: 'Novel Feature',
      desc: 'Profiles team balance across Frontend, Backend, AI/ML, Database, UI/UX, Cloud, Cybersecurity, IoT, Research, Pitching, and Leadership.',
      color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60'
    },
    {
      icon: TrendingUp,
      title: 'What-If Team Simulator',
      badge: 'Novel Feature',
      desc: 'Simulate adding any candidate before inviting them. Predicts exact before-and-after team balance and capability leaps with live mathematics.',
      color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60'
    },
    {
      icon: Award,
      title: 'Hackathon Readiness Score',
      badge: 'Novel Feature',
      desc: 'Evaluates your team against rigorous hackathon judging standards: 30% technical, 20% role, 20% complementarity, and 10% experience.',
      color: 'text-purple-400 bg-purple-950/60 border-purple-800/60'
    },
    {
      icon: ShieldAlert,
      title: 'Team Risk Detector',
      badge: 'Novel Feature',
      desc: 'Identifies High, Medium, and Low operational risks — from single-member backend dependencies to schedule bottlenecks and roster deficit.',
      color: 'text-amber-400 bg-amber-950/60 border-amber-800/60'
    }
  ];

  const workflow = [
    { step: '01', title: 'Create Team', desc: 'Define your hackathon project, maximum size, and mandatory requirements.' },
    { step: '02', title: 'Analyze Team Gaps', desc: 'TEVIX audits your roster to uncover missing capabilities and skill redundancies.' },
    { step: '03', title: 'Discover Candidates', desc: 'Explore candidate profiles ranked dynamically by team complementarity.' },
    { step: '04', title: 'Compare Compatibility', desc: 'Inspect explainable 6-dimension breakdowns and why-match justifications.' },
    { step: '05', title: 'Simulate Team Impact', desc: 'Run What-If simulations to project exact balance and readiness gains.' },
    { step: '06', title: 'Build Your Team', desc: 'Send invites, accept requests, and watch your team DNA dynamically transform.' }
  ];

  return (
    <div className="space-y-24 py-10">
      {/* HERO SECTION */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center pt-8 pb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-xs font-semibold text-indigo-300 mb-6 shadow-md">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>TEAM COMPOSITION INTELLIGENCE PLATFORM</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
          Build the Right Hackathon Team.
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Find teammates based on <span className="text-indigo-400 font-semibold">skills</span>, <span className="text-cyan-400 font-semibold">roles</span>, <span className="text-emerald-400 font-semibold">experience</span> and <span className="text-rose-400 font-semibold">team gaps</span> — not just names.
        </p>

        <p className="mt-2 text-sm text-slate-400 italic font-medium">
          "Build the right team, not just a team."
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/students"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base transition-all shadow-xl shadow-indigo-600/30 group"
          >
            <span>Find My Teammates</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to={user ? "/teams/create" : "/login"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-base transition-colors"
          >
            <Users className="w-4 h-4 text-slate-400" />
            <span>Create a Team</span>
          </Link>

          {onOpenIdealTeam && (
            <button
              onClick={onOpenIdealTeam}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-indigo-300 border border-indigo-800/60 font-semibold text-sm transition-colors"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Build My Ideal Team</span>
            </button>
          )}
        </div>

        {/* Live Demo Callout Box */}
        <div className="mt-12 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 max-w-2xl mx-auto shadow-2xl text-left">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block mb-0.5">
                Ready-to-Test SIH Demo Scenario
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Log in as <strong>arjun@tevix.dev</strong> to evaluate <strong>Team Quantum Leap</strong> (Arjun • Priya • Rahul). Witness Team Gap Intelligence immediately identify missing Backend & AI/ML, simulate adding <strong>Kavin Raj (+44% balance lift)</strong>, and inspect explainable match scores!
              </p>
              <div className="mt-3 flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
                >
                  1-Click Demo Login <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE PHILOSOPHY QUOTE */}
      <section className="bg-slate-900/60 border-y border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <p className="text-xl sm:text-2xl font-semibold text-slate-200 italic leading-relaxed">
            "TEVIX is not a student directory. It is a team composition intelligence platform that analyzes what a team is missing, identifies complementary candidates, explains why they are suitable, and predicts how each candidate improves the team's overall hackathon readiness."
          </p>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 block">
            — TEVIX Engineering Manifesto
          </span>
        </div>
      </section>

      {/* NOVEL FEATURES GRID */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">Novel Architecture</span>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Six Pillars of Composition Intelligence
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Traditional platforms search for people. TEVIX searches for the capabilities your team is missing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-xl border ${f.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {f.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* WORKFLOW SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">Guided Journey</span>
          <h2 className="text-3xl font-black text-white tracking-tight">
            How TEVIX Builds Winning Rosters
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            From initial team inception to locked hackathon registration in 6 deterministic stages.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflow.map((w, idx) => (
            <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-2">
              <span className="text-2xl font-black text-indigo-500/50 block font-mono">{w.step}</span>
              <h4 className="text-base font-bold text-white">{w.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER CALLOUT */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-800/60 rounded-3xl p-10 shadow-2xl space-y-6">
          <h2 className="text-3xl font-black text-white tracking-tight">
            Stop guessing your hackathon chances.
          </h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            Assemble a balanced, risk-tested roster before the opening ceremony starts.
          </p>
          <div>
            <Link
              to="/students"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base transition-colors shadow-lg shadow-indigo-600/30"
            >
              <span>Explore Candidate Intelligence</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
