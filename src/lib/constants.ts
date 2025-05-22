// src/lib/constants.ts
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Briefcase, Image as ImageIcon, Palette, Users } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  subItems?: NavItem[];
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: Briefcase },
  { href: '/mood-boards', label: 'Mood Boards', icon: ImageIcon },
  { href: '/style-guide', label: 'AI Style Guide', icon: Palette },
  // Client Proofing will be integrated into Projects page.
];

export type ProjectStatus = 'Planning' | 'In Progress' | 'Awaiting Feedback' | 'Revisions' | 'Completed' | 'On Hold';

export const PROJECT_STATUSES: ProjectStatus[] = [
  'Planning',
  'In Progress',
  'Awaiting Feedback',
  'Revisions',
  'Completed',
  'On Hold',
];

export const MOCK_CLIENTS = [
  { id: 'client-1', name: 'Elegant Events Co.' },
  { id: 'client-2', name: 'Modern Designs Inc.' },
  { id: 'client-3', name: 'Sunrise Weddings' },
  { id: 'client-4', name: 'Apex Advertising' },
];
