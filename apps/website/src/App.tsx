import { useEffect, useState, type FormEvent, type MouseEvent } from 'react';
import {
  Button,
  Callout,
  FilterChip,
  Footer,
  Icon,
  Input,
  ItemCard,
  SearchField,
  StatusBadge,
  TimelineStep,
  TopNav,
  type IconName,
  type TopNavPage,
} from '@may_thet_htar_aung/lemonade-design-system';
import { categories, featuredCase, foundItems, items, recoverySteps, type Item } from '@shared/data';
import { photosFor } from '@shared/images';
import { useHash } from './useHash';

const go = (to: string) => {
  window.location.hash = to;
};

const NAV_ROUTES: Record<string, string> = {
  'Browse items': 'browse',
  'Report an item': 'report',
  'Track a case': 'track',
  'How it works': '',
  'Sign in': '',
};

/** The design system's nav links render without targets, so route them from the label. */
function onNavClick(event: MouseEvent<HTMLElement>) {
  const target = (event.target as HTMLElement).closest('a, button');
  if (!target || target.classList.contains('top-nav__skip-link')) return;
  const label = target.textContent?.trim() ?? '';
  if (label in NAV_ROUTES) {
    event.preventDefault();
    go(NAV_ROUTES[label]);
    if (label === 'How it works') setTimeout(() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' }), 50);
  } else if (target.classList.contains('top-nav__home')) {
    event.preventDefault();
    go('');
  }
}

function Shell({ page, children }: { page: TopNavPage; children: React.ReactNode }) {
  return (
    <>
      <TopNav Page={page} onClick={onNavClick} />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}

const itemHref = (i: Item) => `#item/${i.id}`;
const meta = (i: Item) => `${i.place} · ${i.ago}`;

/* ───────────── W1 · Landing ───────────── */

const STEPS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'flag', title: '1. Report', text: 'Describe what you lost or found. It takes under two minutes.' },
  { icon: 'search', title: '2. Discover', text: 'We suggest possible matches for staff to review.' },
  { icon: 'shield', title: '3. Verify', text: 'Verified staff check ownership with details only the owner knows.' },
  { icon: 'handover', title: '4. Return safely', text: 'Hand over at an approved pickup point and close the case.' },
];

function Landing() {
  const [query, setQuery] = useState('');
  return (
    <Shell page="Home">
      <section className="wrap hero">
        <div>
          <span className="eyebrow">
            <Icon Name="shield" Size="sm" /> Lost &amp; found, with ownership checks
          </span>
          <h1>Lost something? Let&apos;s get it home.</h1>
          <p className="lead">
            Report an item, discover possible matches, and get it back through a safe, verified
            handover. Private details stay private.
          </p>
          <form
            className="search-row"
            onSubmit={(e) => {
              e.preventDefault();
              go(`browse?q=${encodeURIComponent(query)}`);
            }}
          >
            <SearchField Placeholder="Search by item, place or case number" onValueChange={setQuery} />
            <Button Style="Primary" Label="Search" type="submit" />
          </form>
          <div className="row">
            <Button Style="Primary" Label="I lost something" onClick={() => go('report')} />
            <Button Style="Outline" Label="I found something" onClick={() => go('report')} />
          </div>
        </div>
        <div className="hero__visual">
          <div className="hero__cards">
            <ItemCard Layout="Grid" Title={foundItems[0].title} Photo={foundItems[0].photo} PhotoAlt={foundItems[0].title} Meta={meta(foundItems[0])} href={itemHref(foundItems[0])} />
            <ItemCard Layout="Grid" Title={foundItems[1].title} Photo={foundItems[1].photo} PhotoAlt={foundItems[1].title} Meta={meta(foundItems[1])} href={itemHref(foundItems[1])} />
          </div>
          <Callout Type="Privacy" Title="Details stay private" Body="Serial numbers and contents are shown to verified staff only." />
        </div>
      </section>

      <section className="section section--sand" id="how">
        <div className="wrap">
          <h2 className="section__title">How Lemonade Found works</h2>
          <div className="grid4">
            {STEPS.map((s) => (
              <div className="card step" key={s.title}>
                <div className="step__icon"><Icon Name={s.icon} Size="lg" /></div>
                <h4>{s.title}</h4>
                <p className="muted">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section__head">
            <h2>Recently found near you</h2>
            <Button Style="Outline" Label="Browse all items" onClick={() => go('browse')} />
          </div>
          <div className="grid4">
            {foundItems.slice(0, 4).map((i) => (
              <ItemCard key={i.id} Layout="Grid" Title={i.title} Photo={i.photo} PhotoAlt={i.title} Meta={meta(i)} Status={i.status} href={itemHref(i)} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--brand">
        <div className="wrap trust">
          <div>
            <h2>Your private details stay private</h2>
            {[
              'Serial numbers, contents and inside photos are never shown on public pages.',
              'AI match suggestions are never proof. A person always checks ownership.',
              'Handovers happen at approved pickup points, with photo ID and a case code.',
            ].map((t) => (
              <div className="point" key={t}>
                <Icon Name="check" Size="md" />
                <span>{t}</span>
              </div>
            ))}
          </div>
          <div className="stack">
            <Callout Type="Privacy" Title="Share the minimum" Body="Public listings show a general description and area only." />
            <Callout Type="AI Match" Title="AI match is a suggestion" Body="Staff review every suggested match before anyone is contacted." />
          </div>
        </div>
      </section>

      <section className="section section--accent">
        <div className="wrap cta">
          <h2>Lost or found something today?</h2>
          <div className="row">
            <Button Style="Primary" Label="Report an item" onClick={() => go('report')} />
            <Button Style="Outline" Label="Browse items" onClick={() => go('browse')} />
          </div>
        </div>
      </section>
    </Shell>
  );
}

/* ───────────── W2 · Browse / Search ───────────── */

function Browse({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState<'All' | 'Lost' | 'Found'>('All');
  const [category, setCategory] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const results = items.filter(
    (i) =>
      (status === 'All' || i.kind === status) &&
      (!category || i.category === category) &&
      (!q || `${i.title} ${i.place} ${i.id} ${i.category}`.toLowerCase().includes(q)),
  );

  return (
    <Shell page="Browse">
      <div className="wrap section">
        <h1>Browse lost &amp; found items</h1>
        <div style={{ marginTop: 'var(--spacing-lg)' }}>
          <SearchField
            key={initialQuery}
            Placeholder="Search by item, place or case number"
            defaultValue={initialQuery}
            onValueChange={setQuery}
          />
        </div>
        <div className="browse">
          <aside className="card">
            <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Filters</h3>
            <div className="filter-group">
              <h4>Status</h4>
              <div className="chips">
                {(['All', 'Lost', 'Found'] as const).map((s) => (
                  <FilterChip key={s} Label={s} State={status === s ? 'Active' : 'Default'} onClick={() => setStatus(s)} />
                ))}
              </div>
            </div>
            <div className="filter-group">
              <h4>Category</h4>
              <div className="chips">
                {categories.map((c) => (
                  <FilterChip
                    key={c}
                    Label={c}
                    State={category === c ? 'Active' : 'Default'}
                    onClick={() => setCategory(category === c ? null : c)}
                  />
                ))}
              </div>
            </div>
            <Button
              Style="Outline"
              Label="Reset filters"
              onClick={() => {
                setStatus('All');
                setCategory(null);
                setQuery('');
                go('browse');
              }}
            />
          </aside>
          <section>
            <p className="muted results__head">
              {results.length} result{results.length === 1 ? '' : 's'} · sorted by newest
            </p>
            <div className="stack">
              <Callout Type="Privacy" Title="Listings show the minimum" Body="Exact locations and private details are shared only after verification." />
              {results.length === 0 ? (
                <div className="card">
                  <h3>No items match</h3>
                  <p className="muted" style={{ margin: 'var(--spacing-sm) 0 var(--spacing-lg)' }}>
                    Try fewer filters, or report the item so we can watch for it.
                  </p>
                  <Button Style="Primary" Label="Report an item" onClick={() => go('report')} />
                </div>
              ) : (
                <div className="grid3">
                  {results.map((i) => (
                    <ItemCard key={i.id} Layout="Grid" Title={i.title} Photo={i.photo} PhotoAlt={i.title} Meta={meta(i)} Status={i.status} href={itemHref(i)} />
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </Shell>
  );
}

/* ───────────── W3 · Item details ───────────── */

/** Item photo gallery: auto-advancing loop, prev/next arrows, and thumbnails. */
function Gallery({ title }: { title: string }) {
  const photos = photosFor(title);
  const count = photos.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || count < 2) return;
    const timer = setInterval(() => setIndex((n) => (n + 1) % count), 4000);
    return () => clearInterval(timer);
  }, [paused, count]);

  const go = (n: number) => setIndex(((n % count) + count) % count);

  return (
    <div className="gallery" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="photo gallery__main">
        <img src={photos[index]} alt={`${title}, photo ${index + 1} of ${count}`} />
        {count > 1 && (
          <>
            <button type="button" className="gallery__arrow gallery__arrow--prev" aria-label="Previous photo" onClick={() => go(index - 1)}>
              <Icon Name="chevron-left" Size="md" />
            </button>
            <button type="button" className="gallery__arrow gallery__arrow--next" aria-label="Next photo" onClick={() => go(index + 1)}>
              <Icon Name="chevron-right" Size="md" />
            </button>
          </>
        )}
      </div>
      {count > 1 && (
        <div className="thumbs">
          {photos.map((p, n) => (
            <div key={p} className={n === index ? 'is-active' : undefined}>
              <button type="button" aria-label={`Show photo ${n + 1}`} aria-current={n === index} onClick={() => go(n)}>
                <img src={p} alt="" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ItemDetails({ id }: { id: string }) {
  const item = items.find((i) => i.id === id);
  if (!item) return <NotFound page="Browse" what="item" />;
  const similar = items.filter((i) => i.id !== id && i.category === item.category).concat(items.filter((i) => i.id !== id && i.category !== item.category)).slice(0, 4);
  return (
    <Shell page="Browse">
      <div className="wrap section">
        <nav className="crumbs muted" aria-label="Breadcrumb">
          <a href="#browse">Browse</a> / <span>{item.category}</span> / <span>{item.title}</span>
        </nav>
        <div className="details">
          <div>
            <Gallery title={item.title} />
            <Callout Type="Privacy" Title="Photos show the item only" Body="Inside photos and identifying marks are kept for verified staff." />
          </div>
          <div className="stack">
            <div>
              <StatusBadge Status={item.status} />
              <h1 style={{ margin: 'var(--spacing-sm) 0' }}>{item.title}</h1>
              <p className="lead">{item.description}</p>
            </div>
            <div className="card">
              <h3>Public details</h3>
              <div className="kv"><span>Category</span><span>{item.category}</span></div>
              <div className="kv"><span>{item.kind === 'Found' ? 'Found at' : 'Last seen'}</span><span>{item.place}</span></div>
              <div className="kv"><span>Date &amp; time</span><span>{item.when}</span></div>
              <div className="kv"><span>Held at</span><span>{item.heldAt}</span></div>
              <div className="kv"><span>Case</span><span>{item.id}</span></div>
            </div>
            <div className="card">
              <h3>Ownership details</h3>
              {['Contents', 'Serial / marks', 'Inside photos'].map((k) => (
                <div className="kv" key={k}>
                  <span>{k}</span>
                  <span className="locked"><Icon Name="lock" Size="sm" /> Hidden · verified staff only</span>
                </div>
              ))}
            </div>
            <Button Style="Primary" Label="This looks like mine" onClick={() => go(`claim/${item.id}`)} />
            <Button Style="Outline" Label="Report a similar item" onClick={() => go('report')} />
          </div>
        </div>
      </div>
      <section className="section section--sand">
        <div className="wrap">
          <h2 className="section__title">Similar items</h2>
          <div className="grid4">
            {similar.map((i) => (
              <ItemCard key={i.id} Layout="Grid" Title={i.title} Photo={i.photo} PhotoAlt={i.title} Meta={meta(i)} Status={i.status} href={itemHref(i)} />
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}

/* ───────────── W4 · Report form ───────────── */

function ReportForm() {
  const [kind, setKind] = useState<'Lost' | 'Found'>('Lost');
  const [photos, setPhotos] = useState(0);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [missing, setMissing] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!String(data.get('item') ?? '').trim() || !String(data.get('place') ?? '').trim()) {
      setMissing(true);
      return;
    }
    setMissing(false);
    setSubmitted('LF-2042');
  };

  if (submitted) {
    return (
      <Shell page="Report">
        <div className="wrap section" style={{ maxWidth: 720 }}>
          <div className="notice stack">
            <Icon Name="check" Size="2xl" />
            <h1>Report received</h1>
            <p className="lead">
              Your {kind.toLowerCase()} report is saved as case <strong>{submitted}</strong>. We&apos;ll notify you
              when staff review a possible match.
            </p>
            <div className="row">
              <Button Style="Primary" Label="Track this case" onClick={() => go('track')} />
              <Button Style="Outline" Label="Browse items" onClick={() => go('browse')} />
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell page="Report">
      <div className="wrap section">
        <h1>Report a lost or found item</h1>
        <p className="lead" style={{ margin: 'var(--spacing-sm) 0 var(--spacing-xl)' }}>
          The more general details you give, the easier it is to find a match. Keep identifying details for later.
        </p>
        <div className="form-layout">
          <form className="card stack" onSubmit={onSubmit} noValidate>
            <div className="toggle">
              <Button type="button" Style={kind === 'Lost' ? 'Primary' : 'Outline'} Label="I lost something" onClick={() => setKind('Lost')} />
              <Button type="button" Style={kind === 'Found' ? 'Primary' : 'Outline'} Label="I found something" onClick={() => setKind('Found')} />
            </div>
            <button type="button" className="upload" onClick={() => setPhotos((p) => Math.min(4, p + 1))}>
              <Icon Name="camera" Size="xl" />
              <strong>{photos ? `${photos} photo${photos > 1 ? 's' : ''} added` : 'Add photos of the item'}</strong>
              <span className="muted">Up to 4 · only the item itself, no personal documents</span>
            </button>
            <div className="form-grid">
              <Input name="item" Label="Item name" Placeholder="Black leather wallet" State={missing ? 'Error' : 'Default'} Helper={missing ? 'Add the item name and place.' : undefined} />
              <Input name="category" Label="Category" Placeholder="Wallet" />
              <Input name="place" Label={kind === 'Lost' ? 'Where did you lose it?' : 'Where did you find it?'} Placeholder="Central Station" />
              <Input name="when" Label="When" Placeholder="Today, around 08:40" />
            </div>
            <Input name="description" Type="Multi" Label="Description" Placeholder="Colour, brand, size. No serial numbers here." />
            <div className="form-grid">
              <Input name="email" Label="Your email" Placeholder="you@example.com" />
              <Input name="venue" Label={kind === 'Found' ? 'Where is it now?' : 'Preferred pickup point'} Placeholder="Central Station desk" />
            </div>
            <Callout Type="Privacy" Title="Don't add private details" Body="Serial numbers and contents are asked for only when someone claims the item." />
            <div className="row">
              <Button type="submit" Style="Primary" Label="Submit report" />
              <Button type="button" Style="Ghost" Label="Cancel" onClick={() => go('')} />
            </div>
          </form>
          <aside className="stack">
            <Callout Type="AI Match" Title="We look for matches for you" Body="Staff review every suggestion before contacting anyone." />
            <div className="card">
              <h3 style={{ marginBottom: 'var(--spacing-md)' }}>What happens next</h3>
              <ol className="timeline">
                <TimelineStep State="Current" Title="Report saved" Subtitle="You get a case number" />
                <TimelineStep State="Upcoming" Title="Match review" Subtitle="Staff check suggestions" />
                <TimelineStep State="Upcoming" Title="Claim and verify" Subtitle="Prove it is yours" {...{ 'Show line': false }} />
              </ol>
            </div>
            <Callout Type="Privacy" Title="Your data is minimal" Body="Contact details are shown to staff only." />
          </aside>
        </div>
      </div>
    </Shell>
  );
}

/* ───────────── W5 · Claim submission ───────────── */

function Claim({ id }: { id: string }) {
  const item = items.find((i) => i.id === id);
  const [agreed, setAgreed] = useState(false);
  const [proof, setProof] = useState(0);
  const [error, setError] = useState('');
  if (!item) return <NotFound page="Browse" what="item" />;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!String(data.get('contents') ?? '').trim()) return setError('Describe what is inside or on the item.');
    if (!agreed) return setError('Please confirm the information is true.');
    go(`track/${item.id}`);
  };

  return (
    <Shell page="Browse">
      <div className="wrap section">
        <h1>Claim this item</h1>
        <div className="stepper" aria-label="Claim steps">
          <span className="stepper__dot" data-on="true"><Icon Name="check" Size="sm" /></span><span>Select item</span>
          <span className="stepper__line" />
          <span className="stepper__dot" data-on="true">2</span><strong>Verify ownership</strong>
          <span className="stepper__line" />
          <span className="stepper__dot">3</span><span className="muted">Review &amp; submit</span>
        </div>
        <div className="form-layout" style={{ marginTop: 'var(--spacing-xl)' }}>
          <form className="card stack" onSubmit={onSubmit} noValidate>
            <h3>Item you are claiming</h3>
            <ItemCard Layout="List" Title={item.title} Photo={item.photo} PhotoAlt={item.title} Meta={meta(item)} Status={item.status} href={itemHref(item)} />
            <h3>Prove it is yours</h3>
            <Input name="contents" Type="Multi" Label="What is inside or on it?" Placeholder="Cards, papers, stickers, scratches…" State={error.includes('inside') ? 'Error' : 'Default'} Helper={error.includes('inside') ? error : undefined} />
            <div className="form-grid">
              <Input name="marks" Label="Marks or serial number" Placeholder="Initials A.C. inside the flap" />
              <Input name="lost" Label="When did you lose it?" Placeholder="Yesterday evening" />
            </div>
            <button type="button" className="upload" onClick={() => setProof((p) => Math.min(3, p + 1))}>
              <Icon Name="camera" Size="xl" />
              <strong>{proof ? `${proof} proof photo${proof > 1 ? 's' : ''} added` : 'Add proof (receipt, past photo or box)'}</strong>
              <span className="muted">Private to verified staff · never shown publicly</span>
            </button>
            <label className="consent">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
              <span>I confirm this information is true, and I understand staff may ask for photo ID at handover.</span>
            </label>
            {error && !error.includes('inside') && <p className="error-text" role="alert">{error}</p>}
            <div className="row">
              <Button type="submit" Style="Primary" Label="Submit claim" />
              <Button type="button" Style="Ghost" Label="Back" onClick={() => go(`item/${item.id}`)} />
            </div>
          </form>
          <aside className="stack">
            <Callout Type="Privacy" Title="Your proof stays private" Body="Only verified staff can see what you submit." />
            <Callout Type="AI Match" Title="No automatic approval" Body="A person checks every claim against the private details." />
            <div className="card">
              <h3 style={{ marginBottom: 'var(--spacing-md)' }}>What staff check</h3>
              {[
                'Contents match what you described',
                'Marks or serial number match',
                'Proof is consistent and recent',
                'Identity is confirmed at handover',
              ].map((t) => (
                <div className="point" key={t}><Icon Name="check" Size="md" /><span>{t}</span></div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </Shell>
  );
}

/* ───────────── W6 · Case tracking ───────────── */

function Track({ id }: { id: string }) {
  const [typed, setTyped] = useState('');
  const [error, setError] = useState('');

  if (!id) {
    return (
      <Shell page="Track">
        <div className="wrap section" style={{ maxWidth: 640 }}>
          <h1>Track your case</h1>
          <p className="lead" style={{ margin: 'var(--spacing-sm) 0 var(--spacing-xl)' }}>Enter the case number from your confirmation, such as {featuredCase.id}.</p>
          <form
            className="stack"
            onSubmit={(e) => {
              e.preventDefault();
              const c = typed.trim().toUpperCase();
              if (!items.some((i) => i.id === c)) return setError('We can’t find that case number. Check it and try again.');
              go(`track/${c}`);
            }}
          >
            <SearchField Placeholder="Case number" onValueChange={(v) => { setTyped(v); setError(''); }} />
            {error && <p className="error-text" role="alert">{error}</p>}
            <div><Button type="submit" Style="Primary" Label="Track case" /></div>
          </form>
        </div>
      </Shell>
    );
  }

  const item = items.find((i) => i.id === id);
  if (!item) return <NotFound page="Track" what="case" />;
  return (
    <Shell page="Track">
      <div className="wrap section">
        <div className="section__head">
          <div>
            <h1>Case {item.id}</h1>
            <p className="lead">{item.title} · claim in review</p>
          </div>
          <StatusBadge Status="Claim Pending" />
        </div>
        <div className="form-layout">
          <div className="card">
            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Recovery progress</h3>
            <ol className="timeline">
              {recoverySteps.map((s, idx) => (
                <TimelineStep key={s.title} State={s.state} Title={s.title} Subtitle={s.subtitle} {...{ 'Show line': idx < recoverySteps.length - 1 }} />
              ))}
            </ol>
          </div>
          <aside className="stack">
            <ItemCard Layout="List" Title={item.title} Photo={item.photo} PhotoAlt={item.title} Meta={meta(item)} Status={item.status} href={itemHref(item)} />
            <div className="card">
              <h3>Handover details</h3>
              <div className="kv"><span>Pickup point</span><span className="locked"><Icon Name="lock" Size="sm" /> Revealed after verification</span></div>
              <div className="kv"><span>Staff contact</span><span className="locked"><Icon Name="lock" Size="sm" /> Revealed after verification</span></div>
              <div className="kv"><span>ID needed</span><span>{featuredCase.idRequired}</span></div>
            </div>
            <Callout Type="Privacy" Title="We'll tell you when it's ready" Body="You'll get the pickup point once staff verify your claim." />
            <Button Style="Primary" Label="Contact support" />
            <Button Style="Outline" Label="Back to browse" onClick={() => go('browse')} />
          </aside>
        </div>
      </div>
    </Shell>
  );
}

function NotFound({ page, what }: { page: TopNavPage; what: string }) {
  return (
    <Shell page={page}>
      <div className="wrap section" style={{ maxWidth: 640 }}>
        <h1>We can&apos;t find that {what}</h1>
        <p className="lead" style={{ margin: 'var(--spacing-sm) 0 var(--spacing-xl)' }}>It may have been returned or removed.</p>
        <Button Style="Primary" Label="Browse items" onClick={() => go('browse')} />
      </div>
    </Shell>
  );
}

export function App() {
  const hash = useHash();
  const [path, queryString = ''] = hash.split('?');
  const [route, arg = ''] = path.split('/');
  const q = new URLSearchParams(queryString).get('q') ?? '';

  switch (route) {
    case 'browse':
      return <Browse initialQuery={q} />;
    case 'item':
      return <ItemDetails id={arg} />;
    case 'report':
      return <ReportForm />;
    case 'claim':
      return <Claim id={arg} />;
    case 'track':
      return <Track id={arg} />;
    default:
      return <Landing />;
  }
}
