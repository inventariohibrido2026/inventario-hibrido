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
