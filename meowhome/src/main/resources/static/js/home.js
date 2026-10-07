// Native navigation remains usable without JavaScript.
const menu = document.querySelector('.mobile-menu');
if (menu) {
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu.open = false; }));
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && menu.open) {
            menu.open = false;
            menu.querySelector('summary').focus();
        }
    });
    document.addEventListener('click', event => {
        if (menu.open && !menu.contains(event.target)) menu.open = false;
    });
}

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
function enterPanel(panel) {
    panel.classList.remove('is-entering');
    if (!motionPreference.matches) {
        void panel.offsetWidth;
        panel.classList.add('is-entering');
    }
}

// Both action tabs and TNR steps use the same keyboard-accessible behavior.
document.querySelectorAll('[data-tab-group]').forEach(group => {
    const controls = group.querySelector('.tab-controls');
    const tabs = [...controls.querySelectorAll('button[data-panel]')];
    const panels = [...group.querySelectorAll('[data-tab-panel]')];
    if (!tabs.length || tabs.length !== panels.length) return;
    const activate = (index, focus = false, animate = true) => {
        tabs.forEach((tab, i) => {
            const selected = i === index;
            tab.setAttribute('aria-selected', String(selected));
            tab.tabIndex = selected ? 0 : -1;
            panels[i].hidden = !selected;
        });
        if (focus) tabs[index].focus();
        if (animate) enterPanel(panels[index]);
    };
    controls.hidden = false;
    controls.setAttribute('role', 'tablist');
    group.classList.add('is-enhanced');
    tabs.forEach((tab, index) => {
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-controls', panels[index].id);
        panels[index].setAttribute('role', 'tabpanel');
        panels[index].setAttribute('aria-labelledby', tab.id);
        panels[index].tabIndex = 0;
        tab.addEventListener('click', () => activate(index));
        tab.addEventListener('keydown', event => {
            let next;
            if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
            if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
            if (event.key === 'Home') next = 0;
            if (event.key === 'End') next = tabs.length - 1;
            if (next !== undefined) {
                event.preventDefault();
                activate(next, true);
            }
        });
    });
    activate(0, false, false);
});

// Keep final, accessible numbers in the document; animate the visual values once.
const statistics = [...document.querySelectorAll('[data-count]')];
const formatNumber = new Intl.NumberFormat('zh-TW');
let countFrame = null;
let countStarted = false;
const finalCounts = () => {
    if (countFrame !== null) cancelAnimationFrame(countFrame);
    statistics.forEach(value => { value.textContent = formatNumber.format(Number(value.dataset.count)); });
};
if (statistics.length && !motionPreference.matches && 'IntersectionObserver' in window) {
    statistics.forEach(value => { value.textContent = '0'; });
    const observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting) || countStarted) return;
        countStarted = true;
        observer.disconnect();
        let start;
        const tick = now => {
            if (motionPreference.matches) { finalCounts(); return; }
            if (start === undefined) start = now;
            const progress = Math.min((now - start) / 650, 1);
            const eased = 1 - (1 - progress) * (1 - progress);
            statistics.forEach(value => {
                value.textContent = formatNumber.format(Math.round(Number(value.dataset.count) * eased));
            });
            if (progress < 1) countFrame = requestAnimationFrame(tick);
            else { countFrame = null; finalCounts(); }
        };
        countFrame = requestAnimationFrame(tick);
    }, { threshold: .15 });
    observer.observe(document.querySelector('.impact-numbers'));
    motionPreference.addEventListener('change', () => {
        if (motionPreference.matches) { observer.disconnect(); finalCounts(); }
    });
}

// Manual carousel: no autoplay, and hidden slides cannot receive keyboard focus.
document.querySelectorAll('[data-carousel]').forEach(carousel => {
    const slides = [...carousel.querySelectorAll('[data-slide]')];
    const controls = carousel.querySelector('.carousel-controls');
    const dots = [...carousel.querySelectorAll('[data-slide-button]')];
    if (!slides.length || !controls) return;
    let active = 0;
    const show = (index, animate = true) => {
        active = (index + slides.length) % slides.length;
        slides.forEach((slide, i) => { slide.hidden = i !== active; });
        dots.forEach((dot, i) => { dot.setAttribute('aria-pressed', String(i === active)); });
        carousel.querySelector('[data-carousel-status]').textContent = '第 ' + (active + 1) + ' 則，共 ' + slides.length + ' 則';
        if (animate) enterPanel(slides[active]);
    };
    carousel.classList.add('is-enhanced');
    carousel.setAttribute('role', 'region');
    carousel.setAttribute('aria-roledescription', '輪播');
    carousel.tabIndex = 0;
    controls.hidden = false;
    slides.forEach((slide, i) => {
        slide.setAttribute('role', 'group');
        slide.setAttribute('aria-roledescription', '故事');
        slide.setAttribute('aria-label', (i + 1) + ' / ' + slides.length);
    });
    carousel.querySelector('[data-prev]').addEventListener('click', () => show(active - 1));
    carousel.querySelector('[data-next]').addEventListener('click', () => show(active + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));
    carousel.addEventListener('keydown', event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        if (event.key === 'ArrowLeft') show(active - 1);
        if (event.key === 'ArrowRight') show(active + 1);
        if (event.key === 'Home') show(0);
        if (event.key === 'End') show(slides.length - 1);
    });
    show(0, false);
});

// News filters keep the three editorial items; TNR also includes medical care.
document.querySelectorAll('[data-news]').forEach(section => {
    const filters = section.querySelector('.news-filters');
    const buttons = [...section.querySelectorAll('[data-news-filter]')];
    const feed = section.querySelector('[data-news-feed]');
    const cards = [...feed.querySelectorAll('[data-categories]')];
    const status = section.querySelector('[data-news-status]');
    const hint = section.querySelector('.news-swipe-hint');
    let revision = 0;
    let animations = [];
    let selectedButton = buttons[0];
    filters.hidden = false;

    const cancelAnimations = () => {
        animations.forEach(animation => animation.cancel());
        animations = [];
    };
    const fade = (items, from, to, duration) => {
        animations = items.map(item => item.animate(
            [{ opacity: from }, { opacity: to }],
            { duration, easing: 'ease', fill: 'forwards' }
        ));
        return Promise.all(animations.map(animation => animation.finished.catch(() => {})));
    };
    const applyFilter = async (button, animate = true) => {
        const currentRevision = ++revision;
        cancelAnimations();
        selectedButton = button;
        buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
        feed.setAttribute('aria-busy', 'true');
        const useMotion = animate && !motionPreference.matches && typeof Element.prototype.animate === 'function';
        if (useMotion) {
            await fade(cards.filter(card => !card.hidden), 1, 0, 200);
            if (currentRevision !== revision) return;
        }
        cancelAnimations();
        const category = button.dataset.newsFilter;
        cards.forEach(card => {
            card.hidden = category !== 'all' && !card.dataset.categories.split(' ').includes(category);
        });
        const visibleCards = cards.filter(card => !card.hidden);
        feed.dataset.visibleCount = String(visibleCards.length);
        feed.scrollLeft = 0;
        hint.hidden = visibleCards.length < 2;
        status.textContent = button.textContent + ' · ' + visibleCards.length + ' 則內容';
        if (useMotion && !motionPreference.matches) {
            await fade(visibleCards, 0, 1, 250);
            if (currentRevision !== revision) return;
        }
        cancelAnimations();
        feed.setAttribute('aria-busy', 'false');
    };

    buttons.forEach((button, index) => {
        button.addEventListener('click', () => applyFilter(button));
        button.addEventListener('keydown', event => {
            let target;
            if (event.key === 'ArrowRight') target = (index + 1) % buttons.length;
            if (event.key === 'ArrowLeft') target = (index - 1 + buttons.length) % buttons.length;
            if (event.key === 'Home') target = 0;
            if (event.key === 'End') target = buttons.length - 1;
            if (target !== undefined) {
                event.preventDefault();
                buttons[target].focus();
                applyFilter(buttons[target]);
            }
        });
    });
    section.querySelector('[data-news-all]').addEventListener('click', event => {
        event.preventDefault();
        applyFilter(buttons[0]);
        buttons[0].focus({ preventScroll: true });
    });
    motionPreference.addEventListener('change', () => {
        if (motionPreference.matches) applyFilter(selectedButton, false);
    });
    applyFilter(buttons[0], false);
});
