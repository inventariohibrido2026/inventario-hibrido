// ====================
// MODO CLARO/ESCURO
// ====================
const themeToggle = document.getElementById('themeToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function setTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-mode');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    } else {
        document.body.classList.remove('light-mode');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
    localStorage.setItem('theme', theme);
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (prefersDark.matches) {
        setTheme('dark');
    } else {
        setTheme('dark');
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
        setTheme(currentTheme);
    });
}

// ====================
// MENU MOBILE
// ====================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// ====================
// DADOS DE DEMONSTRAÇÃO
// ====================
const inventoryData = [
    { codigo: '001', nome: 'Notebook Dell', categoria: 'Eletrônicos', quantidade: 15, valorUnit: 3500.00 },
    { codigo: '002', nome: 'Mouse Logitech', categoria: 'Periféricos', quantidade: 50, valorUnit: 89.90 },
    { codigo: '003', nome: 'Teclado Mecânico', categoria: 'Periféricos', quantidade: 30, valorUnit: 299.90 },
    { codigo: '004', nome: 'Monitor LG', categoria: 'Eletrônicos', quantidade: 12, valorUnit: 1200.00 },
    { codigo: '005', nome: 'Cadeira Gamer', categoria: 'Móveis', quantidade: 8, valorUnit: 850.00 },
    { codigo: '006', nome: 'SSD 1TB', categoria: 'Componentes', quantidade: 25, valorUnit: 450.00 },
    { codigo: '007', nome: 'Memória RAM 16GB', categoria: 'Componentes', quantidade: 40, valorUnit: 320.00 },
    { codigo: '008', nome: 'Webcam HD', categoria: 'Periféricos', quantidade: 18, valorUnit: 180.00 }
];

// ====================
// FUNÇÕES DO DASHBOARD
// ====================
function calculateKPIs(data) {
    const totalItems = data.reduce((sum, item) => sum + item.quantidade, 0);
    const totalValue = data.reduce((sum, item) => sum + (item.quantidade * item.valorUnit), 0);
    const lowStock = data.filter(item => item.quantidade < 10).length;
    const categories = [...new Set(data.map(item => item.categoria))].length;
    
    return { totalItems, totalValue, lowStock, categories };
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function renderTable(data, searchTerm = '') {
    const tableBody = document.getElementById('tableBody');
    if (!tableBody) return;
    
    const filteredData = data.filter(item => 
        item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.codigo.includes(searchTerm) ||
        item.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    tableBody.innerHTML = filteredData.map(item => `
        <tr>
            <td>${item.codigo}</td>
            <td>${item.nome}</td>
            <td>${item.categoria}</td>
            <td>${item.quantidade}</td>
            <td>${formatCurrency(item.valorUnit)}</td>
            <td>${formatCurrency(item.quantidade * item.valorUnit)}</td>
        </tr>
    `).join('');
    
    if (filteredData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center;">Nenhum item encontrado</td>
            </tr>
        `;
    }
}

function updateDashboard() {
    const kpis = calculateKPIs(inventoryData);
    
    const totalItemsEl = document.getElementById('totalItems');
    const totalValueEl = document.getElementById('totalValue');
    const lowStockEl = document.getElementById('lowStock');
    const categoriesEl = document.getElementById('categories');
    
    if (totalItemsEl) totalItemsEl.textContent = kpis.totalItems;
    if (totalValueEl) totalValueEl.textContent = formatCurrency(kpis.totalValue);
    if (lowStockEl) lowStockEl.textContent = kpis.lowStock;
    if (categoriesEl) categoriesEl.textContent = kpis.categories;
    
    renderTable(inventoryData);
}

// ====================
// BUSCA EM TEMPO REAL
// ====================
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        renderTable(inventoryData, e.target.value);
    });
}

// ====================
// ANIMAÇÃO DE ENTRADA
// ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .kpi-card, .contact-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// ====================
// INICIALIZAÇÃO
// ====================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateDashboard();
    
    // Fechar menu mobile ao clicar em um link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });
});

// ====================
// VARIÁVEIS GLOBAIS
// ====================
let categoryChart = null;
let topItemsChart = null;

// ====================
// FUNÇÕES DE RELATÓRIOS
// ====================

// Obter dados filtrados
function getFilteredData() {
    let data = [...inventoryData];
    const reportType = document.getElementById('reportType')?.value;
    const category = document.getElementById('categoryFilter')?.value;
    const searchTerm = document.getElementById('searchReport')?.value.toLowerCase() || '';
    
    // Filtrar por tipo de relatório
    if (reportType === 'lowStock') {
        data = data.filter(item => item.quantidade < 10);
    } else if (reportType === 'highValue') {
        data = data.filter(item => (item.quantidade * item.valorUnit) > 5000);
    } else if (reportType === 'category' && category !== 'all') {
        data = data.filter(item => item.categoria === category);
    }
    
    // Filtrar por categoria
    if (category !== 'all' && reportType !== 'category') {
        data = data.filter(item => item.categoria === category);
    }
    
    // Filtrar por busca
    if (searchTerm) {
        data = data.filter(item => 
            item.nome.toLowerCase().includes(searchTerm) ||
            item.codigo.includes(searchTerm) ||
            item.categoria.toLowerCase().includes(searchTerm)
        );
    }
    
    // Ordenar
    const sortBy = document.getElementById('sortBy')?.value;
    if (sortBy === 'nome') {
        data.sort((a, b) => a.nome.localeCompare(b.nome));
    } else if (sortBy === 'quantidade') {
        data.sort((a, b) => b.quantidade - a.quantidade);
    } else if (sortBy === 'valorTotal') {
        data.sort((a, b) => (b.quantidade * b.valorUnit) - (a.quantidade * a.valorUnit));
    }
    
    return data;
}

// Calcular totais
function calculateTotals(data) {
    const totalItems = data.reduce((sum, item) => sum + item.quantidade, 0);
    const totalValue = data.reduce((sum, item) => sum + (item.quantidade * item.valorUnit), 0);
    const avgTicket = data.length > 0 ? totalValue / data.length : 0;
    const categories = [...new Set(data.map(item => item.categoria))].length;
    
    return { totalItems, totalValue, avgTicket, categories };
}

// Atualizar cards de resumo
function updateSummaryCards(data) {
    const totals = calculateTotals(data);
    
    const summaryTotalItems = document.getElementById('summaryTotalItems');
    const summaryTotalValue = document.getElementById('summaryTotalValue');
    const summaryAvgTicket = document.getElementById('summaryAvgTicket');
    const summaryCategories = document.getElementById('summaryCategories');
    
    if (summaryTotalItems) summaryTotalItems.textContent = totals.totalItems;
    if (summaryTotalValue) summaryTotalValue.textContent = formatCurrency(totals.totalValue);
    if (summaryAvgTicket) summaryAvgTicket.textContent = formatCurrency(totals.avgTicket);
    if (summaryCategories) summaryCategories.textContent = totals.categories;
}

// Obter status do estoque
function getStockStatus(quantidade) {
    if (quantidade === 0) {
        return '<span class="status-badge status-danger"><i class="fas fa-times-circle"></i> Esgotado</span>';
    } else if (quantidade < 10) {
        return '<span class="status-badge status-warning"><i class="fas fa-exclamation-triangle"></i> Estoque Baixo</span>';
    } else {
        return '<span class="status-badge status-success"><i class="fas fa-check-circle"></i> Normal</span>';
    }
}

// Renderizar tabela de relatório
function renderReportTable() {
    const tableBody = document.getElementById('reportTableBody');
    const tableFoot = document.getElementById('reportTableFoot');
    const data = getFilteredData();
    
    if (!tableBody) return;
    
    // Renderizar corpo da tabela
    tableBody.innerHTML = data.map(item => `
        <tr>
            <td>${item.codigo}</td>
            <td>${item.nome}</td>
            <td>${item.categoria}</td>
            <td>${item.quantidade}</td>
            <td>${formatCurrency(item.valorUnit)}</td>
            <td>${formatCurrency(item.quantidade * item.valorUnit)}</td>
            <td>${getStockStatus(item.quantidade)}</td>
        </tr>
    `).join('');
    
    if (data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 3rem;">
                    <i class="fas fa-inbox" style="font-size: 3rem; opacity: 0.5;"></i>
                    <p>Nenhum item encontrado</p>
                </td>
            </tr>
        `;
    }
    
    // Renderizar rodapé com totais
    const totals = calculateTotals(data);
    if (tableFoot && data.length > 0) {
        tableFoot.innerHTML = `
            <tr>
                <td colspan="3"><strong>Totais:</strong></td>
                <td><strong>${totals.totalItems}</strong></td>
                <td></td>
                <td><strong>${formatCurrency(totals.totalValue)}</strong></td>
                <td></td>
            </tr>
        `;
    } else if (tableFoot) {
        tableFoot.innerHTML = '';
    }
    
    updateSummaryCards(data);
    updateCharts(data);
}

// Atualizar gráficos
function updateCharts(data) {
    // Gráfico de Pizza - Distribuição por Categoria
    const categoryData = {};
    data.forEach(item => {
        categoryData[item.categoria] = (categoryData[item.categoria] || 0) + item.quantidade;
    });
    
    const categories = Object.keys(categoryData);
    const quantities = Object.values(categoryData);
    
    const ctxPie = document.getElementById('categoryChart');
    if (ctxPie) {
        if (categoryChart) categoryChart.destroy();
        categoryChart = new Chart(ctxPie, {
            type: 'pie',
            data: {
                labels: categories,
                datasets: [{
                    data: quantities,
                    backgroundColor: [
                        '#3b82f6',
                        '#06b6d4',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444',
                        '#8b5cf6',
                        '#ec489a'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: getComputedStyle(document.body).getPropertyValue('--text-primary') }
                    }
                }
            }
        });
    }
    
    // Gráfico de Barras - Top 5 Itens por Valor
    const topItems = [...data]
        .sort((a, b) => (b.quantidade * b.valorUnit) - (a.quantidade * a.valorUnit))
        .slice(0, 5);
    
    const ctxBar = document.getElementById('topItemsChart');
    if (ctxBar) {
        if (topItemsChart) topItemsChart.destroy();
        topItemsChart = new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: topItems.map(item => item.nome),
                datasets: [{
                    label: 'Valor Total (R$)',
                    data: topItems.map(item => item.quantidade * item.valorUnit),
                    backgroundColor: '#3b82f6',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        labels: { color: getComputedStyle(document.body).getPropertyValue('--text-primary') }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toLocaleString('pt-BR');
                            },
                            color: getComputedStyle(document.body).getPropertyValue('--text-secondary')
                        },
                        grid: {
                            color: getComputedStyle(document.body).getPropertyValue('--border-color')
                        }
                    },
                    x: {
                        ticks: {
                            color: getComputedStyle(document.body).getPropertyValue('--text-secondary')
                        },
                        grid: {
                            color: getComputedStyle(document.body).getPropertyValue('--border-color')
                        }
                    }
                }
            }
        });
    }
}

// Exportar para CSV
function exportToCSV() {
    const data = getFilteredData();
    const headers = ['Código', 'Nome', 'Categoria', 'Quantidade', 'Valor Unitário', 'Valor Total'];
    
    const rows = data.map(item => [
        item.codigo,
        item.nome,
        item.categoria,
        item.quantidade,
        item.valorUnit.toFixed(2),
        (item.quantidade * item.valorUnit).toFixed(2)
    ]);
    
    const csvContent = [headers, ...rows]
        .map(row => row.join(','))
        .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_inventario_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Feedback visual
    showNotification('Relatório exportado com sucesso!', 'success');
}

// Exportar para PDF
function exportToPDF() {
    const element = document.querySelector('.reports-page .container');
    const opt = {
        margin: 0.5,
        filename: `relatorio_inventario_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
    };
    
    html2pdf().set(opt).from(element).save();
    showNotification('Gerando PDF...', 'info');
}

// Copiar tabela para área de transferência
function copyTableToClipboard() {
    const table = document.getElementById('reportTable');
    const range = document.createRange();
    range.selectNode(table);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    
    try {
        document.execCommand('copy');
        showNotification('Tabela copiada para área de transferência!', 'success');
    } catch (err) {
        showNotification('Erro ao copiar tabela', 'error');
    }
    
    window.getSelection().removeAllRanges();
}

// Imprimir relatório
function printReport() {
    window.print();
}

// Notificação
function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Estilos da notificação
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Adicionar animações para notificações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ====================
// EVENTOS DOS RELATÓRIOS
// ====================
function initReports() {
    // Eventos de filtro
    const reportType = document.getElementById('reportType');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortBy = document.getElementById('sortBy');
    const searchReport = document.getElementById('searchReport');
    
    if (reportType) reportType.addEventListener('change', renderReportTable);
    if (categoryFilter) categoryFilter.addEventListener('change', renderReportTable);
    if (sortBy) sortBy.addEventListener('change', renderReportTable);
    if (searchReport) searchReport.addEventListener('input', renderReportTable);
    
    // Botões de ação
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    const copyTableBtn = document.getElementById('copyTableBtn');
    const printTableBtn = document.getElementById('printTableBtn');
    
    if (exportCsvBtn) exportCsvBtn.addEventListener('click', exportToCSV);
    if (exportPdfBtn) exportPdfBtn.addEventListener('click', exportToPDF);
    if (copyTableBtn) copyTableBtn.addEventListener('click', copyTableToClipboard);
    if (printTableBtn) printTableBtn.addEventListener('click', printReport);
}

// ====================
// ATUALIZAR FUNÇÃO DOMContentLoaded
// ====================
// Substituir ou adicionar ao DOMContentLoaded existente
const originalDOMContentLoaded = window.onload;
window.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateDashboard();
    initReports();
    renderReportTable();
    
    // Fechar menu mobile ao clicar em um link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });
});
// ====================
// CONFIGURAÇÕES
// ====================

// Inicializar configurações carregadas do localStorage
function loadSettings() {
    // Perfil
    const savedNome = localStorage.getItem('config_nome');
    const savedEmail = localStorage.getItem('config_email');
    const savedCargo = localStorage.getItem('config_cargo');
    const savedTelefone = localStorage.getItem('config_telefone');
    
    if (savedNome) document.getElementById('nomeCompleto') && (document.getElementById('nomeCompleto').value = savedNome);
    if (savedEmail) document.getElementById('email') && (document.getElementById('email').value = savedEmail);
    if (savedCargo) document.getElementById('cargo') && (document.getElementById('cargo').value = savedCargo);
    if (savedTelefone) document.getElementById('telefone') && (document.getElementById('telefone').value = savedTelefone);
    
    // Notificações
    const notifEstoque = localStorage.getItem('config_notif_estoque');
    const notifInventario = localStorage.getItem('config_notif_inventario');
    const notifBackup = localStorage.getItem('config_notif_backup');
    
    if (notifEstoque !== null) document.getElementById('notifEstoqueBaixo') && (document.getElementById('notifEstoqueBaixo').checked = notifEstoque === 'true');
    if (notifInventario !== null) document.getElementById('notifInventario') && (document.getElementById('notifInventario').checked = notifInventario === 'true');
    if (notifBackup !== null) document.getElementById('notifBackup') && (document.getElementById('notifBackup').checked = notifBackup === 'true');
}

// Salvar configurações
function saveSettings() {
    // Perfil
    const nome = document.getElementById('nomeCompleto')?.value;
    const email = document.getElementById('email')?.value;
    const cargo = document.getElementById('cargo')?.value;
    const telefone = document.getElementById('telefone')?.value;
    
    if (nome) localStorage.setItem('config_nome', nome);
    if (email) localStorage.setItem('config_email', email);
    if (cargo) localStorage.setItem('config_cargo', cargo);
    if (telefone) localStorage.setItem('config_telefone', telefone);
    
    // Notificações
    const notifEstoque = document.getElementById('notifEstoqueBaixo')?.checked;
    const notifInventario = document.getElementById('notifInventario')?.checked;
    const notifBackup = document.getElementById('notifBackup')?.checked;
    
    localStorage.setItem('config_notif_estoque', notifEstoque);
    localStorage.setItem('config_notif_inventario', notifInventario);
    localStorage.setItem('config_notif_backup', notifBackup);
    
    showNotification('Configurações salvas com sucesso!', 'success');
}

// Força da senha
function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    
    const strengthEl = document.getElementById('senhaStrength');
    if (!strengthEl) return;
    
    if (password.length === 0) {
        strengthEl.textContent = '';
        strengthEl.className = 'password-strength';
        return;
    }
    
    if (strength <= 2) {
        strengthEl.textContent = 'Senha fraca';
        strengthEl.className = 'password-strength strength-weak';
    } else if (strength <= 4) {
        strengthEl.textContent = 'Senha média';
        strengthEl.className = 'password-strength strength-medium';
    } else {
        strengthEl.textContent = 'Senha forte!';
        strengthEl.className = 'password-strength strength-strong';
    }
}

// Tabs de configurações
function initSettingsTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const panes = document.querySelectorAll('.tab-pane');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));
            
            tab.classList.add('active');
            const activePane = document.getElementById(target);
            if (activePane) activePane.classList.add('active');
        });
    });
}

// Eventos de configurações
function initSettingsEvents() {
    // Salvar perfil
    const perfilForm = document.getElementById('perfilForm');
    if (perfilForm) {
        perfilForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveSettings();
        });
    }
    
    // Cancelar perfil
    const cancelPerfil = document.getElementById('cancelPerfil');
    if (cancelPerfil) {
        cancelPerfil.addEventListener('click', () => {
            loadSettings();
            showNotification('Alterações canceladas', 'info');
        });
    }
    
    // Salvar empresa
    const empresaForm = document.getElementById('empresaForm');
    if (empresaForm) {
        empresaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Salvar dados da empresa
            const razaoSocial = document.getElementById('razaoSocial')?.value;
            const nomeFantasia = document.getElementById('nomeFantasia')?.value;
            const cnpj = document.getElementById('cnpj')?.value;
            
            localStorage.setItem('config_razao_social', razaoSocial);
            localStorage.setItem('config_nome_fantasia', nomeFantasia);
            localStorage.setItem('config_cnpj', cnpj);
            
            showNotification('Dados da empresa salvos!', 'success');
        });
    }
    
    // Salvar financeiro
    const financeiroForm = document.getElementById('financeiroForm');
    if (financeiroForm) {
        financeiroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const moeda = document.getElementById('moeda')?.value;
            const formatoData = document.getElementById('formatoData')?.value;
            const imposto = document.getElementById('imposto')?.value;
            
            localStorage.setItem('config_moeda', moeda);
            localStorage.setItem('config_formato_data', formatoData);
            localStorage.setItem('config_imposto', imposto);
            
            showNotification('Configurações financeiras salvas!', 'success');
        });
    }
    
    // Força da senha
    const novaSenha = document.getElementById('novaSenha');
    if (novaSenha) {
        novaSenha.addEventListener('input', (e) => {
            checkPasswordStrength(e.target.value);
        });
    }
    
    // Alterar senha
    const senhaForm = document.getElementById('senhaForm');
    if (senhaForm) {
        senhaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const senhaAtual = document.getElementById('senhaAtual')?.value;
            const novaSenhaVal = document.getElementById('novaSenha')?.value;
            const confirmarSenha = document.getElementById('confirmarSenha')?.value;
            
            if (!senhaAtual) {
                showNotification('Digite sua senha atual', 'error');
                return;
            }
            
            if (novaSenhaVal !== confirmarSenha) {
                showNotification('As senhas não coincidem', 'error');
                return;
            }
            
            if (novaSenhaVal.length < 6) {
                showNotification('A nova senha deve ter pelo menos 6 caracteres', 'error');
                return;
            }
            
            showNotification('Senha alterada com sucesso!', 'success');
            senhaForm.reset();
        });
    }
    
    // Backup agora
    const backupNow = document.getElementById('backupNow');
    if (backupNow) {
        backupNow.addEventListener('click', () => {
            // Simular backup
            const data = new Date().toLocaleString('pt-BR');
            const backupList = document.getElementById('backupHistoryList');
            if (backupList) {
                const newBackup = document.createElement('li');
                newBackup.innerHTML = `<i class="fas fa-check-circle"></i> ${data} - Backup completo`;
                backupList.insertBefore(newBackup, backupList.firstChild);
            }
            showNotification('Backup realizado com sucesso!', 'success');
        });
    }
    
    // Restaurar backup
    const restoreBackup = document.getElementById('restoreBackup');
    const restoreFile = document.getElementById('restoreFile');
    if (restoreBackup && restoreFile) {
        restoreBackup.addEventListener('click', () => {
            restoreFile.click();
        });
        restoreFile.addEventListener('change', () => {
            if (restoreFile.files.length > 0) {
                showNotification('Backup restaurado com sucesso!', 'success');
            }
        });
    }
    
    // Salvar todas as configurações
    const saveAllBtn = document.getElementById('saveAllSettings');
    if (saveAllBtn) {
        saveAllBtn.addEventListener('click', () => {
            saveSettings();
            showNotification('Todas as configurações salvas!', 'success');
        });
    }
    
    // Encerrar todas as sessões
    const logoutAll = document.getElementById('logoutAllDevices');
    if (logoutAll) {
        logoutAll.addEventListener('click', () => {
            showNotification('Todas as sessões foram encerradas!', 'success');
        });
    }
    
    // Ativar 2FA
    const enable2FA = document.getElementById('enable2FA');
    if (enable2FA) {
        enable2FA.addEventListener('click', () => {
            showNotification('Autenticação em dois fatores ativada!', 'success');
        });
    }
    
    // Testar WhatsApp
    const testWhatsapp = document.getElementById('testWhatsapp');
    if (testWhatsapp) {
        testWhatsapp.addEventListener('click', () => {
            showNotification('Mensagem de teste enviada para o WhatsApp!', 'success');
        });
    }
    
    // Copiar API Key
    const copyApiKey = document.getElementById('copyApiKey');
    const apiKeyInput = document.getElementById('apiKey');
    if (copyApiKey && apiKeyInput) {
        copyApiKey.addEventListener('click', () => {
            apiKeyInput.select();
            document.execCommand('copy');
            showNotification('API Key copiada!', 'success');
        });
    }
    
    // Gerar nova API Key
    const generateApiKey = document.getElementById('generateApiKey');
    if (generateApiKey && apiKeyInput) {
        generateApiKey.addEventListener('click', () => {
            const newKey = 'ih_' + Math.random().toString(36).substr(2, 16);
            apiKeyInput.value = newKey;
            showNotification('Nova API Key gerada!', 'success');
        });
    }
    
    // Upload de avatar
    const uploadAvatarBtn = document.getElementById('uploadAvatarBtn');
    const avatarInput = document.getElementById('avatarInput');
    const avatarPreview = document.getElementById('avatarPreview');
    if (uploadAvatarBtn && avatarInput && avatarPreview) {
        uploadAvatarBtn.addEventListener('click', () => {
            avatarInput.click();
        });
        avatarInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    avatarPreview.innerHTML = `<img src="${event.target.result}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
                };
                reader.readAsDataURL(file);
                showNotification('Avatar atualizado!', 'success');
            }
        });
    }
}

// ====================
// ATUALIZAR FUNÇÃO DOMContentLoaded
// ====================
// Adicionar ao DOMContentLoaded existente
const existingDOMContentLoaded = window.onload;
window.addEventListener('DOMContentLoaded', () => {
    if (existingDOMContentLoaded) existingDOMContentLoaded();
    
    initTheme();
    updateDashboard();
    initReports();
    renderReportTable();
    initSettingsTabs();
    initSettingsEvents();
    loadSettings();
    
    // Fechar menu mobile ao clicar em um link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });
    // ====================
// GERENCIAMENTO DE USUÁRIOS
// ====================

// Dados mockados de usuários
let usuariosData = [
    {
        id: 1,
        nome: "Vinicius Erose Américo",
        email: "viniciuseroseamerico@outlook.com",
        senha: "******",
        cargo: "Administrador de Sistemas",
        telefone: "(62) 99374-7844",
        perfil: "admin",
        status: "active",
        ultimoAcesso: "24/03/2026 14:30",
        permissoes: {
            dashboard: { view: true, export: true },
            inventario: { view: true, create: true, edit: true, delete: true },
            relatorios: { view: true, export: true },
            usuarios: { view: true, create: true, edit: true, delete: true },
            configuracoes: { view: true, edit: true }
        }
    },
    {
        id: 2,
        nome: "Ana Carolina Silva",
        email: "ana.silva@inventario.com",
        senha: "******",
        cargo: "Gerente de Operações",
        telefone: "(11) 98765-4321",
        perfil: "gerente",
        status: "active",
        ultimoAcesso: "23/03/2026 09:15",
        permissoes: {
            dashboard: { view: true, export: true },
            inventario: { view: true, create: true, edit: true, delete: false },
            relatorios: { view: true, export: true },
            usuarios: { view: true, create: false, edit: false, delete: false },
            configuracoes: { view: true, edit: false }
        }
    },
    {
        id: 3,
        nome: "Roberto Almeida",
        email: "roberto.almeida@inventario.com",
        senha: "******",
        cargo: "Operador de Inventário",
        telefone: "(21) 99876-5432",
        perfil: "operador",
        status: "active",
        ultimoAcesso: "24/03/2026 08:00",
        permissoes: {
            dashboard: { view: true, export: false },
            inventario: { view: true, create: true, edit: false, delete: false },
            relatorios: { view: false, export: false },
            usuarios: { view: false, create: false, edit: false, delete: false },
            configuracoes: { view: false, edit: false }
        }
    },
    {
        id: 4,
        nome: "Mariana Costa",
        email: "mariana.costa@inventario.com",
        senha: "******",
        cargo: "Auditora Interna",
        telefone: "(31) 98765-1234",
        perfil: "auditor",
        status: "active",
        ultimoAcesso: "22/03/2026 16:45",
        permissoes: {
            dashboard: { view: true, export: true },
            inventario: { view: true, create: false, edit: false, delete: false },
            relatorios: { view: true, export: true },
            usuarios: { view: true, create: false, edit: false, delete: false },
            configuracoes: { view: true, edit: false }
        }
    },
    {
        id: 5,
        nome: "Carlos Eduardo",
        email: "carlos.eduardo@inventario.com",
        senha: "******",
        cargo: "Operador de Campo",
        telefone: "(62) 91234-5678",
        perfil: "operador",
        status: "inactive",
        ultimoAcesso: "15/03/2026 11:20",
        permissoes: {
            dashboard: { view: true, export: false },
            inventario: { view: true, create: true, edit: false, delete: false },
            relatorios: { view: false, export: false },
            usuarios: { view: false, create: false, edit: false, delete: false },
            configuracoes: { view: false, edit: false }
        }
    }
];

let currentUserId = null;
let currentPage = 1;
const itemsPerPage = 5;

// Renderizar tabela de usuários
function renderUsersTable() {
    const searchTerm = document.getElementById('searchUser')?.value.toLowerCase() || '';
    const roleFilter = document.getElementById('filterRole')?.value || 'all';
    const statusFilter = document.getElementById('filterStatus')?.value || 'all';
    
    let filteredUsers = usuariosData.filter(user => {
        const matchesSearch = user.nome.toLowerCase().includes(searchTerm) ||
                             user.email.toLowerCase().includes(searchTerm) ||
                             user.cargo.toLowerCase().includes(searchTerm);
        const matchesRole = roleFilter === 'all' || user.perfil === roleFilter;
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        
        return matchesSearch && matchesRole && matchesStatus;
    });
    
    // Paginação
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedUsers = filteredUsers.slice(start, end);
    
    // Renderizar tabela
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = paginatedUsers.map(user => `
        <tr>
            <td><input type="checkbox" class="user-checkbox" data-id="${user.id}"></td>
            <td>
                <div class="user-info">
                    <div class="user-avatar">${getInitials(user.nome)}</div>
                    <div class="user-details">
                        <span class="user-name">${user.nome}</span>
                        <span class="user-id">ID: ${user.id}</span>
                    </div>
                </div>
            </td>
            <td>${user.email}</td>
            <td>${user.cargo}</td>
            <td><span class="role-badge role-${user.perfil}">${getRoleName(user.perfil)}</span></td>
            <td><span class="status-badge-${user.status}">${user.status === 'active' ? 'Ativo' : 'Inativo'}</span></td>
            <td>${user.ultimoAcesso}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit-user" data-id="${user.id}" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" data-id="${user.id}" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    // Atualizar estatísticas
    updateUsersStats();
    
    // Atualizar paginação
    renderPagination(totalPages);
    
    // Adicionar eventos aos botões de ação
    document.querySelectorAll('.edit-user').forEach(btn => {
        btn.addEventListener('click', () => editUser(parseInt(btn.dataset.id)));
    });
    
    document.querySelectorAll('.action-btn.delete').forEach(btn => {
        btn.addEventListener('click', () => openDeleteModal(parseInt(btn.dataset.id)));
    });
}

// Pegar iniciais do nome
function getInitials(nome) {
    return nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

// Pegar nome do perfil
function getRoleName(perfil) {
    const roles = {
        admin: 'Administrador',
        gerente: 'Gerente',
        operador: 'Operador',
        auditor: 'Auditor'
    };
    return roles[perfil] || perfil;
}

// Atualizar estatísticas
function updateUsersStats() {
    const totalUsers = usuariosData.length;
    const totalAdmins = usuariosData.filter(u => u.perfil === 'admin').length;
    const totalActive = usuariosData.filter(u => u.status === 'active').length;
    const lastAccess = usuariosData[0]?.ultimoAcesso || 'Nunca';
    
    const totalUsersEl = document.getElementById('totalUsers');
    const totalAdminsEl = document.getElementById('totalAdmins');
    const totalActiveEl = document.getElementById('totalActive');
    const lastAccessEl = document.getElementById('lastAccess');
    
    if (totalUsersEl) totalUsersEl.textContent = totalUsers;
    if (totalAdminsEl) totalAdminsEl.textContent = totalAdmins;
    if (totalActiveEl) totalActiveEl.textContent = totalActive;
    if (lastAccessEl) lastAccessEl.textContent = lastAccess;
}

// Renderizar paginação
function renderPagination(totalPages) {
    const paginationEl = document.getElementById('pagination');
    if (!paginationEl) return;
    
    let html = `
        <button ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    
    html += `
        <button ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    paginationEl.innerHTML = html;
    
    paginationEl.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            const page = parseInt(btn.dataset.page);
            if (!isNaN(page) && page !== currentPage && page >= 1 && page <= totalPages) {
                currentPage = page;
                renderUsersTable();
            }
        });
    });
}

// Abrir modal de usuário
function openUserModal(userId = null) {
    const modal = document.getElementById('userModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('userForm');
    
    if (!modal) return;
    
    currentUserId = userId;
    
    if (userId) {
        modalTitle.textContent = 'Editar Usuário';
        const user = usuariosData.find(u => u.id === userId);
        if (user) {
            document.getElementById('userNome').value = user.nome;
            document.getElementById('userEmail').value = user.email;
            document.getElementById('userCargo').value = user.cargo;
            document.getElementById('userTelefone').value = user.telefone;
            document.getElementById('userPerfil').value = user.perfil;
            document.getElementById('userStatus').value = user.status;
            
            // Preencher permissões
            Object.keys(user.permissoes).forEach(perm => {
                const permCheck = document.querySelector(`.permission-check[data-perm="${perm}"]`);
                if (permCheck) {
                    permCheck.checked = true;
                    const subPermissions = permCheck.closest('.permission-group').querySelectorAll('.sub-permissions input');
                    subPermissions.forEach(sub => {
                        const subPerm = sub.dataset.sub;
                        if (subPerm && user.permissoes[perm][subPerm.split('_')[1]]) {
                            sub.checked = true;
                        }
                    });
                }
            });
            
            document.getElementById('userSenha').required = false;
            document.getElementById('userConfirmSenha').required = false;
        }
    } else {
        modalTitle.textContent = 'Novo Usuário';
        form.reset();
        document.getElementById('userSenha').required = true;
        document.getElementById('userConfirmSenha').required = true;
        document.getElementById('userStatus').value = 'active';
        
        // Resetar permissões
        document.querySelectorAll('.permission-check').forEach(checkbox => {
            checkbox.checked = false;
            const subPermissions = checkbox.closest('.permission-group').querySelectorAll('.sub-permissions input');
            subPermissions.forEach(sub => sub.checked = false);
        });
    }
    
    modal.classList.add('active');
}

// Fechar modal
function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('active');
    });
    currentUserId = null;
}

// Salvar usuário
function saveUser(event) {
    event.preventDefault();
    
    const nome = document.getElementById('userNome').value;
    const email = document.getElementById('userEmail').value;
    const senha = document.getElementById('userSenha').value;
    const confirmSenha = document.getElementById('userConfirmSenha').value;
    const cargo = document.getElementById('userCargo').value;
    const telefone = document.getElementById('userTelefone').value;
    const perfil = document.getElementById('userPerfil').value;
    const status = document.getElementById('userStatus').value;
    
    if (!nome || !email || !perfil) {
        showNotification('Preencha todos os campos obrigatórios', 'error');
        return;
    }
    
    if (!currentUserId && (!senha || senha !== confirmSenha)) {
        showNotification('Senhas não conferem', 'error');
        return;
    }
    
    if (senha && senha.length < 6) {
        showNotification('A senha deve ter no mínimo 6 caracteres', 'error');
        return;
    }
    
    // Coletar permissões
    const permissoes = {
        dashboard: { view: false, export: false },
        inventario: { view: false, create: false, edit: false, delete: false },
        relatorios: { view: false, export: false },
        usuarios: { view: false, create: false, edit: false, delete: false },
        configuracoes: { view: false, edit: false }
    };
    
    document.querySelectorAll('.permission-check').forEach(permCheck => {
        const perm = permCheck.dataset.per;
        if (permCheck.checked && permissoes[perm]) {
            const subPermissions = permCheck.closest('.permission-group').querySelectorAll('.sub-permissions input');
            subPermissions.forEach(sub => {
                const subPerm = sub.dataset.sub;
                if (subPerm) {
                    const action = subPerm.split('_')[1];
                    if (permissoes[perm][action] !== undefined) {
                        permissoes[perm][action] = sub.checked;
                    } else {
                        permissoes[perm][subPerm] = sub.checked;
                    }
                }
            });
        }
    });
    
    if (currentUserId) {
        // Editar usuário existente
        const userIndex = usuariosData.findIndex(u => u.id === currentUserId);
        if (userIndex !== -1) {
            usuariosData[userIndex] = {
                ...usuariosData[userIndex],
                nome,
                email,
                cargo,
                telefone,
                perfil,
                status,
                permissoes
            };
            showNotification('Usuário atualizado com sucesso!', 'success');
        }
    } else {
        // Criar novo usuário
        const newId = Math.max(...usuariosData.map(u => u.id), 0) + 1;
        const newUser = {
            id: newId,
            nome,
            email,
            senha: '******',
            cargo,
            telefone,
            perfil,
            status,
            ultimoAcesso: 'Nunca',
            permissoes
        };
        usuariosData.push(newUser);
        showNotification('Usuário criado com sucesso!', 'success');
    }
    
    closeModal();
    renderUsersTable();
}

// Editar usuário
function editUser(id) {
    openUserModal(id);
}

// Abrir modal de exclusão
let deleteUserId = null;
function openDeleteModal(id) {
    const modal = document.getElementById('deleteModal');
    const userName = usuariosData.find(u => u.id === id)?.nome;
    const deleteUserName = document.getElementById('deleteUserName');
    
    if (deleteUserName) deleteUserName.textContent = userName;
    deleteUserId = id;
    modal.classList.add('active');
}

// Confirmar exclusão
function confirmDelete() {
    if (deleteUserId) {
        usuariosData = usuariosData.filter(u => u.id !== deleteUserId);
        showNotification('Usuário excluído com sucesso!', 'success');
        closeModal();
        renderUsersTable();
        deleteUserId = null;
    }
}

// Exportar usuários para CSV
function exportUsers() {
    const headers = ['ID', 'Nome', 'E-mail', 'Cargo', 'Telefone', 'Perfil', 'Status', 'Último Acesso'];
    const rows = usuariosData.map(user => [
        user.id,
        user.nome,
        user.email,
        user.cargo,
        user.telefone,
        getRoleName(user.perfil),
        user.status === 'active' ? 'Ativo' : 'Inativo',
        user.ultimoAcesso
    ]);
    
    const csvContent = [headers, ...rows]
        .map(row => row.join(','))
        .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `usuarios_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('Usuários exportados com sucesso!', 'success');
}

// Selecionar todos os usuários
function initSelectAll() {
    const selectAll = document.getElementById('selectAll');
    if (!selectAll) return;
    
    selectAll.addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.user-checkbox');
        checkboxes.forEach(cb => cb.checked = e.target.checked);
    });
}

// Eventos de permissões
function initPermissionsEvents() {
    document.querySelectorAll('.permission-check').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const subPermissions = checkbox.closest('.permission-group').querySelectorAll('.sub-permissions input');
            subPermissions.forEach(sub => {
                sub.checked = e.target.checked;
            });
        });
    });
}

// Inicializar eventos de usuários
function initUsersEvents() {
    const openModalBtn = document.getElementById('openUserModal');
    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => openUserModal());
    }
    
    const closeModalBtns = document.querySelectorAll('.modal-close, #closeModal, #cancelDelete');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', saveUser);
    }
    
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', confirmDelete);
    }
    
    const exportUsersBtn = document.getElementById('exportUsersBtn');
    if (exportUsersBtn) {
        exportUsersBtn.addEventListener('click', exportUsers);
    }
    
    const refreshUsersBtn = document.getElementById('refreshUsersBtn');
    if (refreshUsersBtn) {
        refreshUsersBtn.addEventListener('click', () => {
            renderUsersTable();
            showNotification('Lista atualizada!', 'success');
        });
    }
    
    const searchUser = document.getElementById('searchUser');
    const filterRole = document.getElementById('filterRole');
    const filterStatus = document.getElementById('filterStatus');
    
    if (searchUser) searchUser.addEventListener('input', () => {
        currentPage = 1;
        renderUsersTable();
    });
    if (filterRole) filterRole.addEventListener('change', () => {
        currentPage = 1;
        renderUsersTable();
    });
    if (filterStatus) filterStatus.addEventListener('change', () => {
        currentPage = 1;
        renderUsersTable();
    });
    
    initSelectAll();
    initPermissionsEvents();
}

// ====================
// ATUALIZAR FUNÇÃO DOMContentLoaded
// ====================
// Adicionar ao DOMContentLoaded existente
window.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateDashboard();
    initReports();
    renderReportTable();
    initSettingsTabs();
    initSettingsEvents();
    loadSettings();
    initUsersEvents();
    renderUsersTable();
    
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });
});
    // ====================
// GERENCIAMENTO DE OPERADORES
// ====================

// Dados mockados de operadores
let operadoresData = [
    {
        id: 1,
        nome: "João Paulo Santos",
        matricula: "OP001",
        funcao: "Coletor",
        equipe: "Equipe Alpha",
        email: "joao.santos@inventario.com",
        telefone: "(11) 98765-4321",
        admissao: "2024-01-15",
        status: "active",
        situacao: "field",
        meta: 200,
        equipamento: "Coletor TC21",
        observacoes: "Especialista em códigos de barras",
        produtividade: {
            itensColetados: 185,
            ultimos7Dias: [178, 192, 185, 201, 194, 188, 185],
            precisao: 98.5,
            tempoMedio: 12.3
        },
        tarefaAtual: {
            setor: "Setor A - Almoxarifado",
            itens: 150,
            progresso: 65,
            inicio: "2026-03-24T08:00",
            prazo: "2026-03-24T17:00"
        }
    },
    {
        id: 2,
        nome: "Maria Oliveira",
        matricula: "OP002",
        funcao: "Conferente",
        equipe: "Equipe Alpha",
        email: "maria.oliveira@inventario.com",
        telefone: "(11) 98765-4322",
        admissao: "2024-02-20",
        status: "active",
        situacao: "field",
        meta: 250,
        equipamento: "Coletor MC93",
        observacoes: "",
        produtividade: {
            itensColetados: 242,
            ultimos7Dias: [235, 240, 238, 245, 250, 248, 242],
            precisao: 99.2,
            tempoMedio: 10.5
        },
        tarefaAtual: {
            setor: "Setor B - Produção",
            itens: 200,
            progresso: 85,
            inicio: "2026-03-24T08:00",
            prazo: "2026-03-24T17:00"
        }
    },
    {
        id: 3,
        nome: "Carlos Mendes",
        matricula: "OP003",
        funcao: "Supervisor",
        equipe: "Equipe Beta",
        email: "carlos.mendes@inventario.com",
        telefone: "(11) 98765-4323",
        admissao: "2023-10-10",
        status: "active",
        situacao: "active",
        meta: 0,
        equipamento: "Tablet Pro",
        observacoes: "Supervisor de equipe",
        produtividade: {
            itensColetados: 0,
            ultimos7Dias: [0, 0, 0, 0, 0, 0, 0],
            precisao: 0,
            tempoMedio: 0
        },
        tarefaAtual: null
    },
    {
        id: 4,
        nome: "Ana Paula Souza",
        matricula: "OP004",
        funcao: "Coletor",
        equipe: "Equipe Beta",
        email: "ana.souza@inventario.com",
        telefone: "(11) 98765-4324",
        admissao: "2024-03-01",
        status: "active",
        situacao: "field",
        meta: 180,
        equipamento: "Smartphone X5",
        observacoes: "Boa performance em coletas rápidas",
        produtividade: {
            itensColetados: 175,
            ultimos7Dias: [168, 172, 170, 178, 180, 175, 175],
            precisao: 97.8,
            tempoMedio: 13.2
        },
        tarefaAtual: {
            setor: "Setor C - Expedição",
            itens: 120,
            progresso: 45,
            inicio: "2026-03-24T08:00",
            prazo: "2026-03-24T17:00"
        }
    },
    {
        id: 5,
        nome: "Roberto Silva",
        matricula: "OP005",
        funcao: "Auxiliar",
        equipe: "Equipe Gamma",
        email: "roberto.silva@inventario.com",
        telefone: "(11) 98765-4325",
        admissao: "2024-02-10",
        status: "active",
        situacao: "active",
        meta: 100,
        equipamento: "Coletor TC21",
        observacoes: "Auxiliar de inventário",
        produtividade: {
            itensColetados: 95,
            ultimos7Dias: [88, 92, 90, 95, 98, 96, 95],
            precisao: 96.5,
            tempoMedio: 15.8
        },
        tarefaAtual: null
    },
    {
        id: 6,
        nome: "Patrícia Lima",
        matricula: "OP006",
        funcao: "Conferente",
        equipe: "Equipe Gamma",
        email: "patricia.lima@inventario.com",
        telefone: "(11) 98765-4326",
        admissao: "2023-12-05",
        status: "inactive",
        situacao: "inactive",
        meta: 220,
        equipamento: "Coletor MC93",
        observacoes: "Licença médica",
        produtividade: {
            itensColetados: 0,
            ultimos7Dias: [0, 0, 0, 0, 0, 0, 0],
            precisao: 0,
            tempoMedio: 0
        },
        tarefaAtual: null
    }
];

let currentOperatorId = null;
let currentOperatorPage = 1;
const operatorsPerPage = 6;

// Renderizar grid de operadores
function renderOperatorsGrid() {
    const searchTerm = document.getElementById('searchOperator')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('filterStatus')?.value || 'all';
    const teamFilter = document.getElementById('filterTeam')?.value || 'all';
    const functionFilter = document.getElementById('filterFunction')?.value || 'all';
    
    let filteredOperators = operadoresData.filter(op => {
        const matchesSearch = op.nome.toLowerCase().includes(searchTerm) ||
                             op.matricula.toLowerCase().includes(searchTerm) ||
                             op.equipe.toLowerCase().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || 
                              (statusFilter === 'field' ? op.situacao === 'field' : op.status === statusFilter);
        const matchesTeam = teamFilter === 'all' || op.equipe === teamFilter;
        const matchesFunction = functionFilter === 'all' || op.funcao === functionFilter;
        
        return matchesSearch && matchesStatus && matchesTeam && matchesFunction;
    });
    
    // Paginação
    const totalPages = Math.ceil(filteredOperators.length / operatorsPerPage);
    const start = (currentOperatorPage - 1) * operatorsPerPage;
    const end = start + operatorsPerPage;
    const paginatedOperators = filteredOperators.slice(start, end);
    
    // Renderizar grid
    const grid = document.getElementById('operatorsGrid');
    if (!grid) return;
    
    grid.innerHTML = paginatedOperators.map(op => `
        <div class="operator-card" data-id="${op.id}">
            <div class="operator-header">
                <span><i class="fas fa-id-card"></i> ${op.matricula}</span>
                <span class="operator-badge">${op.funcao}</span>
            </div>
            <div class="operator-body">
                <div class="operator-avatar">${getInitials(op.nome)}</div>
                <div class="operator-info">
                    <div class="operator-name">${op.nome}</div>
                    <div class="operator-meta">
                        <span><i class="fas fa-users"></i> ${op.equipe}</span>
                        <span><i class="fas fa-calendar-alt"></i> Admissão: ${formatDate(op.admissao)}</span>
                    </div>
                    <div class="operator-stats">
                        <div class="stat-item">
                            <div class="stat-label">Meta Diária</div>
                            <div class="stat-number">${op.meta || '-'}</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">Coletados Hoje</div>
                            <div class="stat-number ${op.produtividade.itensColetados >= op.meta ? 'success' : 'warning'}">
                                ${op.produtividade.itensColetados}
                            </div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">Precisão</div>
                            <div class="stat-number success">${op.produtividade.precisao}%</div>
                        </div>
                    </div>
                    ${op.tarefaAtual ? `
                        <div class="current-task">
                            <div class="stat-label">Tarefa Atual: ${op.tarefaAtual.setor}</div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${op.tarefaAtual.progresso}%"></div>
                            </div>
                            <div class="stat-label" style="font-size: 0.7rem; margin-top: 0.25rem;">
                                ${op.tarefaAtual.progresso}% concluído
                            </div>
                        </div>
                    ` : `
                        <div class="current-task">
                            <div class="stat-label" style="color: var(--warning);">
                                <i class="fas fa-clock"></i> Aguardando tarefa
                            </div>
                        </div>
                    `}
                </div>
            </div>
            <div class="operator-footer">
                <div class="operator-status status-${op.situacao === 'field' ? 'field' : op.status}">
                    <i class="fas ${op.situacao === 'field' ? 'fa-running' : op.status === 'active' ? 'fa-check-circle' : 'fa-circle'}"></i>
                    ${op.situacao === 'field' ? 'Em campo' : op.status === 'active' ? 'Ativo' : 'Inativo'}
                </div>
                <div class="operator-actions">
                    <button class="action-btn edit-operator" data-id="${op.id}" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn performance-operator" data-id="${op.id}" title="Desempenho">
                        <i class="fas fa-chart-line"></i>
                    </button>
                    ${op.status === 'active' && op.situacao !== 'field' ? `
                        <button class="action-btn assign-task" data-id="${op.id}" title="Atribuir Tarefa">
                            <i class="fas fa-tasks"></i>
                        </button>
                    ` : ''}
                    <button class="action-btn delete-operator" data-id="${op.id}" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Atualizar estatísticas
    updateOperatorsStats();
    
    // Atualizar paginação
    renderOperatorPagination(totalPages);
    
    // Adicionar eventos
    document.querySelectorAll('.edit-operator').forEach(btn => {
        btn.addEventListener('click', () => editOperator(parseInt(btn.dataset.id)));
    });
    
    document.querySelectorAll('.performance-operator').forEach(btn => {
        btn.addEventListener('click', () => showPerformance(parseInt(btn.dataset.id)));
    });
    
    document.querySelectorAll('.assign-task').forEach(btn => {
        btn.addEventListener('click', () => openTaskModal(parseInt(btn.dataset.id)));
    });
    
    document.querySelectorAll('.delete-operator').forEach(btn => {
        btn.addEventListener('click', () => deleteOperator(parseInt(btn.dataset.id)));
    });
}

// Atualizar estatísticas
function updateOperatorsStats() {
    const total = operadoresData.length;
    const active = operadoresData.filter(op => op.status === 'active').length;
    const field = operadoresData.filter(op => op.situacao === 'field').length;
    
    const produtividadeMedia = operadoresData
        .filter(op => op.produtividade.itensColetados > 0)
        .reduce((sum, op) => sum + op.produtividade.itensColetados, 0) / 
        operadoresData.filter(op => op.produtividade.itensColetados > 0).length || 0;
    
    const totalOperatorsEl = document.getElementById('totalOperators');
    const activeOperatorsEl = document.getElementById('activeOperators');
    const avgProductivityEl = document.getElementById('avgProductivity');
    const fieldOperatorsEl = document.getElementById('fieldOperators');
    
    if (totalOperatorsEl) totalOperatorsEl.textContent = total;
    if (activeOperatorsEl) activeOperatorsEl.textContent = active;
    if (avgProductivityEl) avgProductivityEl.textContent = Math.round(produtividadeMedia);
    if (fieldOperatorsEl) fieldOperatorsEl.textContent = field;
}

// Renderizar paginação
function renderOperatorPagination(totalPages) {
    const paginationEl = document.getElementById('pagination');
    if (!paginationEl) return;
    
    let html = `
        <button ${currentOperatorPage === 1 ? 'disabled' : ''} data-page="${currentOperatorPage - 1}">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="${i === currentOperatorPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    
    html += `
        <button ${currentOperatorPage === totalPages ? 'disabled' : ''} data-page="${currentOperatorPage + 1}">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    paginationEl.innerHTML = html;
    
    paginationEl.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            const page = parseInt(btn.dataset.page);
            if (!isNaN(page) && page !== currentOperatorPage && page >= 1 && page <= totalPages) {
                currentOperatorPage = page;
                renderOperatorsGrid();
            }
        });
    });
}

// Abrir modal de operador
function openOperatorModal(operatorId = null) {
    const modal = document.getElementById('operatorModal');
    const modalTitle = document.getElementById('modalTitle');
    
    if (!modal) return;
    
    currentOperatorId = operatorId;
    
    if (operatorId) {
        modalTitle.textContent = 'Editar Operador';
        const operator = operadoresData.find(op => op.id === operatorId);
        if (operator) {
            document.getElementById('opNome').value = operator.nome;
            document.getElementById('opMatricula').value = operator.matricula;
            document.getElementById('opFuncao').value = operator.funcao;
            document.getElementById('opEquipe').value = operator.equipe;
            document.getElementById('opEmail').value = operator.email;
            document.getElementById('opTelefone').value = operator.telefone;
            document.getElementById('opAdmissao').value = operator.admissao;
            document.getElementById('opStatus').value = operator.status;
            document.getElementById('opMeta').value = operator.meta;
            document.getElementById('opEquipamento').value = operator.equipamento;
            document.getElementById('opObservacoes').value = operator.observacoes;
        }
    } else {
        modalTitle.textContent = 'Novo Operador';
        document.getElementById('operatorForm').reset();
        document.getElementById('opStatus').value = 'active';
        document.getElementById('opMeta').value = '200';
    }
    
    modal.classList.add('active');
}

// Salvar operador
function saveOperator(event) {
    event.preventDefault();
    
    const nome = document.getElementById('opNome').value;
    const matricula = document.getElementById('opMatricula').value;
    const funcao = document.getElementById('opFuncao').value;
    const equipe = document.getElementById('opEquipe').value;
    const email = document.getElementById('opEmail').value;
    const telefone = document.getElementById('opTelefone').value;
    const admissao = document.getElementById('opAdmissao').value;
    const status = document.getElementById('opStatus').value;
    const meta = parseInt(document.getElementById('opMeta').value);
    const equipamento = document.getElementById('opEquipamento').value;
    const observacoes = document.getElementById('opObservacoes').value;
    
    if (!nome || !matricula || !funcao) {
        showNotification('Preencha os campos obrigatórios', 'error');
        return;
    }
    
    if (currentOperatorId) {
        // Editar operador existente
        const operatorIndex = operadoresData.findIndex(op => op.id === currentOperatorId);
        if (operatorIndex !== -1) {
            operadoresData[operatorIndex] = {
                ...operadoresData[operatorIndex],
                nome,
                matricula,
                funcao,
                equipe,
                email,
                telefone,
                admissao,
                status,
                meta,
                equipamento,
                observacoes
            };
            showNotification('Operador atualizado com sucesso!', 'success');
        }
    } else {
        // Criar novo operador
        const newId = Math.max(...operadoresData.map(op => op.id), 0) + 1;
        const newOperator = {
            id: newId,
            nome,
            matricula,
            funcao,
            equipe,
            email,
            telefone,
            admissao,
            status,
            situacao: status === 'active' ? 'active' : 'inactive',
            meta,
            equipamento,
            observacoes,
            produtividade: {
                itensColetados: 0,
                ultimos7Dias: [0, 0, 0, 0, 0, 0, 0],
                precisao: 0,
                tempoMedio: 0
            },
            tarefaAtual: null
        };
        operadoresData.push(newOperator);
        showNotification('Operador criado com sucesso!', 'success');
    }
    
    closeModal();
    renderOperatorsGrid();
}

// Editar operador
function editOperator(id) {
    openOperatorModal(id);
}

// Mostrar desempenho
function showPerformance(id) {
    const operator = operadoresData.find(op => op.id === id);
    if (!operator) return;
    
    const modal = document.getElementById('performanceModal');
    const content = document.getElementById('performanceContent');
    
    const diasSemana = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const produtividade = operator.produtividade.ultimos7Dias;
    
    content.innerHTML = `
        <div class="performance-stats">
            <div class="performance-card">
                <div class="performance-label">Itens Coletados (Hoje)</div>
                <div class="performance-value ${operator.produtividade.itensColetados >= operator.meta ? 'success' : 'warning'}">
                    ${operator.produtividade.itensColetados}
                </div>
                <div class="performance-label">Meta: ${operator.meta}</div>
            </div>
            <div class="performance-card">
                <div class="performance-label">Taxa de Precisão</div>
                <div class="performance-value success">${operator.produtividade.precisao}%</div>
                <div class="performance-label">Tempo médio: ${operator.produtividade.tempoMedio}s/item</div>
            </div>
        </div>
        <div class="performance-chart">
            <h4>Produtividade Últimos 7 Dias</h4>
            <div class="chart-bars">
                ${produtividade.map((valor, index) => {
                    const percentual = (valor / operator.meta) * 100;
                    return `
                        <div class="chart-bar-item">
                            <span class="chart-bar-label">${diasSemana[index]}</span>
                            <div class="chart-bar-track">
                                <div class="chart-bar-fill" style="width: ${percentual}%; background: ${percentual >= 100 ? '#10b981' : '#f59e0b'}">
                                    ${valor}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

// Abrir modal de tarefa
let taskOperatorId = null;
function openTaskModal(operatorId) {
    const operator = operadoresData.find(op => op.id === operatorId);
    if (!operator) return;
    
    taskOperatorId = operatorId;
    const modal = document.getElementById('taskModal');
    const taskOperatorName = document.getElementById('taskOperatorName');
    
    taskOperatorName.value = operator.nome;
    document.getElementById('taskForm').reset();
    document.getElementById('taskDeadline').value = getDefaultDeadline();
    
    modal.classList.add('active');
}

// Salvar tarefa
function saveTask(event) {
    event.preventDefault();
    
    const setor = document.getElementById('taskSetor').value;
    const quantity = parseInt(document.getElementById('taskQuantity').value);
    const deadline = document.getElementById('taskDeadline').value;
    
    if (!setor) {
        showNotification('Selecione um setor', 'error');
        return;
    }
    
    const operatorIndex = operadoresData.findIndex(op => op.id === taskOperatorId);
    if (operatorIndex !== -1) {
        operadoresData[operatorIndex].situacao = 'field';
        operadoresData[operatorIndex].tarefaAtual = {
            setor,
            itens: quantity,
            progresso: 0,
            inicio: new Date().toISOString(),
            prazo: deadline
        };
        showNotification('Tarefa atribuída com sucesso!', 'success');
        renderOperatorsGrid();
    }
    
    closeModal();
}

// Excluir operador
function deleteOperator(id) {
    if (confirm('Tem certeza que deseja excluir este operador?')) {
        operadoresData = operadoresData.filter(op => op.id !== id);
        showNotification('Operador excluído com sucesso!', 'success');
        renderOperatorsGrid();
    }
}

// Formatar data
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Data padrão para prazo (hoje 17:00)
function getDefaultDeadline() {
    const date = new Date();
    date.setHours(17, 0, 0, 0);
    return date.toISOString().slice(0, 16);
}

// Inicializar eventos de operadores
function initOperatorsEvents() {
    const openModalBtn = document.getElementById('openOperatorModal');
    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => openOperatorModal());
    }
    
    const closeModalBtns = document.querySelectorAll('.modal-close, #closeModal, #closeTaskModal');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    const operatorForm = document.getElementById('operatorForm');
    if (operatorForm) {
        operatorForm.addEventListener('submit', saveOperator);
    }
    
    const taskForm = document.getElementById('taskForm');
    if (taskForm) {
        taskForm.addEventListener('submit', saveTask);
    }
    
    const searchOperator = document.getElementById('searchOperator');
    const filterStatus = document.getElementById('filterStatus');
    const filterTeam = document.getElementById('filterTeam');
    const filterFunction = document.getElementById('filterFunction');
    
    if (searchOperator) searchOperator.addEventListener('input', () => {
        currentOperatorPage = 1;
        renderOperatorsGrid();
    });
    if (filterStatus) filterStatus.addEventListener('change', () => {
        currentOperatorPage = 1;
        renderOperatorsGrid();
    });
    if (filterTeam) filterTeam.addEventListener('change', () => {
        currentOperatorPage = 1;
        renderOperatorsGrid();
    });
    if (filterFunction) filterFunction.addEventListener('change', () => {
        currentOperatorPage = 1;
        renderOperatorsGrid();
    });
}

// ====================
// ATUALIZAR FUNÇÃO DOMContentLoaded
// ====================
window.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateDashboard();
    initReports();
    renderReportTable();
    initSettingsTabs();
    initSettingsEvents();
    loadSettings();
    initUsersEvents();
    renderUsersTable();
    initOperatorsEvents();
    renderOperatorsGrid();
    
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });
});
});
