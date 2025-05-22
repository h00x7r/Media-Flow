// src/lib/types.ts
import type { ProjectStatus } from "./constants";

export interface Project {
  id: string;
  name: string;
  description: string;
  clientName: string;
  type: 'Photography' | 'Design' | 'Hybrid';
  status: ProjectStatus;
  dueDate?: string; // ISO string or formatted date
  createdAt: string; // ISO string or formatted date
  coverImage?: string; // URL
  proofs?: Proof[];
}

export interface Proof {
  id: string;
  fileName: string;
  fileUrl: string; // URL to the image/document
  uploadedAt: string;
  feedback?: Feedback[];
  status: 'Pending Review' | 'Approved' | 'Revisions Requested';
}

export interface Feedback {
  id: string;
  comment: string;
  commenterName: string; // Could be client name or internal team member
  createdAt: string;
}

export interface MoodBoard {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  coverImage?: string; // URL of one of the images
  images: MoodBoardImage[];
}

export interface MoodBoardImage {
  id: string;
  url: string;
  altText?: string;
  addedAt: string;
  notes?: string;
}
