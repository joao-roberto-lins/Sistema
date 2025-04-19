export interface Project {
  id: string;
  name: string;
  location: string;
  area: number;
  progress: number;
  description: string;
  currentStatus: string;
  notes: string;
  imageUrl?: string;
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  username: string;
  password: string;
}

export const defaultUser: AuthUser = {
  username: 'admjoao',
  password: 'adm'
};