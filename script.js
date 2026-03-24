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
// MENU MOBILE - VERSÃO SIMPLES
// ====================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

if (mobileMenuBtn && navMenu) {
    // Abrir/fechar menu
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Fechar ao clicar em qualquer link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
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
// ====================
// SISTEMA DE AUDITORIA
// ====================

// Dados mockados de logs de auditoria
let auditLogs = [
    {
        id: 1,
        dataHora: "2026-03-24 08:15:23",
        usuario: "Vinicius Erose",
        tipo: "login",
        modulo: "dashboard",
        acao: "Login realizado com sucesso",
        detalhes: { ip: "192.168.1.100", dispositivo: "Chrome/Windows" },
        ip: "192.168.1.100"
    },
    {
        id: 2,
        dataHora: "2026-03-24 08:30:45",
        usuario: "Ana Carolina",
        tipo: "update",
        modulo: "inventario",
        acao: "Atualizou quantidade do item 'Notebook Dell' de 12 para 15",
        detalhes: { 
            item: "Notebook Dell",
            campo: "quantidade",
            valorAnterior: 12,
            valorNovo: 15
        },
        ip: "192.168.1.101"
    },
    {
        id: 3,
        dataHora: "2026-03-24 09:00:12",
        usuario: "Roberto Almeida",
        tipo: "create",
        modulo: "operadores",
        acao: "Cadastrou novo operador: João Paulo Santos",
        detalhes: {
            operador: "João Paulo Santos",
            matricula: "OP001",
            funcao: "Coletor"
        },
        ip: "192.168.1.102"
    },
    {
        id: 4,
        dataHora: "2026-03-24 09:45:33",
        usuario: "Mariana Costa",
        tipo: "export",
        modulo: "relatorios",
        acao: "Exportou relatório de inventário para PDF",
        detalhes: {
            tipoRelatorio: "Completo",
            periodo: "Março/2026"
        },
        ip: "192.168.1.103"
    },
    {
        id: 5,
        dataHora: "2026-03-24 10:20:18",
        usuario: "Carlos Eduardo",
        tipo: "error",
        modulo: "inventario",
        acao: "Erro ao sincronizar dados do coletor",
        detalhes: {
            erro: "Timeout de conexão",
            dispositivo: "Coletor TC21"
        },
        ip: "192.168.1.104"
    },
    {
        id: 6,
        dataHora: "2026-03-24 11:05:47",
        usuario: "Vinicius Erose",
        tipo: "delete",
        modulo: "usuarios",
        acao: "Excluiu usuário: Teste Silva",
        detalhes: {
            usuarioId: 99,
            motivo: "Usuário inativo"
        },
        ip: "192.168.1.100"
    },
    {
        id: 7,
        dataHora: "2026-03-24 11:30:22",
        usuario: "Ana Carolina",
        tipo: "login",
        modulo: "dashboard",
        acao: "Login realizado com sucesso",
        detalhes: { ip: "192.168.1.101", dispositivo: "Firefox/Windows" },
        ip: "192.168.1.101"
    },
    {
        id: 8,
        dataHora: "2026-03-24 12:15:09",
        usuario: "Roberto Almeida",
        tipo: "update",
        modulo: "configuracoes",
        acao: "Alterou configurações de notificações",
        detalhes: {
            configuracoes: {
                notifEstoque: "ativado",
                notifRelatorios: "desativado"
            }
        },
        ip: "192.168.1.102"
    },
    {
        id: 9,
        dataHora: "2026-03-24 14:20:35",
        usuario: "Mariana Costa",
        tipo: "import",
        modulo: "inventario",
        acao: "Importou 150 itens via planilha",
        detalhes: {
            arquivo: "inventario_marco.xlsx",
            quantidade: 150
        },
        ip: "192.168.1.103"
    },
    {
        id: 10,
        dataHora: "2026-03-24 15:45:51",
        usuario: "Carlos Eduardo",
        tipo: "logout",
        modulo: "dashboard",
        acao: "Logout realizado",
        detalhes: { duracao: "5h 25min" },
        ip: "192.168.1.104"
    },
    {
        id: 11,
        dataHora: "2026-03-23 10:30:12",
        usuario: "Vinicius Erose",
        tipo: "create",
        modulo: "operadores",
        acao: "Cadastrou novo operador: Maria Oliveira",
        detalhes: {
            operador: "Maria Oliveira",
            matricula: "OP002",
            funcao: "Conferente"
        },
        ip: "192.168.1.100"
    },
    {
        id: 12,
        dataHora: "2026-03-23 14:15:45",
        usuario: "Ana Carolina",
        tipo: "update",
        modulo: "inventario",
        acao: "Atualizou preço do item 'Mouse Logitech' de R$ 79,90 para R$ 89,90",
        detalhes: {
            item: "Mouse Logitech",
            campo: "preco",
            valorAnterior: 79.90,
            valorNovo: 89.90
        },
        ip: "192.168.1.101"
    },
    {
        id: 13,
        dataHora: "2026-03-22 09:00:00",
        usuario: "Roberto Almeida",
        tipo: "login",
        modulo: "dashboard",
        acao: "Login realizado com sucesso",
        detalhes: { ip: "192.168.1.102", dispositivo: "Chrome/Windows" },
        ip: "192.168.1.102"
    },
    {
        id: 14,
        dataHora: "2026-03-22 11:30:22",
        usuario: "Roberto Almeida",
        tipo: "error",
        modulo: "relatorios",
        acao: "Erro ao gerar gráfico",
        detalhes: {
            erro: "Dados inconsistentes",
            relatorio: "Gráfico de Vendas"
        },
        ip: "192.168.1.102"
    },
    {
        id: 15,
        dataHora: "2026-03-21 16:20:10",
        usuario: "Mariana Costa",
        tipo: "export",
        modulo: "relatorios",
        acao: "Exportou relatório de operadores para CSV",
        detalhes: {
            tipoRelatorio: "Operadores",
            formato: "CSV"
        },
        ip: "192.168.1.103"
    }
];

let currentAuditPage = 1;
const auditItemsPerPage = 10;
let activitiesChart = null;
let typeChart = null;

// Renderizar tabela de auditoria
function renderAuditTable() {
    const filteredLogs = getFilteredAuditLogs();
    const totalPages = Math.ceil(filteredLogs.length / auditItemsPerPage);
    const start = (currentAuditPage - 1) * auditItemsPerPage;
    const end = start + auditItemsPerPage;
    const paginatedLogs = filteredLogs.slice(start, end);
    
    const tbody = document.getElementById('auditTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = paginatedLogs.map(log => `
        <tr>
            <td>${log.dataHora}</td>
            <td><strong>${log.usuario}</strong></td>
            <td><span class="event-badge event-${log.tipo}">${getEventTypeName(log.tipo)}</span></td>
            <td><span class="module-badge">${getModuleName(log.modulo)}</span></td>
            <td>
                <div class="action-details" onclick="showEventDetails(${log.id})">
                    ${truncateText(log.acao, 50)}
                    <i class="fas fa-info-circle" style="font-size: 0.7rem;"></i>
                </div>
            </td>
            <td>${log.ip}</td>
        </tr>
    `).join('');
    
    // Atualizar contador
    const recordsCount = document.getElementById('recordsCount');
    if (recordsCount) {
        recordsCount.textContent = `Mostrando ${paginatedLogs.length} de ${filteredLogs.length} registros`;
    }
    
    // Atualizar estatísticas
    updateAuditStats();
    updateAuditCharts(filteredLogs);
    
    // Atualizar paginação
    renderAuditPagination(totalPages);
}

// Obter logs filtrados
function getFilteredAuditLogs() {
    let logs = [...auditLogs];
    
    const period = document.getElementById('periodFilter')?.value;
    const eventType = document.getElementById('eventTypeFilter')?.value;
    const module = document.getElementById('moduleFilter')?.value;
    const user = document.getElementById('userFilter')?.value.toLowerCase();
    const ip = document.getElementById('ipFilter')?.value.toLowerCase();
    const startDate = document.getElementById('startDate')?.value;
    const endDate = document.getElementById('endDate')?.value;
    
    // Filtrar por período
    if (period === 'today') {
        const today = new Date().toISOString().split('T')[0];
        logs = logs.filter(log => log.dataHora.split(' ')[0] === today);
    } else if (period === 'yesterday') {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        logs = logs.filter(log => log.dataHora.split(' ')[0] === yesterdayStr);
    } else if (period === 'last7') {
        const last7 = new Date();
        last7.setDate(last7.getDate() - 7);
        logs = logs.filter(log => new Date(log.dataHora) >= last7);
    } else if (period === 'last30') {
        const last30 = new Date();
        last30.setDate(last30.getDate() - 30);
        logs = logs.filter(log => new Date(log.dataHora) >= last30);
    } else if (period === 'custom' && startDate && endDate) {
        logs = logs.filter(log => {
            const logDate = log.dataHora.split(' ')[0];
            return logDate >= startDate && logDate <= endDate;
        });
    }
    
    // Filtrar por tipo de evento
    if (eventType !== 'all') {
        logs = logs.filter(log => log.tipo === eventType);
    }
    
    // Filtrar por módulo
    if (module !== 'all') {
        logs = logs.filter(log => log.modulo === module);
    }
    
    // Filtrar por usuário
    if (user) {
        logs = logs.filter(log => log.usuario.toLowerCase().includes(user));
    }
    
    // Filtrar por IP
    if (ip) {
        logs = logs.filter(log => log.ip.toLowerCase().includes(ip));
    }
    
    // Ordenar por data (mais recente primeiro)
    logs.sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));
    
    return logs;
}

// Nome do tipo de evento
function getEventTypeName(tipo) {
    const types = {
        login: 'Login',
        logout: 'Logout',
        create: 'Criação',
        update: 'Atualização',
        delete: 'Exclusão',
        export: 'Exportação',
        import: 'Importação',
        error: 'Erro'
    };
    return types[tipo] || tipo;
}

// Nome do módulo
function getModuleName(modulo) {
    const modules = {
        dashboard: 'Dashboard',
        inventario: 'Inventário',
        relatorios: 'Relatórios',
        usuarios: 'Usuários',
        operadores: 'Operadores',
        configuracoes: 'Configurações'
    };
    return modules[modulo] || modulo;
}

// Truncar texto
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Atualizar estatísticas
function updateAuditStats() {
    const filteredLogs = getFilteredAuditLogs();
    const totalEvents = filteredLogs.length;
    
    const today = new Date().toISOString().split('T')[0];
    const activeUsersToday = [...new Set(filteredLogs
        .filter(log => log.dataHora.split(' ')[0] === today && log.tipo === 'login')
        .map(log => log.usuario))].length;
    
    const changesToday = filteredLogs.filter(log => 
        log.dataHora.split(' ')[0] === today && 
        (log.tipo === 'create' || log.tipo === 'update' || log.tipo === 'delete')
    ).length;
    
    const criticalAlerts = filteredLogs.filter(log => log.tipo === 'error').length;
    
    const totalEventsEl = document.getElementById('totalEvents');
    const activeUsersTodayEl = document.getElementById('activeUsersToday');
    const changesTodayEl = document.getElementById('changesToday');
    const criticalAlertsEl = document.getElementById('criticalAlerts');
    
    if (totalEventsEl) totalEventsEl.textContent = totalEvents;
    if (activeUsersTodayEl) activeUsersTodayEl.textContent = activeUsersToday;
    if (changesTodayEl) changesTodayEl.textContent = changesToday;
    if (criticalAlertsEl) criticalAlertsEl.textContent = criticalAlerts;
}

// Atualizar gráficos
function updateAuditCharts(logs) {
    // Gráfico de atividades por dia
    const last7Days = [];
    const activityCount = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        last7Days.push(dateStr.substring(5));
        
        const count = logs.filter(log => log.dataHora.split(' ')[0] === dateStr).length;
        activityCount.push(count);
    }
    
    const ctxLine = document.getElementById('activitiesChart');
    if (ctxLine) {
        if (activitiesChart) activitiesChart.destroy();
        activitiesChart = new Chart(ctxLine, {
            type: 'line',
            data: {
                labels: last7Days,
                datasets: [{
                    label: 'Atividades',
                    data: activityCount,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.3,
                    fill: true
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
                            stepSize: 1,
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
    
    // Gráfico de pizza por tipo
    const typeCount = {};
    logs.forEach(log => {
        typeCount[log.tipo] = (typeCount[log.tipo] || 0) + 1;
    });
    
    const typeLabels = Object.keys(typeCount).map(t => getEventTypeName(t));
    const typeData = Object.values(typeCount);
    const typeColors = {
        login: '#3b82f6',
        logout: '#6b7280',
        create: '#10b981',
        update: '#f59e0b',
        delete: '#ef4444',
        export: '#8b5cf6',
        import: '#3b82f6',
        error: '#ef4444'
    };
    
    const ctxPie = document.getElementById('typeChart');
    if (ctxPie) {
        if (typeChart) typeChart.destroy();
        typeChart = new Chart(ctxPie, {
            type: 'pie',
            data: {
                labels: typeLabels,
                datasets: [{
                    data: typeData,
                    backgroundColor: Object.keys(typeCount).map(t => typeColors[t] || '#3b82f6')
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
}

// Renderizar paginação
function renderAuditPagination(totalPages) {
    const paginationEl = document.getElementById('pagination');
    if (!paginationEl) return;
    
    let html = `
        <button ${currentAuditPage === 1 ? 'disabled' : ''} data-page="${currentAuditPage - 1}">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    const startPage = Math.max(1, currentAuditPage - 2);
    const endPage = Math.min(totalPages, currentAuditPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="${i === currentAuditPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    
    html += `
        <button ${currentAuditPage === totalPages ? 'disabled' : ''} data-page="${currentAuditPage + 1}">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    paginationEl.innerHTML = html;
    
    paginationEl.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            const page = parseInt(btn.dataset.page);
            if (!isNaN(page) && page !== currentAuditPage && page >= 1 && page <= totalPages) {
                currentAuditPage = page;
                renderAuditTable();
            }
        });
    });
}

// Mostrar detalhes do evento
function showEventDetails(eventId) {
    const event = auditLogs.find(log => log.id === eventId);
    if (!event) return;
    
    const modal = document.getElementById('eventDetailModal');
    const content = document.getElementById('eventDetailContent');
    
    content.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <strong>Data/Hora:</strong> ${event.dataHora}
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Usuário:</strong> ${event.usuario}
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Tipo:</strong> <span class="event-badge event-${event.tipo}">${getEventTypeName(event.tipo)}</span>
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Módulo:</strong> ${getModuleName(event.modulo)}
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Ação:</strong> ${event.acao}
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>IP:</strong> ${event.ip}
        </div>
        ${event.detalhes ? `
            <div style="margin-bottom: 1rem;">
                <strong>Detalhes:</strong>
                <pre class="diff-view">${JSON.stringify(event.detalhes, null, 2)}</pre>
            </div>
        ` : ''}
    `;
    
    modal.classList.add('active');
}

// Exportar log de auditoria
function exportAuditLog() {
    const filteredLogs = getFilteredAuditLogs();
    const headers = ['Data/Hora', 'Usuário', 'Tipo', 'Módulo', 'Ação', 'IP', 'Detalhes'];
    
    const rows = filteredLogs.map(log => [
        log.dataHora,
        log.usuario,
        getEventTypeName(log.tipo),
        getModuleName(log.modulo),
        log.acao,
        log.ip,
        JSON.stringify(log.detalhes)
    ]);
    
    const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');
    
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `auditoria_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('Log de auditoria exportado com sucesso!', 'success');
}

// Inicializar eventos de auditoria
function initAuditEvents() {
    // Filtros
    const periodFilter = document.getElementById('periodFilter');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    
    if (periodFilter) {
        periodFilter.addEventListener('change', () => {
            const customDates = document.querySelectorAll('.custom-date');
            if (periodFilter.value === 'custom') {
                customDates.forEach(el => el.style.display = 'block');
            } else {
                customDates.forEach(el => el.style.display = 'none');
            }
        });
    }
    
    const applyFilters = document.getElementById('applyFilters');
    const clearFilters = document.getElementById('clearFilters');
    const refreshLog = document.getElementById('refreshLog');
    const exportAudit = document.getElementById('exportAuditLog');
    const toggleFilters = document.getElementById('toggleFilters');
    
    if (applyFilters) {
        applyFilters.addEventListener('click', () => {
            currentAuditPage = 1;
            renderAuditTable();
            showNotification('Filtros aplicados', 'success');
        });
    }
    
    if (clearFilters) {
        clearFilters.addEventListener('click', () => {
            if (periodFilter) periodFilter.value = 'today';
            if (startDate) startDate.value = '';
            if (endDate) endDate.value = '';
            const eventTypeFilter = document.getElementById('eventTypeFilter');
            const moduleFilter = document.getElementById('moduleFilter');
            const userFilter = document.getElementById('userFilter');
            const ipFilter = document.getElementById('ipFilter');
            
            if (eventTypeFilter) eventTypeFilter.value = 'all';
            if (moduleFilter) moduleFilter.value = 'all';
            if (userFilter) userFilter.value = '';
            if (ipFilter) ipFilter.value = '';
            
            const customDates = document.querySelectorAll('.custom-date');
            customDates.forEach(el => el.style.display = 'none');
            
            currentAuditPage = 1;
            renderAuditTable();
            showNotification('Filtros limpos', 'info');
        });
    }
    
    if (refreshLog) {
        refreshLog.addEventListener('click', () => {
            renderAuditTable();
            showNotification('Log atualizado', 'success');
        });
    }
    
    if (exportAudit) {
        exportAudit.addEventListener('click', exportAuditLog);
    }
    
    if (toggleFilters) {
        const filtersContent = document.getElementById('filtersContent');
        let filtersVisible = true;
        toggleFilters.addEventListener('click', () => {
            filtersVisible = !filtersVisible;
            filtersContent.style.display = filtersVisible ? 'block' : 'none';
            toggleFilters.innerHTML = filtersVisible ? 
                '<i class="fas fa-chevron-up"></i>' : 
                '<i class="fas fa-chevron-down"></i>';
        });
    }
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
    initAuditEvents();
    renderAuditTable();
    
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
// GERENCIAMENTO DE SETORES
// ====================

// Dados mockados de setores
let setoresData = [
    {
        id: 1,
        nome: "Almoxarifado Central",
        codigo: "ALM-001",
        tipo: "almoxarifado",
        responsavel: "Carlos Silva",
        capacidade: 2000,
        status: "active",
        localizacao: "Prédio A, Térreo",
        descricao: "Almoxarifado principal da empresa",
        coordenadas: { lat: "-23.5505", lng: "-46.6333" },
        estatisticas: {
            itensAtuais: 1520,
            ultimaContagem: "2026-03-24",
            contagensAno: 12,
            ocupacao: 76
        },
        itens: [
            { codigo: "PROD-001", nome: "Parafusos", quantidade: 500, localizacao: "Prateleira A1", ultimaContagem: "2026-03-24" },
            { codigo: "PROD-002", nome: "Porcas", quantidade: 450, localizacao: "Prateleira A2", ultimaContagem: "2026-03-24" },
            { codigo: "PROD-003", nome: "Arruelas", quantidade: 570, localizacao: "Prateleira A3", ultimaContagem: "2026-03-23" }
        ]
    },
    {
        id: 2,
        nome: "Setor de Produção",
        codigo: "PRO-002",
        tipo: "producao",
        responsavel: "Mariana Oliveira",
        capacidade: 1500,
        status: "active",
        localizacao: "Prédio B, 1º andar",
        descricao: "Linha de produção principal",
        coordenadas: { lat: "-23.5510", lng: "-46.6340" },
        estatisticas: {
            itensAtuais: 980,
            ultimaContagem: "2026-03-23",
            contagensAno: 8,
            ocupacao: 65
        },
        itens: [
            { codigo: "PROD-004", nome: "Componente X", quantidade: 320, localizacao: "Esteira 1", ultimaContagem: "2026-03-23" },
            { codigo: "PROD-005", nome: "Componente Y", quantidade: 280, localizacao: "Esteira 2", ultimaContagem: "2026-03-23" },
            { codigo: "PROD-006", nome: "Componente Z", quantidade: 380, localizacao: "Esteira 3", ultimaContagem: "2026-03-22" }
        ]
    },
    {
        id: 3,
        nome: "Expedição",
        codigo: "EXP-003",
        tipo: "expedicao",
        responsavel: "Roberto Almeida",
        capacidade: 800,
        status: "active",
        localizacao: "Prédio C, Térreo",
        descricao: "Área de expedição e carregamento",
        coordenadas: { lat: "-23.5520", lng: "-46.6350" },
        estatisticas: {
            itensAtuais: 430,
            ultimaContagem: "2026-03-24",
            contagensAno: 15,
            ocupacao: 54
        },
        itens: [
            { codigo: "PROD-007", nome: "Produto Acabado A", quantidade: 150, localizacao: "Docas 1-2", ultimaContagem: "2026-03-24" },
            { codigo: "PROD-008", nome: "Produto Acabado B", quantidade: 280, localizacao: "Docas 3-4", ultimaContagem: "2026-03-24" }
        ]
    },
    {
        id: 4,
        nome: "Estoque de Matéria Prima",
        codigo: "EMP-004",
        tipo: "estoque",
        responsavel: "Ana Paula Souza",
        capacidade: 3000,
        status: "active",
        localizacao: "Prédio D, Galpão 2",
        descricao: "Armazenamento de matérias-primas",
        coordenadas: { lat: "-23.5530", lng: "-46.6360" },
        estatisticas: {
            itensAtuais: 2450,
            ultimaContagem: "2026-03-22",
            contagensAno: 10,
            ocupacao: 82
        },
        itens: [
            { codigo: "MP-001", nome: "Aço Inox", quantidade: 1200, localizacao: "Pátio A", ultimaContagem: "2026-03-22" },
            { codigo: "MP-002", nome: "Alumínio", quantidade: 800, localizacao: "Pátio B", ultimaContagem: "2026-03-22" },
            { codigo: "MP-003", nome: "Plástico", quantidade: 450, localizacao: "Silo 1", ultimaContagem: "2026-03-21" }
        ]
    },
    {
        id: 5,
        nome: "Área Administrativa",
        codigo: "ADM-005",
        tipo: "administrativo",
        responsavel: "Patrícia Lima",
        capacidade: 300,
        status: "active",
        localizacao: "Prédio A, 2º andar",
        descricao: "Materiais de escritório e administrativos",
        coordenadas: { lat: "-23.5508", lng: "-46.6338" },
        estatisticas: {
            itensAtuais: 180,
            ultimaContagem: "2026-03-20",
            contagensAno: 6,
            ocupacao: 60
        },
        itens: [
            { codigo: "ADM-001", nome: "Papel A4", quantidade: 50, localizacao: "Armário 1", ultimaContagem: "2026-03-20" },
            { codigo: "ADM-002", nome: "Canetas", quantidade: 80, localizacao: "Armário 2", ultimaContagem: "2026-03-20" },
            { codigo: "ADM-003", nome: "Pastas", quantidade: 50, localizacao: "Armário 3", ultimaContagem: "2026-03-19" }
        ]
    },
    {
        id: 6,
        nome: "Almoxarifado Secundário",
        codigo: "ALM-006",
        tipo: "almoxarifado",
        responsavel: "João Paulo Santos",
        capacidade: 1000,
        status: "inactive",
        localizacao: "Prédio E, Galpão 1",
        descricao: "Almoxarifado auxiliar (em reforma)",
        coordenadas: { lat: "-23.5540", lng: "-46.6370" },
        estatisticas: {
            itensAtuais: 0,
            ultimaContagem: "2026-03-15",
            contagensAno: 3,
            ocupacao: 0
        },
        itens: []
    }
];

let currentSectorId = null;
let currentSectorPage = 1;
const sectorsPerPage = 6;

// Renderizar grid de setores
function renderSectorsGrid() {
    const searchTerm = document.getElementById('searchSector')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('filterStatus')?.value || 'all';
    const typeFilter = document.getElementById('filterType')?.value || 'all';
    
    let filteredSectors = setoresData.filter(sector => {
        const matchesSearch = sector.nome.toLowerCase().includes(searchTerm) ||
                             sector.codigo.toLowerCase().includes(searchTerm) ||
                             sector.responsavel.toLowerCase().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || sector.status === statusFilter;
        const matchesType = typeFilter === 'all' || sector.tipo === typeFilter;
        
        return matchesSearch && matchesStatus && matchesType;
    });
    
    // Paginação
    const totalPages = Math.ceil(filteredSectors.length / sectorsPerPage);
    const start = (currentSectorPage - 1) * sectorsPerPage;
    const end = start + sectorsPerPage;
    const paginatedSectors = filteredSectors.slice(start, end);
    
    // Renderizar grid
    const grid = document.getElementById('sectorsGrid');
    if (!grid) return;
    
    grid.innerHTML = paginatedSectors.map(sector => {
        const ocupacao = sector.estatisticas.ocupacao;
        const ocupacaoClass = ocupacao >= 80 ? 'danger' : ocupacao >= 60 ? 'warning' : 'success';
        
        return `
            <div class="sector-card" data-id="${sector.id}">
                <div class="sector-header">
                    <span><i class="fas fa-map-marker-alt"></i> ${sector.codigo}</span>
                    <span class="sector-code">${sector.tipo.toUpperCase()}</span>
                </div>
                <div class="sector-body">
                    <div class="sector-name">
                        ${sector.nome}
                        <span class="sector-type type-${sector.tipo}">${getTipoNome(sector.tipo)}</span>
                    </div>
                    <div class="sector-info">
                        <div class="info-item">
                            <div class="info-label">Responsável</div>
                            <div class="info-value">${sector.responsavel || '-'}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Capacidade</div>
                            <div class="info-value">${sector.capacidade} itens</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Localização</div>
                            <div class="info-value">${sector.localizacao || '-'}</div>
                        </div>
                    </div>
                    <div class="sector-stats">
                        <div class="stat-item">
                            <div class="stat-label">Itens Atuais</div>
                            <div class="stat-number ${ocupacaoClass}">${sector.estatisticas.itensAtuais}</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">Ocupação</div>
                            <div class="stat-number">${ocupacao}%</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">Última Contagem</div>
                            <div class="stat-number">${formatarData(sector.estatisticas.ultimaContagem)}</div>
                        </div>
                    </div>
                    <div class="occupancy-bar">
                        <div class="occupancy-fill" style="width: ${ocupacao}%; background: ${ocupacao >= 80 ? '#ef4444' : ocupacao >= 60 ? '#f59e0b' : '#10b981'}"></div>
                    </div>
                </div>
                <div class="sector-footer">
                    <div class="sector-status status-${sector.status}">
                        <i class="fas ${sector.status === 'active' ? 'fa-check-circle' : 'fa-circle'}"></i>
                        ${sector.status === 'active' ? 'Ativo' : 'Inativo'}
                    </div>
                    <div class="sector-actions">
                        <button class="action-btn view-inventory" data-id="${sector.id}" title="Ver Inventário">
                            <i class="fas fa-boxes"></i>
                        </button>
                        <button class="action-btn view-details" data-id="${sector.id}" title="Detalhes">
                            <i class="fas fa-info-circle"></i>
                        </button>
                        <button class="action-btn edit-sector" data-id="${sector.id}" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-sector" data-id="${sector.id}" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Atualizar estatísticas
    updateSectorsStats();
    
    // Atualizar paginação
    renderSectorPagination(totalPages);
    
    // Adicionar eventos
    document.querySelectorAll('.edit-sector').forEach(btn => {
        btn.addEventListener('click', () => editSector(parseInt(btn.dataset.id)));
    });
    
    document.querySelectorAll('.view-details').forEach(btn => {
        btn.addEventListener('click', () => showSectorDetails(parseInt(btn.dataset.id)));
    });
    
    document.querySelectorAll('.view-inventory').forEach(btn => {
        btn.addEventListener('click', () => showSectorInventory(parseInt(btn.dataset.id)));
    });
    
    document.querySelectorAll('.delete-sector').forEach(btn => {
        btn.addEventListener('click', () => deleteSector(parseInt(btn.dataset.id)));
    });
}

// Nome do tipo de setor
function getTipoNome(tipo) {
    const tipos = {
        almoxarifado: 'Almoxarifado',
        producao: 'Produção',
        expedicao: 'Expedição',
        estoque: 'Estoque',
        administrativo: 'Administrativo'
    };
    return tipos[tipo] || tipo;
}

// Formatar data
function formatarData(dataString) {
    if (!dataString) return '-';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
}

// Atualizar estatísticas dos setores
function updateSectorsStats() {
    const totalSectors = setoresData.length;
    const totalItems = setoresData.reduce((sum, sector) => sum + sector.estatisticas.itensAtuais, 0);
    const avgOccupancy = setoresData.filter(s => s.status === 'active').reduce((sum, sector) => sum + sector.estatisticas.ocupacao, 0) / 
                         setoresData.filter(s => s.status === 'active').length || 0;
    
    const lastCount = setoresData
        .filter(s => s.status === 'active')
        .sort((a, b) => new Date(b.estatisticas.ultimaContagem) - new Date(a.estatisticas.ultimaContagem))[0]?.estatisticas.ultimaContagem || 'Hoje';
    
    const totalSectorsEl = document.getElementById('totalSectors');
    const totalItemsEl = document.getElementById('totalItems');
    const avgOccupancyEl = document.getElementById('avgOccupancy');
    const lastCountEl = document.getElementById('lastCount');
    
    if (totalSectorsEl) totalSectorsEl.textContent = totalSectors;
    if (totalItemsEl) totalItemsEl.textContent = totalItems;
    if (avgOccupancyEl) avgOccupancyEl.textContent = Math.round(avgOccupancy);
    if (lastCountEl) lastCountEl.textContent = formatarData(lastCount);
}

// Renderizar paginação
function renderSectorPagination(totalPages) {
    const paginationEl = document.getElementById('pagination');
    if (!paginationEl) return;
    
    let html = `
        <button ${currentSectorPage === 1 ? 'disabled' : ''} data-page="${currentSectorPage - 1}">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    const startPage = Math.max(1, currentSectorPage - 2);
    const endPage = Math.min(totalPages, currentSectorPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="${i === currentSectorPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    
    html += `
        <button ${currentSectorPage === totalPages ? 'disabled' : ''} data-page="${currentSectorPage + 1}">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    paginationEl.innerHTML = html;
    
    paginationEl.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            const page = parseInt(btn.dataset.page);
            if (!isNaN(page) && page !== currentSectorPage && page >= 1 && page <= totalPages) {
                currentSectorPage = page;
                renderSectorsGrid();
            }
        });
    });
}

// Abrir modal de setor
function openSectorModal(sectorId = null) {
    const modal = document.getElementById('sectorModal');
    const modalTitle = document.getElementById('modalTitle');
    
    if (!modal) return;
    
    currentSectorId = sectorId;
    
    if (sectorId) {
        modalTitle.textContent = 'Editar Setor';
        const sector = setoresData.find(s => s.id === sectorId);
        if (sector) {
            document.getElementById('sectorNome').value = sector.nome;
            document.getElementById('sectorCodigo').value = sector.codigo;
            document.getElementById('sectorTipo').value = sector.tipo;
            document.getElementById('sectorResponsavel').value = sector.responsavel;
            document.getElementById('sectorCapacidade').value = sector.capacidade;
            document.getElementById('sectorStatus').value = sector.status;
            document.getElementById('sectorLocalizacao').value = sector.localizacao;
            document.getElementById('sectorDescricao').value = sector.descricao;
            document.getElementById('sectorLat').value = sector.coordenadas?.lat || '';
            document.getElementById('sectorLng').value = sector.coordenadas?.lng || '';
        }
    } else {
        modalTitle.textContent = 'Novo Setor';
        document.getElementById('sectorForm').reset();
        document.getElementById('sectorStatus').value = 'active';
        document.getElementById('sectorCapacidade').value = '500';
    }
    
    modal.classList.add('active');
}

// Salvar setor
function saveSector(event) {
    event.preventDefault();
    
    const nome = document.getElementById('sectorNome').value;
    const codigo = document.getElementById('sectorCodigo').value;
    const tipo = document.getElementById('sectorTipo').value;
    const responsavel = document.getElementById('sectorResponsavel').value;
    const capacidade = parseInt(document.getElementById('sectorCapacidade').value);
    const status = document.getElementById('sectorStatus').value;
    const localizacao = document.getElementById('sectorLocalizacao').value;
    const descricao = document.getElementById('sectorDescricao').value;
    const lat = document.getElementById('sectorLat').value;
    const lng = document.getElementById('sectorLng').value;
    
    if (!nome || !codigo || !tipo) {
        showNotification('Preencha os campos obrigatórios', 'error');
        return;
    }
    
    if (currentSectorId) {
        // Editar setor existente
        const sectorIndex = setoresData.findIndex(s => s.id === currentSectorId);
        if (sectorIndex !== -1) {
            setoresData[sectorIndex] = {
                ...setoresData[sectorIndex],
                nome,
                codigo,
                tipo,
                responsavel,
                capacidade,
                status,
                localizacao,
                descricao,
                coordenadas: { lat, lng }
            };
            showNotification('Setor atualizado com sucesso!', 'success');
        }
    } else {
        // Criar novo setor
        const newId = Math.max(...setoresData.map(s => s.id), 0) + 1;
        const newSector = {
            id: newId,
            nome,
            codigo,
            tipo,
            responsavel,
            capacidade,
            status,
            localizacao,
            descricao,
            coordenadas: { lat, lng },
            estatisticas: {
                itensAtuais: 0,
                ultimaContagem: new Date().toISOString().split('T')[0],
                contagensAno: 0,
                ocupacao: 0
            },
            itens: []
        };
        setoresData.push(newSector);
        showNotification('Setor criado com sucesso!', 'success');
    }
    
    closeModal();
    renderSectorsGrid();
}

// Editar setor
function editSector(id) {
    openSectorModal(id);
}

// Mostrar detalhes do setor
function showSectorDetails(id) {
    const sector = setoresData.find(s => s.id === id);
    if (!sector) return;
    
    const modal = document.getElementById('sectorDetailModal');
    const content = document.getElementById('sectorDetailContent');
    
    content.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <strong>Código:</strong> ${sector.codigo}
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Tipo:</strong> <span class="sector-type type-${sector.tipo}">${getTipoNome(sector.tipo)}</span>
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Responsável:</strong> ${sector.responsavel || '-'}
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Capacidade:</strong> ${sector.capacidade} itens
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Itens Atuais:</strong> ${sector.estatisticas.itensAtuais}
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Ocupação:</strong> ${sector.estatisticas.ocupacao}%
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Localização:</strong> ${sector.localizacao || '-'}
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Descrição:</strong><br>${sector.descricao || '-'}
        </div>
        ${sector.coordenadas.lat && sector.coordenadas.lng ? `
            <div style="margin-bottom: 1rem;">
                <strong>Coordenadas:</strong><br>
                Lat: ${sector.coordenadas.lat}<br>
                Lng: ${sector.coordenadas.lng}
            </div>
        ` : ''}
        <div style="margin-bottom: 1rem;">
            <strong>Última Contagem:</strong> ${formatarData(sector.estatisticas.ultimaContagem)}
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Contagens no Ano:</strong> ${sector.estatisticas.contagensAno}
        </div>
    `;
    
    modal.classList.add('active');
}

// Mostrar inventário do setor
function showSectorInventory(id) {
    const sector = setoresData.find(s => s.id === id);
    if (!sector) return;
    
    const modal = document.getElementById('inventoryModal');
    const statsContainer = document.getElementById('inventoryStats');
    const tableBody = document.getElementById('inventoryTableBody');
    
    // Estatísticas
    statsContainer.innerHTML = `
        <div class="inventory-stat">
            <div class="inventory-stat-value">${sector.estatisticas.itensAtuais}</div>
            <div class="inventory-stat-label">Total de Itens</div>
        </div>
        <div class="inventory-stat">
            <div class="inventory-stat-value">${sector.itens.length}</div>
            <div class="inventory-stat-label">Itens Cadastrados</div>
        </div>
        <div class="inventory-stat">
            <div class="inventory-stat-value">${sector.estatisticas.ocupacao}%</div>
            <div class="inventory-stat-label">Ocupação</div>
        </div>
        <div class="inventory-stat">
            <div class="inventory-stat-value">${formatarData(sector.estatisticas.ultimaContagem)}</div>
            <div class="inventory-stat-label">Última Contagem</div>
        </div>
    `;
    
    // Tabela de itens
    tableBody.innerHTML = sector.itens.map(item => `
        <tr>
            <td>${item.codigo}</td>
            <td><strong>${item.nome}</strong></td>
            <td>${item.quantidade}</td>
            <td>${item.localizacao}</td>
            <td>${formatarData(item.ultimaContagem)}</td>
        </tr>
    `).join('');
    
    if (sector.itens.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 2rem;">
                    <i class="fas fa-box-open" style="font-size: 2rem; opacity: 0.5;"></i>
                    <p>Nenhum item cadastrado neste setor</p>
                </td>
            </tr>
        `;
    }
    
    modal.classList.add('active');
}

// Excluir setor
function deleteSector(id) {
    if (confirm('Tem certeza que deseja excluir este setor? Todos os itens serão movidos para um setor padrão.')) {
        setoresData = setoresData.filter(s => s.id !== id);
        showNotification('Setor excluído com sucesso!', 'success');
        renderSectorsGrid();
    }
}

// Inicializar eventos de setores
function initSectorsEvents() {
    const openModalBtn = document.getElementById('openSectorModal');
    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => openSectorModal());
    }
    
    const closeModalBtns = document.querySelectorAll('.modal-close, #closeModal');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    const sectorForm = document.getElementById('sectorForm');
    if (sectorForm) {
        sectorForm.addEventListener('submit', saveSector);
    }
    
    const searchSector = document.getElementById('searchSector');
    const filterStatus = document.getElementById('filterStatus');
    const filterType = document.getElementById('filterType');
    
    if (searchSector) searchSector.addEventListener('input', () => {
        currentSectorPage = 1;
        renderSectorsGrid();
    });
    if (filterStatus) filterStatus.addEventListener('change', () => {
        currentSectorPage = 1;
        renderSectorsGrid();
    });
    if (filterType) filterType.addEventListener('change', () => {
        currentSectorPage = 1;
        renderSectorsGrid();
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
    initAuditEvents();
    renderAuditTable();
    initSectorsEvents();
    renderSectorsGrid();
    
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
// GERENCIAMENTO DE EQUIPAMENTOS
// ====================

// Dados mockados de equipamentos
let equipamentosData = [
    {
        id: 1,
        nome: "Coletor TC21",
        serial: "TC21-2024-001",
        tipo: "coletor",
        modelo: "TC21",
        fabricante: "Zebra",
        aquisicao: "2024-01-15",
        status: "active",
        operadorId: 1,
        operadorNome: "João Paulo Santos",
        ultimaCalibracao: "2026-01-15",
        proximaCalibracao: "2026-07-15",
        observacoes: "Coletor principal da equipe Alpha",
        manutencoes: [
            { data: "2025-12-10", tipo: "Calibração", descricao: "Calibração de leitor de código de barras" },
            { data: "2025-08-22", tipo: "Revisão", descricao: "Revisão geral e limpeza" }
        ]
    },
    {
        id: 2,
        nome: "Coletor MC93",
        serial: "MC93-2024-002",
        tipo: "coletor",
        modelo: "MC93",
        fabricante: "Honeywell",
        aquisicao: "2024-02-20",
        status: "active",
        operadorId: 2,
        operadorNome: "Maria Oliveira",
        ultimaCalibracao: "2026-02-20",
        proximaCalibracao: "2026-08-20",
        observacoes: "Coletor com leitor de alta performance",
        manutencoes: [
            { data: "2026-02-20", tipo: "Calibração", descricao: "Calibração padrão" }
        ]
    },
    {
        id: 3,
        nome: "Tablet Pro X5",
        serial: "TAB-2024-003",
        tipo: "tablet",
        modelo: "X5 Pro",
        fabricante: "Samsung",
        aquisicao: "2024-03-10",
        status: "maintenance",
        operadorId: null,
        operadorNome: null,
        ultimaCalibracao: "2025-10-15",
        proximaCalibracao: "2026-04-15",
        observacoes: "Em manutenção - Tela danificada",
        manutencoes: [
            { data: "2026-03-15", tipo: "Manutenção", descricao: "Substituição de tela" },
            { data: "2025-10-15", tipo: "Calibração", descricao: "Calibração de bateria" }
        ]
    },
    {
        id: 4,
        nome: "Smartphone X5",
        serial: "SMP-2024-004",
        tipo: "smartphone",
        modelo: "X5",
        fabricante: "Motorola",
        aquisicao: "2024-04-05",
        status: "active",
        operadorId: 4,
        operadorNome: "Ana Paula Souza",
        ultimaCalibracao: "2026-01-10",
        proximaCalibracao: "2026-07-10",
        observacoes: "Aplicativo de coleta instalado",
        manutencoes: [
            { data: "2026-01-10", tipo: "Calibração", descricao: "Calibração de sensores" }
        ]
    },
    {
        id: 5,
        nome: "Impressora Zebra",
        serial: "IMP-2024-005",
        tipo: "impressora",
        modelo: "ZD420",
        fabricante: "Zebra",
        aquisicao: "2024-05-12",
        status: "inactive",
        operadorId: null,
        operadorNome: null,
        ultimaCalibracao: "2025-11-20",
        proximaCalibracao: "2026-05-20",
        observacoes: "Aguardando reposição de cabeçote",
        manutencoes: [
            { data: "2025-11-20", tipo: "Manutenção", descricao: "Limpeza de cabeçote" }
        ]
    },
    {
        id: 6,
        nome: "Coletor TC21",
        serial: "TC21-2024-006",
        tipo: "coletor",
        modelo: "TC21",
        fabricante: "Zebra",
        aquisicao: "2024-06-18",
        status: "active",
        operadorId: 5,
        operadorNome: "Roberto Silva",
        ultimaCalibracao: "2026-02-28",
        proximaCalibracao: "2026-08-28",
        observacoes: "Coletor reserva",
        manutencoes: []
    },
    {
        id: 7,
        nome: "Smartphone A15",
        serial: "SMP-2024-007",
        tipo: "smartphone",
        modelo: "A15",
        fabricante: "Samsung",
        aquisicao: "2024-07-22",
        status: "lost",
        operadorId: null,
        operadorNome: null,
        ultimaCalibracao: "2025-12-01",
        proximaCalibracao: "2026-06-01",
        observacoes: "Equipamento extraviado - Busca em andamento",
        manutencoes: []
    }
];

let currentEquipmentId = null;
let currentEquipmentPage = 1;
const equipmentPerPage = 6;

// Renderizar grid de equipamentos
function renderEquipmentGrid() {
    const searchTerm = document.getElementById('searchEquipment')?.value.toLowerCase() || '';
    const typeFilter = document.getElementById('filterType')?.value || 'all';
    const statusFilter = document.getElementById('filterStatus')?.value || 'all';
    const operatorFilter = document.getElementById('filterOperator')?.value || 'all';
    
    let filteredEquipment = equipamentosData.filter(equip => {
        const matchesSearch = equip.nome.toLowerCase().includes(searchTerm) ||
                             equip.serial.toLowerCase().includes(searchTerm) ||
                             (equip.operadorNome && equip.operadorNome.toLowerCase().includes(searchTerm));
        const matchesType = typeFilter === 'all' || equip.tipo === typeFilter;
        const matchesStatus = statusFilter === 'all' || equip.status === statusFilter;
        const matchesOperator = operatorFilter === 'all' || 
                               (operatorFilter === 'assigned' && equip.operadorId) ||
                               (operatorFilter === 'unassigned' && !equip.operadorId);
        
        return matchesSearch && matchesType && matchesStatus && matchesOperator;
    });
    
    // Paginação
    const totalPages = Math.ceil(filteredEquipment.length / equipmentPerPage);
    const start = (currentEquipmentPage - 1) * equipmentPerPage;
    const end = start + equipmentPerPage;
    const paginatedEquipment = filteredEquipment.slice(start, end);
    
    // Renderizar grid
    const grid = document.getElementById('equipmentGrid');
    if (!grid) return;
    
    grid.innerHTML = paginatedEquipment.map(equip => {
        // Verificar alerta de calibração
        let calibrationAlert = '';
        const hoje = new Date();
        const proxCalibracao = new Date(equip.proximaCalibracao);
        const diasRestantes = Math.ceil((proxCalibracao - hoje) / (1000 * 60 * 60 * 24));
        
        if (equip.status === 'active') {
            if (diasRestantes <= 0) {
                calibrationAlert = '<div class="calibration-alert alert-danger"><i class="fas fa-exclamation-triangle"></i> Calibração vencida!</div>';
            } else if (diasRestantes <= 30) {
                calibrationAlert = `<div class="calibration-alert alert-warning"><i class="fas fa-clock"></i> Calibração em ${diasRestantes} dias</div>`;
            } else {
                calibrationAlert = '<div class="calibration-alert alert-success"><i class="fas fa-check-circle"></i> Calibração em dia</div>';
            }
        }
        
        return `
            <div class="equipment-card" data-id="${equip.id}">
                <div class="equipment-header">
                    <div class="equipment-icon">
                        <i class="fas ${getEquipmentIcon(equip.tipo)}"></i>
                    </div>
                    <span class="equipment-serial">${equip.serial}</span>
                </div>
                <div class="equipment-body">
                    <div class="equipment-name">
                        ${equip.nome}
                        <span class="equipment-type type-${equip.tipo}">${getTipoEquipamentoNome(equip.tipo)}</span>
                    </div>
                    <div class="equipment-info">
                        <div class="info-item">
                            <div class="info-label">Modelo</div>
                            <div class="info-value">${equip.modelo || '-'}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Fabricante</div>
                            <div class="info-value">${equip.fabricante || '-'}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Aquisição</div>
                            <div class="info-value">${formatarData(equip.aquisicao)}</div>
                        </div>
                    </div>
                    <div class="equipment-info">
                        <div class="info-item">
                            <div class="info-label">Operador</div>
                            <div class="info-value">${equip.operadorNome || '<span style="color: var(--warning);">Não atribuído</span>'}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Última Calibração</div>
                            <div class="info-value">${formatarData(equip.ultimaCalibracao)}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Próxima Calibração</div>
                            <div class="info-value">${formatarData(equip.proximaCalibracao)}</div>
                        </div>
                    </div>
                    ${calibrationAlert}
                </div>
                <div class="equipment-footer">
                    <div class="equipment-status status-${equip.status}">
                        <i class="fas ${getStatusIcon(equip.status)}"></i>
                        ${getStatusNome(equip.status)}
                    </div>
                    <div class="equipment-actions">
                        <button class="action-btn view-maintenance" data-id="${equip.id}" title="Histórico de Manutenção">
                            <i class="fas fa-history"></i>
                        </button>
                        ${equip.status !== 'lost' && !equip.operadorId ? `
                            <button class="action-btn assign-equipment" data-id="${equip.id}" title="Atribuir a Operador">
                                <i class="fas fa-user-plus"></i>
                            </button>
                        ` : ''}
                        <button class="action-btn edit-equipment" data-id="${equip.id}" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-equipment" data-id="${equip.id}" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Atualizar estatísticas
    updateEquipmentStats();
    
    // Atualizar paginação
    renderEquipmentPagination(totalPages);
    
    // Adicionar eventos
    document.querySelectorAll('.edit-equipment').forEach(btn => {
        btn.addEventListener('click', () => editEquipment(parseInt(btn.dataset.id)));
    });
    
    document.querySelectorAll('.view-maintenance').forEach(btn => {
        btn.addEventListener('click', () => showMaintenanceHistory(parseInt(btn.dataset.id)));
    });
    
    document.querySelectorAll('.assign-equipment').forEach(btn => {
        btn.addEventListener('click', () => openAssignModal(parseInt(btn.dataset.id)));
    });
    
    document.querySelectorAll('.delete-equipment').forEach(btn => {
        btn.addEventListener('click', () => deleteEquipment(parseInt(btn.dataset.id)));
    });
}

// Ícone do equipamento
function getEquipmentIcon(tipo) {
    const icons = {
        coletor: 'fa-barcode',
        tablet: 'fa-tablet-alt',
        smartphone: 'fa-mobile-alt',
        impressora: 'fa-print',
        acessorio: 'fa-plug'
    };
    return icons[tipo] || 'fa-microchip';
}

// Nome do tipo de equipamento
function getTipoEquipamentoNome(tipo) {
    const tipos = {
        coletor: 'Coletor',
        tablet: 'Tablet',
        smartphone: 'Smartphone',
        impressora: 'Impressora',
        acessorio: 'Acessório'
    };
    return tipos[tipo] || tipo;
}

// Ícone do status
function getStatusIcon(status) {
    const icons = {
        active: 'fa-check-circle',
        maintenance: 'fa-tools',
        inactive: 'fa-circle',
        lost: 'fa-search'
    };
    return icons[status] || 'fa-question-circle';
}

// Nome do status
function getStatusNome(status) {
    const nomes = {
        active: 'Em operação',
        maintenance: 'Em manutenção',
        inactive: 'Inativo',
        lost: 'Extraviado'
    };
    return nomes[status] || status;
}

// Atualizar estatísticas
function updateEquipmentStats() {
    const total = equipamentosData.length;
    const active = equipamentosData.filter(e => e.status === 'active').length;
    const maintenance = equipamentosData.filter(e => e.status === 'maintenance').length;
    const availabilityRate = total > 0 ? Math.round((active / total) * 100) : 0;
    
    const totalEl = document.getElementById('totalEquipment');
    const activeEl = document.getElementById('activeEquipment');
    const maintenanceEl = document.getElementById('maintenanceEquipment');
    const availabilityEl = document.getElementById('availabilityRate');
    
    if (totalEl) totalEl.textContent = total;
    if (activeEl) activeEl.textContent = active;
    if (maintenanceEl) maintenanceEl.textContent = maintenance;
    if (availabilityEl) availabilityEl.textContent = availabilityRate;
}

// Renderizar paginação
function renderEquipmentPagination(totalPages) {
    const paginationEl = document.getElementById('pagination');
    if (!paginationEl) return;
    
    let html = `
        <button ${currentEquipmentPage === 1 ? 'disabled' : ''} data-page="${currentEquipmentPage - 1}">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    const startPage = Math.max(1, currentEquipmentPage - 2);
    const endPage = Math.min(totalPages, currentEquipmentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="${i === currentEquipmentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    
    html += `
        <button ${currentEquipmentPage === totalPages ? 'disabled' : ''} data-page="${currentEquipmentPage + 1}">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    paginationEl.innerHTML = html;
    
    paginationEl.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            const page = parseInt(btn.dataset.page);
            if (!isNaN(page) && page !== currentEquipmentPage && page >= 1 && page <= totalPages) {
                currentEquipmentPage = page;
                renderEquipmentGrid();
            }
        });
    });
}

// Abrir modal de equipamento
function openEquipmentModal(equipmentId = null) {
    const modal = document.getElementById('equipmentModal');
    const modalTitle = document.getElementById('modalTitle');
    
    if (!modal) return;
    
    currentEquipmentId = equipmentId;
    
    // Popular operadores
    const operadorSelect = document.getElementById('equipOperador');
    if (operadorSelect && operadoresData) {
        operadorSelect.innerHTML = '<option value="">Não atribuído</option>';
        operadoresData.filter(op => op.status === 'active').forEach(op => {
            operadorSelect.innerHTML += `<option value="${op.id}">${op.nome} (${op.matricula})</option>`;
        });
    }
    
    if (equipmentId) {
        modalTitle.textContent = 'Editar Equipamento';
        const equip = equipamentosData.find(e => e.id === equipmentId);
        if (equip) {
            document.getElementById('equipNome').value = equip.nome;
            document.getElementById('equipSerial').value = equip.serial;
            document.getElementById('equipTipo').value = equip.tipo;
            document.getElementById('equipModelo').value = equip.modelo;
            document.getElementById('equipFabricante').value = equip.fabricante;
            document.getElementById('equipAquisicao').value = equip.aquisicao;
            document.getElementById('equipStatus').value = equip.status;
            document.getElementById('equipOperador').value = equip.operadorId || '';
            document.getElementById('equipCalibracao').value = equip.ultimaCalibracao;
            document.getElementById('equipProxCalibracao').value = equip.proximaCalibracao;
            document.getElementById('equipObservacoes').value = equip.observacoes;
        }
    } else {
        modalTitle.textContent = 'Novo Equipamento';
        document.getElementById('equipmentForm').reset();
        document.getElementById('equipStatus').value = 'active';
    }
    
    modal.classList.add('active');
}

// Salvar equipamento
function saveEquipment(event) {
    event.preventDefault();
    
    const nome = document.getElementById('equipNome').value;
    const serial = document.getElementById('equipSerial').value;
    const tipo = document.getElementById('equipTipo').value;
    const modelo = document.getElementById('equipModelo').value;
    const fabricante = document.getElementById('equipFabricante').value;
    const aquisicao = document.getElementById('equipAquisicao').value;
    const status = document.getElementById('equipStatus').value;
    const operadorId = document.getElementById('equipOperador').value;
    const ultimaCalibracao = document.getElementById('equipCalibracao').value;
    const proximaCalibracao = document.getElementById('equipProxCalibracao').value;
    const observacoes = document.getElementById('equipObservacoes').value;
    
    if (!nome || !serial || !tipo) {
        showNotification('Preencha os campos obrigatórios', 'error');
        return;
    }
    
    const operadorNome = operadorId ? operadoresData.find(op => op.id == operadorId)?.nome : null;
    
    if (currentEquipmentId) {
        // Editar equipamento existente
        const equipIndex = equipamentosData.findIndex(e => e.id === currentEquipmentId);
        if (equipIndex !== -1) {
            equipamentosData[equipIndex] = {
                ...equipamentosData[equipIndex],
                nome,
                serial,
                tipo,
                modelo,
                fabricante,
                aquisicao,
                status,
                operadorId: operadorId || null,
                operadorNome: operadorNome || null,
                ultimaCalibracao,
                proximaCalibracao,
                observacoes
            };
            showNotification('Equipamento atualizado com sucesso!', 'success');
        }
    } else {
        // Criar novo equipamento
        const newId = Math.max(...equipamentosData.map(e => e.id), 0) + 1;
        const newEquipment = {
            id: newId,
            nome,
            serial,
            tipo,
            modelo,
            fabricante,
            aquisicao,
            status,
            operadorId: operadorId || null,
            operadorNome: operadorNome || null,
            ultimaCalibracao,
            proximaCalibracao,
            observacoes,
            manutencoes: []
        };
        equipamentosData.push(newEquipment);
        showNotification('Equipamento criado com sucesso!', 'success');
    }
    
    closeModal();
    renderEquipmentGrid();
}

// Editar equipamento
function editEquipment(id) {
    openEquipmentModal(id);
}

// Mostrar histórico de manutenção
function showMaintenanceHistory(id) {
    const equip = equipamentosData.find(e => e.id === id);
    if (!equip) return;
    
    const modal = document.getElementById('maintenanceModal');
    const content = document.getElementById('maintenanceContent');
    
    content.innerHTML = `
        <div class="maintenance-timeline">
            ${equip.manutencoes.length > 0 ? equip.manutencoes.map(m => `
                <div class="maintenance-item">
                    <div class="maintenance-date">${formatarData(m.data)}</div>
                    <div class="maintenance-title">${m.tipo}</div>
                    <div class="maintenance-description">${m.descricao}</div>
                </div>
            `).join('') : '<p style="text-align: center; padding: 2rem;">Nenhuma manutenção registrada</p>'}
        </div>
    `;
    
    modal.classList.add('active');
}

// Abrir modal de atribuição
let assignEquipmentId = null;
function openAssignModal(equipmentId) {
    const equip = equipamentosData.find(e => e.id === equipmentId);
    if (!equip) return;
    
    assignEquipmentId = equipmentId;
    const modal = document.getElementById('assignModal');
    const assignEquipmentName = document.getElementById('assignEquipmentName');
    const assignOperator = document.getElementById('assignOperator');
    
    assignEquipmentName.value = `${equip.nome} (${equip.serial})`;
    
    // Popular operadores disponíveis
    assignOperator.innerHTML = '<option value="">Selecione um operador</option>';
    operadoresData.filter(op => op.status === 'active' && op.situacao !== 'field').forEach(op => {
        assignOperator.innerHTML += `<option value="${op.id}">${op.nome} (${op.matricula})</option>`;
    });
    
    document.getElementById('assignDate').value = new Date().toISOString().split('T')[0];
    
    modal.classList.add('active');
}

// Salvar atribuição
function saveAssignment(event) {
    event.preventDefault();
    
    const operatorId = document.getElementById('assignOperator').value;
    const assignDate = document.getElementById('assignDate').value;
    
    if (!operatorId) {
        showNotification('Selecione um operador', 'error');
        return;
    }
    
    const operator = operadoresData.find(op => op.id == operatorId);
    const equipIndex = equipamentosData.findIndex(e => e.id === assignEquipmentId);
    
    if (equipIndex !== -1) {
        equipamentosData[equipIndex].operadorId = operator.id;
        equipamentosData[equipIndex].operadorNome = operator.nome;
        
        // Registrar auditoria
        showNotification(`Equipamento atribuído a ${operator.nome}`, 'success');
        renderEquipmentGrid();
    }
    
    closeModal();
}

// Excluir equipamento
function deleteEquipment(id) {
    if (confirm('Tem certeza que deseja excluir este equipamento?')) {
        equipamentosData = equipamentosData.filter(e => e.id !== id);
        showNotification('Equipamento excluído com sucesso!', 'success');
        renderEquipmentGrid();
    }
}

// Inicializar eventos de equipamentos
function initEquipmentEvents() {
    const openModalBtn = document.getElementById('openEquipmentModal');
    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => openEquipmentModal());
    }
    
    const closeModalBtns = document.querySelectorAll('.modal-close, #closeModal, #closeAssignModal');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    const equipmentForm = document.getElementById('equipmentForm');
    if (equipmentForm) {
        equipmentForm.addEventListener('submit', saveEquipment);
    }
    
    const assignForm = document.getElementById('assignForm');
    if (assignForm) {
        assignForm.addEventListener('submit', saveAssignment);
    }
    
    const addMaintenanceBtn = document.getElementById('addMaintenanceBtn');
    if (addMaintenanceBtn) {
        addMaintenanceBtn.addEventListener('click', () => {
            closeModal();
            showNotification('Funcionalidade em desenvolvimento', 'info');
        });
    }
    
    const searchEquipment = document.getElementById('searchEquipment');
    const filterType = document.getElementById('filterType');
    const filterStatus = document.getElementById('filterStatus');
    const filterOperator = document.getElementById('filterOperator');
    
    if (searchEquipment) searchEquipment.addEventListener('input', () => {
        currentEquipmentPage = 1;
        renderEquipmentGrid();
    });
    if (filterType) filterType.addEventListener('change', () => {
        currentEquipmentPage = 1;
        renderEquipmentGrid();
    });
    if (filterStatus) filterStatus.addEventListener('change', () => {
        currentEquipmentPage = 1;
        renderEquipmentGrid();
    });
    if (filterOperator) filterOperator.addEventListener('change', () => {
        currentEquipmentPage = 1;
        renderEquipmentGrid();
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
    initAuditEvents();
    renderAuditTable();
    initSectorsEvents();
    renderSectorsGrid();
    initEquipmentEvents();
    renderEquipmentGrid();
    
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
// GERENCIAMENTO DE INVENTÁRIO
// ====================

// Dados mockados de inventário
let inventoryData = [
    {
        id: 1,
        codigo: "PROD-001",
        nome: "Notebook Dell Inspiron",
        categoria: "Eletrônicos",
        setor: "Almoxarifado Central",
        quantidade: 15,
        minimo: 10,
        valorUnit: 3500.00,
        valorCusto: 2800.00,
        fornecedor: "Dell Computadores",
        localizacao: "Prateleira A1",
        unidade: "UN",
        descricao: "Notebook Dell Inspiron 15, 8GB RAM, 256GB SSD",
        status: "normal",
        ultimaMovimentacao: "2026-03-24",
        historicoMov: [
            { data: "2026-03-24", tipo: "entrada", quantidade: 5, motivo: "Compra" },
            { data: "2026-03-20", tipo: "saida", quantidade: 2, motivo: "Venda" }
        ]
    },
    {
        id: 2,
        codigo: "PROD-002",
        nome: "Mouse Logitech MX Master",
        categoria: "Periféricos",
        setor: "Almoxarifado Central",
        quantidade: 8,
        minimo: 15,
        valorUnit: 89.90,
        valorCusto: 65.00,
        fornecedor: "Logitech",
        localizacao: "Prateleira B2",
        unidade: "UN",
        descricao: "Mouse sem fio Logitech MX Master 3",
        status: "low",
        ultimaMovimentacao: "2026-03-23",
        historicoMov: [
            { data: "2026-03-23", tipo: "saida", quantidade: 3, motivo: "Venda" },
            { data: "2026-03-15", tipo: "entrada", quantidade: 20, motivo: "Compra" }
        ]
    },
    {
        id: 3,
        codigo: "PROD-003",
        nome: "Teclado Mecânico RGB",
        categoria: "Periféricos",
        setor: "Setor de Produção",
        quantidade: 30,
        minimo: 20,
        valorUnit: 299.90,
        valorCusto: 220.00,
        fornecedor: "Redragon",
        localizacao: "Prateleira C3",
        unidade: "UN",
        descricao: "Teclado mecânico RGB switch blue",
        status: "normal",
        ultimaMovimentacao: "2026-03-22",
        historicoMov: [
            { data: "2026-03-22", tipo: "entrada", quantidade: 30, motivo: "Compra" }
        ]
    },
    {
        id: 4,
        codigo: "PROD-004",
        nome: "Monitor LG 24'",
        categoria: "Eletrônicos",
        setor: "Almoxarifado Central",
        quantidade: 0,
        minimo: 5,
        valorUnit: 1200.00,
        valorCusto: 950.00,
        fornecedor: "LG Electronics",
        localizacao: "Prateleira D4",
        unidade: "UN",
        descricao: "Monitor LG 24 polegadas Full HD",
        status: "out",
        ultimaMovimentacao: "2026-03-21",
        historicoMov: [
            { data: "2026-03-21", tipo: "saida", quantidade: 5, motivo: "Venda" },
            { data: "2026-03-10", tipo: "entrada", quantidade: 5, motivo: "Compra" }
        ]
    },
    {
        id: 5,
        codigo: "PROD-005",
        nome: "Cadeira Gamer",
        categoria: "Móveis",
        setor: "Expedição",
        quantidade: 8,
        minimo: 3,
        valorUnit: 850.00,
        valorCusto: 620.00,
        fornecedor: "DT3",
        localizacao: "Área de Paletes",
        unidade: "UN",
        descricao: "Cadeira gamer reclinável",
        status: "normal",
        ultimaMovimentacao: "2026-03-20",
        historicoMov: [
            { data: "2026-03-20", tipo: "saida", quantidade: 2, motivo: "Venda" },
            { data: "2026-03-01", tipo: "entrada", quantidade: 10, motivo: "Compra" }
        ]
    },
    {
        id: 6,
        codigo: "PROD-006",
        nome: "SSD 1TB NVMe",
        categoria: "Componentes",
        setor: "Estoque Matéria Prima",
        quantidade: 25,
        minimo: 20,
        valorUnit: 450.00,
        valorCusto: 380.00,
        fornecedor: "Kingston",
        localizacao: "Prateleira E5",
        unidade: "UN",
        descricao: "SSD NVMe 1TB PCIe 4.0",
        status: "normal",
        ultimaMovimentacao: "2026-03-19",
        historicoMov: [
            { data: "2026-03-19", tipo: "entrada", quantidade: 25, motivo: "Compra" }
        ]
    },
    {
        id: 7,
        codigo: "PROD-007",
        nome: "Memória RAM 16GB",
        categoria: "Componentes",
        setor: "Estoque Matéria Prima",
        quantidade: 12,
        minimo: 15,
        valorUnit: 320.00,
        valorCusto: 260.00,
        fornecedor: "Corsair",
        localizacao: "Prateleira F6",
        unidade: "UN",
        descricao: "Memória RAM DDR4 16GB 3200MHz",
        status: "low",
        ultimaMovimentacao: "2026-03-18",
        historicoMov: [
            { data: "2026-03-18", tipo: "saida", quantidade: 8, motivo: "Produção" }
        ]
    },
    {
        id: 8,
        codigo: "PROD-008",
        nome: "Webcam HD 1080p",
        categoria: "Periféricos",
        setor: "Almoxarifado Central",
        quantidade: 18,
        minimo: 10,
        valorUnit: 180.00,
        valorCusto: 140.00,
        fornecedor: "Logitech",
        localizacao: "Prateleira G7",
        unidade: "UN",
        descricao: "Webcam Full HD com microfone",
        status: "normal",
        ultimaMovimentacao: "2026-03-17",
        historicoMov: [
            { data: "2026-03-17", tipo: "entrada", quantidade: 20, motivo: "Compra" },
            { data: "2026-03-15", tipo: "saida", quantidade: 2, motivo: "Venda" }
        ]
    }
];

let currentItemId = null;
let currentInventoryPage = 1;
const inventoryItemsPerPage = 10;
let movementItemId = null;

// Renderizar tabela de inventário
function renderInventoryTable() {
    const searchTerm = document.getElementById('searchItem')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('filterCategory')?.value || 'all';
    const sectorFilter = document.getElementById('filterSector')?.value || 'all';
    const statusFilter = document.getElementById('filterStatus')?.value || 'all';
    
    let filteredItems = inventoryData.filter(item => {
        const matchesSearch = item.codigo.toLowerCase().includes(searchTerm) ||
                             item.nome.toLowerCase().includes(searchTerm) ||
                             item.categoria.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryFilter === 'all' || item.categoria === categoryFilter;
        const matchesSector = sectorFilter === 'all' || item.setor === sectorFilter;
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        
        return matchesSearch && matchesCategory && matchesSector && matchesStatus;
    });
    
    // Paginação
    const totalPages = Math.ceil(filteredItems.length / inventoryItemsPerPage);
    const start = (currentInventoryPage - 1) * inventoryItemsPerPage;
    const end = start + inventoryItemsPerPage;
    const paginatedItems = filteredItems.slice(start, end);
    
    // Renderizar tabela
    const tbody = document.getElementById('inventoryTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = paginatedItems.map(item => `
        <tr data-id="${item.id}">
            <td><input type="checkbox" class="item-checkbox" data-id="${item.id}"></td>
            <td><strong>${item.codigo}</strong></td>
            <td>${item.nome}</td>
            <td>${item.categoria}</td>
            <td>${item.setor}</td>
            <td class="${item.quantidade <= item.minimo ? 'text-warning' : ''}">${item.quantidade}</td>
            <td>${formatCurrency(item.valorUnit)}</td>
            <td>${formatCurrency(item.quantidade * item.valorUnit)}</td>
            <td><span class="status-badge status-${item.status}">${getStatusText(item.status)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn movement" data-id="${item.id}" title="Movimentar Estoque">
                        <i class="fas fa-exchange-alt"></i>
                    </button>
                    <button class="action-btn edit" data-id="${item.id}" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" data-id="${item.id}" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    // Atualizar rodapé com totais
    updateInventoryFooter(filteredItems);
    
    // Atualizar estatísticas
    updateInventoryStats();
    
    // Atualizar contador
    const recordsCount = document.getElementById('recordsCount');
    if (recordsCount) {
        recordsCount.textContent = `Mostrando ${paginatedItems.length} de ${filteredItems.length} registros`;
    }
    
    // Atualizar paginação
    renderInventoryPagination(totalPages);
    
    // Adicionar eventos
    document.querySelectorAll('.action-btn.movement').forEach(btn => {
        btn.addEventListener('click', () => openMovementModal(parseInt(btn.dataset.id)));
    });
    
    document.querySelectorAll('.action-btn.edit').forEach(btn => {
        btn.addEventListener('click', () => editItem(parseInt(btn.dataset.id)));
    });
    
    document.querySelectorAll('.action-btn.delete').forEach(btn => {
        btn.addEventListener('click', () => deleteItem(parseInt(btn.dataset.id)));
    });
}

// Atualizar rodapé da tabela
function updateInventoryFooter(items) {
    const tfoot = document.getElementById('inventoryTableFoot');
    if (!tfoot) return;
    
    const totalItems = items.reduce((sum, item) => sum + item.quantidade, 0);
    const totalValue = items.reduce((sum, item) => sum + (item.quantidade * item.valorUnit), 0);
    
    tfoot.innerHTML = `
        <tr>
            <td colspan="5"><strong>Totais:</strong></td>
            <td><strong>${totalItems}</strong></td>
            <td></td>
            <td><strong>${formatCurrency(totalValue)}</strong></td>
            <td colspan="2"></td>
        </tr>
    `;
}

// Atualizar estatísticas
function updateInventoryStats() {
    const totalItems = inventoryData.reduce((sum, item) => sum + item.quantidade, 0);
    const totalValue = inventoryData.reduce((sum, item) => sum + (item.quantidade * item.valorUnit), 0);
    const lowStock = inventoryData.filter(item => item.quantidade <= item.minimo && item.quantidade > 0).length;
    const turnoverRate = (inventoryData.reduce((sum, item) => sum + item.historicoMov.filter(m => m.tipo === 'saida' && m.data >= getDateDaysAgo(30)).length, 0) / inventoryData.length).toFixed(1);
    
    const totalItemsEl = document.getElementById('totalItemsCount');
    const totalValueEl = document.getElementById('totalValue');
    const lowStockEl = document.getElementById('lowStockCount');
    const turnoverRateEl = document.getElementById('turnoverRate');
    
    if (totalItemsEl) totalItemsEl.textContent = totalItems;
    if (totalValueEl) totalValueEl.textContent = formatCurrency(totalValue);
    if (lowStockEl) lowStockEl.textContent = lowStock;
    if (turnoverRateEl) turnoverRateEl.textContent = turnoverRate;
}

// Data de dias atrás
function getDateDaysAgo(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
}

// Texto do status
function getStatusText(status) {
    const texts = {
        normal: 'Normal',
        low: 'Estoque Baixo',
        out: 'Esgotado'
    };
    return texts[status] || status;
}

// Renderizar paginação
function renderInventoryPagination(totalPages) {
    const paginationEl = document.getElementById('pagination');
    if (!paginationEl) return;
    
    let html = `
        <button ${currentInventoryPage === 1 ? 'disabled' : ''} data-page="${currentInventoryPage - 1}">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    const startPage = Math.max(1, currentInventoryPage - 2);
    const endPage = Math.min(totalPages, currentInventoryPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="${i === currentInventoryPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    
    html += `
        <button ${currentInventoryPage === totalPages ? 'disabled' : ''} data-page="${currentInventoryPage + 1}">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    paginationEl.innerHTML = html;
    
    paginationEl.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            const page = parseInt(btn.dataset.page);
            if (!isNaN(page) && page !== currentInventoryPage && page >= 1 && page <= totalPages) {
                currentInventoryPage = page;
                renderInventoryTable();
            }
        });
    });
}

// Abrir modal de item
function openItemModal(itemId = null) {
    const modal = document.getElementById('itemModal');
    const modalTitle = document.getElementById('modalTitle');
    
    if (!modal) return;
    
    currentItemId = itemId;
    
    if (itemId) {
        modalTitle.textContent = 'Editar Item';
        const item = inventoryData.find(i => i.id === itemId);
        if (item) {
            document.getElementById('itemCodigo').value = item.codigo;
            document.getElementById('itemBarcode').value = item.barcode || '';
            document.getElementById('itemNome').value = item.nome;
            document.getElementById('itemCategoria').value = item.categoria;
            document.getElementById('itemSetor').value = item.setor;
            document.getElementById('itemFornecedor').value = item.fornecedor;
            document.getElementById('itemQuantidade').value = item.quantidade;
            document.getElementById('itemMinimo').value = item.minimo;
            document.getElementById('itemValor').value = item.valorUnit;
            document.getElementById('itemCusto').value = item.valorCusto;
            document.getElementById('itemLocalizacao').value = item.localizacao;
            document.getElementById('itemUnidade').value = item.unidade;
            document.getElementById('itemDescricao').value = item.descricao;
        }
    } else {
        modalTitle.textContent = 'Novo Item';
        document.getElementById('itemForm').reset();
        document.getElementById('itemQuantidade').value = '0';
        document.getElementById('itemMinimo').value = '10';
        document.getElementById('itemValor').value = '0';
        document.getElementById('itemCusto').value = '0';
        document.getElementById('itemUnidade').value = 'UN';
    }
    
    modal.classList.add('active');
}

// Salvar item
function saveItem(event) {
    event.preventDefault();
    
    const codigo = document.getElementById('itemCodigo').value;
    const nome = document.getElementById('itemNome').value;
    const categoria = document.getElementById('itemCategoria').value;
    const setor = document.getElementById('itemSetor').value;
    const quantidade = parseInt(document.getElementById('itemQuantidade').value);
    const minimo = parseInt(document.getElementById('itemMinimo').value);
    const valorUnit = parseFloat(document.getElementById('itemValor').value);
    const valorCusto = parseFloat(document.getElementById('itemCusto').value);
    const fornecedor = document.getElementById('itemFornecedor').value;
    const localizacao = document.getElementById('itemLocalizacao').value;
    const unidade = document.getElementById('itemUnidade').value;
    const descricao = document.getElementById('itemDescricao').value;
    
    if (!codigo || !nome || !categoria || !setor) {
        showNotification('Preencha os campos obrigatórios', 'error');
        return;
    }
    
    const status = quantidade === 0 ? 'out' : (quantidade <= minimo ? 'low' : 'normal');
    
    if (currentItemId) {
        // Editar item existente
        const itemIndex = inventoryData.findIndex(i => i.id === currentItemId);
        if (itemIndex !== -1) {
            inventoryData[itemIndex] = {
                ...inventoryData[itemIndex],
                codigo, nome, categoria, setor, quantidade, minimo,
                valorUnit, valorCusto, fornecedor, localizacao, unidade, descricao, status
            };
            showNotification('Item atualizado com sucesso!', 'success');
        }
    } else {
        // Criar novo item
        const newId = Math.max(...inventoryData.map(i => i.id), 0) + 1;
        const newItem = {
            id: newId,
            codigo, nome, categoria, setor, quantidade, minimo,
            valorUnit, valorCusto, fornecedor, localizacao, unidade, descricao, status,
            ultimaMovimentacao: new Date().toISOString().split('T')[0],
            historicoMov: quantidade > 0 ? [{ data: new Date().toISOString().split('T')[0], tipo: 'entrada', quantidade, motivo: 'Cadastro inicial' }] : []
        };
        inventoryData.push(newItem);
        showNotification('Item criado com sucesso!', 'success');
    }
    
    closeModal();
    renderInventoryTable();
}

// Editar item
function editItem(id) {
    openItemModal(id);
}

// Abrir modal de movimentação
function openMovementModal(itemId) {
    const item = inventoryData.find(i => i.id === itemId);
    if (!item) return;
    
    movementItemId = itemId;
    const modal = document.getElementById('movementModal');
    const productName = document.getElementById('movementProductName');
    
    productName.value = `${item.nome} (${item.codigo}) - Estoque atual: ${item.quantidade}`;
    document.getElementById('movementForm').reset();
    document.getElementById('movementType').value = 'entrada';
    
    modal.classList.add('active');
}

// Salvar movimentação
function saveMovement(event) {
    event.preventDefault();
    
    const type = document.getElementById('movementType').value;
    const quantity = parseInt(document.getElementById('movementQuantity').value);
    const reason = document.getElementById('movementReason').value;
    const obs = document.getElementById('movementObs').value;
    
    if (!quantity || quantity <= 0) {
        showNotification('Informe uma quantidade válida', 'error');
        return;
    }
    
    const itemIndex = inventoryData.findIndex(i => i.id === movementItemId);
    if (itemIndex === -1) return;
    
    const item = inventoryData[itemIndex];
    let newQuantity = item.quantidade;
    
    if (type === 'entrada') {
        newQuantity += quantity;
    } else if (type === 'saida') {
        if (quantity > item.quantidade) {
            showNotification('Quantidade insuficiente em estoque', 'error');
            return;
        }
        newQuantity -= quantity;
    } else if (type === 'ajuste') {
        newQuantity = quantity;
    }
    
    const newStatus = newQuantity === 0 ? 'out' : (newQuantity <= item.minimo ? 'low' : 'normal');
    
    inventoryData[itemIndex] = {
        ...item,
        quantidade: newQuantity,
        status: newStatus,
        ultimaMovimentacao: new Date().toISOString().split('T')[0],
        historicoMov: [{
            data: new Date().toISOString().split('T')[0],
            tipo: type,
            quantidade: type === 'ajuste' ? quantity : (type === 'entrada' ? quantity : -quantity),
            motivo: reason || (type === 'entrada' ? 'Entrada manual' : type === 'saida' ? 'Saída manual' : 'Ajuste manual'),
            observacao: obs
        }, ...item.historicoMov]
    };
    
    showNotification(`Movimentação de ${type} realizada com sucesso!`, 'success');
    closeModal();
    renderInventoryTable();
}

// Excluir item
function deleteItem(id) {
    if (confirm('Tem certeza que deseja excluir este item?')) {
        inventoryData = inventoryData.filter(i => i.id !== id);
        showNotification('Item excluído com sucesso!', 'success');
        renderInventoryTable();
    }
}

// Exportar inventário para CSV
function exportInventory() {
    const headers = ['Código', 'Nome', 'Categoria', 'Setor', 'Quantidade', 'Valor Unitário', 'Valor Total', 'Status'];
    
    const rows = inventoryData.map(item => [
        item.codigo,
        item.nome,
        item.categoria,
        item.setor,
        item.quantidade,
        item.valorUnit.toFixed(2),
        (item.quantidade * item.valorUnit).toFixed(2),
        getStatusText(item.status)
    ]);
    
    const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');
    
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inventario_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('Inventário exportado com sucesso!', 'success');
}

// Importar inventário (simulação)
function importInventory() {
    showNotification('Funcionalidade de importação em desenvolvimento', 'info');
}

// Selecionar todos os itens
function initSelectAllItems() {
    const selectAll = document.getElementById('selectAll');
    if (!selectAll) return;
    
    selectAll.addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.item-checkbox');
        checkboxes.forEach(cb => cb.checked = e.target.checked);
    });
}

// Inicializar eventos de inventário
function initInventoryEvents() {
    const openModalBtn = document.getElementById('openItemModal');
    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => openItemModal());
    }
    
    const importBtn = document.getElementById('importItemsBtn');
    if (importBtn) {
        importBtn.addEventListener('click', importInventory);
    }
    
    const exportBtn = document.getElementById('exportItemsBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportInventory);
    }
    
    const closeModalBtns = document.querySelectorAll('.modal-close, #closeModal, #closeMovementModal');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    const itemForm = document.getElementById('itemForm');
    if (itemForm) {
        itemForm.addEventListener('submit', saveItem);
    }
    
    const movementForm = document.getElementById('movementForm');
    if (movementForm) {
        movementForm.addEventListener('submit', saveMovement);
    }
    
    const searchItem = document.getElementById('searchItem');
    const filterCategory = document.getElementById('filterCategory');
    const filterSector = document.getElementById('filterSector');
    const filterStatus = document.getElementById('filterStatus');
    
    if (searchItem) searchItem.addEventListener('input', () => {
        currentInventoryPage = 1;
        renderInventoryTable();
    });
    if (filterCategory) filterCategory.addEventListener('change', () => {
        currentInventoryPage = 1;
        renderInventoryTable();
    });
    if (filterSector) filterSector.addEventListener('change', () => {
        currentInventoryPage = 1;
        renderInventoryTable();
    });
    if (filterStatus) filterStatus.addEventListener('change', () => {
        currentInventoryPage = 1;
        renderInventoryTable();
    });
    
    initSelectAllItems();
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
    initAuditEvents();
    renderAuditTable();
    initSectorsEvents();
    renderSectorsGrid();
    initEquipmentEvents();
    renderEquipmentGrid();
    initInventoryEvents();
    renderInventoryTable();
    
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });
});
