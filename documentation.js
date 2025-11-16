/* ========== JS для сайдбара (ИСПРАВЛЕНО) ========== */
const sidebar = document.getElementById('sidebar');
if (sidebar) {
    document.body.addEventListener('mousemove', e => {
        // Работает только на экранах шире 900px
        if (window.innerWidth > 900) { 
            // Показать, если мышь у левого края (ширина 50px)
            if (e.clientX < 50) {
                sidebar.classList.add('show');
            } 
            // Скрыть, если мышь ушла от сайдбара (ширина сайдбара 200px + 50px буфер)
            else if (e.clientX > 250) { 
                sidebar.classList.remove('show');
            }
        }
        // На мобильных (<= 900px) эта логика не работает, 
        // там нужно будет делать бургер-меню, если потребуется.
    });

    // Доп. логика: скрыть сайдбар при клике на ссылку в нем
    sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 900) { // На мобильных скрываем по клику
                 sidebar.classList.remove('show');
            }
            // На десктопе скролл и так уберет мышь из зоны
        });
    });
}

/* ========== Плавная прокрутка ========== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({behavior: 'smooth'});
    }
  });
});


/* ========== JS для модалок ========== */
const modalBg = document.getElementById('modal-bg');

function openModal(id) {
  if (!modalBg) return;
  
  // Находим нужную модалку
  const modal = document.getElementById(id + '-modal');
  
  if (modal) {
      modalBg.style.display = 'flex'; // Показываем фон
      modal.style.display = 'block'; // Показываем модалку
  } else {
      console.warn('Модалка с ID ' + id + '-modal не найдена');
  }
}

function closeModal(e, force = false) {
  // force = true для кнопок "Закрыть"
  // e.target.id === 'modal-bg' для клика по фону
  if (force || (e && e.target.id === 'modal-bg')) {
    if (modalBg) {
        modalBg.style.display = 'none'; // Скрываем фон
        // Скрываем ВООБЩЕ ВСЕ модалки внутри
        modalBg.querySelectorAll('.modal').forEach(m => {
          m.style.display = 'none';
        });
    }
  }
  // Предотвращаем "всплытие" клика, чтобы клик по модалке не закрывал ее
  if (e) e.stopPropagation();
}

/* ========== Копирование кода ========== */
function copyCode(id) {
  const modal = document.getElementById(id + '-modal');
  if (!modal) return;
  
  // Ищем несколько <pre> (для HTML, CSS, JS)
  const pres = modal.querySelectorAll('pre');
  let codeText = '';
  
  pres.forEach(pre => {
      // Добавляем заголовок (HTML/CSS/JS)
      const title = pre.previousElementSibling;
      if (title && (title.tagName === 'H3' || title.tagName === 'H4')) {
          codeText += `/* --- ${title.innerText} --- */\n\n`;
      }
      codeText += pre.innerText + '\n\n';
  });

  if (codeText) {
      navigator.clipboard.writeText(codeText).then(() => {
          const btn = modal.querySelector('.copy-btn');
          const originalText = btn.innerText;
          
          btn.innerText = 'Скопировано! ✅';
          btn.style.background = '#4caf50';
          
          setTimeout(() => {
              btn.innerText = originalText;
              btn.style.background = ''; // сброс к стилю CSS
          }, 2000);
      }).catch(err => {
          console.error('Ошибка копирования:', err);
      });
  }
}

/* ========== Accordion Logic ========== */
function toggleAcc(element) {
  // Находим родительский .acc-item
  const item = element.closest('.acc-item, .acc-item-preview');
  if (item) {
      item.classList.toggle('active');
  }
  // Остановка всплытия, чтобы не открыть модалку
  event.stopPropagation();
}

/* ========== Tabs Logic ========== */
function openTab(evt, tabId) {
  // Находим родительский .tabs-container или .tabs-preview
  const container = evt.target.closest('.tabs-container, .tabs-preview');
  if (!container) return;

  // Скрываем весь контент
  container.querySelectorAll('.tab-content').forEach(tab => {
    tab.style.display = 'none';
    tab.classList.remove('active');
  });
  
  // Снимаем .active с кнопок
  container.querySelectorAll('.tab-link').forEach(link => {
    link.classList.remove('active');
  });
  
  // Показать нужный контент и активировать кнопку
  const tabToShow = document.getElementById(tabId);
  if (tabToShow) {
      tabToShow.style.display = 'block';
      tabToShow.classList.add('active');
  }
  evt.currentTarget.classList.add('active');
  
  // Остановка всплытия, чтобы не открыть модалку
  evt.stopPropagation();
}