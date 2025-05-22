// src/lib/mock-data.ts
import type { Project, MoodBoard } from './types';
import { MOCK_CLIENTS } from './constants';

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Summer Wedding Gala',
    description: 'Full photography coverage for a large summer wedding event. Includes pre-wedding shoot, ceremony, and reception.',
    clientName: MOCK_CLIENTS[0].name,
    type: 'Photography',
    status: 'Planning',
    dueDate: '2024-08-15',
    createdAt: '2024-06-01',
    coverImage: 'https://placehold.co/600x400.png',
    proofs: [
      { id: 'proof-1-1', fileName: 'PreWedding_001.jpg', fileUrl: 'https://placehold.co/800x600.png', uploadedAt: '2024-07-20', status: 'Pending Review' },
      { id: 'proof-1-2', fileName: 'PreWedding_002.jpg', fileUrl: 'https://placehold.co/800x600.png', uploadedAt: '2024-07-20', status: 'Pending Review' }
    ]
  },
  {
    id: 'proj-2',
    name: 'Product Launch Campaign',
    description: 'Design all visual assets for a new tech product launch, including social media graphics, web banners, and print ads.',
    clientName: MOCK_CLIENTS[1].name,
    type: 'Design',
    status: 'Awaiting Feedback',
    dueDate: '2024-07-30',
    createdAt: '2024-05-15',
    coverImage: 'https://placehold.co/600x400.png',
    proofs: [
      { id: 'proof-2-1', fileName: 'SocialMediaAd_V1.png', fileUrl: 'https://placehold.co/1080x1080.png', uploadedAt: '2024-07-10', status: 'Revisions Requested',
        feedback: [{id: 'fb-2-1-1', comment: 'Please use a brighter blue for the CTA button.', commenterName: MOCK_CLIENTS[1].name, createdAt: '2024-07-12'}]
      }
    ]
  },
  {
    id: 'proj-3',
    name: 'Corporate Headshots',
    description: 'Professional headshots for 50 employees of a financial firm.',
    clientName: MOCK_CLIENTS[2].name,
    type: 'Photography',
    status: 'Completed',
    dueDate: '2024-07-10',
    createdAt: '2024-06-20',
    coverImage: 'https://placehold.co/600x400.png',
  },
  {
    id: 'proj-4',
    name: 'Restaurant Menu Redesign',
    description: 'Complete redesign of a local restaurant\'s menu, including layout and food photography.',
    clientName: MOCK_CLIENTS[3].name,
    type: 'Hybrid',
    status: 'In Progress',
    dueDate: '2024-09-01',
    createdAt: '2024-07-05',
    coverImage: 'https://placehold.co/600x400.png',
  },
];

export const MOCK_MOOD_BOARDS: MoodBoard[] = [
  {
    id: 'mood-1',
    name: 'Vintage Elegance Wedding',
    description: 'Inspiration for a classic, timeless wedding aesthetic with a vintage touch.',
    createdAt: '2024-06-10',
    coverImage: 'https://placehold.co/600x400.png',
    images: [
      { id: 'img-1-1', url: 'https://placehold.co/400x300.png', altText: 'Lace wedding dress', addedAt: '2024-06-10', dataAiHint: "wedding dress" },
      { id: 'img-1-2', url: 'https://placehold.co/400x300.png', altText: 'Antique floral centerpiece', addedAt: '2024-06-11', dataAiHint: "floral centerpiece" },
      { id: 'img-1-3', url: 'https://placehold.co/400x300.png', altText: 'Calligraphy invitation suite', addedAt: '2024-06-12', dataAiHint: "calligraphy invitation" },
    ],
  },
  {
    id: 'mood-2',
    name: 'Minimalist Tech Branding',
    description: 'Clean lines, muted colors, and modern typography for a tech startup.',
    createdAt: '2024-05-20',
    coverImage: 'https://placehold.co/600x400.png',
    images: [
      { id: 'img-2-1', url: 'https://placehold.co/400x300.png', altText: 'Abstract geometric pattern', addedAt: '2024-05-20', dataAiHint: "geometric pattern" },
      { id: 'img-2-2', url: 'https://placehold.co/400x300.png', altText: 'Monochromatic office interior', addedAt: '2024-05-21', dataAiHint: "office interior" },
    ],
  },
  {
    id: 'mood-3',
    name: 'Bohemian Desert Photoshoot',
    description: 'Warm earth tones, natural textures, and free-spirited vibes.',
    createdAt: '2024-07-01',
    coverImage: 'https://placehold.co/600x400.png',
    images: [
      { id: 'img-3-1', url: 'https://placehold.co/400x300.png', altText: 'Dried pampas grass arrangement', addedAt: '2024-07-01', dataAiHint: "pampas grass" },
      { id: 'img-3-2', url: 'https://placehold.co/400x300.png', altText: 'Macrame wall hanging', addedAt: '2024-07-02', dataAiHint: "macrame wall" },
      { id: 'img-3-3', url: 'https://placehold.co/400x300.png', altText: 'Sunset over sand dunes', addedAt: '2024-07-03', dataAiHint: "desert sunset" },
      { id: 'img-3-4', url: 'https://placehold.co/400x300.png', altText: 'Model in flowy dress', addedAt: '2024-07-04', dataAiHint: "flowy dress" },
    ],
  },
];

// Function to get a specific project by ID
export const getProjectById = (id: string): Project | undefined => {
  return MOCK_PROJECTS.find(project => project.id === id);
};

// Function to get a specific mood board by ID
export const getMoodBoardById = (id: string): MoodBoard | undefined => {
  return MOCK_MOOD_BOARDS.find(moodBoard => moodBoard.id === id);
};

// Helper to simulate adding a project (in a real app, this would be an API call)
export const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'coverImage'>): Project => {
  const newProject: Project = {
    ...project,
    id: `proj-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
    coverImage: 'https://placehold.co/600x400.png', // Default cover image
  };
  MOCK_PROJECTS.unshift(newProject); // Add to the beginning of the array
  return newProject;
};

// Helper to simulate adding a mood board
export const addMoodBoard = (moodBoard: Omit<MoodBoard, 'id' | 'createdAt' | 'coverImage' | 'images'>): MoodBoard => {
  const newMoodBoard: MoodBoard = {
    ...moodBoard,
    id: `mood-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
    coverImage: 'https://placehold.co/600x400.png',
    images: [],
  };
  MOCK_MOOD_BOARDS.unshift(newMoodBoard);
  return newMoodBoard;
};
