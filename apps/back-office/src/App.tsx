import { useState, type ReactNode } from 'react';
import {
  Avatar,
  Button,
  Callout,
  DialogBox,
  FilterChip,
  Icon,
  IconButton,
  Pagination,
  SearchField,
  Sidebar,
  StatCard,
  StatusBadge,
  Table,
  TableRow,
  TimelineStep,
  type SidebarActive,
  type StatusBadgeStatus,
} from '@may_thet_htar_aung/lemonade-design-system';
import { claims, featuredCase, handovers, matches, reports, users, venues, weeklyReports } from '@shared/data';
import { photoFor } from '@shared/images';
import { useHash } from './useHash';

const go = (to: string) => {
  window.location.hash = to;
};

const ROUTES: { hash: string; active: SidebarActive }[] = [
  { hash: 'dashboard', active: 'Dashboard' },
  { hash: 'reports', active: 'Reports' },
  { hash: 'matches', active: 'Matches' },
  { hash: 'claims', active: 'Claims' },
  { hash: 'users-venues', active: 'Users & Venues' },
  { hash: 'handovers', active: 'Handovers' },
];

function Layout({
  active,
  title,
  subtitle,
  children,
}: {
  active: SidebarActive;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="layout">
      <Sidebar Active={active} />
      <div className="main">
        <header className="topbar">
          <div>
            <h1>{title}</h1>
            <p className="muted">{subtitle}</p>
          </div>
          <div className="topbar__tools">
            <SearchField Placeholder="Search cases, items, people" aria-label="Search" />
            <IconButton Style="Outline" aria-label="Notifications, 3 unread" {...{ 'Show badge': true }} />
            <Avatar Size="Medium" Initials="AC" aria-label="Aye Chan" />
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}

/* ───────────── B1 · Dashboard ───────────── */

function Dashboard() {
  const max = Math.max(...weeklyReports.map((d) => d.value));
  return (
    <Layout active="Dashboard" title="Dashboard" subtitle="Central Station · overview for today">
      <div className="stats">
        <StatCard Label="Open reports" Value="128" Delta="+12 since yesterday" />
        <StatCard Label="Matches to review" Value="23" Delta="+4 since yesterday" />
        <StatCard Label="Claims waiting" Value="17" Delta="3 overdue" />
        <StatCard Label="Returned this week" Value="42" Delta="+9 vs last week" />
      </div>
      <div className="panels">
        <section className="card">
          <div className="row row--between">
            <h3>Reports this week</h3>
            <span className="muted">Last 7 days</span>
          </div>
          <div className="bars" role="img" aria-label="Reports per day, last 7 days">
            {weeklyReports.map((d) => (
              <div className="bar" key={d.day}>
                <span>{d.value}</span>
                <div className="bar__fill" data-peak={d.value === max} style={{ height: `${(d.value / max) * 150}px` }} />
                <span className="muted">{d.day}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="card stack">
          <h3>Needs attention</h3>
          <button className="alert" onClick={() => go('claims')}>
            <StatusBadge Status="Claim Pending" />
            <strong>Claim LF-2038 waiting 52h</strong>
            <span className="muted">Owner verification overdue</span>
          </button>
          <button className="alert" onClick={() => go('matches')}>
            <StatusBadge Status="Potential Match" />
            <strong>Match LF-1982 / LF-2041</strong>
            <span className="muted">86% similarity · review needed</span>
          </button>
          <button className="alert" onClick={() => go('claims')}>
            <StatusBadge Status="Claim Pending" />
            <strong>Claim LF-2029 waiting 49h</strong>
            <span className="muted">Needs more proof from claimant</span>
          </button>
        </section>
      </div>
      <div className="row row--between">
        <h3>Recent reports</h3>
        <Button Style="Outline" Label="View all reports" onClick={() => go('reports')} />
      </div>
      <Table aria-label="Recent reports">
        {reports.slice(0, 6).map((r) => (
          <TableRow key={r.reference} Type="Body" Reference={r.reference} Item={r.item} Owner={r.owner} Location={r.location} Status={r.status} Action="Review" onClick={() => go('reports')} />
        ))}
      </Table>
    </Layout>
  );
}

/* ───────────── B2 · Reports ───────────── */

const FILTERS = ['All', 'Lost', 'Found', 'Potential Match', 'Claim Pending', 'Returned'] as const;
const PAGE_SIZE = 8;

function Reports() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  const [page, setPage] = useState(0);
  const rows = reports.filter((r) => filter === 'All' || r.status === filter);
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const shown = rows.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const from = rows.length ? page * PAGE_SIZE + 1 : 0;
  return (
    <Layout active="Reports" title="Reports" subtitle="All lost and found reports across venues">
      <div className="row row--between">
        <div className="chips">
          {FILTERS.map((f) => (
            <FilterChip
              key={f}
              Label={f}
              State={filter === f ? 'Active' : 'Default'}
              onClick={() => {
                setFilter(f);
                setPage(0);
              }}
            />
          ))}
        </div>
        <div className="row">
          <Button Style="Outline" Label="Export" />
          <Button Style="Primary" Label="New report" />
        </div>
      </div>
      <Table aria-label="Reports">
        {shown.map((r) => (
          <TableRow key={r.reference} Type="Body" Reference={r.reference} Item={r.item} Owner={r.owner} Location={r.location} Status={r.status} Action="Open" onClick={() => go(r.status === 'Potential Match' ? 'matches' : r.status === 'Claim Pending' ? 'claims' : 'reports')} />
        ))}
      </Table>
      <Pagination
        Position={page === 0 ? 'First' : page >= pages - 1 ? 'Last' : 'Middle'}
        Summary={`Showing ${from}–${Math.min(rows.length, (page + 1) * PAGE_SIZE)} of ${rows.length} reports`}
        onPrevious={() => setPage((p) => Math.max(0, p - 1))}
        onNext={() => setPage((p) => Math.min(pages - 1, p + 1))}
      />
    </Layout>
  );
}

/* ───────────── B3 · Match review ───────────── */

type Decision = 'pending' | 'approved' | 'rejected' | 'more';

function Matches() {
  const [selected, setSelected] = useState(0);
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const m = matches[selected];
  const [lostRef, foundRef] = m.pair.split(' / ');
  const decision = decisions[m.pair] ?? 'pending';
  const decide = (d: Decision) => setDecisions({ ...decisions, [m.pair]: d });
  const remaining = matches.filter((x) => (decisions[x.pair] ?? 'pending') === 'pending').length;
  const [lostName, foundName] = m.summary.split(' · ');

  return (
    <Layout active="Matches" title="Match review" subtitle="AI suggestions waiting for staff review">
      <div className="review">
        <section className="card">
          <h3>Suggested matches · {remaining + 19}</h3>
          <div className="queue">
            {matches.map((x, i) => (
              <button key={x.pair} className="queue__item" aria-pressed={i === selected} onClick={() => setSelected(i)}>
                <span className="queue__row"><span>{x.pair}</span><span>{x.score}%</span></span>
                <span className="muted">{x.summary}</span>
                <StatusBadge Status={decisions[x.pair] === 'approved' ? 'Verified' : decisions[x.pair] === 'rejected' ? 'Rejected' : (x.status as StatusBadgeStatus)} />
              </button>
            ))}
          </div>
        </section>
        <section className="stack">
          <div className="row row--between">
            <h3>{m.pair}</h3>
            <span className="row"><Icon Name="sparkle" Size="sm" /> {m.score}% similarity · AI suggestion</span>
          </div>
          <Callout Type="AI Match" Title="A suggestion, not proof" Body="Approve only after comparing the public details. Ownership is checked at the claim step." />
          <div className="compare">
            <div className="card">
              <div className="photo"><img src={photoFor(lostName)} alt={lostName} /></div>
              <div className="row row--between"><strong>Lost report · {lostRef}</strong><StatusBadge Status="Lost" /></div>
              <div className="kv"><span>Item</span><span>{lostName}</span></div>
              <div className="kv"><span>Category</span><span>Wallet</span></div>
              <div className="kv"><span>Last seen</span><span>Central Station area</span></div>
              <div className="kv"><span>Date</span><span>Yesterday, evening</span></div>
              <div className="kv"><span>Private details</span><span className="locked"><Icon Name="lock" Size="sm" /> Hidden until claim</span></div>
            </div>
            <div className="card">
              <div className="photo"><img src={photoFor(foundName)} alt={foundName} /></div>
              <div className="row row--between"><strong>Found item · {foundRef}</strong><StatusBadge Status="Found" /></div>
              <div className="kv"><span>Item</span><span>{foundName}</span></div>
              <div className="kv"><span>Category</span><span>Wallet</span></div>
              <div className="kv"><span>Found at</span><span>Central Station, gate 4</span></div>
              <div className="kv"><span>Date</span><span>Today, 08:40</span></div>
              <div className="kv"><span>Private details</span><span className="locked"><Icon Name="lock" Size="sm" /> Hidden until claim</span></div>
            </div>
          </div>
          {decision === 'pending' ? (
            <div className="row">
              <Button Style="Primary" Label="Approve for claim" onClick={() => { decide('approved'); }} />
              <Button Style="Outline" Label="Needs more info" onClick={() => decide('more')} />
              <Button Style="Ghost" Label="Not a match" onClick={() => decide('rejected')} />
            </div>
          ) : (
            <Callout
              Type="AI Match"
              Title={decision === 'approved' ? 'Approved for claim' : decision === 'rejected' ? 'Marked as not a match' : 'More information requested'}
              Body={decision === 'approved' ? 'The owner can now submit a claim. Review it under Claims.' : 'You can change this decision by choosing another match.'}
            />
          )}
          {decision === 'approved' && <div><Button Style="Primary" Label="Go to claims" onClick={() => go('claims')} /></div>}
        </section>
      </div>
    </Layout>
  );
}

/* ───────────── B4 · Claims verification ───────────── */

type CheckState = 'Claim Pending' | 'Verified' | 'Rejected';

function Claims() {
  const [selected, setSelected] = useState(0);
  const [checks, setChecks] = useState<Record<string, CheckState[]>>({});
  const [dialog, setDialog] = useState(false);
  const [outcome, setOutcome] = useState<Record<string, 'approved' | 'rejected'>>({});
  const c = claims[selected];
  const rows = [
    ['Contents', 'Student card, transit pass, two bank cards'],
    ['Marks / serial', 'Initials “A.C.” inside flap'],
    ['Proof photo', 'Receipt dated Feb 2026'],
    ['Identity at handover', 'Photo ID + case code'],
  ];
  const state = checks[c.ref] ?? (c.ref === 'LF-2041' ? ['Verified', 'Verified', 'Claim Pending', 'Claim Pending'] : ['Claim Pending', 'Claim Pending', 'Claim Pending', 'Claim Pending']) as CheckState[];
  const cycle = (i: number) => {
    const order: CheckState[] = ['Claim Pending', 'Verified', 'Rejected'];
    const next = [...state];
    next[i] = order[(order.indexOf(state[i]) + 1) % order.length];
    setChecks({ ...checks, [c.ref]: next });
  };
  const allVerified = state.every((s) => s === 'Verified');
  const done = outcome[c.ref];

  return (
    <Layout active="Claims" title="Claims verification" subtitle="Check ownership answers against private details">
      <div className="review">
        <section className="card">
          <h3>Claims queue · 17</h3>
          <div className="queue">
            {claims.map((x, i) => (
              <button key={x.ref} className="queue__item" aria-pressed={i === selected} onClick={() => setSelected(i)}>
                <span className="queue__row"><span>{x.ref} · {x.claimant}</span></span>
                <span className="muted">{x.item} · {x.age}</span>
                <StatusBadge Status={outcome[x.ref] === 'approved' ? 'Verified' : outcome[x.ref] === 'rejected' ? 'Rejected' : (x.status as StatusBadgeStatus)} />
              </button>
            ))}
          </div>
        </section>
        <section className="stack">
          <div className="row row--between">
            <h3>Claim {c.ref} · {c.claimant}</h3>
            <StatusBadge Status={done === 'approved' ? 'Verified' : done === 'rejected' ? 'Rejected' : 'Claim Pending'} />
          </div>
          <Callout Type="Privacy" Title="Private details are visible to you only" Body="Every access to these details is logged." />
          <div className="card">
            <h3>Claimant answers vs private details</h3>
            {rows.map(([k, v], i) => (
              <div className="check" key={k}>
                <strong>{k}</strong>
                <span>{v}</span>
                <button onClick={() => cycle(i)} aria-label={`${k}: ${state[i]}. Click to change`}><StatusBadge Status={state[i]} /></button>
              </div>
            ))}
          </div>
          <Callout Type="AI Match" Title="Approval rests on your checks" Body="Mark each check, then approve. The owner confirms identity at handover." />
          {done ? (
            <div className="row">
              <Button Style="Primary" Label="Go to handovers" onClick={() => go('handovers')} />
            </div>
          ) : (
            <div className="row">
              <Button Style="Primary" Label="Approve claim" State={allVerified ? 'Default' : 'Disabled'} onClick={() => setDialog(true)} />
              <Button Style="Outline" Label="Request more proof" />
              <Button Style="Ghost" Label="Reject" onClick={() => setOutcome({ ...outcome, [c.ref]: 'rejected' })} />
            </div>
          )}
        </section>
      </div>
      <DialogBox
        open={dialog}
        Title="Approve this claim?"
        Body="The owner will be told where and when to collect the item."
        ConfirmLabel="Approve claim"
        onCancel={() => setDialog(false)}
        onConfirm={() => {
          setOutcome({ ...outcome, [c.ref]: 'approved' });
          setDialog(false);
        }}
      />
    </Layout>
  );
}

/* ───────────── B5 · Users & venues ───────────── */

function UsersVenues() {
  const [tab, setTab] = useState<'All' | 'Users' | 'Venues'>('All');
  return (
    <Layout active="Users & Venues" title="Users & venues" subtitle="Manage staff access and partner venues">
      <div className="row row--between">
        <div className="chips">
          {(['All', 'Users', 'Venues'] as const).map((t) => (
            <FilterChip key={t} Label={t} State={tab === t ? 'Active' : 'Default'} onClick={() => setTab(t)} />
          ))}
        </div>
        <div className="row">
          <Button Style="Outline" Label="Invite user" />
          <Button Style="Primary" Label="Add venue" />
        </div>
      </div>
      {tab !== 'Venues' && (
        <>
          <h3>Users</h3>
          <Table aria-label="Users">
            {users.map((u) => (
              <TableRow key={u.name} Type="Body" Reference={u.name} Item={u.role} Owner={u.venue} Location="Staff" Status={u.status} Action="Edit" />
            ))}
          </Table>
        </>
      )}
      {tab !== 'Users' && (
        <>
          <h3>Venues</h3>
          <Table aria-label="Venues">
            {venues.map((v) => (
              <TableRow key={v.name} Type="Body" Reference={v.name} Item={v.type} Owner={v.contact} Location={v.open} Status="Verified" Action="Manage" />
            ))}
          </Table>
        </>
      )}
    </Layout>
  );
}

/* ───────────── B6 · Handovers ───────────── */

function Handovers() {
  const [selected, setSelected] = useState(0);
  const [returned, setReturned] = useState<Record<string, boolean>>({});
  const h = handovers[selected];
  const isReturned = h.status === 'Returned' || returned[h.ref];
  return (
    <Layout active="Handovers" title="Handover tracking" subtitle="Verified owners collecting their items">
      <div className="stats">
        <StatCard Label="Scheduled today" Value="6" Delta="2 in the next hour" />
        <StatCard Label="Awaiting pickup" Value="9" Delta="+1 since yesterday" />
        <StatCard Label="Returned this week" Value="42" Delta="+9 vs last week" />
        <StatCard Label="Missed windows" Value="2" Delta="Follow up today" />
      </div>
      <Table aria-label="Handovers">
        {handovers.map((x, i) => (
          <TableRow key={x.ref} Type="Body" Reference={x.ref} Item={x.item} Owner={x.owner} Location={x.point} Status={returned[x.ref] ? 'Returned' : x.status} Action="Select" onClick={() => setSelected(i)} />
        ))}
      </Table>
      <div className="panels">
        <section className="card stack">
          <div className="row row--between">
            <h3>{h.ref} · {h.item}</h3>
            <StatusBadge Status={isReturned ? 'Returned' : (h.status as StatusBadgeStatus)} />
          </div>
          <div>
            <div className="kv"><span>Owner</span><span>{h.owner}</span></div>
            <div className="kv"><span>Pickup point</span><span>{h.point}</span></div>
            <div className="kv"><span>Window</span><span>{h.window}</span></div>
            <div className="kv"><span>ID required</span><span>{featuredCase.idRequired}</span></div>
          </div>
          <Callout Type="Privacy" Title="Check ID before handing over" Body="Match the photo ID and the case code, then confirm the return." />
          <div className="row">
            <Button Style="Primary" Label={isReturned ? 'Returned' : 'Confirm return'} State={isReturned ? 'Disabled' : 'Default'} onClick={() => setReturned({ ...returned, [h.ref]: true })} />
            <Button Style="Outline" Label="Reschedule" />
          </div>
        </section>
        <section className="card">
          <h3>Handover timeline</h3>
          <ol className="timeline">
            <TimelineStep State="Done" Title="Claim approved" Subtitle="Today, 10:05" />
            <TimelineStep State="Done" Title="Owner notified" Subtitle="Today, 10:06" />
            <TimelineStep State={isReturned ? 'Done' : 'Current'} Title="Owner collects the item" Subtitle={h.window} />
            <TimelineStep State={isReturned ? 'Done' : 'Upcoming'} Title="Return confirmed" Subtitle="Case closed" {...{ 'Show line': false }} />
          </ol>
        </section>
      </div>
    </Layout>
  );
}

export function App() {
  const hash = useHash();
  const route = ROUTES.find((r) => r.hash === hash.split('/')[0])?.hash ?? 'dashboard';
  switch (route) {
    case 'reports':
      return <Reports />;
    case 'matches':
      return <Matches />;
    case 'claims':
      return <Claims />;
    case 'users-venues':
      return <UsersVenues />;
    case 'handovers':
      return <Handovers />;
    default:
      return <Dashboard />;
  }
}
