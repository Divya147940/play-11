import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Trophy, ArrowRight, Zap, Target, Star, Brain, Cpu, ShieldCheck } from 'lucide-react';

const HomeChoicePage = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name') || 'Scholar';
  const mobileNumber = localStorage.getItem('user_mobile') || '';

  const zones = [
    {
      id: 'study',
      title: 'Study Zone',
      subtitle: 'Academic Supremacy',
      desc: 'Master competitive exams with high-precision mock tests and real-time analytics.',
      icon: <Brain size={38} />,
      color: '#38bdf8',
      path: '/study-home',
      tag: 'Academic',
      stats: '1.2K+ active'
    },
    {
      id: 'game',
      title: 'Game Zone',
      subtitle: 'Strategic Arena',
      desc: 'Prove your expertise in sports prediction and climb the global elite leaderboards.',
      icon: <Cpu size={38} />,
      color: '#818cf8',
      path: '/game-home',
      tag: 'Sports',
      stats: '840+ live'
    }
  ];

  return (
    <div className="luminescent-theme min-h-screen">
      {/* Dynamic Cyber Grid Background */}
      <div className="cyber-grid"></div>
      
      <div className="container relative z-10 mx-auto px-4 py-12 md:px-8">
        
        {/* Elite Status Bar */}
        <div className="mb-12 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/20">
              <ShieldCheck size={28} />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400/60">QUZO Academy ID</div>
              <div className="font-mono text-sm font-bold text-white/90">QA-{mobileNumber.slice(-4) || '7744'}</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden text-right md:block">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Identity Status</div>
              <div className="text-sm font-bold text-emerald-400">Authenticated</div>
            </div>
            {/* Standard Profile Icon - Replaces User Photo */}
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-sky-400 ring-1 ring-white/10">
              <Target size={24} />
            </div>
          </div>
        </div>

        {/* Hero Intelligence Section */}
        <section className="mb-16">
          <div className="inline-flex items-center gap-3 rounded-full bg-sky-500/5 px-4 py-2 ring-1 ring-sky-500/10">
            <div className="h-2 w-2 animate-pulse rounded-full bg-sky-400 shadow-[0_0_10px_#38bdf8]"></div>
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-400/80">Command Hub Active</span>
          </div>
          
          <h1 className="mt-6 text-5xl font-black leading-[1.1] tracking-tighter text-white md:text-7xl">
            Welcome back, <br />
            <span className="glow-text text-sky-400">{userName}.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-white/50">
            Initialize your objective. Your current standing is in the <span className="text-white">Top 5%</span> of the Academy. Systems are primed for the next challenge.
          </p>
        </section>

        {/* Selection Matrix */}
        <div className="mb-16 grid gap-6 md:grid-cols-2 lg:gap-8">
          {zones.map((zone) => (
            <div 
              key={zone.id}
              className="elite-card group relative p-8 cursor-pointer"
              onClick={() => navigate(zone.path)}
            >
              <div className="relative z-10">
                <div 
                  className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl ring-1 ring-white/10"
                  style={{ background: `linear-gradient(135deg, ${zone.color}22, transparent)`, color: zone.color }}
                >
                  {zone.icon}
                </div>
                
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-lg bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 ring-1 ring-white/10">
                    {zone.tag}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400">{zone.stats}</span>
                </div>

                <h2 className="mb-2 text-3xl font-black tracking-tight text-white">{zone.title}</h2>
                <div className="mb-4 text-xs font-bold uppercase tracking-wider text-white/40">{zone.subtitle}</div>
                <p className="mb-8 leading-relaxed text-white/50">{zone.desc}</p>
                
                <div className="flex items-center gap-3 font-black uppercase tracking-[0.2em] text-sky-400 transition-all group-hover:gap-5">
                  <span className="text-xs">Enter Arena</span>
                  <ArrowRight size={18} strokeWidth={3} />
                </div>
              </div>

              {/* Decorative side accent */}
              <div 
                className="absolute right-0 top-1/4 h-1/2 w-1 rounded-l-full opacity-0 transition-opacity group-hover:opacity-100"
                style={{ backgroundColor: zone.color, boxShadow: `0 0 20px ${zone.color}` }}
              ></div>
            </div>
          ))}
        </div>

        {/* Global Academy Status */}
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { label: 'Platform Load', value: 'Nominal', icon: <Zap size={20} />, color: 'text-amber-400' },
            { label: 'Active Learners', value: '1,240+', icon: <Star size={20} />, color: 'text-sky-400' },
            { label: 'Next Match', value: '14m 20s', icon: <Zap size={20} />, color: 'text-rose-400' }
          ].map((stat, i) => (
            <div key={i} className="elite-card flex items-center justify-between px-8 py-6">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{stat.label}</div>
                <div className="mt-1 text-xl font-black text-white">{stat.value}</div>
              </div>
              <div className={`${stat.color} opacity-50`}>{stat.icon}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default HomeChoicePage;
