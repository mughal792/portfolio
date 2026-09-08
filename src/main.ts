/**
 * Yahya Mughal Portfolio - High-Performance Vanilla JS Controller
 * Clean, lightweight DOM controller with zero runtime dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', String(!isExpanded));
      mobileMenu.classList.toggle('hidden');
    });

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Active Section Highlighting via IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav-link');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // 3. Header Scroll Shadow
  const siteHeader = document.getElementById('siteHeader');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (siteHeader) {
      if (scrollY > 20) {
        siteHeader.classList.add('shadow-sm', 'bg-surface/95');
        siteHeader.classList.remove('bg-surface/80');
      } else {
        siteHeader.classList.remove('shadow-sm', 'bg-surface/95');
        siteHeader.classList.add('bg-surface/80');
      }
    }

    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.remove('hide');
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
        backToTopBtn.classList.add('hide');
      }
    }
  }, { passive: true });

  // 4. Contact Form Handler with Instant WhatsApp Integration option
  const contactForm = document.getElementById('contactForm') as HTMLFormElement | null;
  const formSuccess = document.getElementById('formSuccess');
  const whatsappSubmitBtn = document.getElementById('whatsappSubmitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('formName') as HTMLInputElement | null;
      const emailInput = document.getElementById('formEmail') as HTMLInputElement | null;
      const serviceSelect = document.getElementById('formService') as HTMLSelectElement | null;
      const messageInput = document.getElementById('formMessage') as HTMLTextAreaElement | null;

      const name = nameInput?.value.trim() || 'Client';
      const email = emailInput?.value.trim() || '';
      const service = serviceSelect?.value || 'General Inquiry';
      const message = messageInput?.value.trim() || '';

      if (!name || !email || !message) {
        alert('Please fill in all required fields.');
        return;
      }

      // Show confirmation state
      if (formSuccess) {
        formSuccess.classList.remove('hidden');
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Prepare mailto link as fallback backup trigger
      const mailtoUrl = `mailto:mughl792ab@gmail.com?subject=${encodeURIComponent(
        `Portfolio Inquiry: ${service} - from ${name}`
      )}&body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nService: ${service}\n\nProject Details:\n${message}`
      )}`;

      // Reset form fields
      contactForm.reset();

      // Open email client safely
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 600);
    });
  }

  // Quick WhatsApp trigger from form data
  if (whatsappSubmitBtn) {
    whatsappSubmitBtn.addEventListener('click', () => {
      const nameInput = document.getElementById('formName') as HTMLInputElement | null;
      const serviceSelect = document.getElementById('formService') as HTMLSelectElement | null;
      const messageInput = document.getElementById('formMessage') as HTMLTextAreaElement | null;

      const name = nameInput?.value.trim() || '';
      const service = serviceSelect?.value || 'Digital Marketing / Web Development';
      const message = messageInput?.value.trim() || '';

      const waText = `Hi Yahya, I'm ${name ? name : 'visiting your portfolio'}. I am interested in: ${service}.${message ? ` Details: ${message}` : ''}`;
      const waUrl = `https://wa.me/923716461882?text=${encodeURIComponent(waText)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // 5. Copy Email to Clipboard with Quick Visual Feedback
  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
  copyEmailBtns.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = 'mughl792ab@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        const originalText = btn.getAttribute('data-original-text') || btn.innerHTML;
        btn.innerHTML = '<span class="text-xs font-bold text-green-700">✓ Copied!</span>';
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2000);
      } catch {
        window.location.href = `mailto:${email}`;
      }
    });
  });

  // 6. Personal Hero Profile Photo Dynamic Sync & Local Drop Handler
  const heroProfilePhoto = document.getElementById('heroProfilePhoto') as HTMLImageElement | null;
  const heroPortraitFrame = document.getElementById('heroPortraitFrame');
  const heroPhotoUploadInput = document.getElementById('heroPhotoUploadInput') as HTMLInputElement | null;
  const heroPhotoUploadTrigger = document.getElementById('heroPhotoUploadTrigger');
  const heroProfilePicture = document.getElementById('heroProfilePicture');

  // Check if a saved custom profile photo is in localStorage
  const savedPhoto = localStorage.getItem('yahya_custom_hero_photo');
  if (savedPhoto && heroProfilePhoto) {
    heroProfilePhoto.src = savedPhoto;
    if (heroProfilePicture) {
      heroProfilePicture.querySelectorAll('source').forEach((s) => s.setAttribute('srcset', savedPhoto));
    }
  }

  function applyNewPhoto(file: File) {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result && heroProfilePhoto) {
        heroProfilePhoto.src = result;
        if (heroProfilePicture) {
          heroProfilePicture.querySelectorAll('source').forEach((s) => s.setAttribute('srcset', result));
        }
        try {
          localStorage.setItem('yahya_custom_hero_photo', result);
        } catch {
          // localStorage capacity guard
        }
      }
    };
    reader.readAsDataURL(file);
  }

  if (heroPhotoUploadTrigger && heroPhotoUploadInput) {
    heroPhotoUploadTrigger.addEventListener('click', () => {
      heroPhotoUploadInput.click();
    });

    heroPhotoUploadInput.addEventListener('change', () => {
      const file = heroPhotoUploadInput.files?.[0];
      if (file) applyNewPhoto(file);
    });
  }

  if (heroPortraitFrame) {
    heroPortraitFrame.addEventListener('dragover', (e) => {
      e.preventDefault();
      heroPortraitFrame.classList.add('ring-2', 'ring-[#a33900]');
    });

    heroPortraitFrame.addEventListener('dragleave', () => {
      heroPortraitFrame.classList.remove('ring-2', 'ring-[#a33900]');
    });

    heroPortraitFrame.addEventListener('drop', (e) => {
      e.preventDefault();
      heroPortraitFrame.classList.remove('ring-2', 'ring-[#a33900]');
      const file = e.dataTransfer?.files?.[0];
      if (file) applyNewPhoto(file);
    });
  }
});
