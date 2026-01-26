async function loadComponent(id, url) {
    const element = document.getElementById(id);
    if (!element) return;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Ошибка загрузки: ${url}`);
        const html = await response.text();
        element.innerHTML = html;
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadComponent('header-res', 'components/header.html');
    loadComponent('catalog-res', 'components/catalog.html');
    loadComponent('footer-res', 'components/footer.html');
});