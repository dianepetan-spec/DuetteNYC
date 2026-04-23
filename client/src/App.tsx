import { Switch, Route, Router, Link, useLocation } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { useQuery, QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useState, useMemo } from 'react';
import { 
  LayoutDashboard, Search, TrendingUp, Star, Lightbulb, 
  ExternalLink, ChevronRight, Filter, X, Menu, Moon, Sun,
  BarChart2, Globe, Users, DollarSign, Tag, Megaphone,
  Home, CheckCircle, AlertCircle, Info, Award
} from 'lucide-react';
import type { Competitor } from '@shared/schema';

// ─── Theme ───────────────────────────────────────────────────────────────────
function useTheme() {
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
  const toggle = () => {
    setDark(d => {
      document.documentElement.classList.toggle('dark', !d);
      return !d;
    });
  };
  if (dark) document.documentElement.classList.add('dark');
  return { dark, toggle };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function parseJSON<T>(str: string, fallback: T): T {
  try { return JSON.parse(str); } catch { return fallback; }
}

const SEGMENT_COLORS: Record<string, string> = {
  'Boutique DTC': 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
  'Premium DTC + Wholesale': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  'Shapewear-Crossover DTC': 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  'Sustainable Contemporary': 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  'Accessible Mid-Market': 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300',
  'Contemporary Luxury': 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300',
  'Technical Premium': 'bg-slate-100 text-slate-800 dark:bg-slate-700/40 dark:text-slate-300',
  'Contemporary Designer': 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
  'Designer Minimalist': 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  'Luxury Knit': 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  'Luxury': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
};

const TIER_COLORS: Record<string, string> = {
  'Mid': 'text-blue-600 dark:text-blue-400',
  'Mid-Premium': 'text-indigo-600 dark:text-indigo-400',
  'Value-Mid': 'text-sky-600 dark:text-sky-400',
  'Contemporary': 'text-violet-600 dark:text-violet-400',
  'Premium': 'text-slate-700 dark:text-slate-300',
  'Contemporary Luxury': 'text-purple-700 dark:text-purple-400',
  'Luxury': 'text-amber-700 dark:text-amber-400',
  'Designer': 'text-rose-700 dark:text-rose-400',
};

function ScoreRing({ score, size = 52 }: { score: number; size?: number }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 10) * circ;
  const color = score >= 9 ? '#10b981' : score >= 7 ? '#3b82f6' : score >= 5 ? '#f59e0b' : '#ef4444';
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" className="rotate-[-90deg]">
      <circle cx="22" cy="22" r={r} fill="none" stroke="currentColor" strokeWidth="3" className="text-border opacity-30" />
      <circle
        cx="22" cy="22" r={r} fill="none"
        stroke={color} strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
      <text x="22" y="22" textAnchor="middle" dominantBaseline="middle"
        className="rotate-90" style={{ transform: 'rotate(90deg)', transformOrigin: '22px 22px', fontSize: '10px', fontWeight: 700, fill: color }}>
        {score}/10
      </text>
    </svg>
  );
}

function Badge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}

function PillTag({ text }: { text: string }) {
  return (
    <span className="inline-block bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full mr-1 mb-1">
      {text}
    </span>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
const NAV = [
  { href: '/', icon: LayoutDashboard, label: 'Overview' },
  { href: '/matrix', icon: BarChart2, label: 'Full Matrix' },
  { href: '/homepage', icon: Home, label: 'Homepage Analysis' },
  { href: '/seo', icon: Search, label: 'SEO & Keywords' },
  { href: '/marketing', icon: Megaphone, label: 'Marketing Channels' },
  { href: '/insights', icon: Lightbulb, label: 'Best Practices' },
];

function Sidebar({ mobile, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const [loc] = useLocation();
  return (
    <aside className={`${mobile ? 'fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex' : 'w-60 flex-shrink-0'}`}>
      <div className={`${mobile ? 'w-64 h-full' : 'w-full h-full'} bg-card border-r border-border flex flex-col`}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <svg viewBox="0 0 28 28" className="w-7 h-7 flex-shrink-0" fill="none">
              <rect width="28" height="28" rx="6" fill="hsl(175,97%,21%)" />
              <path d="M7 14 L14 7 L21 14 L14 21 Z" fill="none" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
              <circle cx="14" cy="14" r="3" fill="white"/>
            </svg>
            <div>
              <p className="text-sm font-semibold leading-none">DuetteNYC</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Competitor Intel</p>
            </div>
          </div>
        </div>
        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = loc === href;
            return (
              <Link key={href} href={href} onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
              </Link>
            );
          })}
        </nav>
        <div className="px-5 py-4 border-t border-border">
          <p className="text-[10px] text-muted-foreground">12 brands · Apr 2026</p>
        </div>
      </div>
      {mobile && (
        <div className="flex-1" onClick={onClose} />
      )}
    </aside>
  );
}

// ─── Data hook ───────────────────────────────────────────────────────────────
function useCompetitors() {
  return useQuery<Competitor[]>({
    queryKey: ['/competitors.json'],
    queryFn: async () => {
      const res = await fetch('/competitors.json');
      if (!res.ok) throw new Error('Failed to load data');
      return res.json();
    },
  });
}

// ─── Overview Page ────────────────────────────────────────────────────────────
function OverviewPage() {
  const { data: brands = [], isLoading } = useCompetitors();
  const [search, setSearch] = useState('');
  const [segFilter, setSegFilter] = useState('All');
  const [tierFilter, setTierFilter] = useState('All');

  const segments = useMemo(() => ['All', ...Array.from(new Set(brands.map(b => b.segment)))], [brands]);
  const tiers = useMemo(() => ['All', ...Array.from(new Set(brands.map(b => b.priceTier)))], [brands]);

  const filtered = useMemo(() => brands.filter(b => {
    const q = search.toLowerCase();
    const matchQ = !q || b.name.toLowerCase().includes(q) || b.segment.toLowerCase().includes(q) || b.priceTier.toLowerCase().includes(q);
    const matchS = segFilter === 'All' || b.segment === segFilter;
    const matchT = tierFilter === 'All' || b.priceTier === tierFilter;
    return matchQ && matchS && matchT;
  }), [brands, search, segFilter, tierFilter]);

  const duette = brands.find(b => b.name === 'DuetteNYC');
  const competitors = brands.filter(b => b.name !== 'DuetteNYC');

  if (isLoading) return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Brands Tracked', value: brands.length, icon: Globe, color: 'text-teal-600' },
          { label: 'Price Range', value: '$83 – $2,350', icon: DollarSign, color: 'text-blue-600' },
          { label: 'Avg Conv. Score', value: `${Math.round(brands.reduce((s,b)=>s+b.conversionScore,0)/brands.length)}/10`, icon: TrendingUp, color: 'text-purple-600' },
          { label: 'DuetteNYC Rating', value: '5.0 ★', icon: Star, color: 'text-amber-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
            <div className={`p-2 rounded-lg bg-muted ${color}`}><Icon className="w-4 h-4" /></div>
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-lg font-semibold mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* DuetteNYC spotlight */}
      {duette && (
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/20 border border-teal-200 dark:border-teal-800 rounded-xl p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-teal-700 dark:text-teal-400">Your Brand</span>
                <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300">Benchmark</Badge>
              </div>
              <h2 className="text-xl font-bold">DuetteNYC</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">{duette.garmentFocus}</p>
            </div>
            <div className="flex items-center gap-6 text-center">
              <div><p className="text-2xl font-bold text-teal-700 dark:text-teal-400">{duette.priceRange}</p><p className="text-xs text-muted-foreground">Price Point</p></div>
              <ScoreRing score={duette.conversionScore} size={64} />
              <div><p className="text-2xl font-bold text-amber-600">{duette.rating}★</p><p className="text-xs text-muted-foreground">{duette.reviewCount} reviews</p></div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {parseJSON<string[]>(duette.seoKeywords, []).map(k => (
              <PillTag key={k} text={k} />
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search} onChange={e => setSearch(e.target.value)} placeholder="Search brands…"
            className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
            data-testid="input-search"
          />
        </div>
        <select value={segFilter} onChange={e => setSegFilter(e.target.value)} data-testid="select-segment"
          className="text-sm bg-card border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30">
          {segments.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={tierFilter} onChange={e => setTierFilter(e.target.value)} data-testid="select-tier"
          className="text-sm bg-card border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30">
          {tiers.map(t => <option key={t}>{t}</option>)}
        </select>
        {(search || segFilter !== 'All' || tierFilter !== 'All') && (
          <button onClick={() => { setSearch(''); setSegFilter('All'); setTierFilter('All'); }}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground" data-testid="button-clear-filters">
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
        <span className="text-sm text-muted-foreground ml-auto">{filtered.length} brands</span>
      </div>

      {/* Brand cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.filter(b => b.name !== 'DuetteNYC').map(brand => (
          <BrandCard key={brand.id} brand={brand} />
        ))}
      </div>
    </div>
  );
}

function BrandCard({ brand }: { brand: Competitor }) {
  const [expanded, setExpanded] = useState(false);
  const channels = parseJSON<string[]>(brand.primaryChannels, []);
  const insights = parseJSON<string[]>(brand.replicableInsights, []);
  const keywords = parseJSON<string[]>(brand.seoKeywords, []);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-colors" data-testid={`card-brand-${brand.id}`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-semibold text-sm">{brand.name}</h3>
              <Badge className={SEGMENT_COLORS[brand.segment] || 'bg-muted text-muted-foreground'}>
                {brand.segment}
              </Badge>
            </div>
            <a href={brand.url} target="_blank" rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
              {brand.url.replace('https://', '')} <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
          <ScoreRing score={brand.conversionScore} size={48} />
        </div>

        {/* Key stats row */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-muted/50 rounded-lg p-2 text-center">
            <p className="text-xs text-muted-foreground">Price</p>
            <p className={`text-sm font-semibold ${TIER_COLORS[brand.priceTier] || ''}`}>{brand.priceRange}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-2 text-center">
            <p className="text-xs text-muted-foreground">Rating</p>
            <p className="text-sm font-semibold">{brand.rating === 'N/A' ? '—' : `${brand.rating}★`}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-2 text-center">
            <p className="text-xs text-muted-foreground">Reviews</p>
            <p className="text-sm font-semibold">{parseInt(brand.reviewCount.replace(/,/g,'')) > 0 ? brand.reviewCount : '—'}</p>
          </div>
        </div>

        {/* Revenue */}
        <div className="flex items-center gap-1.5 mb-3">
          <DollarSign className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          <p className="text-xs text-muted-foreground">{brand.annualRevenue}</p>
        </div>

        {/* Target customer */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">{brand.targetCustomer}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {brand.hasBestseller ? <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"><CheckCircle className="w-2.5 h-2.5 mr-0.5"/>Best Seller</Badge> : null}
          {brand.hasSustainability ? <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Sustainable</Badge> : null}
          {brand.hasPetiteTall ? <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Petite/Tall</Badge> : null}
        </div>

        {/* Expand button */}
        <button onClick={() => setExpanded(!expanded)}
          className="w-full text-xs text-primary hover:text-primary/80 flex items-center justify-center gap-1 py-1 border-t border-border mt-1"
          data-testid={`button-expand-${brand.id}`}>
          {expanded ? 'Show less' : 'See insights & details'}
          <ChevronRight className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {expanded && (
        <div className="border-t border-border bg-muted/30 p-4 space-y-3">
          {/* Keywords */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">SEO Keywords</p>
            <div className="flex flex-wrap gap-1">
              {keywords.slice(0, 6).map(k => <PillTag key={k} text={k} />)}
            </div>
          </div>

          {/* Channels */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Primary Channels</p>
            <div className="flex flex-wrap gap-1">
              {channels.slice(0, 5).map(c => <PillTag key={c} text={c} />)}
            </div>
          </div>

          {/* Replicable insights */}
          {insights.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                <Lightbulb className="w-3 h-3" /> DuetteNYC Can Replicate
              </p>
              <ul className="space-y-1">
                {insights.slice(0, 3).map((ins, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="text-amber-500 mt-0.5 flex-shrink-0">→</span>
                    {ins}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Full Matrix Page ─────────────────────────────────────────────────────────
function MatrixPage() {
  const { data: brands = [], isLoading } = useCompetitors();
  if (isLoading) return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;

  const cols = [
    { key: 'name', label: 'Brand' },
    { key: 'segment', label: 'Segment' },
    { key: 'priceTier', label: 'Tier' },
    { key: 'priceRange', label: 'Price' },
    { key: 'annualRevenue', label: 'Revenue (est.)' },
    { key: 'rating', label: 'Rating' },
    { key: 'reviewCount', label: 'Reviews' },
    { key: 'conversionScore', label: 'Conv. Score' },
    { key: 'hasBestseller', label: 'Bestseller' },
    { key: 'hasSustainability', label: 'Sustainable' },
    { key: 'hasPetiteTall', label: 'Petite/Tall' },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Full Competitive Matrix</h2>
        <p className="text-sm text-muted-foreground">All 12 brands side-by-side across every tracked dimension.</p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/60 border-b border-border">
              {cols.map(c => (
                <th key={c.key} className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">{c.label}</th>
              ))}
              <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground">Garment Focus</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {brands.map((b, i) => {
              const isDuette = b.name === 'DuetteNYC';
              return (
                <tr key={b.id} className={`${isDuette ? 'bg-teal-50/60 dark:bg-teal-950/20' : i % 2 === 0 ? 'bg-card' : 'bg-muted/20'} hover:bg-muted/40 transition-colors`}
                  data-testid={`row-brand-${b.id}`}>
                  <td className="px-3 py-3 font-medium whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {isDuette && <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0"/>}
                      <a href={b.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary flex items-center gap-1">
                        {b.name} <ExternalLink className="w-2.5 h-2.5 opacity-50"/>
                      </a>
                    </div>
                  </td>
                  <td className="px-3 py-3"><Badge className={SEGMENT_COLORS[b.segment] || 'bg-muted text-muted-foreground'}>{b.segment}</Badge></td>
                  <td className="px-3 py-3 whitespace-nowrap"><span className={`text-xs font-medium ${TIER_COLORS[b.priceTier] || ''}`}>{b.priceTier}</span></td>
                  <td className="px-3 py-3 font-medium whitespace-nowrap">{b.priceRange}</td>
                  <td className="px-3 py-3 text-muted-foreground text-xs whitespace-nowrap">{b.annualRevenue}</td>
                  <td className="px-3 py-3 whitespace-nowrap">{b.rating === 'N/A' ? <span className="text-muted-foreground">—</span> : <span className="text-amber-600 font-medium">{b.rating}★</span>}</td>
                  <td className="px-3 py-3 whitespace-nowrap">{parseInt(b.reviewCount.replace(/,/g,'')) > 0 ? <span className="font-medium">{b.reviewCount}</span> : <span className="text-muted-foreground">—</span>}</td>
                  <td className="px-3 py-3"><ScoreRing score={b.conversionScore} size={40} /></td>
                  <td className="px-3 py-3 text-center">{b.hasBestseller ? <CheckCircle className="w-4 h-4 text-green-500 mx-auto"/> : <span className="text-muted-foreground text-xs">—</span>}</td>
                  <td className="px-3 py-3 text-center">{b.hasSustainability ? <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto"/> : <span className="text-muted-foreground text-xs">—</span>}</td>
                  <td className="px-3 py-3 text-center">{b.hasPetiteTall ? <CheckCircle className="w-4 h-4 text-blue-500 mx-auto"/> : <span className="text-muted-foreground text-xs">—</span>}</td>
                  <td className="px-3 py-3 text-xs text-muted-foreground max-w-xs line-clamp-2">{b.garmentFocus}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Homepage Analysis Page ───────────────────────────────────────────────────
function HomepagePage() {
  const { data: brands = [], isLoading } = useCompetitors();
  if (isLoading) return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Homepage Conversion Analysis</h2>
        <p className="text-sm text-muted-foreground">Hero messaging, trust signals, promotional offers, and conversion score per brand.</p>
      </div>

      {/* Conversion score leaderboard */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-4">Conversion Score Ranking (1–10)</h3>
        <div className="space-y-2">
          {[...brands].sort((a,b) => b.conversionScore - a.conversionScore).map((brand, i) => {
            const isDuette = brand.name === 'DuetteNYC';
            const pct = brand.conversionScore * 10;
            const barColor = brand.conversionScore >= 9 ? 'bg-green-500' : brand.conversionScore >= 7 ? 'bg-blue-500' : brand.conversionScore >= 5 ? 'bg-amber-500' : 'bg-red-400';
            return (
              <div key={brand.id} className={`flex items-center gap-3 ${isDuette ? 'font-semibold text-teal-700 dark:text-teal-400' : ''}`}
                data-testid={`row-conversion-${brand.id}`}>
                <span className="text-xs text-muted-foreground w-4 text-right">{i+1}</span>
                <span className="text-sm w-32 truncate flex items-center gap-1.5">
                  {isDuette && <span className="w-1.5 h-1.5 rounded-full bg-teal-500"/>}
                  {brand.name}
                </span>
                <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                  <div className={`h-full rounded-full ${barColor} transition-all duration-700`} style={{ width: `${pct}%` }}/>
                </div>
                <span className="text-sm font-bold w-8 text-right">{brand.conversionScore}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {brands.map(brand => {
          const isDuette = brand.name === 'DuetteNYC';
          const trustSignals = parseJSON<string[]>(brand.trustSignals, []);
          return (
            <div key={brand.id} className={`bg-card border rounded-xl overflow-hidden ${isDuette ? 'border-teal-300 dark:border-teal-700' : 'border-border'}`}
              data-testid={`card-homepage-${brand.id}`}>
              <div className={`px-4 py-3 border-b border-border flex items-center justify-between ${isDuette ? 'bg-teal-50/60 dark:bg-teal-950/20' : 'bg-muted/30'}`}>
                <div className="flex items-center gap-2">
                  {isDuette && <span className="w-2 h-2 rounded-full bg-teal-500"/>}
                  <span className="font-semibold text-sm">{brand.name}</span>
                  <Badge className={SEGMENT_COLORS[brand.segment] || 'bg-muted text-muted-foreground'}>{brand.segment}</Badge>
                </div>
                <ScoreRing score={brand.conversionScore} size={40} />
              </div>
              <div className="p-4 space-y-3">
                {/* Hero */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Hero Headline</p>
                  <p className="text-sm italic text-foreground/80 leading-snug">"{brand.heroHeadline}"</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">CTA</p>
                  <p className="text-sm font-medium">{brand.heroCta}</p>
                </div>
                {/* Promo offer */}
                {brand.promoOffer && (
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-0.5">Promotional Offer</p>
                    <p className="text-xs text-amber-800 dark:text-amber-300">{brand.promoOffer}</p>
                  </div>
                )}
                {/* Trust signals */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Trust Signals</p>
                  <div className="flex flex-wrap gap-1">
                    {trustSignals.map((t, i) => (
                      <span key={i} className="text-xs bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
                <a href={brand.url} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1">
                  Visit site <ExternalLink className="w-3 h-3"/>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── SEO Page ─────────────────────────────────────────────────────────────────
function SeoPage() {
  const { data: brands = [], isLoading } = useCompetitors();
  if (isLoading) return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;

  // Aggregate all keywords with frequency
  const kwMap: Record<string, string[]> = {};
  brands.forEach(b => {
    parseJSON<string[]>(b.seoKeywords, []).forEach(kw => {
      if (!kwMap[kw]) kwMap[kw] = [];
      kwMap[kw].push(b.name);
    });
  });
  const allKws = Object.entries(kwMap).sort((a,b) => b[1].length - a[1].length);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">SEO Keywords & Search Positioning</h2>
        <p className="text-sm text-muted-foreground">Keywords each brand targets, plus shared opportunity terms for DuetteNYC.</p>
      </div>

      {/* Shared keywords (appearing across 2+ brands) */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-1">High-Opportunity Keyword Clusters</h3>
        <p className="text-xs text-muted-foreground mb-4">Keywords targeted by 2+ competitors — high competition but validated demand.</p>
        <div className="space-y-2">
          {allKws.filter(([,brands]) => brands.length >= 2).map(([kw, brandList]) => (
            <div key={kw} className="flex items-center gap-3">
              <span className="text-sm flex-1">{kw}</span>
              <div className="flex gap-1 flex-wrap justify-end">
                {brandList.map(b => (
                  <span key={b} className={`text-xs px-1.5 py-0.5 rounded ${b === 'DuetteNYC' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 font-bold' : 'bg-muted text-muted-foreground'}`}>{b}</span>
                ))}
              </div>
              <div className="w-24 bg-muted rounded-full h-1.5 flex-shrink-0">
                <div className="h-full rounded-full bg-primary" style={{ width: `${(brandList.length/brands.length)*100}%` }}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Per-brand keyword lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {brands.map(brand => {
          const isDuette = brand.name === 'DuetteNYC';
          const kws = parseJSON<string[]>(brand.seoKeywords, []);
          return (
            <div key={brand.id} className={`bg-card border rounded-xl p-4 ${isDuette ? 'border-teal-300 dark:border-teal-700' : 'border-border'}`}
              data-testid={`card-seo-${brand.id}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {isDuette && <span className="w-2 h-2 rounded-full bg-teal-500"/>}
                  <h3 className={`text-sm font-semibold ${isDuette ? 'text-teal-700 dark:text-teal-400' : ''}`}>{brand.name}</h3>
                </div>
                <Badge className={SEGMENT_COLORS[brand.segment] || 'bg-muted text-muted-foreground'}>{brand.priceTier}</Badge>
              </div>
              <div className="flex flex-wrap gap-1">
                {kws.map(kw => (
                  <span key={kw} className={`text-xs px-2 py-0.5 rounded-full border ${isDuette ? 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-950/20 dark:border-teal-800 dark:text-teal-300' : 'bg-muted border-border text-muted-foreground'}`}>{kw}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Marketing Channels Page ──────────────────────────────────────────────────
function MarketingPage() {
  const { data: brands = [], isLoading } = useCompetitors();
  if (isLoading) return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;

  const allChannels = ['Instagram', 'TikTok', 'Facebook', 'Pinterest', 'Email', 'SMS', 'Loyalty program', 'Press / PR', 'Blog / Editorial', 'Affiliate', 'Wholesale', 'App'];
  const channelPresence: Record<string, string[]> = {};
  allChannels.forEach(ch => { channelPresence[ch] = []; });

  brands.forEach(b => {
    const channels = parseJSON<string[]>(b.primaryChannels, []);
    const joined = channels.join(' ').toLowerCase();
    allChannels.forEach(ch => {
      if (joined.includes(ch.toLowerCase().split('/')[0].trim())) {
        channelPresence[ch].push(b.name);
      }
    });
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Marketing Channels & Strategy</h2>
        <p className="text-sm text-muted-foreground">Channel presence heatmap and brand-level marketing strategy summaries.</p>
      </div>

      {/* Channel heatmap */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">Channel Coverage Heatmap</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-2 text-left font-medium text-muted-foreground">Channel</th>
                {brands.map(b => (
                  <th key={b.id} className={`px-2 py-2 text-center font-medium whitespace-nowrap ${b.name === 'DuetteNYC' ? 'text-teal-600 dark:text-teal-400' : 'text-muted-foreground'}`}
                    data-testid={`header-channel-${b.id}`}>
                    {b.name === 'DuetteNYC' ? '★ ' : ''}{b.name.length > 8 ? b.name.slice(0,8)+'…' : b.name}
                  </th>
                ))}
                <th className="px-2 py-2 text-center font-medium text-muted-foreground">Coverage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allChannels.map(ch => {
                const count = channelPresence[ch].length;
                const pct = Math.round((count / brands.length) * 100);
                return (
                  <tr key={ch} className="hover:bg-muted/20">
                    <td className="px-4 py-2 font-medium">{ch}</td>
                    {brands.map(b => {
                      const has = channelPresence[ch].includes(b.name);
                      const isDuette = b.name === 'DuetteNYC';
                      return (
                        <td key={b.id} className="px-2 py-2 text-center">
                          {has
                            ? <span className={`inline-block w-4 h-4 rounded-full ${isDuette ? 'bg-teal-500' : 'bg-green-400/70'}`}/>
                            : <span className="inline-block w-4 h-4 rounded-full bg-muted"/>}
                        </td>
                      );
                    })}
                    <td className="px-2 py-2 text-center">
                      <span className={`font-medium ${pct >= 70 ? 'text-green-600' : pct >= 40 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                        {pct}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Marketing strategy cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {brands.map(brand => {
          const isDuette = brand.name === 'DuetteNYC';
          const channels = parseJSON<string[]>(brand.primaryChannels, []);
          return (
            <div key={brand.id} className={`bg-card border rounded-xl p-4 ${isDuette ? 'border-teal-300 dark:border-teal-700' : 'border-border'}`}
              data-testid={`card-marketing-${brand.id}`}>
              <div className="flex items-center gap-2 mb-2">
                {isDuette && <span className="w-2 h-2 rounded-full bg-teal-500"/>}
                <h3 className={`text-sm font-semibold ${isDuette ? 'text-teal-700 dark:text-teal-400' : ''}`}>{brand.name}</h3>
                <Badge className={SEGMENT_COLORS[brand.segment] || 'bg-muted text-muted-foreground'}>{brand.segment}</Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{brand.marketingStrategy}</p>
              <div className="flex flex-wrap gap-1">
                {channels.map((c, i) => <PillTag key={i} text={c} />)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Best Practices / Insights Page ──────────────────────────────────────────
function InsightsPage() {
  const { data: brands = [], isLoading } = useCompetitors();
  if (isLoading) return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;

  const competitors = brands.filter(b => b.name !== 'DuetteNYC');

  // Gather all replicable insights from all brands
  const allInsights: { brand: string; insight: string; segment: string }[] = [];
  competitors.forEach(b => {
    parseJSON<string[]>(b.replicableInsights, []).forEach(ins => {
      allInsights.push({ brand: b.name, insight: ins, segment: b.segment });
    });
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Best Practices & Replicable Insights</h2>
        <p className="text-sm text-muted-foreground">What each competitor does well — and exactly how DuetteNYC can apply it.</p>
      </div>

      {/* Master insights list */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-amber-50/60 dark:bg-amber-950/20">
          <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-400 flex items-center gap-2">
            <Lightbulb className="w-4 h-4"/> All DuetteNYC Action Items ({allInsights.length} total)
          </h3>
        </div>
        <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
          {allInsights.map(({ brand, insight, segment }, i) => (
            <div key={i} className="flex items-start gap-3 px-5 py-3 hover:bg-muted/30" data-testid={`row-insight-${i}`}>
              <span className="text-amber-500 mt-0.5 flex-shrink-0"><Lightbulb className="w-3.5 h-3.5"/></span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-relaxed">{insight}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">From:</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${SEGMENT_COLORS[segment] || 'bg-muted text-muted-foreground'}`}>{brand}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Per-brand best practices */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Best Practices by Brand</h3>
        {competitors.map(brand => {
          const practices = parseJSON<string[]>(brand.bestPractices, []);
          const insights = parseJSON<string[]>(brand.replicableInsights, []);
          return (
            <div key={brand.id} className="bg-card border border-border rounded-xl overflow-hidden" data-testid={`card-insights-${brand.id}`}>
              <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">{brand.name}</h3>
                  <Badge className={SEGMENT_COLORS[brand.segment] || 'bg-muted text-muted-foreground'}>{brand.segment}</Badge>
                  <span className={`text-xs font-medium ${TIER_COLORS[brand.priceTier] || ''}`}>{brand.priceRange}</span>
                </div>
                <a href={brand.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                  Visit <ExternalLink className="w-3 h-3"/>
                </a>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
                    <Award className="w-3 h-3 text-blue-500"/> What They Do Well
                  </p>
                  <ul className="space-y-2">
                    {practices.map((p, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0"/>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <Lightbulb className="w-3 h-3"/> DuetteNYC Can Replicate
                  </p>
                  <ul className="space-y-2">
                    {insights.map((ins, i) => (
                      <li key={i} className="text-xs text-foreground flex items-start gap-2">
                        <ChevronRight className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0"/>
                        {ins}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Shell ────────────────────────────────────────────────────────────────────
export default function App() {
  const { dark, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
    <Router hook={useHashLocation}>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Desktop sidebar */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        {/* Mobile sidebar */}
        {mobileOpen && <Sidebar mobile onClose={() => setMobileOpen(false)} />}

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top bar */}
          <header className="h-14 flex items-center justify-between px-4 md:px-6 border-b border-border bg-card flex-shrink-0">
            <button className="md:hidden p-2 rounded-lg hover:bg-muted" onClick={() => setMobileOpen(true)} data-testid="button-menu">
              <Menu className="w-4 h-4"/>
            </button>
            <div className="flex-1 md:flex-none">
              <h1 className="text-sm font-semibold hidden md:block text-muted-foreground">DuetteNYC Competitor Intelligence</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground hidden sm:block">Last updated: Apr 23, 2026</span>
              <button onClick={toggle} className="p-2 rounded-lg hover:bg-muted text-muted-foreground" data-testid="button-theme">
                {dark ? <Sun className="w-4 h-4"/> : <Moon className="w-4 h-4"/>}
              </button>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
              <Switch>
                <Route path="/" component={OverviewPage} />
                <Route path="/matrix" component={MatrixPage} />
                <Route path="/homepage" component={HomepagePage} />
                <Route path="/seo" component={SeoPage} />
                <Route path="/marketing" component={MarketingPage} />
                <Route path="/insights" component={InsightsPage} />
              </Switch>
            </div>
          </main>
        </div>
      </div>
    </Router>
    </QueryClientProvider>
  );
}
