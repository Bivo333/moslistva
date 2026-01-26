async function loadComponent(id, url) {
    const element = document.getElementById(id);
    if (!element) return;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Ошибка загрузки: ${url}`);
        const html = await response.text();
        element.innerHTML = html;

        // Если загрузили меню, вызываем подсветку активной ссылки
        if (id === 'nav-res') {
            setActiveLink();
        }
    } catch (error) {
        console.error(`Ошибка компонента #${id}:`, error);
    }
}

function setActiveLink() {
    // Определяем имя текущего файла
    let currentPage = window.location.pathname.split("/").pop();
    if (currentPage === "" || currentPage === "/") {
        currentPage = 'index.html';
    }
    
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        // Если href ссылки совпадает с текущей страницей
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Загружаем части шапки
    loadComponent('header-top-res', 'components/header.html');
    loadComponent('nav-res', 'components/nav.html');
    
    // Загружаем остальное
    loadComponent('catalog-res', 'components/catalog.html');
    loadComponent('footer-res', 'components/footer.html');
});