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
});
