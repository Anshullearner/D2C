import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const IMAGES = [
  {
    src: '/images/dog_biscuits.png',
    bg: '#F5B041',
    name: 'DOG BISCUITS',
    flavor: 'CHICKEN FLAVOUR',
    desc: 'Oven-baked to gold perfection, Petoholic premium chicken biscuits support strong bones and healthy teeth. Formulated with real chicken for a crunchy taste your dogs will love.'
  },
  {
    src: '/images/cat_biscuits.png',
    bg: '#9C8CE7',
    name: 'CAT BISCUITS',
    flavor: 'TUNA FLAVOUR',
    desc: 'Delectable, oven-baked tuna-flavored biscuits crafted to support a lustrous coat and healthy skin. Zero artificial colors, prepared with real tuna cats adore.'
  },
  {
    src: '/images/dog_biscuits.png',
    bg: '#F5B041',
    name: 'DOG BISCUITS',
    flavor: 'CHICKEN FLAVOUR',
    desc: 'Oven-baked to gold perfection, Petoholic premium chicken biscuits support strong bones and healthy teeth. Formulated with real chicken for a crunchy taste your dogs will love.'
  },
  {
    src: '/images/cat_biscuits.png',
    bg: '#9C8CE7',
    name: 'CAT BISCUITS',
    flavor: 'TUNA FLAVOUR',
    desc: 'Delectable, oven-baked tuna-flavored biscuits crafted to support a lustrous coat and healthy skin. Zero artificial colors, prepared with real tuna cats adore.'
  },
];

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Preload all 4 images on mount
  useEffect(() => {
    IMAGES.forEach((item) => {
      const img = new Image();
      img.src = item.src;
    });
  }, []);

  // Handle responsiveness resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Carousel navigation
  const navigate = (direction: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);
    if (direction === 'next') {
      setActiveIndex((prev) => (prev + 1) % 4);
    } else {
      setActiveIndex((prev) => (prev + 3) % 4);
    }
    setTimeout(() => {
      setIsAnimating(false);
    }, 650);
  };

  // Derive role styles
  const getRoleStyles = (role: 'center' | 'left' | 'right' | 'back') => {
    switch (role) {
      case 'center':
        return {
          transform: `translateX(-50%) scale(${isMobile ? 1.0 : 1.18})`,
          filter: 'blur(0px)',
          opacity: 1,
          zIndex: 20,
          left: '50%',
          height: isMobile ? '52%' : '80%',
          bottom: isMobile ? '24%' : '2%',
        };
      case 'left':
        return {
          transform: 'translateX(-50%) scale(0.68)',
          filter: 'blur(2px)',
          opacity: 0.85,
          zIndex: 10,
          left: isMobile ? '20%' : '30%',
          height: isMobile ? '14%' : '24%',
          bottom: isMobile ? '32%' : '12%',
        };
      case 'right':
        return {
          transform: 'translateX(-50%) scale(0.68)',
          filter: 'blur(2px)',
          opacity: 0.85,
          zIndex: 10,
          left: isMobile ? '80%' : '70%',
          height: isMobile ? '14%' : '24%',
          bottom: isMobile ? '32%' : '12%',
        };
      case 'back':
        return {
          transform: 'translateX(-50%) scale(0.55)',
          filter: 'blur(4px)',
          opacity: 1,
          zIndex: 5,
          left: '50%',
          height: isMobile ? '11%' : '19%',
          bottom: isMobile ? '32%' : '12%',
        };
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-transition min-h-screen"
      style={{
        backgroundColor: IMAGES[activeIndex].bg,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div className="relative w-full h-screen overflow-hidden">
        {/* 1. Grain overlay */}
        <div className="absolute inset-0 pointer-events-none grain-overlay opacity-40 z-50" />

        {/* 2. Giant ghost text "PETOHOLIC" */}
        <div
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none font-anton text-white uppercase text-center"
          style={{
            zIndex: 2,
            top: '18%',
            fontSize: 'clamp(80px, 24vw, 320px)',
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
          }}
        >
          PETOHOLIC
        </div>

        {/* 3. Top-left brand label "PETOHOLIC" */}
        <div className="absolute top-6 left-4 sm:left-8 z-60 select-none">
          <div className="text-xs font-bold uppercase text-white tracking-[0.18em]">
            PETOHOLIC
          </div>
          <div className="text-[9px] font-medium uppercase text-white/80 tracking-[0.08em] mt-0.5">
            Happy Pets. Happy Life.
          </div>
        </div>

        {/* 4. Carousel */}
        <div className="absolute inset-0 z-[3]">
          {IMAGES.map((imgData, index) => {
            // Derive role for the image
            let role: 'center' | 'left' | 'right' | 'back' = 'back';
            if (index === activeIndex) {
              role = 'center';
            } else if (index === (activeIndex + 3) % 4) {
              role = 'left';
            } else if (index === (activeIndex + 1) % 4) {
              role = 'right';
            }

            return (
              <div
                key={index}
                className="carousel-item-transition"
                style={{
                  position: 'absolute',
                  aspectRatio: '0.6 / 1',
                  ...getRoleStyles(role),
                }}
              >
                <img
                  src={imgData.src}
                  alt={`Petoholic product ${imgData.name}`}
                  className="w-full h-full object-contain object-bottom select-none pointer-events-none"
                  draggable="false"
                  fetchPriority={role === 'center' ? 'high' : 'low'}
                />
              </div>
            );
          })}
        </div>

        {/* 5. Bottom-left text + nav buttons */}
        <div className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24 z-60 max-w-[320px] select-none">
          <p
            className="font-bold uppercase text-white opacity-95 mb-0.5 sm:mb-1 text-base sm:text-[22px]"
            style={{ letterSpacing: '0.02em' }}
          >
            {IMAGES[activeIndex].name}
          </p>
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white/90 mb-2 sm:mb-3">
            {IMAGES[activeIndex].flavor}
          </p>
          <p className="hidden sm:block text-xs sm:text-sm text-white opacity-85 leading-[1.6] mb-4 sm:mb-5 transition-opacity duration-300">
            {IMAGES[activeIndex].desc}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('prev')}
              disabled={isAnimating}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white flex items-center justify-center text-white bg-transparent hover:scale-[1.08] hover:bg-white/12 active:scale-95 nav-button-transition cursor-pointer disabled:opacity-50"
              aria-label="Previous product"
            >
              <ArrowLeft size={26} strokeWidth={2.25} />
            </button>
            <button
              onClick={() => navigate('next')}
              disabled={isAnimating}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white flex items-center justify-center text-white bg-transparent hover:scale-[1.08] hover:bg-white/12 active:scale-95 nav-button-transition cursor-pointer disabled:opacity-50"
              aria-label="Next product"
            >
              <ArrowRight size={26} strokeWidth={2.25} />
            </button>
          </div>
        </div>

        {/* 6. Bottom-right link "SHOP TREATS" */}
        <a
          href="#shop"
          className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10 z-60 flex items-center gap-1 sm:gap-2 font-anton text-white opacity-95 hover:opacity-100 no-underline discover-link-transition group uppercase cursor-pointer"
          style={{
            fontSize: 'clamp(20px, 4vw, 56px)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          <span>SHOP TREATS</span>
          <ArrowRight
            className="w-5 h-5 sm:w-8 sm:h-8 transition-transform duration-200 group-hover:translate-x-1"
            strokeWidth={2.25}
          />
        </a>
      </div>
    </div>
  );
}

export default App;
