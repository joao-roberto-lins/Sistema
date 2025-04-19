import React, { useState, useRef } from 'react';
import { useProjects } from '../context/ProjectContext';
import { SaveIcon, AlertCircle, Upload, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProjectRegistration: React.FC = () => {
  const { addProject } = useProjects();
  const { isAuthenticated } = useAuth();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    area: '',
    progress: '',
    description: '',
    currentStatus: '',
    notes: '',
    imageUrl: '',
    pdfUrl: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);

  const validateForm = () => {
    if (!isAuthenticated) {
      setErrors({ auth: 'Você precisa estar autenticado para cadastrar projetos' });
      return false;
    }

    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'O nome do projeto é obrigatório';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'O local da obra é obrigatório';
    }
    
    if (!formData.area || Number(formData.area) <= 0) {
      newErrors.area = 'A área construída deve ser um número positivo';
    }
    
    if (!formData.progress || Number(formData.progress) < 0 || Number(formData.progress) > 100) {
      newErrors.progress = 'A porcentagem deve estar entre 0 e 100';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'A descrição do que está sendo construído é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        const imageUrl = URL.createObjectURL(file);
        setFormData(prev => ({ ...prev, imageUrl }));
      } else {
        setErrors(prev => ({ ...prev, image: 'Por favor, selecione uma imagem válida' }));
      }
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setSelectedPdf(file);
        const pdfUrl = URL.createObjectURL(file);
        setFormData(prev => ({ ...prev, pdfUrl }));
      } else {
        setErrors(prev => ({ ...prev, pdf: 'Por favor, selecione um arquivo PDF válido' }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      addProject({
        name: formData.name,
        location: formData.location,
        area: Number(formData.area),
        progress: Number(formData.progress),
        description: formData.description,
        currentStatus: formData.currentStatus,
        notes: formData.notes,
        imageUrl: formData.imageUrl,
        pdfUrl: formData.pdfUrl
      });
      
      setFormData({
        name: '',
        location: '',
        area: '',
        progress: '',
        description: '',
        currentStatus: '',
        notes: '',
        imageUrl: '',
        pdfUrl: ''
      });
      
      setSelectedImage(null);
      setSelectedPdf(null);
      if (imageInputRef.current) imageInputRef.current.value = '';
      if (pdfInputRef.current) pdfInputRef.current.value = '';
      
      setSuccessMessage('Projeto cadastrado com sucesso!');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Você precisa estar autenticado para cadastrar projetos.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="px-6 py-4 bg-blue-600">
        <h3 className="text-lg font-medium text-white">Cadastro de Projeto</h3>
      </div>
      
      {successMessage && (
        <div className="m-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome do projeto *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Local da obra *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
          </div>
          
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
              Área construída (m²) *
            </label>
            <input
              type="number"
              id="area"
              name="area"
              min="0"
              step="0.01"
              value={formData.area}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.area ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.area && <p className="mt-1 text-sm text-red-600">{errors.area}</p>}
          </div>
          
          <div>
            <label htmlFor="progress" className="block text-sm font-medium text-gray-700 mb-1">
              Porcentagem de andamento (%) *
            </label>
            <input
              type="number"
              id="progress"
              name="progress"
              min="0"
              max="100"
              value={formData.progress}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.progress ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.progress && <p className="mt-1 text-sm text-red-600">{errors.progress}</p>}
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            O que está sendo construído *
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>
        
        <div>
          <label htmlFor="currentStatus" className="block text-sm font-medium text-gray-700 mb-1">
            Situação atual da obra
          </label>
          <textarea
            id="currentStatus"
            name="currentStatus"
            rows={3}
            value={formData.currentStatus}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Observações
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagem do projeto
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Carregar imagem</span>
                    <input
                      id="image-upload"
                      name="image-upload"
                      type="file"
                      ref={imageInputRef}
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG até 10MB</p>
              </div>
            </div>
            {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
            {selectedImage && (
              <div className="mt-2">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="h-20 w-20 object-cover rounded-md"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Arquivo PDF
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="pdf-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Carregar PDF</span>
                    <input
                      id="pdf-upload"
                      name="pdf-upload"
                      type="file"
                      ref={pdfInputRef}
                      className="sr-only"
                      accept="application/pdf"
                      onChange={handlePdfChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PDF até 10MB</p>
              </div>
            </div>
            {errors.pdf && <p className="mt-1 text-sm text-red-600">{errors.pdf}</p>}
            {selectedPdf && (
              <p className="mt-2 text-sm text-gray-600">
                PDF selecionado: {selectedPdf.name}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <SaveIcon className="h-5 w-5 mr-2" />
            Salvar projeto
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectRegistration;