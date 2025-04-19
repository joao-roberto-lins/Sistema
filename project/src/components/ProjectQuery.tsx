import React, { useState, useEffect } from 'react';
import { useProjects } from '../context/ProjectContext';
import { Search, FileText, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { generatePDF } from '../utils/pdfGenerator';
import ProjectDetails from './ProjectDetails';
import { useAuth } from '../context/AuthContext';
import Login from './Login';

const ProjectQuery: React.FC = () => {
  const { projects, searchProjects, setCurrentProject, currentProject, deleteProject } = useProjects();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(projects);
  const [message, setMessage] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [actionType, setActionType] = useState<'delete' | 'edit' | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    setSearchResults(searchProjects(searchQuery));
  }, [searchQuery, projects, searchProjects]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const results = searchProjects(searchQuery);
    setSearchResults(results);
    
    if (results.length === 0) {
      setMessage('Nenhum projeto encontrado com este nome.');
    } else {
      setMessage('');
    }
  };

  const handleSelectProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProject(project);
    }
  };

  const handleEditProject = (projectId: string) => {
    if (!isAuthenticated) {
      setActionType('edit');
      setSelectedProjectId(projectId);
      setShowLoginModal(true);
      return;
    }
    // Implementation for edit will be added
    console.log('Edit project:', projectId);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!isAuthenticated) {
      setActionType('delete');
      setSelectedProjectId(projectId);
      setShowLoginModal(true);
      return;
    }

    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
      try {
        await deleteProject(projectId);
        if (currentProject?.id === projectId) {
          setCurrentProject(null);
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Erro ao excluir o projeto. Tente novamente.');
      }
    }
  };

  const handleLoginSuccess = async () => {
    setShowLoginModal(false);
    if (selectedProjectId && actionType === 'delete') {
      await handleDeleteProject(selectedProjectId);
    } else if (selectedProjectId && actionType === 'edit') {
      await handleEditProject(selectedProjectId);
    }
    setSelectedProjectId(null);
    setActionType(null);
  };

  const handleGeneratePDF = () => {
    if (currentProject) {
      generatePDF(currentProject);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="px-6 py-4 bg-blue-600">
            <h3 className="text-lg font-medium text-white">Consulta de Projeto</h3>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSearch} className="flex items-end space-x-4">
              <div className="flex-grow">
                <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do projeto
                </label>
                <input
                  type="text"
                  id="searchQuery"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Digite o nome do projeto..."
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <Search className="h-5 w-5 mr-2" />
                Buscar
              </button>
            </form>
            
            {message && (
              <div className="mt-4 p-3 bg-yellow-100 text-yellow-700 rounded-md flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                {message}
              </div>
            )}
            
            {searchResults.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Resultados da busca</h4>
                <div className="overflow-hidden rounded-md border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nome
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Local
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progresso
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {searchResults.map((project) => (
                        <tr key={project.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {project.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {project.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-blue-600 h-2.5 rounded-full" 
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-sm text-gray-500">{project.progress}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-4">
                              <button
                                onClick={() => handleSelectProject(project.id)}
                                className="text-blue-600 hover:text-blue-900 focus:outline-none"
                              >
                                Ver detalhes
                              </button>
                              <button
                                onClick={() => handleEditProject(project.id)}
                                className="text-yellow-600 hover:text-yellow-900 focus:outline-none flex items-center"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Editar
                              </button>
                              <button
                                onClick={() => handleDeleteProject(project.id)}
                                className="text-red-600 hover:text-red-900 focus:outline-none flex items-center"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {currentProject && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-blue-600 flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Detalhes do Projeto</h3>
              <button
                onClick={handleGeneratePDF}
                className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors duration-200"
              >
                <FileText className="h-4 w-4 mr-1" />
                Gerar PDF
              </button>
            </div>
            
            <div className="p-6">
              <ProjectDetails project={currentProject} />
            </div>
          </div>
        )}
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Autenticação necessária
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Para {actionType === 'delete' ? 'excluir' : 'editar'} um projeto, você precisa fazer login.
            </p>
            <Login onSuccess={handleLoginSuccess} />
            <button
              onClick={() => setShowLoginModal(false)}
              className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectQuery;