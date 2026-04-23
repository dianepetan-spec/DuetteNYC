
// ─── Metrics to Monitor Page ─────────────────────────────────────────────────
function MetricsPage() {
  const METRICS = [
    {
      category: 'Conversion & Revenue',
      color: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800',
      icon: TrendingUp,
      items: [
        { metric: 'Overall conversion rate', target: '1.5–2.5%', current: '0.09%', priority: 'CRITICAL', note: 'Industry average is 1.5–3%. DuetteNYC is 17x below benchmark.' },
        { metric: 'Add-to-cart → checkout drop-off', target: '<30% drop', current: '~11% proceed', priority: 'CRITICAL', note: 'Track in Shopify Analytics — pinpoints friction step.' },
        { metric: 'Average Order Value (AOV)', target: '$200+', current: '~$128', priority: 'HIGH', note: 'Bundle promotions (20–30% off 2–3 items) should push AOV up.' },
        { metric: 'Return customer rate', target: '25–35%', current: 'Unknown', priority: 'HIGH', note: 'Core to your "pant you reach for again" promise.' },
        { metric: 'Revenue per visitor', target: '$3–$5', current: '<$0.50', priority: 'HIGH', note: 'Single number combining price × conversion.' },
        { metric: 'Checkout abandonment rate', target: '<65%', current: 'Unknown', priority: 'HIGH', note: 'Shopify + email cart recovery flow directly impacts this.' },
      ]
    },
    {
      category: 'SEO & Organic',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
      icon: Search,
      items: [
        { metric: 'Keyword ranking: "black ponte bootleg pants"', target: 'Page 1 (top 10)', current: 'Unknown', priority: 'HIGH', note: 'Your core term. Check with Google Search Console.' },
        { metric: 'Keyword ranking: "best black pants"', target: 'Top 20', current: 'Unknown', priority: 'HIGH', note: 'High-volume discovery term competitors target.' },
        { metric: 'Organic traffic share vs. paid', target: '>60% organic', current: 'Unknown', priority: 'MEDIUM', note: 'At early DTC stage, organic = compounding free growth.' },
        { metric: 'Backlink count vs. Ripley Rader / Spanx', target: 'Growing MoM', current: 'Low', priority: 'MEDIUM', note: 'Press coverage (Forbes, TODAY, Vogue) drives massive backlink gaps.' },
        { metric: 'Google Search Console impressions', target: 'Growing MoM', current: 'Unknown', priority: 'HIGH', note: 'Free in GSC — shows how many people see you in search.' },
        { metric: 'Site speed (Core Web Vitals)', target: 'LCP < 2.5s', current: 'Unknown', priority: 'MEDIUM', note: 'Slow pages kill SEO rankings and conversion simultaneously.' },
      ]
    },
    {
      category: 'Social & Brand',
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800',
      icon: Users,
      items: [
        { metric: 'Instagram follower count', target: '10K (6-mo goal)', current: 'Nascent', priority: 'HIGH', note: 'Lysse has 200K+. Every follower is a free remarketing channel.' },
        { metric: 'TikTok views per post', target: '>5K avg', current: 'None', priority: 'HIGH', note: 'Ripley Rader built $40M on viral TikTok/IG founder content.' },
        { metric: 'User-generated content (UGC) volume', target: '10+ tagged posts/mo', current: '<5', priority: 'HIGH', note: 'Tagged posts = free social proof. Encourage with hashtag or incentive.' },
        { metric: 'Review count (Shopify)', target: '50+ (3-mo goal)', current: '2', priority: 'CRITICAL', note: 'Lysse has 24,300. Reviews are your biggest credibility gap.' },
        { metric: 'Email list size', target: '1,000 (3-mo goal)', current: 'Unknown', priority: 'HIGH', note: 'Email converts 3–5x better than social. Add popup with offer.' },
        { metric: 'Email open rate', target: '>30%', current: 'Unknown', priority: 'MEDIUM', note: 'Industry avg 20%. DTC brands with strong voice hit 35–45%.' },
        { metric: 'Press mentions / "As Seen In"', target: '3+ placements/yr', current: '0', priority: 'MEDIUM', note: 'Ripley Rader: Forbes, TODAY, Vogue. One placement changes everything.' },
      ]
    },
    {
      category: 'Competitive Intelligence',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
      icon: BarChart2,
      items: [
        { metric: 'Competitor sale frequency', target: 'Track monthly', current: 'Ad hoc', priority: 'MEDIUM', note: 'Spanx rarely discounts = brand strength. Ann Taylor discounts weekly = margin erosion signal.' },
        { metric: 'Ripley Rader / Lysse new SKU launches', target: 'Track quarterly', current: 'None', priority: 'MEDIUM', note: 'New drops signal what silhouettes/colors are trending.' },
        { metric: 'Competitor out-of-stock patterns', target: 'Track weekly', current: 'None', priority: 'MEDIUM', note: 'Ripley Rader "constantly sold out" = scarcity marketing + real demand signal.' },
        { metric: 'Competitor homepage conversion score', target: 'Track quarterly', current: 'Done (Apr 2026)', priority: 'LOW', note: 'Re-audit this dashboard every quarter as competitors update their sites.' },
        { metric: 'Competitor review velocity', target: 'Track monthly', current: 'Done (Apr 2026)', priority: 'MEDIUM', note: 'Are Lysse/Spanx review counts growing? At what rate?' },
      ]
    },
    {
      category: 'Product & Operations',
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800',
      icon: Award,
      items: [
        { metric: 'Return rate by SKU', target: '<10%', current: 'Unknown', priority: 'HIGH', note: 'High returns = fit issue. Low returns + high reviews = product-market fit.' },
        { metric: 'Inventory sell-through rate', target: '>80%', current: 'Unknown', priority: 'MEDIUM', note: 'Tracks whether production quantities match real demand.' },
        { metric: 'Time to first purchase (new visitors)', target: '<7 days', current: 'Unknown', priority: 'MEDIUM', note: 'Email sequences and retargeting ads reduce this window.' },
        { metric: 'Customer lifetime value (LTV)', target: '$300+', current: 'Unknown', priority: 'HIGH', note: 'LTV vs. CAC ratio determines whether paid ads are profitable to scale.' },
      ]
    },
  ];

  const PRIORITY_STYLE: Record<string, string> = {
    CRITICAL: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    HIGH: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    MEDIUM: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    LOW: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Metrics to Monitor</h2>
        <p className="text-sm text-muted-foreground mt-1">KPIs to track regularly to close the gap on competitors and grow DuetteNYC. Prioritized by impact.</p>
      </div>

      {/* Priority legend */}
      <div className="flex flex-wrap gap-2 text-xs">
        {Object.entries(PRIORITY_STYLE).map(([p, cls]) => (
          <span key={p} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-semibold ${cls}`}>
            <Circle className="w-2 h-2 fill-current" />{p}
          </span>
        ))}
        <span className="text-muted-foreground ml-2 self-center">· Re-audit quarterly</span>
      </div>

      {METRICS.map(({ category, color, bg, icon: Icon, items }) => (
        <div key={category} className={`border rounded-xl overflow-hidden ${bg}`}>
          <div className="px-5 py-3 flex items-center gap-2 border-b border-inherit">
            <Icon className={`w-4 h-4 ${color}`} />
            <h3 className={`font-semibold text-sm ${color}`}>{category}</h3>
            <span className="ml-auto text-xs text-muted-foreground">{items.length} metrics</span>
          </div>
          <div className="bg-card divide-y divide-border">
            {items.map(({ metric, target, current, priority, note }) => (
              <div key={metric} className="px-5 py-3 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_auto] gap-2 md:gap-4 items-start">
                <div>
                  <p className="text-sm font-medium">{metric}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{note}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Current</p>
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400">{current}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Target</p>
                  <p className="text-sm font-medium text-teal-600 dark:text-teal-400">{target}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${PRIORITY_STYLE[priority]}`}>
                  {priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
