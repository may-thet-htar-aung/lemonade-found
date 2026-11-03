import { useState, type FormEvent, type ReactNode } from 'react';
import {
  Button,
  Callout,
  FilterChip,
  Icon,
  IconButton,
  Input,
  ItemCard,
  Logo,
  SearchField,
  StatusBadge,
  TabBar,
  TimelineStep,
  type TabBarActive,
} from '@may_thet_htar_aung/lemonade-design-system';
import { featuredCase, foundItems, items, recoverySteps, type Item } from '@shared/data';
import { useHash } from './useHash';

const go = (to: string) => {
  window.location.hash = to;
};

const TAB_HREFS: Record<TabBarActive, string> = {
  Home: '#home',
  Search: '#search',
  Report: '#report',
  Activity: '#track',
  Profile: '#profile',
};

function Phone({ tab, children }: { tab?: TabBarActive; children: ReactNode }) {
  return (
    <div className="phone">
      <main className="screen">{children}</main>
      {tab && (
        <div className="tabs">
          <TabBar Active={tab} hrefs={TAB_HREFS} />
        </div>
      )}
    </div>
  );
}

function Header({ title, back }: { title: string; back?: string }) {
  return (
    <div className="header">
      <h1>{title}</h1>
      <IconButton Style="Ghost" aria-label="Close" onClick={() => go(back ?? 'home')} {...{ 'Icon swap': <Icon Name="x" Size="md" /> }} />
    </div>
  );
}

const itemHref = (i: Item) => `#item/${i.id}`;
const meta = (i: Item) => `${i.place} · ${i.ago}`;

/* ───────────── M1 · Home / Discovery ───────────── */

function Home() {
  const [chip, setChip] = useState('All');
  const chips = ['All', 'Wallets', 'Phones', 'Bags'];
  const filtered = foundItems.filter((i) => {
    if (chip === 'All') return true;
    if (chip === 'Wallets') return i.category === 'Wallet';
    if (chip === 'Phones') return i.title.toLowerCase().includes('phone');
    return i.category === 'Bags';
  });
  return (
    <Phone tab="Home">
      <div className="topbar">
        <Logo Theme="Light" Size="Small" />
        <IconButton Style="Ghost" aria-label="Notifications, 3 unread" {...{ 'Show badge': true }} />
      </div>
      <div className="stack">
        <h1>Lost something? Let&apos;s get it home.</h1>
        <p className="muted">Report it, or browse what others have found.</p>
      </div>
      <div className="row">
        <Button Style="Primary" Label="I lost it" onClick={() => go('report')} />
        <Button Style="Outline" Label="I found it" onClick={() => go('report')} />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go('search');
        }}
      >
        <SearchField Placeholder="Search by item or place" onValueChange={() => undefined} />
      </form>
      <div className="chips" role="group" aria-label="Quick filters">
        {chips.map((c) => (
          <FilterChip key={c} Label={c} State={chip === c ? 'Active' : 'Default'} onClick={() => setChip(c)} />
        ))}
      </div>
      <div className="header">
        <h2>Recently found near you</h2>
        <a className="link" href="#search">See all</a>
      </div>
      {filtered.length === 0 ? (
        <p className="muted">Nothing found yet in this category.</p>
      ) : (
        <>
          <div className="grid2">
            {filtered.slice(0, 2).map((i) => (
              <ItemCard key={i.id} Layout="Grid" Title={i.title} Meta={meta(i)} Status={i.status} href={itemHref(i)} />
            ))}
          </div>
          {filtered.slice(2, 3).map((i) => (
            <ItemCard key={i.id} Layout="List" Title={i.title} Meta={meta(i)} Status={i.status} href={itemHref(i)} />
          ))}
        </>
      )}
    </Phone>
  );
}

/* ───────────── M3 · Search results ───────────── */

function Search() {
  const [query, setQuery] = useState('');
  const [chip, setChip] = useState('All');
  const q = query.trim().toLowerCase();
  const results = items.filter(
    (i) =>
      (chip === 'All' || i.kind === chip) &&
      (!q || `${i.title} ${i.place} ${i.category}`.toLowerCase().includes(q)),
  );
  return (
    <Phone tab="Search">
      <h1>Search results</h1>
      <SearchField Placeholder="Search by item or place" onValueChange={setQuery} />
      <div className="chips" role="group" aria-label="Filters">
        {['All', 'Found', 'Lost'].map((c) => (
          <FilterChip key={c} Label={c} State={chip === c ? 'Active' : 'Default'} onClick={() => setChip(c)} />
        ))}
      </div>
      <Callout Type="Privacy" Title="Only general details are shown" Body="Private details stay hidden until you claim an item." />
      <p className="muted">{results.length} result{results.length === 1 ? '' : 's'}</p>
      <div className="stack">
        {results.map((i) => (
          <ItemCard key={i.id} Layout="List" Title={i.title} Meta={meta(i)} Status={i.status} href={itemHref(i)} />
        ))}
        {results.length === 0 && (
          <div className="card stack">
            <h3>No items match</h3>
            <p className="muted">Report it and we&apos;ll watch for a match.</p>
            <Button Style="Primary" Label="Report an item" onClick={() => go('report')} />
          </div>
        )}
      </div>
    </Phone>
  );
}

/* ───────────── M2 · Report lost / found ───────────── */

function Report() {
  const [kind, setKind] = useState<'Lost' | 'Found'>('Lost');
  const [photos, setPhotos] = useState(0);
  const [missing, setMissing] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!String(data.get('item') ?? '').trim()) return setMissing(true);
    setMissing(false);
    setDone(true);
  };

  if (done) {
    return (
      <Phone tab="Report">
        <div className="success"><Icon Name="check" Size="3xl" /></div>
        <div className="center stack">
          <h1>Report received</h1>
          <p className="muted">Saved as case LF-2042. We&apos;ll tell you when staff review a possible match.</p>
        </div>
        <Button Style="Primary" Label="Track this case" onClick={() => go('track')} />
        <Button Style="Outline" Label="Back to home" onClick={() => go('home')} />
      </Phone>
    );
  }

  return (
    <Phone tab="Report">
      <Header title="Report an item" />
      <div className="row">
        <Button type="button" Style={kind === 'Lost' ? 'Primary' : 'Outline'} Label="I lost it" onClick={() => setKind('Lost')} />
        <Button type="button" Style={kind === 'Found' ? 'Primary' : 'Outline'} Label="I found it" onClick={() => setKind('Found')} />
      </div>
      <form className="stack" onSubmit={onSubmit} noValidate>
        <button type="button" className="upload" onClick={() => setPhotos((p) => Math.min(4, p + 1))}>
          <Icon Name="camera" Size="xl" />
          <strong>{photos ? `${photos} photo${photos > 1 ? 's' : ''} added` : 'Add photos'}</strong>
          <span className="muted">Up to 4 · only the item, no personal documents</span>
        </button>
        <Input name="item" Label="Item name" Placeholder="Black leather wallet" State={missing ? 'Error' : 'Default'} Helper={missing ? 'Add the item name.' : undefined} />
        <Input name="place" Label={kind === 'Lost' ? 'Where did you lose it?' : 'Where did you find it?'} Placeholder="Central Station" />
        <Input name="when" Label="When" Placeholder="Today, around 08:40" />
        <Input name="description" Type="Multi" Label="Description" Placeholder="Colour, brand, size" />
        <Callout Type="Privacy" Title="Don't add private details" Body="Serial numbers and contents are asked for only when someone claims the item." />
        <Button type="submit" Style="Primary" Label="Submit report" />
      </form>
    </Phone>
  );
}

/* ───────────── M4 · Item details ───────────── */

function ItemDetails({ id }: { id: string }) {
  const item = items.find((i) => i.id === id);
  if (!item) return <Missing />;
  return (
    <Phone tab="Search">
      <Header title="Item details" back="search" />
      <div className="photo"><Icon Name="box" Size="3xl" /></div>
      <div className="stack">
        <StatusBadge Status={item.status} />
        <h1>{item.title}</h1>
        <p className="muted">{item.description}</p>
      </div>
      <div className="card">
        <div className="kv"><span>Category</span><span>{item.category}</span></div>
        <div className="kv"><span>{item.kind === 'Found' ? 'Found at' : 'Last seen'}</span><span>{item.place}</span></div>
        <div className="kv"><span>Date &amp; time</span><span>{item.when}</span></div>
        <div className="kv"><span>Held at</span><span>{item.heldAt}</span></div>
      </div>
      <div className="card">
        <h3>Ownership details</h3>
        {['Contents', 'Serial / marks', 'Inside photos'].map((k) => (
          <div className="kv" key={k}><span>{k}</span><span className="locked"><Icon Name="lock" Size="sm" /> Hidden</span></div>
        ))}
      </div>
      <Callout Type="Privacy" Title="Only the owner can see more" Body="Claim it and verified staff will check your answers." />
      <Button Style="Primary" Label="This looks like mine" onClick={() => go(`claim/${item.id}`)} />
    </Phone>
  );
}

/* ───────────── M5 · Ownership claim ───────────── */

function Claim({ id }: { id: string }) {
  const item = items.find((i) => i.id === id);
  const [proof, setProof] = useState(0);
  const [error, setError] = useState('');
  if (!item) return <Missing />;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!String(data.get('contents') ?? '').trim()) return setError('Describe what is inside or on the item.');
    go(`track/${item.id}`);
  };

  return (
    <Phone>
      <div className="stack">
        <Header title="Claim this item" back={`item/${item.id}`} />
        <p className="muted">Step 2 of 3 · Prove it&apos;s you</p>
        <div className="progress" aria-hidden="true"><span data-on="true" /><span data-on="true" /><span /></div>
      </div>
      <ItemCard Layout="List" Title={item.title} Meta={meta(item)} Status={item.status} href={itemHref(item)} />
      <Callout Type="Privacy" Title="Your answers stay private" Body="Only verified staff can see them." />
      <form className="stack" onSubmit={onSubmit} noValidate>
        <Input name="contents" Type="Multi" Label="What is inside or on it?" Placeholder="Cards, papers, stickers…" State={error ? 'Error' : 'Default'} Helper={error || undefined} />
        <Input name="marks" Label="Marks or serial number" Placeholder="Initials inside the flap" />
        <button type="button" className="upload" onClick={() => setProof((p) => Math.min(3, p + 1))}>
          <Icon Name="camera" Size="xl" />
          <strong>{proof ? `${proof} proof photo${proof > 1 ? 's' : ''} added` : 'Add proof photo'}</strong>
          <span className="muted">Receipt, past photo or box</span>
        </button>
        <Callout Type="AI Match" Title="A person reviews every claim" Body="You'll be asked for photo ID at handover." />
        <Button type="submit" Style="Primary" Label="Submit claim" />
        <Button type="button" Style="Ghost" Label="Cancel" onClick={() => go(`item/${item.id}`)} />
      </form>
    </Phone>
  );
}

/* ───────────── M6 · Recovery tracking ───────────── */

function Track({ id }: { id: string }) {
  const item = items.find((i) => i.id === (id || featuredCase.id));
  const [collected, setCollected] = useState(false);
  if (!item) return <Missing />;
  return (
    <Phone tab="Activity">
      <div className="stack">
        <Header title="Track recovery" />
        <p className="muted">Case {item.id}</p>
      </div>
      <ItemCard Layout="List" Title={item.title} Meta={meta(item)} Status={item.status} href={itemHref(item)} />
      <div className="card">
        <ol className="timeline">
          {recoverySteps.map((s, idx) => (
            <TimelineStep
              key={s.title}
              State={s.state}
              Title={s.title}
              Subtitle={s.subtitle}
              {...{ 'Show line': idx < recoverySteps.length - 1 }}
            />
          ))}
        </ol>
      </div>
      <Callout Type="Privacy" Title="Pickup point hidden for now" Body="You'll see it as soon as staff verify your claim." />
      <Button Style="Primary" Label="I've collected my item" onClick={() => { setCollected(true); go('returned'); }} State={collected ? 'Disabled' : 'Default'} />
    </Phone>
  );
}

/* ───────────── M7 · Return confirmation ───────────── */

function Returned() {
  return (
    <Phone tab="Activity">
      <div className="success"><Icon Name="check" Size="3xl" /></div>
      <div className="center stack">
        <h1>Item returned</h1>
        <p className="muted">Your wallet is back with you. Thanks for using Lemonade Found.</p>
      </div>
      <div className="card">
        <div className="row row--between" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3>Handover summary</h3>
          <StatusBadge Status="Returned" />
        </div>
        <div className="kv"><span>Case</span><span>{featuredCase.id}</span></div>
        <div className="kv"><span>Item</span><span>{featuredCase.item}</span></div>
        <div className="kv"><span>Handover point</span><span>{featuredCase.pickupPoint}</span></div>
        <div className="kv"><span>Date</span><span>Today, 14:20</span></div>
        <div className="kv"><span>Verified by</span><span>Station staff</span></div>
      </div>
      <Callout Type="Privacy" Title="Your details are now closed" Body="Proof you shared is no longer visible to staff." />
      <Button Style="Primary" Label="Back to home" onClick={() => go('home')} />
      <Button Style="Outline" Label="Report another item" onClick={() => go('report')} />
    </Phone>
  );
}

function Missing() {
  return (
    <Phone tab="Home">
      <h1>We can&apos;t find that</h1>
      <p className="muted">It may have been returned or removed.</p>
      <Button Style="Primary" Label="Back to home" onClick={() => go('home')} />
    </Phone>
  );
}

export function App() {
  const hash = useHash();
  const [route, arg = ''] = hash.split('/');
  switch (route) {
    case 'search':
      return <Search />;
    case 'report':
      return <Report />;
    case 'item':
      return <ItemDetails id={arg} />;
    case 'claim':
      return <Claim id={arg} />;
    case 'track':
      return <Track id={arg} />;
    case 'returned':
      return <Returned />;
    case 'profile':
      return <Missing />;
    default:
      return <Home />;
  }
}
