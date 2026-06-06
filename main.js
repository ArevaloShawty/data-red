/* ===========================
   NEXUS — main.js
   =========================== */

// ── EMAILJS CONFIG ──────────────────────────────────────
// 1. Crea cuenta gratis en https://www.emailjs.com
// 2. Crea un servicio Gmail y una plantilla
// 3. Reemplaza los tres valores de abajo con los tuyos
const EMAILJS_PUBLIC_KEY  = 'QQukUWF0_9WkctR_V';
const EMAILJS_SERVICE_ID  = 'service_f8xppai';
const EMAILJS_TEMPLATE_ID = 'template_prx9pyd';
// ────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  // Inicializa EmailJS
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  // ── 1. TAB & SECTION NAVIGATION ──────────────────────
  const tabs     = document.querySelectorAll('.tab');
  const navBtns  = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.content-section');
  const heroCtas = document.querySelectorAll('[data-trigger="nav"]');

  function showSection(sectionId) {
    sections.forEach(s => {
      s.classList.remove('active');
      s.style.display = 'none';
    });
    const target = document.getElementById('sec-' + sectionId);
    if (!target) return;
    target.style.display = 'block';
    requestAnimationFrame(() => requestAnimationFrame(() => target.classList.add('active')));
    tabs.forEach(t => t.classList.toggle('active', t.dataset.section === sectionId));
    navBtns.forEach(b => b.classList.toggle('active', b.dataset.section === sectionId));
    const wrap = document.querySelector('.sections-wrap');
    if (wrap) {
      const offset = wrap.getBoundingClientRect().top + window.scrollY - 68;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  }

  tabs.forEach(tab => tab.addEventListener('click', () => showSection(tab.dataset.section)));
  navBtns.forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); showSection(btn.dataset.section); });
  });
  heroCtas.forEach(cta => cta.addEventListener('click', () => showSection(cta.dataset.section)));
  showSection('quienes');

  // ── 2. NAVBAR SCROLL ─────────────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // ── 3. HAMBURGER ─────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
    navBtns.forEach(btn => btn.addEventListener('click', () => navLinks.classList.remove('open')));
  }

  // ── 4. PRODUCT SUB-TABS ───────────────────────────────
  document.querySelectorAll('.ptab').forEach(ptab => {
    ptab.addEventListener('click', () => {
      document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.ptab-content').forEach(c => c.classList.remove('active'));
      ptab.classList.add('active');
      const c = document.getElementById('ptab-' + ptab.dataset.ptab);
      if (c) c.classList.add('active');
    });
  });

  // ── 5. MULTIMEDIA SUB-TABS ───────────────────────────
  document.querySelectorAll('.mtab').forEach(mtab => {
    mtab.addEventListener('click', () => {
      document.querySelectorAll('.mtab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.mtab-content').forEach(c => c.classList.remove('active'));
      mtab.classList.add('active');
      const c = document.getElementById('mtab-' + mtab.dataset.mtab);
      if (c) c.classList.add('active');
    });
  });

  // ── 6. GALLERY LIGHTBOX ──────────────────────────────
  const lightbox   = document.getElementById('lightbox');
  const lbImgWrap  = document.getElementById('lbImgWrap');
  const lbCaption  = document.getElementById('lbCaption');
  const lbClose    = document.getElementById('lbClose');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const imgDiv   = item.querySelector('.gallery-img');
      const caption  = item.dataset.caption || '';
      // Clone the gradient box into the lightbox
      lbImgWrap.innerHTML = '';
      const clone = imgDiv.cloneNode(false);
      clone.style.width  = '100%';
      clone.style.height = '100%';
      clone.style.borderRadius = '0';
      lbImgWrap.appendChild(clone);
      lbCaption.textContent = caption;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (lbClose)  lbClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  // ── 7. VIDEO PLACEHOLDER HIDE ────────────────────────
  document.querySelectorAll('.vid-player').forEach(vid => {
    vid.addEventListener('play', () => {
      const placeholder = vid.parentElement.querySelector('.video-placeholder');
      if (placeholder) placeholder.style.display = 'none';
    });
  });

  // ── 8. PLAN SELECTOR ─────────────────────────────────
  const planInput = document.getElementById('plan');
  document.querySelectorAll('.plan-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.plan-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      if (planInput) planInput.value = opt.dataset.plan;
      clearError('plan');
    });
  });

  // ── 9. FORM VALIDATION & SUBMIT ──────────────────────
  const btnSubmit    = document.getElementById('btnSubmit');
  const btnText      = document.getElementById('btnText');
  const btnSpinner   = document.getElementById('btnSpinner');
  const formSuccess  = document.getElementById('formSuccess');
  const formContainer= document.getElementById('formContainer');
  const formReset    = document.getElementById('formReset');

  function setError(fieldId, msg) {
    const el = document.getElementById('err-' + fieldId);
    const input = document.getElementById(fieldId) ||
                  document.querySelector('[name="' + fieldId + '"]');
    if (el) el.textContent = msg;
    if (input) {
      input.classList.add('invalid');
      input.classList.remove('valid');
    }
  }
  function clearError(fieldId) {
    const el = document.getElementById('err-' + fieldId);
    const input = document.getElementById(fieldId);
    if (el) el.textContent = '';
    if (input) {
      input.classList.remove('invalid');
      if (input.value) input.classList.add('valid');
    }
  }

  // Live validation
  ['nombre','empresa','email','telefono','departamento','rubro'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      if (el.value.trim()) clearError(id);
    });
    el.addEventListener('blur', () => validateField(id));
  });

  function validateField(id) {
    const el = document.getElementById(id);
    if (!el) return true;
    const val = el.value.trim();
    if (!val) { setError(id, 'Este campo es obligatorio.'); return false; }
    if (id === 'email') {
      const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailReg.test(val)) { setError(id, 'Ingresa un correo válido. Ej: nombre@gmail.com'); return false; }
    }
    if (id === 'telefono') {
      const telReg = /^[\d\s\-\+\(\)]{7,15}$/;
      if (!telReg.test(val)) { setError(id, 'Ingresa un número válido. Ej: 7000-0000'); return false; }
    }
    clearError(id);
    return true;
  }

  function validateAll() {
    let valid = true;
    ['nombre','empresa','email','telefono','departamento','rubro'].forEach(id => {
      if (!validateField(id)) valid = false;
    });
    // Plan
    if (!planInput || !planInput.value) {
      setError('plan', 'Selecciona un plan de interés.');
      valid = false;
    } else {
      clearError('plan');
    }
    // Términos
    const terminos = document.getElementById('terminos');
    if (!terminos || !terminos.checked) {
      setError('terminos', 'Debes aceptar para continuar.');
      valid = false;
    } else {
      clearError('terminos');
    }
    return valid;
  }

  if (btnSubmit) {
    btnSubmit.addEventListener('click', async () => {
      if (!validateAll()) {
        // Scroll to first error
        const firstErr = document.querySelector('.field-error:not(:empty)');
        if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Collect data
      const data = {
        nombre:       document.getElementById('nombre').value.trim(),
        empresa:      document.getElementById('empresa').value.trim(),
        email:        document.getElementById('email').value.trim(),
        telefono:     document.getElementById('telefono').value.trim(),
        departamento: document.getElementById('departamento').value,
        rubro:        document.getElementById('rubro').value,
        plan:         planInput.value,
        mensaje:      document.getElementById('mensaje').value.trim() || '(Sin mensaje adicional)',
        fecha:        new Date().toLocaleString('es-SV'),
      };

      // Loading state
      btnSubmit.disabled = true;
      btnText.classList.add('hidden');
      btnSpinner.classList.remove('hidden');

      let enviado = false;

      // Intento EmailJS
      if (typeof emailjs !== 'undefined' &&
          EMAILJS_PUBLIC_KEY !== 'TU_PUBLIC_KEY') {
        try {
          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            from_name:    data.nombre,
            empresa:      data.empresa,
            email:        data.email,
            telefono:     data.telefono,
            departamento: data.departamento,
            rubro:        data.rubro,
            plan:         data.plan,
            mensaje:      data.mensaje,
            fecha:        data.fecha,
          });
          enviado = true;
        } catch (err) {
          console.warn('EmailJS error:', err);
        }
      }

      // Siempre guardar en localStorage como respaldo
      saveLocalRecord(data);

      // Mostrar éxito
      btnSubmit.disabled = false;
      btnText.classList.remove('hidden');
      btnSpinner.classList.add('hidden');
      formContainer.classList.add('hidden');
      formSuccess.classList.remove('hidden');
      renderLocalLog();
    });
  }

  if (formReset) {
    formReset.addEventListener('click', () => {
      formSuccess.classList.add('hidden');
      formContainer.classList.remove('hidden');
      // Reset fields
      ['nombre','empresa','email','telefono','mensaje'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.value = ''; el.classList.remove('valid','invalid'); }
      });
      ['departamento','rubro'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.selectedIndex = 0; el.classList.remove('valid','invalid'); }
      });
      document.querySelectorAll('.plan-option').forEach(o => o.classList.remove('selected'));
      if (planInput) planInput.value = '';
      const terminos = document.getElementById('terminos');
      if (terminos) terminos.checked = false;
      document.querySelectorAll('.field-error').forEach(e => e.textContent = '');
    });
  }

  // ── 10. LOCAL STORAGE RECORDS ────────────────────────
  function saveLocalRecord(data) {
    const records = JSON.parse(localStorage.getItem('nexus_solicitudes') || '[]');
    records.unshift(data);
    localStorage.setItem('nexus_solicitudes', JSON.stringify(records.slice(0, 50)));
  }

  function renderLocalLog() {
    const records = JSON.parse(localStorage.getItem('nexus_solicitudes') || '[]');
    const card    = document.getElementById('localLogCard');
    const list    = document.getElementById('localLogList');
    if (!card || !list) return;
    if (records.length === 0) { card.style.display = 'none'; return; }
    card.style.display = 'block';
    list.innerHTML = records.slice(0, 5).map(r =>
      `<div class="log-entry">
        <strong>${r.empresa}</strong> — ${r.nombre}<br/>
        📧 ${r.email} · 📱 ${r.telefono}<br/>
        Plan: ${r.plan} · ${r.fecha}
      </div>`
    ).join('');
  }

  const btnClear = document.getElementById('btnClearLog');
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      localStorage.removeItem('nexus_solicitudes');
      renderLocalLog();
    });
  }

  renderLocalLog();

  // ── 11. FLOW STEPS HOVER ─────────────────────────────
  document.querySelectorAll('.flow-step').forEach(step => {
    step.addEventListener('mouseenter', () => {
      const n = step.querySelector('.step-number');
      if (n) n.style.color = 'var(--blue-bright)';
    });
    step.addEventListener('mouseleave', () => {
      const n = step.querySelector('.step-number');
      if (n) n.style.color = 'var(--blue-pale)';
    });
  });

  // ── 12. SCROLL ANIMATIONS ────────────────────────────
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(
    '.pillar-card, .tl-item, .flow-step, .stat-card, .chip, .audio-card, .plan-option'
  ).forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(20px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
    observer.observe(el);
  });

  // ── 13. VC DIAGRAM SPEED ON HOVER ────────────────────
  const vcDiagram = document.querySelector('.vc-diagram');
  if (vcDiagram) {
    vcDiagram.addEventListener('mouseenter', () => {
      const ol = vcDiagram.querySelector('.orbit-line');
      if (ol) ol.style.animationDuration = '6s';
    });
    vcDiagram.addEventListener('mouseleave', () => {
      const ol = vcDiagram.querySelector('.orbit-line');
      if (ol) ol.style.animationDuration = '12s';
    });
  }

});
