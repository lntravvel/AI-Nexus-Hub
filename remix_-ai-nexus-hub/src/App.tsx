/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef, Component, ReactNode } from 'react';
import { 
  Network as Hub, 
  Search, 
  Languages as Language, 
  Zap as Bolt, 
  MessageSquare, 
  Image as ImageIcon, 
  Video, 
  Code, 
  Mic, 
  BarChart, 
  Cpu, 
  Gamepad2, 
  Filter, 
  Bot as SmartToy, 
  Palette, 
  Video as VideoCameraFront,
  ArrowLeft as ArrowBack,
  Bell as Notifications,
  Sparkles as AutoAwesome,
  TrendingUp,
  Flame as NewReleases,
  Gift as Redeem,
  SlidersHorizontal as Tune,
  Brain as Psychology,
  Clapperboard as MovieEdit,
  Music as MusicNote,
  Gamepad2 as SportsEsports,
  Bookmark,
  X,
  Info,
  CheckCircle2 as CheckCircle,
  CreditCard as Payments,
  Laptop as Devices,
  Rocket as RocketLaunch,
  UploadCloud as CloudUpload,
  BadgeCheck as BadgeIcon,
  FileText as Description,
  LayoutDashboard as Dashboard,
  Database,
  Settings,
  Home as HomeIcon,
  Grid as GridView,
  User as Person,
  ChevronRight,
  Star,
  PlayCircle,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ALL_TOOLS as TOOLS, CATEGORIES, Tool, Category } from './data';
import { DigitalSnow } from './components/DigitalSnow';
import { SplashScreen } from './components/SplashScreen';

// --- Types ---
type Screen = 'home' | 'categories' | 'category-details' | 'details' | 'admin' | 'saved' | 'profile';

// --- Hooks ---
const useAutoScroll = (speed: number = 1) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let animationFrameId: number;
    let isHovered = false;
    let isDragging = false;

    const scroll = () => {
      if (!isHovered && !isDragging) {
        const isRtl = getComputedStyle(el).direction === 'rtl';
        if (isRtl) {
          el.scrollLeft -= speed;
          if (Math.abs(el.scrollLeft) >= el.scrollWidth / 2) {
            el.scrollLeft = 0;
          }
        } else {
          el.scrollLeft += speed;
          if (el.scrollLeft >= el.scrollWidth / 2) {
            el.scrollLeft = 0;
          }
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    const handleMouseEnter = () => isHovered = true;
    const handleMouseLeave = () => isHovered = false;
    const handleMouseDown = () => isDragging = true;
    const handleMouseUp = () => isDragging = false;

    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [speed]);

  return ref;
};

// --- Components ---

const SavedScreen = ({ savedTools, onToolClick, lang }: { savedTools: Tool[], onToolClick: (t: Tool) => void, lang: 'en' | 'ar', key?: string }) => {
  const t = {
    en: {
      title: "Saved Tools",
      subtitle: "Your personal collection of AI favorites.",
      emptyTitle: "No saved tools yet",
      emptySubtitle: "Explore categories and bookmark tools you want to keep track of.",
      browse: "Browse Tools",
      viewDetails: "View Details"
    },
    ar: {
      title: "الأدوات المحفوظة",
      subtitle: "مجموعتك الشخصية من أدوات الذكاء الاصطناعي المفضلة.",
      emptyTitle: "لا توجد أدوات محفوظة بعد",
      emptySubtitle: "استكشف الفئات وقم بتمييز الأدوات التي تريد متابعتها.",
      browse: "تصفح الأدوات",
      viewDetails: "عرض التفاصيل"
    }
  }[lang];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8"
    >
      <div className="mb-8 relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <h2 className="text-4xl font-extrabold mb-3 tracking-tight text-gradient">{t.title}</h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">{t.subtitle}</p>
      </div>

      {savedTools.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center glass-panel glow-border rounded-3xl">
          <div className="size-24 rounded-full bg-slate-100/50 dark:bg-slate-800/50 flex items-center justify-center mb-6 shadow-inner border border-slate-200/50 dark:border-slate-700/50">
            <Bookmark className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-slate-800 dark:text-slate-200">{t.emptyTitle}</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
            {t.emptySubtitle}
          </p>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'categories' }))}
            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            {t.browse}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mobile-grid">
          {savedTools.map((tool) => (
            <div key={tool.id} className="glass-panel glow-border rounded-2xl overflow-hidden flex flex-col group cursor-pointer" onClick={() => onToolClick(tool)}>
              <div className="h-48 bg-slate-100 dark:bg-slate-900 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] to-transparent opacity-60 z-10"></div>
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" src={tool.banner} alt={lang === 'en' ? tool.nameEn : tool.nameAr} referrerPolicy="no-referrer" />
                <div className="absolute bottom-3 left-3 z-20 flex gap-2">
                  <span className="px-2 py-1 bg-black/50 backdrop-blur-md rounded-md text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                    {tool.category}
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1 relative">
                <div className="absolute -top-10 right-6 z-20 size-16 rounded-xl bg-[#0a0f1a] p-1 shadow-xl border border-white/10">
                  <div className="w-full h-full rounded-lg overflow-hidden bg-white">
                    <img src={tool.logo} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                </div>
                <div className="pr-16 mb-4">
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors line-clamp-1">{lang === 'en' ? tool.nameEn : tool.nameAr}</h4>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 flex-1 line-clamp-2 font-medium">
                  {lang === 'en' ? tool.descriptionEn : tool.descriptionAr}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {tool.pricing.free.price === 'Free' || tool.pricing.free.price === 'مجاني' ? (lang === 'en' ? 'Free Plan Available' : 'خطة مجانية متاحة') : (lang === 'en' ? 'Paid Only' : 'مدفوع فقط')}
                  </span>
                  <button 
                    className="text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    {t.viewDetails} <ArrowBack className={`w-4 h-4 ${lang === 'en' ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const Header = ({ onSearch, onLangToggle, currentScreen, onBack, lang }: { 
  onSearch?: () => void, 
  onLangToggle?: () => void,
  currentScreen: Screen,
  onBack?: () => void,
  lang: 'en' | 'ar'
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-[#0a0f1a]/80 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          {currentScreen !== 'home' && (
            <button 
              onClick={onBack}
              className="p-1.5 md:p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors glass-panel"
            >
              <ArrowBack className={`w-4 h-4 md:w-5 md:h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
            </button>
          )}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onBack && currentScreen !== 'home' && onBack()}>
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-1 md:p-1.5 rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <Hub className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <h1 className="text-base md:text-xl font-extrabold tracking-tight text-gradient">
              AI Nexus Hub
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <button 
            onClick={onLangToggle}
            className="flex items-center gap-1 md:gap-1.5 text-xs md:text-sm font-bold hover:text-blue-600 transition-colors px-2 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 shadow-sm"
          >
            <Language className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span>{lang === 'en' ? 'العربية' : 'English'}</span>
          </button>
          <button 
            onClick={onSearch}
            className="p-2 md:p-2.5 rounded-lg md:rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200/50 dark:hover:border-slate-700/50"
          >
            <Search className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

const BottomNav = ({ activeScreen, onNavigate, lang }: { activeScreen: Screen, onNavigate: (s: Screen) => void, lang: 'en' | 'ar' }) => {
  const navItems = [
    { id: 'home', icon: HomeIcon, label: lang === 'en' ? 'Home' : 'الرئيسية' },
    { id: 'categories', icon: GridView, label: lang === 'en' ? 'Categories' : 'الفئات' },
    { id: 'saved', icon: Bookmark, label: lang === 'en' ? 'Saved' : 'المحفوظات' },
    { id: 'profile', icon: Person, label: lang === 'en' ? 'Profile' : 'الملف' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0a0f1a]/80 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 pb-safe shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.3)]">
      <div className="max-w-7xl mx-auto flex h-14 md:h-16 items-center justify-around px-2 md:px-4">
        {navItems.map((item) => {
          const isActive = activeScreen === item.id || (activeScreen === 'admin' && item.id === 'profile');
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as Screen)}
              className={`flex flex-1 flex-col items-center justify-center gap-1 md:gap-1.5 transition-all duration-300 relative ${
                isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="bottomNavIndicator"
                  className="absolute -top-2 md:-top-3 left-1/2 -translate-x-1/2 w-8 md:w-12 h-1 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                />
              )}
              <item.icon className={`w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 ${isActive ? 'scale-110 fill-current' : 'scale-100'}`} />
              <span className={`text-[9px] md:text-[10px] uppercase tracking-wider transition-all duration-300 ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

// --- Screens ---

const HomeScreen = ({ onToolClick, onBrowseAll, onCategoryClick, lang }: { onToolClick: (t: Tool) => void, onBrowseAll: () => void, onCategoryClick: (c: Category) => void, lang: 'en' | 'ar', key?: string }) => {
  const categoriesScrollRef = useAutoScroll(1);
  const featuredScrollRef = useAutoScroll(1.5);

  const t = {
    en: {
      latest: "LATEST UPDATES IN AI",
      title: "The Central Hub for All Things AI",
      subtitle: "Discover, compare, and master the world's most powerful artificial intelligence tools in one unified workspace.",
      getStarted: "Get Started",
      browse: "Browse Tools",
      categories: "Categories",
      viewAll: "View All",
      featured: "Featured Tools",
      viewDetails: "View Details"
    },
    ar: {
      latest: "أحدث التحديثات في الذكاء الاصطناعي",
      title: "المحطة المركزية لكل ما يتعلق بالذكاء الاصطناعي",
      subtitle: "اكتشف وقارن وأتقن أقوى أدوات الذكاء الاصطناعي في العالم في مساحة عمل موحدة.",
      getStarted: "ابدأ الآن",
      browse: "تصفح الأدوات",
      categories: "الفئات",
      viewAll: "عرض الكل",
      featured: "الأدوات المميزة",
      viewDetails: "عرض التفاصيل"
    }
  }[lang];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1"
    >
      {/* Hero */}
      <section className="relative px-4 py-12 md:py-24 overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 border border-blue-600/30 animate-float">
            <Bolt className="w-4 h-4" />
            {t.latest}
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-8 text-gradient">
            {t.title}
          </h2>
          <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400 text-lg md:text-xl mb-10">
            {t.subtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-blue-600/20 animate-pulse-glow">
              {t.getStarted}
            </button>
            <button 
              onClick={onBrowseAll}
              className="glass-panel text-slate-900 dark:text-slate-100 px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all"
            >
              {t.browse}
            </button>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-12 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
              {t.categories}
            </h3>
            <button onClick={onBrowseAll} className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
              {t.viewAll} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div ref={categoriesScrollRef} className="flex gap-4 overflow-x-hidden pb-4 -mx-4 px-4 cursor-grab active:cursor-grabbing"
               onMouseDown={(e) => {
                 const ele = e.currentTarget;
                 let isDown = true;
                 let startX = e.pageX - ele.offsetLeft;
                 let scrollLeft = ele.scrollLeft;
                 const isRtl = getComputedStyle(ele).direction === 'rtl';
                 
                 const onMouseMove = (e: MouseEvent) => {
                   if (!isDown) return;
                   e.preventDefault();
                   const x = e.pageX - ele.offsetLeft;
                   const walk = (x - startX) * 2;
                   ele.scrollLeft = isRtl ? scrollLeft + walk : scrollLeft - walk;
                 };
                 
                 const onMouseUp = () => {
                   isDown = false;
                   document.removeEventListener('mousemove', onMouseMove);
                   document.removeEventListener('mouseup', onMouseUp);
                 };
                 
                 document.addEventListener('mousemove', onMouseMove);
                 document.addEventListener('mouseup', onMouseUp);
               }}>
            {[...CATEGORIES, ...CATEGORIES].map((cat, idx) => (
              <div key={`${cat.id}-${idx}`} onClick={() => onCategoryClick(cat)} className="flex-none w-32 md:w-40 glass-panel glow-border p-4 md:p-5 rounded-2xl text-center flex flex-col items-center gap-3 md:gap-4 cursor-pointer group">
                <div className={`size-12 md:size-14 rounded-2xl bg-white/10 dark:bg-slate-800/50 ${cat.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner`}>
                  {cat.id === 'llm' && <MessageSquare className="w-6 h-6 md:w-7 md:h-7" />}
                  {cat.id === 'image' && <ImageIcon className="w-6 h-6 md:w-7 md:h-7" />}
                  {cat.id === 'video' && <Video className="w-6 h-6 md:w-7 md:h-7" />}
                  {cat.id === 'coding' && <Code className="w-6 h-6 md:w-7 md:h-7" />}
                  {cat.id === 'audio' && <Mic className="w-6 h-6 md:w-7 md:h-7" />}
                  {cat.id === 'analytics' && <BarChart className="w-6 h-6 md:w-7 md:h-7" />}
                  {cat.id === 'gaming' && <Gamepad2 className="w-6 h-6 md:w-7 md:h-7" />}
                  {cat.id === 'google' && <Search className="w-6 h-6 md:w-7 md:h-7" />}
                  {cat.id === 'research' && <BookOpen className="w-6 h-6 md:w-7 md:h-7" />}
                </div>
                <span className="font-bold text-xs md:text-sm tracking-wide">{lang === 'en' ? cat.nameEn : cat.nameAr}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-12 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <div className="w-2 h-6 bg-purple-600 rounded-full animate-pulse-glow"></div>
              {t.featured}
            </h3>
            <button className="size-10 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
          <div ref={featuredScrollRef} className="flex gap-4 overflow-x-hidden pb-8 -mx-4 px-4 cursor-grab active:cursor-grabbing"
               onMouseDown={(e) => {
                 const ele = e.currentTarget;
                 let isDown = true;
                 let startX = e.pageX - ele.offsetLeft;
                 let scrollLeft = ele.scrollLeft;
                 const isRtl = getComputedStyle(ele).direction === 'rtl';
                 
                 const onMouseMove = (e: MouseEvent) => {
                   if (!isDown) return;
                   e.preventDefault();
                   const x = e.pageX - ele.offsetLeft;
                   const walk = (x - startX) * 2;
                   ele.scrollLeft = isRtl ? scrollLeft + walk : scrollLeft - walk;
                 };
                 
                 const onMouseUp = () => {
                   isDown = false;
                   document.removeEventListener('mousemove', onMouseMove);
                   document.removeEventListener('mouseup', onMouseUp);
                 };
                 
                 document.addEventListener('mousemove', onMouseMove);
                 document.addEventListener('mouseup', onMouseUp);
               }}>
            {[...TOOLS.slice(0, 8), ...TOOLS.slice(0, 8)].map((tool, idx) => (
              <div key={`${tool.id}-${idx}`} onClick={() => onToolClick(tool)} className="flex-none w-[240px] md:w-[280px] glass-panel glow-border p-3 md:p-4 rounded-2xl flex items-center gap-3 md:gap-4 cursor-pointer hover:shadow-lg transition-all group">
                <div className="size-10 md:size-12 rounded-xl bg-slate-100 dark:bg-slate-900 overflow-hidden shrink-0 shadow-inner">
                  <img src={tool.logo} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-xs md:text-sm truncate group-hover:text-blue-500 transition-colors">{lang === 'en' ? tool.nameEn : tool.nameAr}</h4>
                    <span className={`text-[8px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 rounded uppercase tracking-wider ${
                      tool.pricingType === 'free' ? 'bg-green-500/20 text-green-700 dark:text-green-400' :
                      tool.pricingType === 'freemium' ? 'bg-blue-500/20 text-blue-700 dark:text-blue-400' :
                      'bg-purple-500/20 text-purple-700 dark:text-purple-400'
                    }`}>
                      {lang === 'en' ? tool.pricingType : (tool.pricingType === 'free' ? 'مجاني' : tool.pricingType === 'freemium' ? 'مجاني جزئياً' : 'مدفوع')}
                    </span>
                  </div>
                  <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 truncate">{lang === 'en' ? tool.descriptionEn : tool.descriptionAr}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

const CategoriesScreen = ({ onToolClick, lang }: { onToolClick: (t: Tool) => void, lang: 'en' | 'ar', key?: string }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const t = {
    en: {
      placeholder: "Search AI tools & categories...",
      allCategories: "All Categories",
      noResults: "No tools found matching your criteria.",
      viewDetails: "View Details",
      tryNow: "Try Now",
      filters: {
        all: "All",
        popular: "Most Popular",
        newest: "Newest",
        free: "Free"
      }
    },
    ar: {
      placeholder: "ابحث عن أدوات وفئات الذكاء الاصطناعي...",
      allCategories: "جميع الفئات",
      noResults: "لم يتم العثور على أدوات تطابق معاييرك.",
      viewDetails: "عرض التفاصيل",
      tryNow: "جرب الآن",
      filters: {
        all: "الكل",
        popular: "الأكثر شعبية",
        newest: "الأحدث",
        free: "مجاني"
      }
    }
  }[lang];

  const filters = [
    { id: 'all', label: t.filters.all, icon: AutoAwesome },
    { id: 'popular', label: t.filters.popular, icon: TrendingUp },
    { id: 'newest', label: t.filters.newest, icon: NewReleases },
    { id: 'free', label: t.filters.free, icon: Redeem },
  ];

  const filteredTools = useMemo(() => {
    return TOOLS.filter(tool => {
      const matchesSearch = tool.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           tool.descriptionEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.nameAr.includes(searchQuery) ||
                           tool.descriptionAr.includes(searchQuery);
      const matchesCategory = !selectedCategory || tool.category === selectedCategory;
      
      let matchesFilter = true;
      if (activeFilter === 'free') matchesFilter = tool.pricing.free.price.toLowerCase().includes('free') || tool.pricing.free.price.includes('مجاني');
      if (activeFilter === 'popular') matchesFilter = tool.badge === 'Popular' || tool.badge === 'شائع';
      if (activeFilter === 'newest') matchesFilter = tool.badge === 'New' || tool.badge === 'جديد';

      return matchesSearch && matchesCategory && matchesFilter;
    });
  }, [searchQuery, selectedCategory, activeFilter]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 w-full max-w-5xl mx-auto p-4"
    >
      <div className="mb-6">
        <div className="relative flex items-center w-full group">
          <Search className={`absolute ${lang === 'en' ? 'left-4' : 'right-4'} w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors`} />
          <input 
            className={`w-full bg-slate-200/50 dark:bg-slate-800/50 border-none rounded-xl py-3 ${lang === 'en' ? 'pl-12 pr-4' : 'pr-12 pl-4'} focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all text-sm placeholder:text-slate-500`} 
            placeholder={t.placeholder} 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-3 mb-6 overflow-x-auto pb-2 no-scrollbar">
        {filters.map((f) => (
          <button 
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
              activeFilter === f.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-600'
            }`}
          >
            <f.icon className="w-4 h-4" />
            <span>{f.label}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 mb-8 -mx-4 px-4 snap-x snap-mandatory cursor-grab active:cursor-grabbing"
           onMouseDown={(e) => {
             const ele = e.currentTarget;
             let isDown = true;
             let startX = e.pageX - ele.offsetLeft;
             let scrollLeft = ele.scrollLeft;
             const isRtl = getComputedStyle(ele).direction === 'rtl';
             
             const onMouseMove = (e: MouseEvent) => {
               if (!isDown) return;
               e.preventDefault();
               const x = e.pageX - ele.offsetLeft;
               const walk = (x - startX) * 2;
               ele.scrollLeft = isRtl ? scrollLeft + walk : scrollLeft - walk;
             };
             
             const onMouseUp = () => {
               isDown = false;
               document.removeEventListener('mousemove', onMouseMove);
               document.removeEventListener('mouseup', onMouseUp);
             };
             
             document.addEventListener('mousemove', onMouseMove);
             document.addEventListener('mouseup', onMouseUp);
           }}>
        <button 
          onClick={() => setSelectedCategory(null)}
          className={`flex-none snap-start px-6 py-2 rounded-xl font-bold transition-all ${!selectedCategory ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
        >
          {t.allCategories}
        </button>
        {CATEGORIES.map((cat) => (
          <button 
            key={cat.id} 
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex-none snap-start px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${selectedCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
          >
            <span className="text-xs">{lang === 'en' ? cat.nameEn : cat.nameAr}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mobile-grid">
        {filteredTools.map((tool) => (
            <div 
              key={tool.id} 
              onClick={() => onToolClick(tool)}
              className="glass-panel glow-border rounded-2xl overflow-hidden flex flex-col hover:shadow-xl transition-all group cursor-pointer"
            >
              <div className="h-40 bg-slate-100 dark:bg-slate-900 overflow-hidden relative">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={tool.banner} alt={lang === 'en' ? tool.nameEn : tool.nameAr} referrerPolicy="no-referrer" />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-10 rounded-xl bg-white/10 dark:bg-slate-800/50 p-1.5 flex items-center justify-center overflow-hidden shadow-inner">
                    <img src={tool.logo} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-bold truncate group-hover:text-blue-500 transition-colors">{lang === 'en' ? tool.nameEn : tool.nameAr}</h4>
                    {tool.releaseYear && (
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{tool.releaseYear}</span>
                    )}
                  </div>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 flex-1 line-clamp-2">
                  {lang === 'en' ? tool.descriptionEn : tool.descriptionAr}
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onToolClick(tool);
                    }}
                    className="flex-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 text-sm font-bold py-2.5 rounded-xl transition-colors"
                  >
                    {t.viewDetails}
                  </button>
                  <a 
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center text-sm font-bold py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-600/20 cursor-pointer"
                  >
                    {t.tryNow}
                  </a>
                </div>
              </div>
            </div>
        ))}
      </div>
      
      {filteredTools.length === 0 && (
        <div className="text-center py-20 glass-panel rounded-3xl mt-8">
          <p className="text-slate-500 font-medium">{t.noResults}</p>
        </div>
      )}
    </motion.div>
  );
};

const CategoryDetailsScreen = ({ category, onToolClick, lang }: { category: Category, onToolClick: (t: Tool) => void, lang: 'en' | 'ar', key?: string }) => {
  const categoryTools = useMemo(() => TOOLS.filter(t => t.category === category.id), [category.id]);
  
  const freeTools = categoryTools.filter(t => t.pricingType === 'free');
  const freemiumTools = categoryTools.filter(t => t.pricingType === 'freemium');
  const paidTools = categoryTools.filter(t => t.pricingType === 'paid');

  const t = {
    en: {
      free: "Free Tools",
      freemium: "Freemium Tools",
      paid: "Paid Tools",
      comparison: "Tools Comparison",
      features: "Features",
      pricing: "Pricing",
      bestFor: "Best For",
      tryNow: "Try Now",
      toolName: "Tool Name",
      audience: "Target Audience",
      release: "Release"
    },
    ar: {
      free: "أدوات مجانية",
      freemium: "أدوات مجانية جزئياً",
      paid: "أدوات مدفوعة",
      comparison: "مقارنة الأدوات",
      features: "المميزات",
      pricing: "الأسعار",
      bestFor: "أفضل لـ",
      tryNow: "جرب الآن",
      toolName: "اسم الأداة",
      audience: "الجمهور المستهدف",
      release: "الإصدار"
    }
  }[lang];

  const renderToolList = (tools: Tool[], title: string) => {
    if (tools.length === 0) return null;
    return (
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <div className="w-2 h-8 bg-blue-600 rounded-full animate-pulse-glow"></div>
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mobile-grid">
          {tools.map(tool => (
            <div 
              key={tool.id} 
              onClick={() => onToolClick(tool)}
              className="glass-panel glow-border rounded-2xl overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-300 group cursor-pointer"
            >
              <div className="h-48 bg-slate-100 dark:bg-slate-900 overflow-hidden relative">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={tool.banner} alt={lang === 'en' ? tool.nameEn : tool.nameAr} referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white text-xs font-medium bg-blue-600/80 px-2 py-1 rounded backdrop-blur-sm">
                    {lang === 'en' ? tool.targetAudienceEn : tool.targetAudienceAr}
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="size-12 rounded-xl bg-white/10 dark:bg-slate-800/50 p-2 flex items-center justify-center overflow-hidden shadow-inner">
                    <img src={tool.logo} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xl font-bold truncate group-hover:text-blue-500 transition-colors">{lang === 'en' ? tool.nameEn : tool.nameAr}</h4>
                    {tool.releaseYear && (
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{tool.releaseYear}</span>
                    )}
                  </div>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-3 flex-1 line-clamp-2">
                  {lang === 'en' ? tool.descriptionEn : tool.descriptionAr}
                </p>
                <p className="text-slate-400 dark:text-slate-500 text-xs mb-6 flex-1 line-clamp-2 font-mono">
                  {lang === 'en' ? tool.technicalOverviewEn : tool.technicalOverviewAr}
                </p>
                <div className="flex gap-3 mt-auto">
                  <button 
                    onClick={() => onToolClick(tool)}
                    className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-bold py-2.5 rounded-xl transition-colors"
                  >
                    {t.features}
                  </button>
                  <a 
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center text-sm font-bold py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-600/20 cursor-pointer"
                  >
                    {t.tryNow}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const IconComponent = {
    'MessageSquare': MessageSquare,
    'Image': ImageIcon,
    'Video': Video,
    'Code': Code,
    'Mic': Mic,
    'BarChart': BarChart,
    'Cpu': Cpu,
    'Gamepad2': Gamepad2,
    'Search': Search,
    'BookOpen': BookOpen
  }[category.icon] || Bolt;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 bg-grid-pattern-light dark:bg-grid-pattern"
    >
      <div className="bg-slate-900 text-white py-10 md:py-20 px-4 text-center relative overflow-hidden data-flow-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-transparent"></div>
        <div className="max-w-3xl mx-auto relative z-10">
          <div className={`size-14 md:size-20 mx-auto rounded-2xl md:rounded-3xl bg-white/10 flex items-center justify-center mb-4 md:mb-8 ${category.color} animate-float backdrop-blur-md border border-white/10`}>
            <IconComponent className="w-7 h-7 md:w-10 md:h-10" />
          </div>
          <h1 className="text-3xl md:text-6xl font-extrabold mb-3 md:mb-6 text-gradient">{lang === 'en' ? category.nameEn : category.nameAr}</h1>
          <p className="max-w-2xl mx-auto text-slate-300 text-sm md:text-xl leading-relaxed">{lang === 'en' ? category.descriptionEn : category.descriptionAr}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {renderToolList(freeTools, t.free)}
        {renderToolList(freemiumTools, t.freemium)}
        {renderToolList(paidTools, t.paid)}

        {categoryTools.length > 0 && (
          <div className="mt-10 md:mt-20">
            <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-8 flex items-center gap-3">
              <div className="w-2 h-6 md:h-8 bg-purple-600 rounded-full animate-pulse-glow"></div>
              {t.comparison}
            </h2>
            <div className="flex flex-col gap-2 md:gap-4">
              {/* Desktop Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-5 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200/50 dark:border-slate-700/50 backdrop-blur-md rounded-t-2xl font-bold text-slate-900 dark:text-white text-sm glass-panel glow-border mb-[-1rem] relative z-10">
                <div className="col-span-4">{t.toolName}</div>
                <div className="col-span-2">{t.pricing}</div>
                <div className="col-span-3">{t.audience}</div>
                <div className="col-span-1">{t.release}</div>
                <div className="col-span-2 text-end"></div>
              </div>
              
              <div className="flex flex-col gap-0 divide-y divide-slate-200/50 dark:divide-slate-700/50 glass-panel glow-border rounded-2xl md:rounded-t-none overflow-hidden relative z-0 md:pt-4">
                {categoryTools.map(tool => (
                  <div 
                    key={tool.id} 
                    onClick={() => onToolClick(tool)}
                    className="flex items-center gap-3 p-3 md:p-5 md:grid md:grid-cols-12 md:items-center md:gap-4 hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  >
                    {/* Mobile: compact single row | Desktop: grid */}
                    <div className="md:col-span-4 flex items-center gap-2 md:gap-4 flex-1 min-w-0">
                      <div className="size-8 md:size-10 rounded-lg bg-slate-100 dark:bg-slate-900 overflow-hidden shadow-inner shrink-0">
                        <img src={tool.logo} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                      </div>
                      <span className="font-bold text-sm md:text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">{lang === 'en' ? tool.nameEn : tool.nameAr}</span>
                    </div>
                    
                    <div className="md:col-span-2 flex items-center shrink-0">
                      <span className={`px-2 md:px-3 py-1 rounded-md text-[10px] md:text-xs font-bold uppercase tracking-wider ${
                        tool.pricingType === 'free' ? 'bg-green-500/20 text-green-700 dark:text-green-400' :
                        tool.pricingType === 'freemium' ? 'bg-blue-500/20 text-blue-700 dark:text-blue-400' :
                        'bg-purple-500/20 text-purple-700 dark:text-purple-400'
                      }`}>
                        {lang === 'en' ? tool.pricingType : (tool.pricingType === 'free' ? 'مجاني' : tool.pricingType === 'freemium' ? 'مجاني جزئياً' : 'مدفوع')}
                      </span>
                    </div>
                    
                    <div className="hidden md:flex md:col-span-3 items-center">
                      <span className="text-slate-600 dark:text-slate-400 font-medium text-base">
                        {lang === 'en' ? tool.targetAudienceEn : tool.targetAudienceAr}
                      </span>
                    </div>
                    
                    <div className="hidden md:flex md:col-span-1 items-center">
                      <span className="text-slate-500 dark:text-slate-500 font-mono text-xs">
                        {tool.releaseYear || '-'}
                      </span>
                    </div>

                    <div className="md:col-span-2 flex justify-end shrink-0">
                      <a 
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-bold text-xs md:text-sm transition-colors shadow-md shadow-blue-600/20"
                      >
                        {t.tryNow}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ToolModal = ({ tool, isSaved, onToggleSave, onClose, lang }: { tool: Tool, isSaved: boolean, onToggleSave: (id: string) => void, onClose: () => void, lang: 'en' | 'ar', key?: string }) => {
  const t = {
    en: {
      overview: "Technical Overview",
      features: "Key Features",
      howToUse: "How to Use",
      pricing: "Pricing",
      compatibility: "Compatibility",
      tryNow: "Try Now",
      free: "Free",
      pro: "Pro",
      trial: "Trial plan",
      professional: "Professional use",
      perMonth: "/per month",
      popular: "Popular"
    },
    ar: {
      overview: "نظرة عامة تقنية",
      features: "الميزات الرئيسية",
      howToUse: "كيفية الاستخدام",
      bestFor: "الأفضل لـ",
      pricing: "الأسعار",
      compatibility: "التوافق",
      tryNow: "جرب الآن",
      free: "مجاني",
      pro: "احترافي",
      trial: "خطة تجريبية",
      professional: "للاستخدام المهني",
      perMonth: "/شهرياً",
      popular: "شائع"
    }
  }[lang];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl bg-white dark:bg-[#0a0f1a] rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-200/50 dark:border-slate-800/50"
        >
          <button 
            onClick={onClose}
            className={`absolute top-4 ${lang === 'en' ? 'right-4' : 'left-4'} z-[110] p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors border border-white/10`}
          >
            <X className="w-6 h-6" />
          </button>

          <header className="p-4 md:p-8 flex flex-col items-center text-center gap-3 md:gap-6 relative overflow-hidden data-flow-bg">
            <div className="absolute inset-0 bg-grid-pattern-light dark:bg-grid-pattern opacity-50"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent"></div>
            <div className="w-full flex justify-end relative z-10">
              <button 
                onClick={() => onToggleSave(tool.id)}
                className={`p-2 md:p-3 rounded-full transition-colors ${isSaved ? 'text-blue-600 bg-blue-600/10' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 glass-panel'}`}
              >
                <Bookmark className={`w-5 h-5 md:w-6 md:h-6 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>
        <div className="w-16 h-16 md:w-28 md:h-28 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 p-0.5 shadow-2xl shadow-blue-600/30 relative z-10">
          <div className="w-full h-full bg-white dark:bg-[#0a0f1a] rounded-[10px] md:rounded-[14px] flex items-center justify-center overflow-hidden">
            <img src={tool.logo} alt={lang === 'en' ? tool.nameEn : tool.nameAr} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        </div>
        <div className="space-y-2 relative z-10">
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-gradient">{lang === 'en' ? tool.nameEn : tool.nameAr}</h2>
          <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap">
            <span className="px-2 md:px-3 py-1 bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded-full text-xs md:text-sm font-bold">
              {CATEGORIES.find(c => c.id === tool.category)?.[lang === 'en' ? 'nameEn' : 'nameAr'] || tool.category}
            </span>
            <span className="px-2 md:px-3 py-1 bg-purple-600/10 text-purple-600 dark:text-purple-400 rounded-full text-xs md:text-sm font-bold">
              {lang === 'en' ? tool.targetAudienceEn : tool.targetAudienceAr}
            </span>
            {tool.releaseYear && (
              <span className="px-2 md:px-3 py-1 bg-slate-500/10 text-slate-600 dark:text-slate-400 rounded-full text-xs md:text-sm font-mono">
                {tool.releaseYear}
              </span>
            )}
          </div>
        </div>
      </header>

        <div className="p-6 md:p-8 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <section className="glass-panel glow-border rounded-3xl p-6">
            <h3 className="text-xl font-bold flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-600/10 rounded-lg text-blue-600">
                <Info className="w-5 h-5" />
              </div>
              {t.overview}
            </h3>
            <div className="leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
              <p>{lang === 'en' ? tool.technicalOverviewEn : tool.technicalOverviewAr}</p>
            </div>
          </section>

          <section className="glass-panel glow-border rounded-3xl p-6">
            <h3 className="text-xl font-bold flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-600/10 rounded-lg text-amber-600">
                <Star className="w-5 h-5" />
              </div>
              {t.bestFor}
            </h3>
            <div className="leading-relaxed text-slate-700 dark:text-slate-300 font-bold text-lg">
              <p>{lang === 'en' ? tool.bestForEn : tool.bestForAr}</p>
            </div>
          </section>

          {(tool.howToUseEn || tool.howToUseAr) && (
            <section className="glass-panel glow-border rounded-3xl p-6">
              <h3 className="text-xl font-bold flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-600/10 rounded-lg text-emerald-600">
                  <PlayCircle className="w-5 h-5" />
                </div>
                {t.howToUse}
              </h3>
              <div className="leading-relaxed text-slate-700 dark:text-slate-300 font-medium whitespace-pre-line bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
                <p>{lang === 'en' ? tool.howToUseEn : tool.howToUseAr}</p>
              </div>
            </section>
          )}

          <section className="glass-panel glow-border rounded-3xl p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <div className="p-2 bg-purple-600/10 rounded-lg text-purple-600">
                <AutoAwesome className="w-5 h-5" />
              </div>
              {t.features}
            </h3>
            <div className="grid gap-4">
              {(lang === 'en' ? tool.featuresEn : tool.featuresAr).map((feat, i) => (
                <div key={i} className="flex items-start gap-4 bg-white/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-500/50 transition-colors">
                  <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex flex-col w-full gap-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{feat}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel glow-border rounded-3xl p-6 md:p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <div className="p-2 bg-green-600/10 rounded-lg text-green-600">
                <Payments className="w-5 h-5" />
              </div>
              {t.pricing}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 bg-white/50 dark:bg-slate-800/30">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="font-bold text-xl">{t.free}</h4>
                    <p className="text-slate-500 text-sm font-medium">{t.trial}</p>
                  </div>
                  <span className="text-3xl font-extrabold text-slate-800 dark:text-white">{tool.pricing.free.price}</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {tool.pricing.free.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-slate-400" /> {f}</li>
                  ))}
                </ul>
              </div>
              <div className="border-2 border-blue-600 rounded-2xl p-6 bg-blue-600/5 relative overflow-hidden shadow-lg shadow-blue-600/10">
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-xl uppercase tracking-wider">{t.popular}</div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="font-bold text-xl text-blue-600 dark:text-blue-400">{t.pro}</h4>
                    <p className="text-slate-500 text-sm font-medium">{t.professional}</p>
                  </div>
                  <div className="text-end">
                    <span className="text-3xl font-extrabold text-slate-800 dark:text-white">{tool.pricing.pro.price}</span>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">{t.perMonth}</p>
                  </div>
                </div>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {tool.pricing.pro.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-900 dark:text-slate-100">
                      <CheckCircle className="w-4 h-4 text-blue-600" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="glass-panel glow-border rounded-3xl p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <div className="p-2 bg-orange-600/10 rounded-lg text-orange-600">
                <Devices className="w-5 h-5" />
              </div>
              {t.compatibility}
            </h3>
            <div className="flex flex-wrap gap-3">
              {tool.compatibility.map((c, i) => (
                <span key={i} className="px-5 py-2.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 rounded-xl text-sm font-bold shadow-sm">{c}</span>
              ))}
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50 dark:bg-[#0a0f1a]">
          <a 
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-xl shadow-blue-600/30 animate-pulse-glow cursor-pointer"
          >
            <span className="text-lg">{t.tryNow}</span>
            <RocketLaunch className="w-6 h-6" />
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AdminPortal = ({ lang }: { lang: 'en' | 'ar', key?: string }) => {
  const t = {
    en: {
      title: "Add New Tool",
      subtitle: "AI Nexus Hub Admin Portal",
      cancel: "Cancel",
      save: "Save Tool",
      identity: "Identity & Branding",
      logo: "Tool Logo",
      upload: "Click to upload or drag & drop PNG, SVG",
      nameEn: "Tool Name (EN)",
      nameAr: "Tool Name (AR)",
      category: "Category",
      selectCategory: "Select Category",
      pricing: "Pricing Model",
      perMonth: "/ month",
      content: "Content & Marketing",
      descEn: "Short Description (EN)",
      descAr: "Short Description (AR)",
      techEn: "Technical Overview (EN)",
      techAr: "Technical Overview (AR)",
      dashboard: "Dashboard",
      tools: "Tools",
      analytics: "Analytics",
      settings: "Settings"
    },
    ar: {
      title: "إضافة أداة جديدة",
      subtitle: "بوابة مسؤول AI Nexus Hub",
      cancel: "إلغاء",
      save: "حفظ الأداة",
      identity: "الهوية والعلامة التجارية",
      logo: "شعار الأداة",
      upload: "انقر للتحميل أو اسحب وأفلت PNG ، SVG",
      nameEn: "اسم الأداة (EN)",
      nameAr: "اسم الأداة (AR)",
      category: "الفئة",
      selectCategory: "اختر الفئة",
      pricing: "نموذج التسعير",
      perMonth: "/ شهرياً",
      content: "المحتوى والتسويق",
      descEn: "وصف قصير (EN)",
      descAr: "وصف قصير (AR)",
      techEn: "نظرة عامة تقنية (EN)",
      techAr: "نظرة عامة تقنية (AR)",
      dashboard: "لوحة القيادة",
      tools: "الأدوات",
      analytics: "التحليلات",
      settings: "الإعدادات"
    }
  }[lang];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 space-y-8"
    >
      <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-6 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gradient mb-1">{t.title}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t.subtitle}</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors">{t.cancel}</button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 transition-all active:scale-95">
            {t.save}
          </button>
        </div>
      </div>

      <section className="glass-panel glow-border rounded-3xl p-6 md:p-8 space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-200/50 dark:border-slate-700/50 pb-4">
          <div className="p-2 bg-blue-600/10 rounded-lg text-blue-600">
            <BadgeIcon className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">{t.identity}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">{t.logo}</p>
            <div className="relative group aspect-square rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all overflow-hidden">
              <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CloudUpload className="w-12 h-12 mb-3 text-slate-400 group-hover:text-blue-500 transition-colors relative z-10" />
              <p className="text-xs text-slate-500 font-medium text-center px-6 relative z-10">{t.upload}</p>
            </div>
          </div>
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.nameEn}</span>
                <input className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-4 py-3 text-sm font-medium transition-all outline-none" placeholder="e.g. Nexus GPT" type="text" />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.nameAr}</span>
                <input className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-4 py-3 text-sm font-medium transition-all outline-none" dir="rtl" placeholder="مثال: نكسوس جي بي تي" type="text" />
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.category}</span>
                <select className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-4 py-3 text-sm font-medium transition-all outline-none appearance-none cursor-pointer">
                  <option>{t.selectCategory}</option>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{lang === 'en' ? c.nameEn : c.nameAr}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.pricing}</span>
                <div className="relative">
                  <span className={`absolute ${lang === 'en' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-slate-400 font-bold`}>$</span>
                  <input className={`w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${lang === 'en' ? 'pl-8 pr-4' : 'pr-8 pl-4'} py-3 text-sm font-medium transition-all outline-none`} placeholder={`0.00 ${t.perMonth}`} type="text" />
                </div>
              </label>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-panel glow-border rounded-3xl p-6 md:p-8 space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-200/50 dark:border-slate-700/50 pb-4">
          <div className="p-2 bg-purple-600/10 rounded-lg text-purple-600">
            <Description className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">{t.content}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.descEn}</span>
            <textarea className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-4 py-3 text-sm font-medium transition-all outline-none resize-none" placeholder="A brief one-liner summary for cards..." rows={3}></textarea>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.descAr}</span>
            <textarea className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-4 py-3 text-sm font-medium transition-all outline-none resize-none" dir="rtl" placeholder="وصف موجز يظهر في بطاقة الأداة..." rows={3}></textarea>
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.techEn}</span>
            <textarea className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-4 py-3 text-sm font-medium transition-all outline-none" placeholder="Detailed technical capabilities, API info, etc..." rows={6}></textarea>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.techAr}</span>
            <textarea className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-4 py-3 text-sm font-medium transition-all outline-none" dir="rtl" placeholder="تفاصيل القدرات التقنية ومعلومات واجهة البرمجيات..." rows={6}></textarea>
          </label>
        </div>
      </section>

      {/* Admin Bottom Nav */}
      <div className="h-24 md:hidden"></div>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-[#0a0f1a]/80 backdrop-blur-xl px-4 pb-safe pt-2 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.3)]">
        <button className="flex flex-1 flex-col items-center justify-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors py-2">
          <Dashboard className="w-6 h-6" />
          <p className="text-[10px] font-bold tracking-wide uppercase">{t.dashboard}</p>
        </button>
        <button className="flex flex-1 flex-col items-center justify-center gap-1.5 text-blue-600 py-2 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
          <Database className="w-6 h-6" />
          <p className="text-[10px] font-bold tracking-wide uppercase">{t.tools}</p>
        </button>
        <button className="flex flex-1 flex-col items-center justify-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors py-2">
          <BarChart className="w-6 h-6" />
          <p className="text-[10px] font-bold tracking-wide uppercase">{t.analytics}</p>
        </button>
        <button className="flex flex-1 flex-col items-center justify-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors py-2">
          <Settings className="w-6 h-6" />
          <p className="text-[10px] font-bold tracking-wide uppercase">{t.settings}</p>
        </button>
      </nav>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nexus_saved_tools');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [lang, setLang] = useState<'en' | 'ar'>('ar'); // Arabic as default as requested
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem('nexus_saved_tools', JSON.stringify(savedIds));
    } catch (e) {
      console.error("Failed to save tools", e);
    }
  }, [savedIds]);

  useEffect(() => {
    const handleNavigate = (e: any) => setScreen(e.detail);
    window.addEventListener('navigate', handleNavigate);
    return () => window.removeEventListener('navigate', handleNavigate);
  }, []);

  const toggleSave = (id: string) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const savedTools = useMemo(() => TOOLS.filter(t => savedIds.includes(t.id)), [savedIds]);

  useEffect(() => {
    // Apply dark mode by default as per screenshots
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Apply RTL for Arabic
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const handleToolClick = (tool: Tool) => {
    setSelectedTool(tool);
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setScreen('category-details');
  };

  const handleBack = () => {
    if (selectedTool) {
      setSelectedTool(null);
    } else if (screen === 'category-details') {
      setScreen('home');
      setSelectedCategory(null);
    } else {
      setScreen('home');
    }
  };

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'ar' : 'en');
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <SplashScreen lang={lang} onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>
      <div 
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
        className={`min-h-screen bg-slate-50 dark:bg-[#0a0f1a] text-slate-900 dark:text-slate-100 font-sans flex flex-col relative overflow-hidden ${lang === 'ar' ? 'font-arabic' : ''} ${showSplash ? 'h-screen overflow-hidden' : ''}`}
      >
      <div className="scan-line hidden dark:block"></div>
      <DigitalSnow />
      <Header 
        currentScreen={screen} 
        onBack={handleBack} 
        onLangToggle={toggleLang} 
        onSearch={() => setScreen('categories')} 
        lang={lang}
      />

      <main className="flex-1 pb-24 relative z-10">
        <AnimatePresence mode="wait">
          {screen === 'home' && (
            <HomeScreen 
              key="home" 
              onToolClick={handleToolClick} 
              onBrowseAll={() => setScreen('categories')} 
              onCategoryClick={handleCategoryClick}
              lang={lang}
            />
          )}
          {screen === 'categories' && (
            <CategoriesScreen 
              key="categories" 
              onToolClick={handleToolClick} 
              lang={lang}
            />
          )}
          {screen === 'category-details' && selectedCategory && (
            <CategoryDetailsScreen
              key="category-details"
              category={selectedCategory}
              onToolClick={handleToolClick}
              lang={lang}
            />
          )}
          {screen === 'saved' && (
            <SavedScreen 
              key="saved" 
              savedTools={savedTools} 
              onToolClick={handleToolClick} 
              lang={lang}
            />
          )}
          {screen === 'admin' && (
            <AdminPortal key="admin" lang={lang} />
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {selectedTool && (
          <ToolModal 
            key={selectedTool.id}
            tool={selectedTool} 
            isSaved={savedIds.includes(selectedTool.id)} 
            onToggleSave={toggleSave} 
            onClose={() => setSelectedTool(null)}
            lang={lang}
          />
        )}
      </AnimatePresence>

      <BottomNav 
        activeScreen={screen} 
        lang={lang}
        onNavigate={(s) => {
          if (s === 'profile') setScreen('admin'); // Using profile as entry to admin for demo
          else setScreen(s);
        }} 
      />
      </div>
    </>
  );
}
