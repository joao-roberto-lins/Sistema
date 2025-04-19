import React from 'react';
import { Project } from '../types/Project';
import { FileText } from 'lucide-react';

interface ProjectDetailsProps {
  project: Project;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-1">Nome do projeto</h4>
          <p className="text-base text-gray-900">{project.name}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-1">Local da obra</h4>
          <p className="text-base text-gray-900">{project.location}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-1">Área construída</h4>
          <p className="text-base text-gray-900">{project.area} m²</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-1">Porcentagem de andamento</h4>
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
            <span className="text-base text-gray-900">{project.progress}%</span>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-1">O que está sendo construído</h4>
        <p className="text-base text-gray-900 whitespace-pre-line">{project.description}</p>
      </div>
      
      {project.currentStatus && (
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-1">Situação atual da obra</h4>
          <p className="text-base text-gray-900 whitespace-pre-line">{project.currentStatus}</p>
        </div>
      )}
      
      {project.notes && (
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-1">Observações</h4>
          <p className="text-base text-gray-900 whitespace-pre-line">{project.notes}</p>
        </div>
      )}

      {project.imageUrl && (
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-1">Imagem do projeto</h4>
          <img
            src={project.imageUrl}
            alt="Imagem do projeto"
            className="mt-2 max-w-full h-auto rounded-lg shadow-md"
          />
        </div>
      )}

      {project.pdfUrl && (
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-1">Arquivo PDF</h4>
          <a
            href={project.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FileText className="h-5 w-5 mr-2 text-gray-500" />
            Visualizar PDF
          </a>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 pt-4 border-t border-gray-200">
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-1">Data de criação</h4>
          <p className="text-base text-gray-900">{formatDate(project.createdAt)}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-1">Última atualização</h4>
          <p className="text-base text-gray-900">{formatDate(project.updatedAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;