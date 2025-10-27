// Application State - Using in-memory storage (no localStorage)
let appState = {
  currentPlatform: 'microsoft_learn',
  certifications: {},
  editingId: null,
  deleteId: null
};

// Platform Information
const platformInfo = {
  microsoft_learn: {
    name: 'Microsoft Learn',
    color: '#0078D4',
    icon: '🔷',
    description: 'Microsoft Learn profiles podem ser incorporados usando iframe ou links diretos para páginas de transcrição'
  },
  google_skills: {
    name: 'Google Skills',
    color: '#4285F4',
    icon: '🔹',
    description: 'Google Skills profiles usam URLs de perfil público que podem ser vinculadas diretamente'
  },
  aws_skillbuilder: {
    name: 'AWS SkillBuilder',
    color: '#FF9900',
    icon: '🟧',
    description: 'AWS SkillBuilder profiles têm URLs públicas para compartilhar conquistas e certificações'
  },
  roadmapsh: {
    name: 'Roadmap.sh',
    color: '#7C3AED',
    icon: '🛣️',
    description: 'Roadmap.sh fornece incorporações de cartão HTML e Markdown para perfis do GitHub e sites'
  },
  custom: {
    name: 'Personalizado',
    color: '#6B7280',
    icon: '⭐',
    description: 'Crie cartões de certificação personalizados para qualquer plataforma'
  }
};

// Initialize with sample data
function initializeSampleData() {
  appState.certifications = {
    microsoft_learn: [
      {
        id: 'ms-1',
        title: 'Azure Fundamentals',
        description: 'Microsoft Azure Fundamentals certification covering cloud concepts, services, and solutions',
        url: 'https://learn.microsoft.com/pt-br/users/diogomendesneves-9530/transcript/dlmgfe8oy2x3k9v?tab=tab-started',
        date: '2024-01-15',
        status: 'Active',
        badge_url: 'https://learn.microsoft.com/pt-br/media/learn/certification/badges/microsoft-certified-fundamentals-badge.svg'
      },
      {
        id: 'ms-2',
        title: 'DevOps Engineer Expert',
        description: 'Microsoft Azure DevOps Solutions certification for implementing DevOps processes',
        url: 'https://learn.microsoft.com/certifications/devops-engineer',
        date: '2024-03-20',
        status: 'In Progress',
        badge_url: ''
      }
    ],
    google_skills: [
      {
        id: 'gs-1',
        title: 'Google Cloud Associate',
        description: 'Google Cloud Platform Associate Cloud Engineer certification',
        url: 'https://www.skills.google/public_profiles/ab0b5e96-2e96-4f19-8161-4da5a721e955',
        date: '2024-02-10',
        status: 'Active',
        badge_url: 'https://api.accredible.com/v1/frontend/credential_website_embed_image/badge/123456'
      }
    ],
    aws_skillbuilder: [
      {
        id: 'aws-1',
        title: 'AWS Cloud Practitioner',
        description: 'AWS Certified Cloud Practitioner foundational certification',
        url: 'https://skillsprofile.skillbuilder.aws/user/diogo-mendes-neves',
        date: '2024-01-30',
        status: 'Active',
        badge_url: 'https://images.credly.com/size/340x340/images/00634f82-b07f-4bbd-a6bb-53de397fc3a6/image.png'
      }
    ],
    roadmapsh: [
      {
        id: 'rm-1',
        title: 'Frontend Developer Roadmap',
        description: 'Completed frontend development learning path with progress tracking',
        url: 'https://roadmap.sh/u/diogomendesneves',
        date: '2024-04-01',
        status: 'In Progress',
        badge_url: 'https://roadmap.sh/card/wide/68e05fc0399d9064911d1bfb?variant=dark&roadmaps=',
        card_html: '<a href="https://roadmap.sh"><img src="https://roadmap.sh/card/wide/68e05fc0399d9064911d1bfb?variant=dark&roadmaps=" alt="roadmap.sh"/></a>',
        card_markdown: '[![roadmap.sh](https://roadmap.sh/card/wide/68e05fc0399d9064911d1bfb?variant=dark&roadmaps=)](https://roadmap.sh)'
      }
    ],
    custom: []
  };
}

// Initialize app
function initializeApp() {
  initializeSampleData();
  setupEventListeners();
  setupKeyboardShortcuts();
  renderCurrentView();
}

// Setup Event Listeners
function setupEventListeners() {
  // Tab navigation
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchPlatform(btn.dataset.platform));
  });

  // Header actions
  document.getElementById('exportBtn').addEventListener('click', exportData);
  document.getElementById('importBtn').addEventListener('click', () => document.getElementById('fileInput').click());
  document.getElementById('fileInput').addEventListener('change', importData);
  document.getElementById('generateCodeBtn').addEventListener('click', openCodeModal);

  // Controls
  document.getElementById('addCardBtn').addEventListener('click', openAddModal);
  document.getElementById('searchInput').addEventListener('input', renderCurrentView);
  document.getElementById('statusFilter').addEventListener('change', renderCurrentView);
  document.getElementById('sortBy').addEventListener('change', renderCurrentView);

  // Card modal
  document.getElementById('closeModal').addEventListener('click', closeCardModal);
  document.getElementById('cancelBtn').addEventListener('click', closeCardModal);
  document.getElementById('cardForm').addEventListener('submit', saveCard);
  document.getElementById('cardModal').addEventListener('click', (e) => {
    if (e.target.id === 'cardModal') closeCardModal();
  });

  // Delete modal
  document.getElementById('closeDeleteModal').addEventListener('click', closeDeleteModal);
  document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);
  document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);
  document.getElementById('deleteModal').addEventListener('click', (e) => {
    if (e.target.id === 'deleteModal') closeDeleteModal();
  });

  // Code modal
  document.getElementById('closeCodeModal').addEventListener('click', closeCodeModal);
  document.getElementById('codeModal').addEventListener('click', (e) => {
    if (e.target.id === 'codeModal') closeCodeModal();
  });
  document.querySelectorAll('.code-tab').forEach(tab => {
    tab.addEventListener('click', () => switchCodeTab(tab.dataset.codeTab));
  });
  document.getElementById('copyHtmlBtn').addEventListener('click', () => copyCode('html'));
  document.getElementById('copyCssBtn').addEventListener('click', () => copyCode('css'));
}

// Setup Keyboard Shortcuts
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + N: New card
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
      e.preventDefault();
      openAddModal();
    }
    // Ctrl/Cmd + E: Export
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
      e.preventDefault();
      exportData();
    }
    // Ctrl/Cmd + I: Import
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      document.getElementById('fileInput').click();
    }
    // Ctrl/Cmd + G: Generate code
    if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
      e.preventDefault();
      openCodeModal();
    }
    // ESC: Close modals
    if (e.key === 'Escape') {
      closeCardModal();
      closeDeleteModal();
      closeCodeModal();
    }
    // Alt + 1-5: Switch platforms
    if (e.altKey && e.key >= '1' && e.key <= '5') {
      e.preventDefault();
      const platforms = ['microsoft_learn', 'google_skills', 'aws_skillbuilder', 'roadmapsh', 'custom'];
      switchPlatform(platforms[parseInt(e.key) - 1]);
    }
  });
}

// Switch Platform
function switchPlatform(platform) {
  appState.currentPlatform = platform;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.platform === platform);
  });
  updatePlatformInfo();
  renderCurrentView();
}

// Update Platform Info
function updatePlatformInfo() {
  const info = platformInfo[appState.currentPlatform];
  const infoBar = document.getElementById('platformInfo');
  infoBar.style.background = `${info.color}15`;
  document.getElementById('platformName').textContent = `${info.icon} ${info.name}`;
  document.getElementById('platformDescription').textContent = info.description;
}

// Render Current View
function renderCurrentView() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const statusFilter = document.getElementById('statusFilter').value;
  const sortBy = document.getElementById('sortBy').value;

  let cards = appState.certifications[appState.currentPlatform] || [];

  // Filter
  cards = cards.filter(card => {
    const matchesSearch = card.title.toLowerCase().includes(searchTerm) ||
                         card.description.toLowerCase().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || card.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort
  cards.sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.date) - new Date(a.date);
      case 'date-asc':
        return new Date(a.date) - new Date(b.date);
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  const grid = document.getElementById('cardsGrid');
  const emptyState = document.getElementById('emptyState');

  if (cards.length === 0) {
    emptyState.style.display = 'block';
    Array.from(grid.children).forEach(child => {
      if (child !== emptyState) child.remove();
    });
  } else {
    emptyState.style.display = 'none';
    grid.innerHTML = '';
    cards.forEach(card => {
      grid.appendChild(createCardElement(card));
    });
  }
}

// Create Card Element
function createCardElement(card) {
  const cardEl = document.createElement('div');
  cardEl.className = 'cert-card';
  cardEl.draggable = true;
  cardEl.dataset.id = card.id;

  const statusClass = card.status.toLowerCase().replace(' ', '-');
  const badgeContent = card.badge_url
    ? `<img src="${card.badge_url}" alt="${card.title}" />`
    : platformInfo[appState.currentPlatform].icon;

  const formattedDate = new Date(card.date).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  cardEl.innerHTML = `
    <div class="card-platform-indicator ${appState.currentPlatform}"></div>
    <div class="card-header">
      <div class="card-badge">${badgeContent}</div>
      <div class="card-title-area">
        <h3 class="card-title">${escapeHtml(card.title)}</h3>
        <div class="card-date">📅 ${formattedDate}</div>
      </div>
    </div>
    <p class="card-description">${escapeHtml(card.description)}</p>
    <div class="card-footer">
      <span class="card-status ${statusClass}">${card.status}</span>
      <div class="card-actions">
        <button class="card-action-btn" onclick="window.open('${card.url}', '_blank')" title="Ver certificação">🔗</button>
        <button class="card-action-btn" onclick="editCard('${card.id}')" title="Editar">✏️</button>
        <button class="card-action-btn" onclick="deleteCard('${card.id}')" title="Excluir">🗑️</button>
      </div>
    </div>
  `;

  // Drag and drop
  cardEl.addEventListener('dragstart', handleDragStart);
  cardEl.addEventListener('dragover', handleDragOver);
  cardEl.addEventListener('drop', handleDrop);
  cardEl.addEventListener('dragend', handleDragEnd);

  return cardEl;
}

// Drag and Drop Handlers
let draggedCard = null;

function handleDragStart(e) {
  draggedCard = this;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  if (draggedCard !== this) {
    const cards = appState.certifications[appState.currentPlatform];
    const draggedId = draggedCard.dataset.id;
    const targetId = this.dataset.id;
    const draggedIndex = cards.findIndex(c => c.id === draggedId);
    const targetIndex = cards.findIndex(c => c.id === targetId);
    
    const [removed] = cards.splice(draggedIndex, 1);
    cards.splice(targetIndex, 0, removed);
    
    renderCurrentView();
  }
  return false;
}

function handleDragEnd() {
  this.classList.remove('dragging');
  draggedCard = null;
}

// Modal Functions
function openAddModal() {
  appState.editingId = null;
  document.getElementById('modalTitle').textContent = 'Adicionar Certificação';
  document.getElementById('cardForm').reset();
  document.getElementById('cardDate').valueAsDate = new Date();
  
  // Show/hide roadmap fields
  const roadmapFields = document.getElementById('roadmapFields');
  roadmapFields.style.display = appState.currentPlatform === 'roadmapsh' ? 'block' : 'none';
  
  document.getElementById('cardModal').classList.add('active');
}

function closeCardModal() {
  document.getElementById('cardModal').classList.remove('active');
  appState.editingId = null;
}

function editCard(id) {
  const cards = appState.certifications[appState.currentPlatform];
  const card = cards.find(c => c.id === id);
  if (!card) return;

  appState.editingId = id;
  document.getElementById('modalTitle').textContent = 'Editar Certificação';
  document.getElementById('cardTitle').value = card.title;
  document.getElementById('cardDescription').value = card.description;
  document.getElementById('cardUrl').value = card.url;
  document.getElementById('cardDate').value = card.date;
  document.getElementById('cardStatus').value = card.status;
  document.getElementById('cardBadgeUrl').value = card.badge_url || '';
  
  // Show/hide roadmap fields
  const roadmapFields = document.getElementById('roadmapFields');
  if (appState.currentPlatform === 'roadmapsh') {
    roadmapFields.style.display = 'block';
    document.getElementById('cardHtml').value = card.card_html || '';
    document.getElementById('cardMarkdown').value = card.card_markdown || '';
  } else {
    roadmapFields.style.display = 'none';
  }
  
  document.getElementById('cardModal').classList.add('active');
}

function saveCard(e) {
  e.preventDefault();
  
  const cardData = {
    title: document.getElementById('cardTitle').value,
    description: document.getElementById('cardDescription').value,
    url: document.getElementById('cardUrl').value,
    date: document.getElementById('cardDate').value,
    status: document.getElementById('cardStatus').value,
    badge_url: document.getElementById('cardBadgeUrl').value
  };

  // Add roadmap.sh specific fields
  if (appState.currentPlatform === 'roadmapsh') {
    cardData.card_html = document.getElementById('cardHtml').value;
    cardData.card_markdown = document.getElementById('cardMarkdown').value;
  }

  if (!appState.certifications[appState.currentPlatform]) {
    appState.certifications[appState.currentPlatform] = [];
  }

  if (appState.editingId) {
    // Update existing
    const cards = appState.certifications[appState.currentPlatform];
    const index = cards.findIndex(c => c.id === appState.editingId);
    cards[index] = { ...cards[index], ...cardData };
  } else {
    // Add new
    cardData.id = `${appState.currentPlatform}-${Date.now()}`;
    appState.certifications[appState.currentPlatform].push(cardData);
  }

  closeCardModal();
  renderCurrentView();
}

function deleteCard(id) {
  appState.deleteId = id;
  const cards = appState.certifications[appState.currentPlatform];
  const card = cards.find(c => c.id === id);
  if (card) {
    document.getElementById('deleteItemName').textContent = card.title;
    document.getElementById('deleteModal').classList.add('active');
  }
}

function closeDeleteModal() {
  document.getElementById('deleteModal').classList.remove('active');
  appState.deleteId = null;
}

function confirmDelete() {
  if (!appState.deleteId) return;
  
  const cards = appState.certifications[appState.currentPlatform];
  const index = cards.findIndex(c => c.id === appState.deleteId);
  if (index !== -1) {
    cards.splice(index, 1);
  }
  
  closeDeleteModal();
  renderCurrentView();
}

// Code Generation
function openCodeModal() {
  const cards = appState.certifications[appState.currentPlatform] || [];
  if (cards.length === 0) {
    alert('Adicione algumas certificações antes de gerar o código!');
    return;
  }

  generateCode();
  document.getElementById('codeModal').classList.add('active');
}

function closeCodeModal() {
  document.getElementById('codeModal').classList.remove('active');
}

function switchCodeTab(tab) {
  document.querySelectorAll('.code-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.codeTab === tab);
  });
  document.querySelectorAll('.code-content').forEach(c => {
    c.classList.toggle('active', c.dataset.codeContent === tab);
  });
}

function generateCode() {
  const cards = appState.certifications[appState.currentPlatform] || [];
  const platformName = platformInfo[appState.currentPlatform].name;
  const platformColor = platformInfo[appState.currentPlatform].color;

  // Generate HTML
  let html = `<section class="certifications-section" data-platform="${appState.currentPlatform}">\n`;
  html += `  <h2>${platformName}</h2>\n`;
  html += `  <div class="certifications-grid">\n`;
  
  cards.forEach(card => {
    const statusClass = card.status.toLowerCase().replace(' ', '-');
    const badgeImg = card.badge_url 
      ? `<img src="${card.badge_url}" alt="${escapeHtml(card.title)}" />` 
      : '';
    
    html += `    <div class="cert-card">\n`;
    html += `      <div class="cert-badge">${badgeImg}</div>\n`;
    html += `      <h3>${escapeHtml(card.title)}</h3>\n`;
    html += `      <p>${escapeHtml(card.description)}</p>\n`;
    html += `      <div class="cert-meta">\n`;
    html += `        <span class="cert-date">${new Date(card.date).toLocaleDateString('pt-BR')}</span>\n`;
    html += `        <span class="cert-status ${statusClass}">${card.status}</span>\n`;
    html += `      </div>\n`;
    html += `      <a href="${card.url}" target="_blank" class="cert-link">Ver Certificação</a>\n`;
    html += `    </div>\n`;
  });
  
  html += `  </div>\n`;
  html += `</section>`;

  // Generate CSS
  let css = `/* Certifications Section Styles */\n`;
  css += `.certifications-section {\n`;
  css += `  max-width: 1200px;\n`;
  css += `  margin: 40px auto;\n`;
  css += `  padding: 20px;\n`;
  css += `}\n\n`;
  css += `.certifications-section h2 {\n`;
  css += `  font-size: 32px;\n`;
  css += `  margin-bottom: 30px;\n`;
  css += `  color: ${platformColor};\n`;
  css += `}\n\n`;
  css += `.certifications-grid {\n`;
  css += `  display: grid;\n`;
  css += `  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\n`;
  css += `  gap: 24px;\n`;
  css += `}\n\n`;
  css += `.cert-card {\n`;
  css += `  background: #fff;\n`;
  css += `  border: 1px solid #e0e0e0;\n`;
  css += `  border-radius: 12px;\n`;
  css += `  padding: 24px;\n`;
  css += `  box-shadow: 0 2px 8px rgba(0,0,0,0.05);\n`;
  css += `  transition: transform 0.2s, box-shadow 0.2s;\n`;
  css += `}\n\n`;
  css += `.cert-card:hover {\n`;
  css += `  transform: translateY(-4px);\n`;
  css += `  box-shadow: 0 4px 16px rgba(0,0,0,0.1);\n`;
  css += `}\n\n`;
  css += `.cert-badge {\n`;
  css += `  width: 80px;\n`;
  css += `  height: 80px;\n`;
  css += `  margin-bottom: 16px;\n`;
  css += `}\n\n`;
  css += `.cert-badge img {\n`;
  css += `  width: 100%;\n`;
  css += `  height: 100%;\n`;
  css += `  object-fit: contain;\n`;
  css += `}\n\n`;
  css += `.cert-card h3 {\n`;
  css += `  font-size: 18px;\n`;
  css += `  margin-bottom: 12px;\n`;
  css += `  color: #333;\n`;
  css += `}\n\n`;
  css += `.cert-card p {\n`;
  css += `  font-size: 14px;\n`;
  css += `  color: #666;\n`;
  css += `  line-height: 1.6;\n`;
  css += `  margin-bottom: 16px;\n`;
  css += `}\n\n`;
  css += `.cert-meta {\n`;
  css += `  display: flex;\n`;
  css += `  justify-content: space-between;\n`;
  css += `  align-items: center;\n`;
  css += `  margin-bottom: 16px;\n`;
  css += `  font-size: 12px;\n`;
  css += `}\n\n`;
  css += `.cert-date {\n`;
  css += `  color: #999;\n`;
  css += `}\n\n`;
  css += `.cert-status {\n`;
  css += `  padding: 4px 12px;\n`;
  css += `  border-radius: 20px;\n`;
  css += `  font-weight: 500;\n`;
  css += `}\n\n`;
  css += `.cert-status.active {\n`;
  css += `  background: #dcfce7;\n`;
  css += `  color: #16a34a;\n`;
  css += `}\n\n`;
  css += `.cert-status.in-progress {\n`;
  css += `  background: #fef3c7;\n`;
  css += `  color: #d97706;\n`;
  css += `}\n\n`;
  css += `.cert-status.expired {\n`;
  css += `  background: #fee2e2;\n`;
  css += `  color: #dc2626;\n`;
  css += `}\n\n`;
  css += `.cert-link {\n`;
  css += `  display: inline-block;\n`;
  css += `  padding: 8px 16px;\n`;
  css += `  background: ${platformColor};\n`;
  css += `  color: #fff;\n`;
  css += `  text-decoration: none;\n`;
  css += `  border-radius: 6px;\n`;
  css += `  font-size: 14px;\n`;
  css += `  font-weight: 500;\n`;
  css += `  transition: opacity 0.2s;\n`;
  css += `}\n\n`;
  css += `.cert-link:hover {\n`;
  css += `  opacity: 0.9;\n`;
  css += `}\n\n`;
  css += `@media (max-width: 768px) {\n`;
  css += `  .certifications-grid {\n`;
  css += `    grid-template-columns: 1fr;\n`;
  css += `  }\n`;
  css += `}`;

  document.getElementById('htmlCode').textContent = html;
  document.getElementById('cssCode').textContent = css;
  
  // Generate preview
  const previewContainer = document.getElementById('previewContainer');
  previewContainer.innerHTML = html;
  const style = document.createElement('style');
  style.textContent = css;
  previewContainer.appendChild(style);
}

function copyCode(type) {
  const codeElement = type === 'html' ? document.getElementById('htmlCode') : document.getElementById('cssCode');
  const text = codeElement.textContent;
  
  navigator.clipboard.writeText(text).then(() => {
    const btn = type === 'html' ? document.getElementById('copyHtmlBtn') : document.getElementById('copyCssBtn');
    const originalText = btn.textContent;
    btn.textContent = '✅ Copiado!';
    setTimeout(() => {
      btn.textContent = originalText;
    }, 2000);
  }).catch(err => {
    alert('Erro ao copiar código. Por favor, copie manualmente.');
  });
}

// Export/Import Functions
function exportData() {
  const dataStr = JSON.stringify(appState.certifications, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `certifications-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const importedData = JSON.parse(event.target.result);
      if (confirm('Deseja sobrescrever os dados atuais com os dados importados?')) {
        appState.certifications = importedData;
        renderCurrentView();
        alert('Dados importados com sucesso!');
      }
    } catch (error) {
      alert('Erro ao importar dados. Verifique se o arquivo é válido.');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
}

// Utility Functions
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}