import type { StatusBadgeStatus } from '@may_thet_htar_aung/lemonade-design-system';

export type Item = {
  id: string;
  title: string;
  kind: 'Lost' | 'Found';
  category: string;
  place: string;
  when: string;
  ago: string;
  heldAt: string;
  description: string;
  status: StatusBadgeStatus;
};

/** Public listings. Private ownership details are never part of this data. */
export const items: Item[] = [
  {
    id: 'LF-2041',
    title: 'Black leather wallet',
    kind: 'Found',
    category: 'Wallet',
    place: 'Central Station, gate 4',
    when: 'Today, 08:40',
    ago: '2h ago',
    heldAt: 'Lost-property desk',
    description: 'Found near gate 4 and handed to the lost-property desk.',
    status: 'Found',
  },
  {
    id: 'LF-2039',
    title: 'Grey umbrella',
    kind: 'Found',
    category: 'Other',
    place: 'Riverside Library',
    when: 'Today, 07:15',
    ago: '3h ago',
    heldAt: 'Library front desk',
    description: 'Left by the reading room entrance.',
    status: 'Found',
  },
  {
    id: 'LF-2035',
    title: 'Black phone',
    kind: 'Found',
    category: 'Electronics',
    place: 'Tram line 7, Market stop',
    when: 'Yesterday, 18:20',
    ago: '1d ago',
    heldAt: 'Transit lost-property office',
    description: 'Screen is cracked. Handed in by the driver.',
    status: 'Potential Match',
  },
  {
    id: 'LF-2034',
    title: 'Reading glasses',
    kind: 'Found',
    category: 'Accessories',
    place: 'City Park café',
    when: 'Yesterday, 14:05',
    ago: '1d ago',
    heldAt: 'Café counter',
    description: 'Dark frame in a brown case.',
    status: 'Found',
  },
  {
    id: 'LF-2033',
    title: 'Brown backpack',
    kind: 'Found',
    category: 'Bags',
    place: 'Central Station, platform 2',
    when: 'Yesterday, 09:30',
    ago: '1d ago',
    heldAt: 'Lost-property desk',
    description: 'Left on a bench on platform 2.',
    status: 'Found',
  },
  {
    id: 'LF-2031',
    title: 'Wireless earbuds case',
    kind: 'Found',
    category: 'Electronics',
    place: 'Northgate Mall, food court',
    when: '2 days ago',
    ago: '2d ago',
    heldAt: 'Mall information desk',
    description: 'White charging case, no earbuds inside.',
    status: 'Claim Pending',
  },
  {
    id: 'LF-1982',
    title: 'Black wallet',
    kind: 'Lost',
    category: 'Wallet',
    place: 'Central Station area',
    when: 'Yesterday, evening',
    ago: '1d ago',
    heldAt: '—',
    description: 'Lost on the way to the evening train.',
    status: 'Lost',
  },
  {
    id: 'LF-1990',
    title: 'Grey umbrella',
    kind: 'Lost',
    category: 'Other',
    place: 'Riverside Library area',
    when: 'Yesterday, afternoon',
    ago: '1d ago',
    heldAt: '—',
    description: 'Folding umbrella with a wooden handle.',
    status: 'Lost',
  },
];

export const foundItems = items.filter((i) => i.kind === 'Found');
export const categories = ['Wallet', 'Electronics', 'Bags', 'Accessories', 'Other'];

export const featuredCase = {
  id: 'LF-2041',
  item: 'Black leather wallet',
  owner: 'Aye Chan',
  pickupPoint: 'Central Station desk',
  window: 'Today, 14:00–16:00',
  idRequired: 'Photo ID + case code',
  staffContact: 'Station lost-property staff',
};

export type Step = {
  state: 'Upcoming' | 'Current' | 'Done' | 'Event';
  title: string;
  subtitle: string;
};

/** The recovery journey for case LF-2041, shared by the website and the mobile app. */
export const recoverySteps: Step[] = [
  { state: 'Done', title: 'Report received', subtitle: 'Today, 08:40' },
  { state: 'Done', title: 'Possible match found', subtitle: 'Today, 09:10' },
  { state: 'Done', title: 'Claim submitted', subtitle: 'Today, 09:42' },
  { state: 'Current', title: 'Staff verifying ownership', subtitle: 'In progress' },
  { state: 'Upcoming', title: 'Handover scheduled', subtitle: 'After verification' },
  { state: 'Upcoming', title: 'Item returned', subtitle: 'Confirmed at the desk' },
];

/** Back Office data. */
export const reports = [
  { reference: 'LF-2041', item: 'Black leather wallet', owner: 'Found · Station desk', location: 'Central Station', status: 'Claim Pending' },
  { reference: 'LF-2039', item: 'Grey umbrella', owner: 'Found · Library desk', location: 'Riverside Library', status: 'Found' },
  { reference: 'LF-2038', item: 'Wireless earbuds case', owner: 'Kyaw Zin', location: 'Northgate Mall', status: 'Claim Pending' },
  { reference: 'LF-2035', item: 'Black phone', owner: 'Found · Transit office', location: 'Market stop', status: 'Potential Match' },
  { reference: 'LF-2034', item: 'Reading glasses', owner: 'Found · Café counter', location: 'City Park', status: 'Found' },
  { reference: 'LF-2029', item: 'Reading glasses', owner: 'Hnin Wai', location: 'City Park café', status: 'Claim Pending' },
  { reference: 'LF-2022', item: 'Brown backpack', owner: 'Mya Thandar', location: 'Central Station', status: 'Verified' },
  { reference: 'LF-2017', item: 'Blue water bottle', owner: 'Found · Gym desk', location: 'Eastside Gym', status: 'Returned' },
  { reference: 'LF-2009', item: 'Silver watch', owner: 'Found · Hotel desk', location: 'Harbour Hotel', status: 'Rejected' },
  { reference: 'LF-2003', item: 'Phone, cracked', owner: 'Zaw Min', location: 'Tram line 7', status: 'Lost' },
  { reference: 'LF-1990', item: 'Grey umbrella', owner: 'Su Su', location: 'Riverside Library', status: 'Lost' },
  { reference: 'LF-1982', item: 'Black wallet', owner: 'Aye Chan', location: 'Central Station', status: 'Lost' },
] as const;

export const weeklyReports = [
  { day: 'Mon', value: 12 },
  { day: 'Tue', value: 17 },
  { day: 'Wed', value: 14 },
  { day: 'Thu', value: 22 },
  { day: 'Fri', value: 19 },
  { day: 'Sat', value: 9 },
  { day: 'Sun', value: 15 },
];

export const matches = [
  { pair: 'LF-1982 / LF-2041', summary: 'Black wallet · Black leather wallet', score: 86, status: 'Potential Match' },
  { pair: 'LF-1990 / LF-2039', summary: 'Grey umbrella · Grey umbrella', score: 81, status: 'Potential Match' },
  { pair: 'LF-2003 / LF-2035', summary: 'Phone, cracked · Black phone', score: 74, status: 'Potential Match' },
  { pair: 'LF-2011 / LF-2034', summary: 'Glasses · Reading glasses', score: 69, status: 'Potential Match' },
] as const;

export const claims = [
  { ref: 'LF-2041', claimant: 'Aye Chan', item: 'Black leather wallet', age: '2h ago', status: 'Claim Pending' },
  { ref: 'LF-2038', claimant: 'Kyaw Zin', item: 'Wireless earbuds case', age: '52h ago', status: 'Claim Pending' },
  { ref: 'LF-2029', claimant: 'Hnin Wai', item: 'Reading glasses', age: '49h ago', status: 'Claim Pending' },
  { ref: 'LF-2022', claimant: 'Mya Thandar', item: 'Brown backpack', age: '3 days ago', status: 'Verified' },
] as const;

export const users = [
  { name: 'Aye Chan', role: 'Admin', venue: 'Central Station desk', status: 'Verified' },
  { name: 'Thura Win', role: 'Staff', venue: 'Central Station desk', status: 'Verified' },
  { name: 'Hnin Wai', role: 'Staff', venue: 'Riverside Library', status: 'Verified' },
  { name: 'Kyaw Zin', role: 'Staff', venue: 'Northgate Mall', status: 'Claim Pending' },
  { name: 'Mya Thandar', role: 'Viewer', venue: 'City Park café', status: 'Verified' },
] as const;

export const venues = [
  { name: 'Central Station desk', type: 'Transit', contact: 'Thura Win', open: '24 items' },
  { name: 'Riverside Library', type: 'Public building', contact: 'Hnin Wai', open: '9 items' },
  { name: 'Northgate Mall', type: 'Retail', contact: 'Kyaw Zin', open: '14 items' },
  { name: 'City Park café', type: 'Hospitality', contact: 'Mya Thandar', open: '5 items' },
  { name: 'Transit lost-property office', type: 'Transit', contact: 'Zaw Min', open: '31 items' },
] as const;

export const handovers = [
  { ref: 'LF-2041', item: 'Black leather wallet', owner: 'Aye Chan', point: 'Central Station desk', window: 'Today, 14:00–16:00', status: 'Verified' },
  { ref: 'LF-2022', item: 'Brown backpack', owner: 'Mya Thandar', point: 'Central Station desk', window: 'Today, 11:00–12:00', status: 'Returned' },
  { ref: 'LF-2017', item: 'Blue water bottle', owner: 'Ko Lin', point: 'Eastside Gym', window: 'Yesterday', status: 'Returned' },
  { ref: 'LF-2029', item: 'Reading glasses', owner: 'Hnin Wai', point: 'City Park café', window: 'Tomorrow, 10:00', status: 'Claim Pending' },
] as const;
