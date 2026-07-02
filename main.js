(() => {
  document.documentElement.classList.add("js");

  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const menuIcon = document.querySelector("[data-menu-icon]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const mobileLinks = document.querySelectorAll("[data-menu-link]");

  const setScrolled = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  };

  const setMenuOpen = (open) => {
    if (!mobileMenu || !menuIcon) return;
    mobileMenu.classList.toggle("is-open", open);
    mobileMenu.setAttribute("aria-hidden", open ? "false" : "true");
    menuIcon.className = `fas ${open ? "fa-times" : "fa-bars"}`;
    document.body.style.overflow = open ? "hidden" : "";
  };

  setScrolled();
  window.addEventListener("scroll", setScrolled, { passive: true });

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const open = !mobileMenu.classList.contains("is-open");
      setMenuOpen(open);
    });
  }

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  // Reveal Animations on Scroll
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => {
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach((el) => {
      el.classList.add("is-visible");
    });
  }

  const reviews = [
    {
      name: "Mariana Silva",
      photo:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
      text:
        "Atendimento impecável! Saí da clínica me sentindo renovada. A Karoliny tem mãos de fada e o ambiente é super acolhedor.",
    },
    {
      name: "Juliana Costa",
      photo:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
      text:
        "Resultados incríveis no meu tratamento facial. Profissionais super preparadas e tecnologia de ponta. Recomendo demais!",
    },
    {
      name: "Patrícia Almeida",
      photo:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop",
      text:
        "Me sinto em casa toda vez que venho. O cuidado com cada detalhe faz toda a diferença. Minha autoestima agradece!",
    },
  ];

  const carousel = document.querySelector("[data-review-carousel]");
  const reviewName = document.querySelector("[data-review-name]");
  const reviewPhoto = document.querySelector("[data-review-photo]");
  const reviewText = document.querySelector("[data-review-text]");
  const dotsRoot = document.querySelector("[data-review-dots]");
  const prevBtn = document.querySelector("[data-review-prev]");
  const nextBtn = document.querySelector("[data-review-next]");

  let idx = 0;

  const renderDots = () => {
    if (!dotsRoot) return;
    dotsRoot.innerHTML = "";
    reviews.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.className = `dot ${i === idx ? "is-active" : ""}`;
      dotsRoot.appendChild(dot);
    });
  };

  const renderReview = () => {
    if (!carousel || !reviewName || !reviewPhoto || !reviewText) return;
    const r = reviews[idx];
    reviewName.textContent = r.name;
    reviewPhoto.src = r.photo;
    reviewPhoto.alt = r.name;
    reviewText.textContent = `"${r.text}"`;
    renderDots();
  };

  if (carousel) {
    renderReview();
    prevBtn?.addEventListener("click", () => {
      idx = (idx - 1 + reviews.length) % reviews.length;
      renderReview();
    });
    nextBtn?.addEventListener("click", () => {
      idx = (idx + 1) % reviews.length;
      renderReview();
    });
  }

  const form = document.querySelector("[data-contact-form]");
  if (form instanceof HTMLFormElement) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const nome = String(data.get("nome") || "").trim();
      const email = String(data.get("email") || "").trim();
      const telefone = String(data.get("telefone") || "").trim();
      const mensagem = String(data.get("mensagem") || "").trim();

      if (!nome || !email || !telefone || !mensagem) {
        alert("Por favor, preencha todos os campos.");
        return;
      }

      if (!email.includes("@")) {
        alert("Por favor, insira um email válido.");
        return;
      }

      const text = `Olá! Gostaria de agendar uma avaliação na clínica.%0A%0A*Nome:* ${nome}%0A*Email:* ${email}%0A*Telefone:* ${telefone}%0A*Mensagem:* ${mensagem}`;
      const whatsappUrl = `https://wa.me/5527997958981?text=${text}`;

      window.open(whatsappUrl, "_blank");
      form.reset();
    });
  }
})();

// --- Hero Carousel Controller ---
(() => {
  const CAROUSEL_INTERVAL = 4500; // Tempo de transição em milissegundos (configurável)

  const slidesData = [
    {
      src: "./images/IMG_6508.jpg",
      alt: "Dra. Karoliny Brum sorrindo em seu consultório"
    },
    {
      src: "./images/IMG_9991.jpeg",
      alt: "Dra. Karoliny Brum em seu consultório"
    },
    {
      src: "./images/IMG_9992.jpeg",
      alt: "Ambiente luxuoso, relaxante e sofisticado da clínica de estética"
    }
  ];

  const container = document.querySelector(".hero-carousel-container");
  const slidesContainer = document.querySelector("[data-hero-carousel-slides]");
  const dotsContainer = document.querySelector("[data-hero-carousel-dots]");
  const prevBtn = document.querySelector("[data-hero-carousel-prev]");
  const nextBtn = document.querySelector("[data-hero-carousel-next]");

  if (!container || !slidesContainer || !dotsContainer || !prevBtn || !nextBtn) return;

  let currentIndex = 0;
  let autoplayTimer = null;
  let isTransitioning = false;

  // 1. Renderiza os slides dinamicamente
  const renderSlides = () => {
    slidesContainer.innerHTML = slidesData
      .map((slide, index) => `
        <div class="hero-carousel__slide ${index === 0 ? "is-active" : ""}" data-slide-index="${index}">
          <img 
            class="hero-carousel__image" 
            src="${slide.src}" 
            alt="${slide.alt}" 
            loading="${index === 0 ? "eager" : "lazy"}" 
            decoding="async"
          />
        </div>
      `)
      .join("");
  };

  // 2. Renderiza as bolinhas (dots)
  const renderDots = () => {
    dotsContainer.innerHTML = slidesData
      .map((_, index) => `
        <button 
          class="hero-carousel__dot ${index === 0 ? "is-active" : ""}" 
          data-dot-index="${index}" 
          aria-label="Ir para o slide ${index + 1}"
          type="button"
        ></button>
      `)
      .join("");
  };

  renderSlides();
  renderDots();

  const slides = Array.from(slidesContainer.children);
  const dots = Array.from(dotsContainer.children);

  // 3. Função para mudar de slide com transição fade suave
  const goToSlide = (nextIndex) => {
    if (isTransitioning || nextIndex === currentIndex) return;
    isTransitioning = true;

    // Remove a classe ativa do slide e do dot atual
    slides[currentIndex].classList.remove("is-active");
    dots[currentIndex].classList.remove("is-active");

    // Atualiza o índice
    currentIndex = nextIndex;

    // Adiciona a classe ativa no novo slide e dot
    slides[currentIndex].classList.add("is-active");
    dots[currentIndex].classList.add("is-active");

    // Libera a transição após a animação de entrada do CSS (750ms)
    setTimeout(() => {
      isTransitioning = false;
    }, 750);
  };

  const nextSlide = () => {
    const nextIndex = (currentIndex + 1) % slidesData.length;
    goToSlide(nextIndex);
  };

  const prevSlide = () => {
    const prevIndex = (currentIndex - 1 + slidesData.length) % slidesData.length;
    goToSlide(prevIndex);
  };

  // 4. Lógica de Autoplay
  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, CAROUSEL_INTERVAL);
  };

  const stopAutoplay = () => {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };

  // 5. Event Listeners de interação manual
  prevBtn.addEventListener("click", () => {
    prevSlide();
    startAutoplay(); // Reinicia o temporizador ao interagir manualmente
  });

  nextBtn.addEventListener("click", () => {
    nextSlide();
    startAutoplay(); // Reinicia o temporizador ao interagir manualmente
  });

  dotsContainer.addEventListener("click", (e) => {
    const dot = e.target.closest(".hero-carousel__dot");
    if (!dot) return;
    const index = parseInt(dot.getAttribute("data-dot-index"), 10);
    goToSlide(index);
    startAutoplay(); // Reinicia o temporizador ao interagir manualmente
  });

  // Pausar autoplay quando o mouse estiver sobre o carrossel
  container.addEventListener("mouseenter", stopAutoplay);
  container.addEventListener("mouseleave", startAutoplay);

  // Navegação por teclado quando o contêiner do carrossel estiver em foco
  container.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevSlide();
      startAutoplay();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextSlide();
      startAutoplay();
    }
  });

  // Inicializa o Autoplay na carga da página
  startAutoplay();
})();
