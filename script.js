const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const setMenuState = (open) => {
    menuButton?.setAttribute('aria-expanded', String(open));
    menuButton?.classList.toggle('open', open);
    header?.classList.toggle('menu-open', open);
    nav?.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    const label = menuButton?.querySelector('.sr-only');
    if (label) label.textContent = open ? 'Fechar menu' : 'Abrir menu';
};

menuButton?.addEventListener('click', () => {
    setMenuState(menuButton.getAttribute('aria-expanded') !== 'true');
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenuState(false)));

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
        setMenuState(false);
        menuButton.focus();
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 900) setMenuState(false);
});
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));
} else {
    document.querySelectorAll('.reveal').forEach((item) => item.classList.add('visible'));
}
document.querySelector('[data-year]').textContent = new Date().getFullYear();
