import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { Project } from '../types/Project';

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
  getProject: (id: string) => Project | undefined;
  searchProjects: (query: string) => Project[];
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  deleteProject: (id: string) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return;
    }

    setProjects(data.map(transformProjectFromDB));
  };

  const transformProjectFromDB = (dbProject: any): Project => ({
    id: dbProject.id,
    name: dbProject.name,
    location: dbProject.location,
    area: dbProject.area,
    progress: dbProject.progress,
    description: dbProject.description,
    currentStatus: dbProject.current_status || '',
    notes: dbProject.notes || '',
    imageUrl: dbProject.image_url,
    pdfUrl: dbProject.pdf_url,
    createdAt: new Date(dbProject.created_at),
    updatedAt: new Date(dbProject.updated_at),
    userId: dbProject.user_id
  });

  const transformProjectToDB = (project: Partial<Project>) => ({
    name: project.name,
    location: project.location,
    area: project.area,
    progress: project.progress,
    description: project.description,
    current_status: project.currentStatus,
    notes: project.notes,
    image_url: project.imageUrl,
    pdf_url: project.pdfUrl,
    user_id: user?.id
  });

  const addProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!isAuthenticated) {
      throw new Error('Authentication required');
    }

    const { error } = await supabase
      .from('projects')
      .insert(transformProjectToDB(projectData));

    if (error) {
      throw error;
    }

    await fetchProjects();
  };

  const updateProject = async (id: string, projectData: Partial<Project>) => {
    if (!isAuthenticated) {
      throw new Error('Authentication required');
    }

    const { error } = await supabase
      .from('projects')
      .update(transformProjectToDB(projectData))
      .eq('id', id);

    if (error) {
      throw error;
    }

    await fetchProjects();
  };

  const deleteProject = async (id: string) => {
    if (!isAuthenticated) {
      throw new Error('Authentication required');
    }

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    await fetchProjects();
  };

  const getProject = (id: string): Project | undefined => {
    return projects.find(project => project.id === id);
  };

  const searchProjects = (query: string): Project[] => {
    if (!query.trim()) return projects;
    
    const lowerCaseQuery = query.toLowerCase();
    return projects.filter(project => 
      project.name.toLowerCase().includes(lowerCaseQuery) ||
      project.location.toLowerCase().includes(lowerCaseQuery)
    );
  };

  return (
    <ProjectContext.Provider value={{ 
      projects, 
      addProject, 
      getProject, 
      searchProjects,
      currentProject,
      setCurrentProject,
      deleteProject,
      updateProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};