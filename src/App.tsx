import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ShoppingBag, X, Plus, Minus, Trash2, Sparkles, Check } from 'lucide-react';

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

const PRODUCTS = [
  {
    id: 'dog-biscuits-chicken',
    name: 'Dog Biscuits',
    flavor: 'Chicken Flavour',
    price: 12.99,
    weight: '400g',
    src: '/images/dog_biscuits.png',
    bg: '#F5B041',
    features: ['Oven Baked', 'Strong Bones', 'Real Chicken']
  },
  {
    id: 'cat-biscuits-tuna',
    name: 'Cat Biscuits',
    flavor: 'Tuna Flavour',
    price: 12.99,
    weight: '400g',
    src: '/images/cat_biscuits.png',
    bg: '#9C8CE7',
    features: ['Zero Artificial Colors', 'Healthy Skin & Coat', 'Real Tuna']
  },
  {
    id: 'dog-bites-beef',
    name: 'Gourmet Dog Bites',
    flavor: 'Beef & Liver Flavour',
    price: 9.99,
    weight: '250g',
    src: '/images/dog_biscuits.png',
    bg: '#F4845F',
    features: ['Grain Free', 'High Protein', 'Premium Beef']
  },
  {
    id: 'cat-crunchies-salmon',
    name: 'Salmon Kitten Bites',
    flavor: 'Wild Salmon Flavour',
    price: 8.99,
    weight: '200g',
    src: '/images/cat_biscuits.png',
    bg: '#6EB5FF',
    features: ['Omega 3 Oil', 'Easy Digestion', 'Wild Salmon']
  }
];

interface CartItem {
  id: string;
  name: string;
  flavor: string;
  price: number;
  weight: string;
  src: string;
  quantity: number;
  bg: string;
}

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // E-commerce Cart States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Preload all 4 images on mount
  useEffect(() => {
    IMAGES.forEach((item) => {
      const img = new Image();
      img.src = item.src;
    });
  }, []);

  // Handle responsiveness and sticky header scroll listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    handleResize();
    handleScroll();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
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

  // Derive role styles for hero carousel
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

  // Shopping Cart Operations
  const addToCart = (productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === productId);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prevCart,
        {
          id: product.id,
          name: product.name,
          flavor: product.flavor,
          price: product.price,
          weight: product.weight,
          src: product.src,
          bg: product.bg,
          quantity: 1,
        },
      ];
    });

    setIsCartOpen(true);
    setAnimateCart(true);
    setTimeout(() => setAnimateCart(false), 250);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const handleCheckout = () => {
    setCheckoutSuccess(true);
    setTimeout(() => {
      setCheckoutSuccess(false);
      setCart([]);
      setIsCartOpen(false);
    }, 2800);
  };

  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartTotalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="relative w-full overflow-hidden bg-[#0d0c11]">
      {/* Dynamic sticky navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-80 transition-all duration-300 select-none ${
          isScrolled
            ? 'py-3 backdrop-blur-md bg-[#0d0c11]/70 border-b border-white/5 shadow-xl'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          <div className="flex flex-col">
            <a href="#" className="text-sm sm:text-base font-bold uppercase text-white tracking-[0.18em]">
              PETOHOLIC
            </a>
            <span className="text-[8px] sm:text-[9px] font-medium uppercase text-white/60 tracking-[0.08em] mt-0.5">
              Happy Pets. Happy Life.
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-xs font-semibold text-white/70 hover:text-white uppercase tracking-wider transition-colors">
              Hero Showcase
            </a>
            <a href="#shop" className="text-xs font-semibold text-white/70 hover:text-white uppercase tracking-wider transition-colors">
              Shop Treats
            </a>
          </nav>

          <button
            onClick={() => setIsCartOpen(true)}
            className={`relative flex items-center justify-center p-2 rounded-full backdrop-blur-md border border-white/10 hover:border-white/30 text-white cursor-pointer transition-all hover:scale-105 active:scale-95 bg-white/5 ${
              animateCart ? 'animate-pop' : ''
            }`}
            aria-label="Open Shopping Cart"
          >
            <ShoppingBag size={20} strokeWidth={2.0} />
            {cartTotalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-black border border-[#0d0c11]">
                {cartTotalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero Showcase (Carousel) */}
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

      {/* SHOP SECTION */}
      <section id="shop" className="relative py-24 sm:py-32 px-4 sm:px-8 border-t border-white/5 bg-[#0d0c11]">
        {/* Grain overlay for section */}
        <div className="absolute inset-0 pointer-events-none grain-overlay opacity-[0.2] z-0" />

        <div className="relative max-w-7xl mx-auto z-10">
          <div className="text-center sm:text-left mb-12 sm:mb-16 select-none">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-[0.2em]">
              PETOHOLIC PANTRY
            </span>
            <h2 className="text-3xl sm:text-[44px] font-anton uppercase text-white mt-2 mb-4 tracking-normal leading-none">
              Shop Premium Baked Treats
            </h2>
            <p className="max-w-xl text-white/60 text-xs sm:text-sm leading-relaxed mx-auto sm:mx-0">
              Reward your furry family members with gourmet, oven-baked treats crafted from wholesome, organic ingredients. Absolutely no artificial colors, no additives—just pure love.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {PRODUCTS.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col glass-panel glass-panel-hover rounded-2xl p-5 select-none"
              >
                {/* Visual Glow Backdrop */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl opacity-10 transition-opacity duration-300 group-hover:opacity-20 pointer-events-none"
                  style={{ backgroundColor: product.bg }}
                />

                {/* Card Top Information */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-semibold text-white/50 bg-white/5 px-2 py-0.5 rounded-full">
                    {product.weight}
                  </span>
                  <div className="flex gap-1">
                    {product.features.slice(0, 1).map((feat, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-bold text-black bg-amber-500 px-2.5 py-0.5 rounded-full flex items-center gap-1"
                      >
                        <Sparkles size={8} /> {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Product Image Frame */}
                <div className="relative h-56 flex items-center justify-center mb-6 overflow-hidden">
                  <div
                    className="absolute inset-0 rounded-full scale-75 opacity-10 blur-xl transition-transform duration-300 group-hover:scale-90"
                    style={{ backgroundColor: product.bg }}
                  />
                  <img
                    src={product.src}
                    alt={product.name}
                    className="h-full object-contain transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-105 select-none"
                  />
                </div>

                {/* Product Meta */}
                <div className="flex-grow flex flex-col justify-end">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-0.5">
                    {product.name}
                  </h3>
                  <p className="text-xs text-white/60 font-medium mb-3">
                    {product.flavor}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-5">
                    {product.features.slice(1).map((feat, idx) => (
                      <span key={idx} className="text-[9px] text-white/70 bg-white/5 border border-white/5 px-2 py-0.5 rounded">
                        {feat}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-bold text-white">
                      ${product.price}
                    </span>
                    <button
                      onClick={() => addToCart(product.id)}
                      className="px-4 py-2 text-xs font-bold text-black bg-white rounded-lg hover:bg-amber-500 hover:scale-[1.03] transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-md"
                    >
                      <Plus size={12} strokeWidth={3} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-[#09080c] border-t border-white/5 relative z-10 text-center select-none">
        <p className="text-xs text-white/40">
          &copy; {new Date().getFullYear()} PETOHOLIC Inc. Happy Pets. Happy Life. All rights reserved.
        </p>
      </footer>

      {/* SHOPPING CART DRAWER OVERLAY */}
      <div
        className={`fixed inset-0 z-[100] transition-opacity duration-300 pointer-events-none select-none ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'
        }`}
      >
        {/* Backdrop blur */}
        <div
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Sliding Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-full sm:w-[440px] bg-[#0d0c11]/95 backdrop-blur-md shadow-2xl border-l border-white/5 flex flex-col z-[101] drawer-transition ${
            isCartOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-amber-500" size={20} />
              <h2 className="text-lg font-bold text-white">Your Pantry Cart</h2>
              <span className="text-xs font-semibold text-white/50 bg-white/5 px-2 py-0.5 rounded-full">
                {cartTotalItems} {cartTotalItems === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full text-white/50 hover:text-white bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
              aria-label="Close cart drawer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Cart Contents */}
          <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-6">
            {cart.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center text-white/40 select-none">
                <ShoppingBag size={48} className="mb-4 text-white/15 animate-pulse" />
                <p className="text-sm font-semibold">Your pantry cart is currently empty</p>
                <p className="text-xs mt-1">Explore our treats and add healthy biscuits for your pet!</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-5 py-2.5 text-xs font-bold text-black bg-white rounded-lg hover:bg-amber-500 hover:scale-103 transition-all cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
                  {/* Item Image */}
                  <div
                    className="relative w-16 h-16 rounded-lg p-1.5 flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: `${item.bg}15` }}
                  >
                    <img src={item.src} alt={item.name} className="h-full object-contain" />
                  </div>

                  {/* Item Details */}
                  <div className="flex-grow">
                    <h3 className="text-sm font-bold text-white leading-tight">{item.name}</h3>
                    <p className="text-[10px] text-white/50 font-medium mb-1.5">{item.flavor}</p>
                    <span className="text-xs font-bold text-white">${item.price}</span>
                  </div>

                  {/* Quantity Actions */}
                  <div className="flex flex-col items-end justify-between h-full gap-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-white/30 hover:text-red-400 p-1 cursor-pointer transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="flex items-center border border-white/10 rounded-md overflow-hidden bg-white/5">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 px-2 hover:bg-white/5 text-white/70 hover:text-white transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={10} strokeWidth={2.5} />
                      </button>
                      <span className="px-2 text-xs font-bold text-white select-none">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 px-2 hover:bg-white/5 text-white/70 hover:text-white transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus size={10} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-white/5 bg-white/[0.01]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/50">Shipping & taxes</span>
                <span className="text-xs font-semibold text-green-400 uppercase tracking-wider bg-green-500/10 px-2 py-0.5 rounded">
                  Calculated at Checkout
                </span>
              </div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-white/70 font-semibold">Subtotal</span>
                <span className="text-xl font-bold text-white">${cartSubtotal.toFixed(2)}</span>
              </div>

              {checkoutSuccess ? (
                <div className="w-full bg-emerald-500 text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 select-none">
                  <Check size={18} strokeWidth={3} />
                  Payment Successful! Thank you!
                </div>
              ) : (
                <button
                  onClick={handleCheckout}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black py-4 rounded-xl font-bold text-sm tracking-wider uppercase transition-all hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-amber-500/10"
                >
                  <Sparkles size={16} />
                  Proceed to Checkout
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
