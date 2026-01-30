/**
 * 1. МОБИЛЬНОЕ МЕНЮ (Логика)
 */
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const dropdown = document.getElementById('mobile-menu-dropdown');
    const icon = btn?.querySelector('i');

    if (!btn || !dropdown) return;

    // Удаляем старые слушатели (на всякий случай, если компонент перезагрузился)
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = dropdown.classList.contains('hidden');
        
        if (isHidden) {
            dropdown.classList.remove('hidden');
            // Меняем иконку на крестик
            newBtn.innerHTML = '<i class="fas fa-times text-2xl"></i>';
        } else {
            dropdown.classList.add('hidden');
            // Меняем иконку обратно
            newBtn.innerHTML = '<i class="fas fa-bars text-2xl"></i>';
        }
    });

    // Закрытие при клике вне меню
    document.addEventListener('click', (e) => {
        if (!dropdown.classList.contains('hidden') && !dropdown.contains(e.target) && e.target !== newBtn) {
            dropdown.classList.add('hidden');
            newBtn.innerHTML = '<i class="fas fa-bars text-2xl"></i>';
        }
    });
}

/**
 * 2. ЗАГРУЗКА КОМПОНЕНТОВ
 */
async function loadComponent(id, url) {
    const element = document.getElementById(id);
    if (!element) return;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Ошибка загрузки: ${url}`);
        const html = await response.text();
        element.innerHTML = html;

        // --- ХУКИ ПОСЛЕ ЗАГРУЗКИ ---
        
        // 1. Если загрузилась навигация, запускаем мобильное меню
        if (id === 'nav-res') {
            setActiveLink();
            initMobileMenu();
        }

        // 2. Если загрузилась модалка, инициализируем маску телефона
        if (id === 'callback-modal-res') {
            initPhoneMask();
        }

        // 3. Если загрузились крошки
        if (id === 'breadcrumbs-res') {
            updateBreadcrumbs();
        }

    } catch (error) {
        console.error(`Ошибка компонента #${id}:`, error);
    }
}

/**
 * 3. ПОДСВЕТКА АКТИВНОЙ ССЫЛКИ
 */
function setActiveLink() {
    let currentPage = window.location.pathname.split("/").pop() || 'index.html';
    // Убираем параметры запроса (например ?cat=...)
    currentPage = currentPage.split('?')[0]; 
    
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        // Логика активной ссылки
        if (href === currentPage || 
           (currentPage === 'catalog-page.html' && href === 'catalog.html') ||
           (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

/**
 * 4. ХЛЕБНЫЕ КРОШКИ
 */
function updateBreadcrumbs() {
    const breadcrumbLabel = document.getElementById('current-page-name');
    const breadcrumbContainer = document.getElementById('breadcrumbs-res');
    if (!breadcrumbLabel || !breadcrumbContainer) return;

    const pageTitles = {
        'index.html': 'Главная',
        'catalog.html': 'Каталог',
        'catalog-page.html': 'Каталог',
        'prices.html': 'Цены',
        'gallery.html': 'Галерея',
        'delivery.html': 'Доставка',
        'about.html': 'О компании',
        'contacts.html': 'Контакты'
    };

    let currentPage = window.location.pathname.split("/").pop() || 'index.html';
    currentPage = currentPage.split('?')[0];

    if (currentPage === 'index.html' || currentPage === '') {
        breadcrumbContainer.classList.add('hidden');
    } else {
        breadcrumbContainer.classList.remove('hidden');
        breadcrumbLabel.innerText = pageTitles[currentPage] || 'Страница';
    }
}

/**
 * 5. МОДАЛЬНОЕ ОКНО
 */
function openCallbackModal() {
    const modal = document.getElementById('callback-modal');
    const content = document.getElementById('modal-content');
    if (!modal || !content) return;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden'; // Блокируем скролл сайта

    setTimeout(() => {
        content.classList.replace('scale-95', 'scale-100');
        content.classList.replace('opacity-0', 'opacity-100');
    }, 10);
}

function closeCallbackModal() {
    const modal = document.getElementById('callback-modal');
    const content = document.getElementById('modal-content');
    if (!modal || !content) return;

    content.classList.replace('scale-100', 'scale-95');
    content.classList.replace('opacity-100', 'opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = 'auto'; // Возвращаем скролл
    }, 200);
}

/**
 * 6. МАСКА ТЕЛЕФОНА
 */
function initPhoneMask() {
    const phoneInput = document.getElementById("user-phone");
    if (phoneInput && typeof Inputmask !== "undefined") {
        Inputmask({"mask": "+7 (999) 999-99-99"}).mask(phoneInput);
    }
}

/**
 * 7. ИНИЦИАЛИЗАЦИЯ
 */
document.addEventListener('DOMContentLoaded', () => {
    // Загрузка компонентов
    loadComponent('header-top-res', 'components/header.html');
    loadComponent('nav-res', 'components/nav.html');
    loadComponent('breadcrumbs-res', 'components/breadcrumbs.html');
    loadComponent('footer-res', 'components/footer.html');
    loadComponent('callback-modal-res', 'components/callback-modal.html');

    if (document.getElementById('catalog-res')) {
        loadComponent('catalog-res', 'components/catalog.html');
    }

    // Подгрузка библиотеки маски
    if (!document.querySelector('script[src*="inputmask"]')) {
        const maskScript = document.createElement('script');
        maskScript.src = "https://cdn.jsdelivr.net/npm/inputmask@5.0.8/dist/inputmask.min.js";
        maskScript.onload = initPhoneMask;
        document.head.appendChild(maskScript);
    }
});

/**
 * 8. ГЛОБАЛЬНЫЙ ОБРАБОТЧИК КЛИКОВ
 */
document.addEventListener('click', (e) => {
    // Обработка кнопок вызова модалки
    const trigger = e.target.closest('.trigger-callback');
    
    if (trigger) {
        const isTouch = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
        const isMobileWidth = window.innerWidth <= 1024;
        const isMobile = isTouch || isMobileWidth;
        const isPhoneLink = trigger.tagName === 'A' && trigger.getAttribute('href')?.startsWith('tel:');

        // Логика: Если это десктоп -> открываем модалку всегда
        // Если это телефон И это ссылка tel: -> звоним (не открываем модалку)
        // Если это телефон И это кнопка -> открываем модалку
        if (!isMobile) {
            if (isPhoneLink) e.preventDefault(); 
            openCallbackModal();
        } else {
            if (!isPhoneLink) {
                e.preventDefault();
                openCallbackModal();
            }
        }
    }

    // Закрытие модалки по крестику или фону
    const modal = document.getElementById('callback-modal');
    if (modal && (e.target.closest('#close-modal') || e.target === modal)) {
        closeCallbackModal();
    }
});