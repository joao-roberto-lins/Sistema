import { Project } from '../types/Project';

export const generatePDF = (project: Project) => {
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Por favor, permita popups para gerar o PDF do projeto');
    return;
  }
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const documentNumber = `DOC-${project.id.split('-')[1]}`;
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Projeto: ${project.name}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 40px;
          color: #333;
        }
        .header {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #2563eb;
        }
        .header-content {
          text-align: left;
        }
        .header h1 {
          color: #1e40af;
          margin: 0 0 10px 0;
          font-size: 24px;
        }
        .header h2 {
          color: #1e40af;
          margin: 0;
          font-size: 20px;
        }
        .document-info {
          margin: 20px 0;
          padding: 10px;
          background: #f8fafc;
          border-radius: 8px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section h3 {
          color: #1e40af;
          font-size: 18px;
          margin-bottom: 10px;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 5px;
        }
        .section p {
          margin: 5px 0;
          line-height: 1.6;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        .progress-container {
          width: 100%;
          height: 20px;
          background-color: #e5e7eb;
          border-radius: 10px;
          overflow: hidden;
          margin-top: 10px;
        }
        .progress-bar {
          height: 100%;
          background-color: #2563eb;
          border-radius: 10px;
        }
        .footer {
          margin-top: 50px;
          text-align: right;
          font-size: 14px;
          color: #64748b;
          border-top: 2px solid #2563eb;
          padding-top: 20px;
        }
        .image {
          max-width: 100%;
          height: auto;
          margin: 20px 0;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
        @media print {
          body {
            padding: 20px;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="header-content">
          <h1>Prefeitura Municipal de Cerro Azul</h1>
          <h2>Sistema de Gestão de Obras</h2>
          <div class="document-info">
            <p>Documento Nº: ${documentNumber}</p>
            <p>Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </div>
      
      <div class="section">
        <h3>Informações do Projeto</h3>
        <div class="grid">
          <div>
            <p><strong>Nome do projeto:</strong><br/>${project.name}</p>
          </div>
          <div>
            <p><strong>Local da obra:</strong><br/>${project.location}</p>
          </div>
        </div>
        <div class="grid">
          <div>
            <p><strong>Área construída:</strong><br/>${project.area} m²</p>
          </div>
          <div>
            <p><strong>Progresso da obra:</strong><br/>${project.progress}%</p>
            <div class="progress-container">
              <div class="progress-bar" style="width: ${project.progress}%"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="section">
        <h3>Detalhes da Construção</h3>
        <p><strong>O que está sendo construído:</strong><br/>${project.description.replace(/\n/g, '<br/>')}</p>
      </div>
      
      ${project.currentStatus ? `
      <div class="section">
        <h3>Situação Atual</h3>
        <p>${project.currentStatus.replace(/\n/g, '<br/>')}</p>
      </div>
      ` : ''}
      
      ${project.notes ? `
      <div class="section">
        <h3>Observações</h3>
        <p>${project.notes.replace(/\n/g, '<br/>')}</p>
      </div>
      ` : ''}
      
      ${project.imageUrl ? `
      <div class="section">
        <h3>Imagem do Projeto</h3>
        <img src="${project.imageUrl}" alt="Imagem do projeto" class="image"/>
      </div>
      ` : ''}
      
      <div class="section">
        <h3>Informações Adicionais</h3>
        <p><strong>Data de criação:</strong> ${formatDate(project.createdAt)}</p>
        <p><strong>Última atualização:</strong> ${formatDate(project.updatedAt)}</p>
      </div>
      
      <div class="footer">
        <p>João Roberto Lins</p>
        <p>Técnico em Edificações</p>
        <p>Sistema de Gestão de Obras de Cerro Azul-PR</p>
      </div>
      
      <div class="no-print" style="text-align: center; margin-top: 30px;">
        <button onclick="window.print()" style="padding: 10px 20px; background-color: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Imprimir / Salvar como PDF
        </button>
      </div>
    </body>
    </html>
  `);
  
  printWindow.document.close();
};