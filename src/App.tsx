import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, ArrowLeft, ArrowRight, RotateCw, Shield, Terminal, Search, Globe, Clock, Zap, FileText, Folder, Maximize, Minimize, Gamepad2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { games } from './games';

interface Tab {
  id: string;
  url: string;
  displayUrl: string;
  title: string;
  loading: boolean;
}

function HomePage({ onNavigate }: { onNavigate: (url: string) => void }) {
  const [localInput, setLocalInput] = useState('');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localInput.trim()) onNavigate(localInput);
  };

  const quickLinks = [
    { name: 'WIKIPEDIA', url: 'wikipedia.org' },
    { name: 'HACKER NEWS', url: 'news.ycombinator.com' },
    { name: 'GITHUB', url: 'github.com' },
    { name: 'DUCKDUCKGO', url: 'duckduckgo.com' }
  ];

  return (
    <div className="w-full h-full flex items-center justify-center bg-raw-bg relative overflow-hidden p-4 sm:p-8">
      {/* Blueprint grid background */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'linear-gradient(var(--color-raw-ink) 1px, transparent 1px), linear-gradient(90deg, var(--color-raw-ink) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
      
      <div className="relative z-10 w-full max-w-3xl border border-raw-ink bg-raw-white shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] flex flex-col">
        <div className="border-b border-raw-ink p-3 sm:p-4 flex justify-between items-center bg-raw-bg">
          <div className="flex items-center space-x-2 font-bold tracking-widest">
            <Globe size={16} />
            <span>SYS.HOME</span>
          </div>
          <div className="flex items-center space-x-2 text-xs font-bold">
            <Clock size={14} />
            <span>{time.toLocaleTimeString()}</span>
          </div>
        </div>
        
        <div className="p-6 sm:p-10 flex flex-col gap-8">
          <div className="text-center">
            <Terminal size={48} strokeWidth={1.5} className="mx-auto mb-4 text-raw-accent" />
            <div className="text-4xl sm:text-6xl font-bold tracking-tighter">HYPER_PROXY</div>
            <div className="text-xs uppercase tracking-widest opacity-50 mt-2">Secure Browsing Environment</div>
          </div>

          <form onSubmit={handleSubmit} className="flex border-2 border-raw-ink bg-raw-white focus-within:border-raw-accent transition-colors">
            <div className="p-3 sm:p-4 bg-raw-ink text-raw-white flex items-center justify-center">
              <Search size={20} />
            </div>
            <input
              autoFocus
              value={localInput}
              onChange={e => setLocalInput(e.target.value)}
              className="flex-1 p-3 sm:p-4 bg-transparent outline-none font-mono text-sm sm:text-base placeholder-raw-ink/30"
              placeholder="ENTER URL OR SEARCH QUERY..."
              spellCheck={false}
            />
            <button type="submit" className="px-6 sm:px-8 border-l-2 border-raw-ink hover:bg-raw-accent hover:text-raw-white font-bold transition-colors flex items-center space-x-2">
              <span className="hidden sm:inline">INITIALIZE</span>
              <Zap size={16} className="sm:hidden" />
            </button>
          </form>

          <div>
            <div className="text-xs font-bold mb-3 opacity-50 flex items-center space-x-2">
              <span>// QUICK_ACCESS</span>
              <div className="h-px bg-raw-ink flex-1 opacity-20"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {quickLinks.map((link, i) => (
                <button
                  key={link.name}
                  onClick={() => onNavigate(link.url)}
                  className="border border-raw-ink p-3 sm:p-4 text-left hover:bg-raw-ink hover:text-raw-white transition-colors flex justify-between items-center group bg-raw-bg"
                >
                  <span className="font-bold tracking-tight">{link.name}</span>
                  <span className="opacity-30 group-hover:opacity-100 font-mono text-xs">[{String(i+1).padStart(2, '0')}]</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', url: 'about:blank', displayUrl: '', title: 'NEW_TAB', loading: false }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('1');
  const [inputValue, setInputValue] = useState('');
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);
  const [isBrowserFullscreen, setIsBrowserFullscreen] = useState(false);
  const [isGamesOpen, setIsGamesOpen] = useState(false);
  const [isGamesFullscreen, setIsGamesFullscreen] = useState(false);
  const [activeGame, setActiveGame] = useState<{name: string, url: string} | null>(null);
  const [isFileViewerOpen, setIsFileViewerOpen] = useState(false);
  const [isFileViewerFullscreen, setIsFileViewerFullscreen] = useState(false);
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [lockedTabCount, setLockedTabCount] = useState<number | null>(null);
  const [time, setTime] = useState(new Date());
  const unlockTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isBrowserOpen) setLockedTabCount(null);
  }, [isBrowserOpen]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  useEffect(() => {
    if (activeTab) {
      setInputValue(activeTab.displayUrl);
    }
  }, [activeTabId, activeTab?.displayUrl]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'navigate' && event.data.url && event.data.tabId) {
        setTabs(currentTabs => currentTabs.map(t => {
          if (t.id === event.data.tabId) {
            return { ...t, url: event.data.url, displayUrl: event.data.url, title: event.data.url, loading: true };
          }
          return t;
        }));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const addTab = () => {
    setLockedTabCount(null);
    const newId = Math.random().toString(36).substr(2, 9);
    setTabs([...tabs, { id: newId, url: 'about:blank', displayUrl: '', title: 'NEW_TAB', loading: false }]);
    setActiveTabId(newId);
  };

  const closeTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLockedTabCount(prev => prev !== null ? prev : tabs.length);
    
    if (unlockTimeoutRef.current) clearTimeout(unlockTimeoutRef.current);
    unlockTimeoutRef.current = setTimeout(() => {
      setLockedTabCount(null);
    }, 350);

    if (tabs.length === 1) {
      setTabs([{ id: Math.random().toString(36).substr(2, 9), url: 'about:blank', displayUrl: '', title: 'NEW_TAB', loading: false }]);
      return;
    }
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  const handleNavigate = (targetUrl: string, tabId: string) => {
    let url = targetUrl.trim();
    if (!url) return;
    
    let displayUrl = url;
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.includes('.') && !url.includes(' ')) {
        url = 'https://' + url;
      } else {
        url = 'https://duckduckgo.com/?q=' + encodeURIComponent(url);
        displayUrl = url;
      }
    }

    setTabs(currentTabs => currentTabs.map(t => {
      if (t.id === tabId) {
        return { ...t, url: url, displayUrl, title: displayUrl, loading: true };
      }
      return t;
    }));
    
    if (tabId === activeTabId) {
      setInputValue(displayUrl);
    }
  };

  const onTopBarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleNavigate(inputValue, activeTabId);
  };

  const handleIframeLoad = (id: string) => {
    setTabs(tabs.map(t => t.id === id ? { ...t, loading: false } : t));
  };

  const reloadTab = () => {
    if (activeTab.url !== 'about:blank') {
      setTabs(tabs.map(t => t.id === activeTabId ? { ...t, loading: true } : t));
      // Force iframe reload by slightly modifying the URL or just relying on React key
      // For simplicity, we just set loading to true and let the iframe reload
      const iframe = document.getElementById(`iframe-${activeTabId}`) as HTMLIFrameElement;
      if (iframe) {
        iframe.src = iframe.src;
      }
    }
  };

  return (
    <div className="h-screen w-screen bg-raw-bg text-raw-ink font-mono overflow-hidden selection:bg-raw-accent selection:text-raw-white relative">
      {/* Desktop Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(var(--color-raw-ink) 1px, transparent 1px), linear-gradient(90deg, var(--color-raw-ink) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 flex flex-col gap-6 z-10">
        <button 
          onDoubleClick={() => setIsBrowserOpen(true)}
          onClick={() => setIsBrowserOpen(true)}
          className="group flex flex-col items-center w-24 gap-2"
        >
          <div className="w-12 h-12 bg-raw-white border-2 border-raw-ink shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] group-hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all flex items-center justify-center text-raw-accent">
            <Globe size={24} strokeWidth={2} />
          </div>
          <span className="text-xs font-bold bg-raw-white px-1 border border-transparent group-hover:border-raw-ink group-hover:bg-raw-accent group-hover:text-raw-white transition-colors">HYPER_PROXY</span>
        </button>

        <button 
          onDoubleClick={() => setIsFileViewerOpen(true)}
          onClick={() => setIsFileViewerOpen(true)}
          className="group flex flex-col items-center w-24 gap-2"
        >
          <div className="w-12 h-12 bg-raw-white border-2 border-raw-ink shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] group-hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all flex items-center justify-center text-blue-600">
            <FileText size={24} strokeWidth={2} />
          </div>
          <span className="text-xs font-bold bg-raw-white px-1 border border-transparent group-hover:border-raw-ink group-hover:bg-raw-accent group-hover:text-raw-white transition-colors">FILES</span>
        </button>

        <button 
          onDoubleClick={() => setIsGamesOpen(true)}
          onClick={() => setIsGamesOpen(true)}
          className="group flex flex-col items-center w-24 gap-2"
        >
          <div className="w-12 h-12 bg-raw-white border-2 border-raw-ink shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] group-hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all flex items-center justify-center text-purple-600">
            <Gamepad2 size={24} strokeWidth={2} />
          </div>
          <span className="text-xs font-bold bg-raw-white px-1 border border-transparent group-hover:border-raw-ink group-hover:bg-raw-accent group-hover:text-raw-white transition-colors">ARCADE</span>
        </button>
      </div>

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-12 border-t-2 border-raw-ink bg-raw-white flex items-center justify-between z-50 px-2">
        <div className="flex items-center gap-2 h-full py-2">
          <button className="h-full px-4 border-2 border-raw-ink font-bold hover:bg-raw-ink hover:text-raw-white transition-colors flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
            <Terminal size={16} />
            <span className="hidden sm:inline">SYS.START</span>
          </button>
          {isBrowserOpen && (
            <button className="h-full px-4 border-2 border-raw-ink font-bold bg-raw-ink text-raw-white flex items-center gap-2">
              <Globe size={16} />
              <span className="hidden sm:inline">HYPER_PROXY</span>
            </button>
          )}
          {isGamesOpen && (
            <button className="h-full px-4 border-2 border-raw-ink font-bold bg-raw-ink text-raw-white flex items-center gap-2">
              <Gamepad2 size={16} />
              <span className="hidden sm:inline">ARCADE</span>
            </button>
          )}
          {isFileViewerOpen && (
            <button className="h-full px-4 border-2 border-raw-ink font-bold bg-raw-ink text-raw-white flex items-center gap-2">
              <FileText size={16} />
              <span className="hidden sm:inline">FILES</span>
            </button>
          )}
        </div>
        <div className="h-full flex items-center px-4 border-l-2 border-raw-ink font-bold text-sm">
          <Clock size={16} className="mr-2" />
          {time.toLocaleTimeString()}
        </div>
      </div>

      {/* Browser Window */}
      <AnimatePresence>
        {isBrowserOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className={`absolute bg-raw-bg flex flex-col z-40 overflow-hidden transition-all duration-200 ${
              isBrowserFullscreen 
                ? 'top-0 left-0 right-0 bottom-12 border-b-2 border-raw-ink shadow-none' 
                : 'top-4 sm:top-8 left-4 sm:left-12 right-4 sm:right-12 bottom-16 border-2 border-raw-ink shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]'
            }`}
          >
            {/* Tabs Bar */}
      <div className="flex border-b border-raw-ink h-10 bg-raw-bg justify-between">
        <div 
          className="flex-1 flex overflow-x-auto hide-scrollbar"
          onMouseLeave={() => setLockedTabCount(null)}
        >
          <AnimatePresence initial={false}>
            {tabs.map(tab => {
              const effectiveTabCount = lockedTabCount !== null ? Math.max(lockedTabCount, tabs.length) : tabs.length;
              return (
              <motion.div
                layout
                initial={{ opacity: 0, maxWidth: 0, minWidth: 0 }}
                animate={{ 
                  opacity: 1, 
                  maxWidth: `calc(min(240px, (100vw - 120px) / ${effectiveTabCount}))`,
                  minWidth: 48
                }}
                exit={{ opacity: 0, maxWidth: 0, minWidth: 0, borderRightWidth: 0, paddingLeft: 0, paddingRight: 0 }}
                transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                onAuxClick={(e) => {
                  if (e.button === 1) closeTab(e, tab.id);
                }}
                className={`group flex items-center flex-1 border-r border-raw-ink px-2 sm:px-3 cursor-pointer select-none overflow-hidden ${
                  activeTabId === tab.id 
                    ? 'bg-raw-white border-t-2 border-t-raw-accent' 
                    : 'bg-raw-bg border-t-2 border-t-transparent hover:bg-black/5'
                }`}
              >
                <div className="w-2 h-2 rounded-full border border-raw-ink mr-1 sm:mr-2 flex-shrink-0 transition-colors duration-300" 
                     style={{ backgroundColor: tab.loading ? 'var(--color-raw-accent)' : 'transparent' }} />
                <span className="truncate flex-1 text-xs font-medium tracking-tight">
                  {tab.title}
                </span>
                <button 
                  onClick={(e) => closeTab(e, tab.id)}
                  className="ml-1 sm:ml-2 opacity-40 hover:opacity-100 hover:text-raw-accent transition-opacity flex-shrink-0"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </motion.div>
            )})}
          </AnimatePresence>
          <motion.button 
            layout
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            onClick={addTab}
            className="flex-shrink-0 w-10 flex items-center justify-center border-r border-raw-ink hover:bg-raw-ink hover:text-raw-white transition-colors"
          >
            <Plus size={18} strokeWidth={2.5} />
          </motion.button>
        </div>

        {/* Global Window Controls */}
        <div className="flex border-l border-raw-ink flex-shrink-0">
          <button 
            onClick={() => setIsBrowserFullscreen(!isBrowserFullscreen)}
            className="w-10 flex items-center justify-center hover:bg-raw-ink hover:text-raw-white transition-colors text-raw-ink border-r border-raw-ink"
            title={isBrowserFullscreen ? "Restore" : "Maximize"}
          >
            {isBrowserFullscreen ? <Minimize size={16} strokeWidth={2.5} /> : <Maximize size={16} strokeWidth={2.5} />}
          </button>
          <button 
            onClick={() => setIsBrowserOpen(false)}
            className="w-10 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors text-raw-ink"
            title="Close Proxy"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center h-12 border-b border-raw-ink bg-raw-white">
        <div className="flex items-center px-2 space-x-1 border-r border-raw-ink h-full">
          <button className="p-1.5 hover:bg-raw-bg transition-colors opacity-50 cursor-not-allowed">
            <ArrowLeft size={16} strokeWidth={2.5} />
          </button>
          <button className="p-1.5 hover:bg-raw-bg transition-colors opacity-50 cursor-not-allowed">
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
          <button 
            className="p-1.5 hover:bg-raw-bg transition-colors"
            onClick={reloadTab}
          >
            <RotateCw size={16} strokeWidth={2.5} className={activeTab?.loading ? 'animate-spin' : ''} />
          </button>
        </div>
        
        <form onSubmit={onTopBarSubmit} className="flex-1 flex items-center h-full">
          <div className="px-3 text-raw-ink/50">
            <Shield size={14} strokeWidth={2.5} />
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 h-full bg-transparent outline-none text-sm placeholder-raw-ink/30"
            placeholder="ENTER URL OR SEARCH QUERY..."
            spellCheck={false}
          />
        </form>
      </div>

      {/* Viewport Area */}
      <div className="flex-1 relative bg-raw-white">
        {tabs.map(tab => (
          <div 
            key={tab.id}
            className={`absolute inset-0 ${activeTabId === tab.id ? 'z-10' : 'z-0 hidden'}`}
          >
            {tab.url !== 'about:blank' ? (
              <iframe
                id={`iframe-${tab.id}`}
                src={`/api/proxy?url=${encodeURIComponent(tab.url)}&tabId=${tab.id}`}
                className="w-full h-full border-none bg-white"
                onLoad={() => handleIframeLoad(tab.id)}
                sandbox="allow-same-origin allow-scripts allow-forms"
                title={`Viewport ${tab.id}`}
              />
            ) : (
              <HomePage onNavigate={(url) => handleNavigate(url, tab.id)} />
            )}
          </div>
        ))}
      </div>
      
      {/* Status Bar */}
      <div className="h-6 border-t border-raw-ink bg-raw-bg flex items-center px-3 text-[10px] uppercase tracking-wider">
        <div className="flex-1 truncate">
          {activeTab?.loading ? 'FETCHING DATA...' : 'IDLE'}
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-raw-accent font-bold">SECURE: YES</span>
          <span>PROXY: ACTIVE</span>
          <span>SYS: ONLINE</span>
        </div>
      </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Games Window */}
      <AnimatePresence>
        {isGamesOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className={`absolute bg-raw-bg flex flex-col z-50 overflow-hidden transition-all duration-200 ${
              isGamesFullscreen 
                ? 'top-0 left-0 right-0 bottom-12 border-b-2 border-raw-ink shadow-none' 
                : 'top-12 sm:top-16 left-8 sm:left-20 right-8 sm:right-20 bottom-24 border-2 border-raw-ink shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]'
            }`}
          >
            {/* Games Title Bar */}
            <div className="flex border-b border-raw-ink h-10 bg-raw-ink text-raw-white justify-between items-center px-3">
              <div className="flex items-center gap-2 font-bold tracking-widest">
                <Gamepad2 size={18} />
                <span>ARCADE_EMULATOR</span>
                {activeGame && <span className="opacity-70 truncate max-w-[200px] sm:max-w-none">:: {activeGame.name}</span>}
              </div>
              <div className="flex items-center gap-2">
                {activeGame && (
                  <button 
                    onClick={() => setActiveGame(null)}
                    className="px-2 py-1 text-xs font-bold bg-raw-white text-raw-ink hover:bg-raw-accent hover:text-raw-white transition-colors"
                  >
                    BACK TO MENU
                  </button>
                )}
                <button 
                  onClick={() => setIsGamesFullscreen(!isGamesFullscreen)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  {isGamesFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                </button>
                <button 
                  onClick={() => setIsGamesOpen(false)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-red-500 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Games Content */}
            <div className="flex-1 relative bg-raw-white overflow-y-auto">
              {activeGame ? (
                <iframe
                  src={activeGame.url}
                  className="w-full h-full border-none bg-black"
                  allow="fullscreen; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock allow-presentation allow-downloads"
                  title={activeGame.name}
                />
              ) : (
                <div className="p-4 sm:p-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b-2 border-raw-ink pb-4 gap-4">
                    <h2 className="text-2xl font-bold">AVAILABLE TITLES ({games.filter(game => game.name.toLowerCase().includes(searchQuery.toLowerCase())).length})</h2>
                    <div className="relative w-full sm:w-64">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-raw-ink/50" />
                      </div>
                      <input
                        type="text"
                        placeholder="SEARCH GAMES..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border-2 border-raw-ink bg-raw-white focus:border-raw-accent outline-none font-mono text-sm transition-colors"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {games.filter(game => game.name.toLowerCase().includes(searchQuery.toLowerCase())).map(game => (
                      <button
                        key={game.name}
                        onClick={() => setActiveGame(game)}
                        className="flex flex-col items-center p-0 border-2 border-raw-ink hover:border-raw-accent transition-all shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[2px] hover:translate-y-[2px] overflow-hidden group bg-raw-white"
                      >
                        <div className="w-full aspect-video bg-black border-b-2 border-raw-ink overflow-hidden relative">
                          <img 
                            src={game.image} 
                            alt={game.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              // Fallback to a placeholder if the image fails to load
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(game.name)}&background=random&size=400&font-size=0.3`;
                            }}
                          />
                        </div>
                        <div className="font-bold text-sm text-center p-3 w-full group-hover:bg-raw-accent group-hover:text-raw-white transition-colors truncate px-2">
                          {game.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Viewer Window */}
      <AnimatePresence>
        {isFileViewerOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className={`absolute bg-raw-bg flex flex-col z-40 overflow-hidden transition-all duration-200 ${
              isFileViewerFullscreen 
                ? 'top-0 left-0 right-0 bottom-12 border-b-2 border-raw-ink shadow-none' 
                : 'top-20 sm:top-24 left-12 sm:left-28 right-12 sm:right-28 bottom-32 border-2 border-raw-ink shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]'
            }`}
          >
            {/* File Viewer Title Bar */}
            <div className="flex border-b border-raw-ink h-10 bg-raw-ink text-raw-white justify-between items-center px-3">
              <div className="flex items-center gap-2 font-bold tracking-widest">
                <FileText size={18} />
                <span>TEXT_READER</span>
                {fileName && <span className="opacity-70 truncate max-w-[200px] sm:max-w-none">:: {fileName}</span>}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsFileViewerFullscreen(!isFileViewerFullscreen)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  {isFileViewerFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                </button>
                <button 
                  onClick={() => setIsFileViewerOpen(false)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-red-500 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* File Viewer Content */}
            <div className="flex-1 relative bg-raw-white overflow-hidden flex flex-col">
              <div className="p-2 border-b-2 border-raw-ink bg-raw-bg flex items-center gap-4">
                <label className="cursor-pointer px-4 py-1 border-2 border-raw-ink font-bold hover:bg-raw-accent hover:text-raw-white transition-colors shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] bg-raw-white text-raw-ink">
                  OPEN FILE
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setFileName(file.name);
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setFileContent(event.target?.result as string);
                      };
                      reader.readAsText(file);
                    }} 
                  />
                </label>
                <span className="text-sm font-mono opacity-60 truncate max-w-[300px]">
                  {fileName ? `Loaded: ${fileName}` : 'No file selected'}
                </span>
              </div>
              <textarea 
                className="flex-1 w-full p-4 font-mono text-sm resize-none outline-none bg-raw-white"
                value={fileContent}
                readOnly
                placeholder="Select a text file to read its contents..."
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
