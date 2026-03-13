import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, ArrowLeft, ArrowRight, RotateCw, Shield, Terminal, Search, Globe, Clock, Zap, FileText, Folder, Maximize, Minimize, Gamepad2, Film, Activity, StickyNote, Save, Trash2, MessageSquare, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { games } from './games';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

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
  const [fileDataUrl, setFileDataUrl] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isMoviesOpen, setIsMoviesOpen] = useState(false);
  const [isMoviesFullscreen, setIsMoviesFullscreen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isNotesFullscreen, setIsNotesFullscreen] = useState(false);
  const [notes, setNotes] = useState<string>(() => localStorage.getItem('hyper_notes') || '');
  const [isSysMonOpen, setIsSysMonOpen] = useState(false);
  const [isSysMonFullscreen, setIsSysMonFullscreen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isTerminalFullscreen, setIsTerminalFullscreen] = useState(false);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [terminalHistory, setTerminalHistory] = useState<{type: 'cmd' | 'out', text: string}[]>([
    { type: 'out', text: 'HYPER_TERMINAL v1.0.0' },
    { type: 'out', text: 'TYPE "HELP" FOR COMMANDS.' }
  ]);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isAIAssistantFullscreen, setIsAIAssistantFullscreen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'HELLO! I AM YOUR AI ASSISTANT. HOW CAN I HELP YOU FIND GAMES OR PROXIES TODAY?' }
  ]);
  const [sysStats, setSysStats] = useState({ cpu: 0, mem: 0, net: 0 });

  const handleTerminalCommand = (cmd: string) => {
    const cleanCmd = cmd.trim().toLowerCase();
    const newHistory = [...terminalHistory, { type: 'cmd' as const, text: cmd }];

    switch (cleanCmd) {
      case 'help':
        newHistory.push({ type: 'out', text: 'AVAILABLE COMMANDS: HELP, LS, CLEAR, WHOAMI, DATE, ECHO [MSG], EXIT' });
        break;
      case 'ls':
        newHistory.push({ type: 'out', text: 'hyper_proxy.bin  cinema_stream.exe  arcade_emu.so  notes.txt  sys_mon.service' });
        break;
      case 'clear':
        setTerminalHistory([]);
        return;
      case 'whoami':
        newHistory.push({ type: 'out', text: 'root@hyper_os' });
        break;
      case 'date':
        newHistory.push({ type: 'out', text: new Date().toString() });
        break;
      case 'exit':
        setIsTerminalOpen(false);
        break;
      default:
        if (cleanCmd.startsWith('echo ')) {
          newHistory.push({ type: 'out', text: cmd.substring(5) });
        } else if (cleanCmd !== '') {
          newHistory.push({ type: 'out', text: `COMMAND NOT FOUND: ${cleanCmd}` });
        }
    }
    setTerminalHistory(newHistory);
  };

  const [moviesUrl, setMoviesUrl] = useState('https://www.cineby.gd/');
  const [movieSource, setMovieSource] = useState('cineby');
  const [gameSearchQuery, setGameSearchQuery] = useState('');
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

  useEffect(() => {
    localStorage.setItem('hyper_notes', notes);
  }, [notes]);

  useEffect(() => {
    if (isSysMonOpen) {
      const interval = setInterval(() => {
        setSysStats({
          cpu: Math.floor(Math.random() * 30) + 5,
          mem: Math.floor(Math.random() * 20) + 40,
          net: Math.floor(Math.random() * 100) + 10,
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isSysMonOpen]);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  useEffect(() => {
    if (activeTab) {
      setInputValue(activeTab.displayUrl);
    }
  }, [activeTabId, activeTab?.displayUrl]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'navigate' && event.data.url) {
        const { url, tabId } = event.data;
        
        if (tabId === 'movies') {
          setMoviesUrl(url);
        } else if (tabId === 'games') {
          setActiveGame(prev => prev ? { ...prev, url } : null);
        } else if (tabId) {
          setTabs(currentTabs => currentTabs.map(t => {
            if (t.id === tabId) {
              return { ...t, url: url, displayUrl: url, title: url, loading: true };
            }
            return t;
          }));
        }
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

  const movieSources = [
    { id: 'cineby', name: 'Cineby', url: 'https://www.cineby.gd/' },
    { id: 'xprime', name: 'XPrime', url: 'https://xprime.today/' },
    { id: 'aether', name: 'Aether', url: 'https://aether.mom/' },
  ];

  const handleSourceChange = (sourceId: string) => {
    const source = movieSources.find(s => s.id === sourceId);
    if (source) {
      setMovieSource(sourceId);
      setMoviesUrl(source.url);
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
          onDoubleClick={() => setIsMoviesOpen(true)}
          onClick={() => setIsMoviesOpen(true)}
          className="group flex flex-col items-center w-24 gap-2"
        >
          <div className="w-12 h-12 bg-raw-white border-2 border-raw-ink shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] group-hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all flex items-center justify-center text-red-600">
            <Film size={24} strokeWidth={2} />
          </div>
          <span className="text-xs font-bold bg-raw-white px-1 border border-transparent group-hover:border-raw-ink group-hover:bg-raw-accent group-hover:text-raw-white transition-colors">MOVIES</span>
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

        <button 
          onDoubleClick={() => setIsNotesOpen(true)}
          onClick={() => setIsNotesOpen(true)}
          className="group flex flex-col items-center w-24 gap-2"
        >
          <div className="w-12 h-12 bg-raw-white border-2 border-raw-ink shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] group-hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all flex items-center justify-center text-amber-600">
            <StickyNote size={24} strokeWidth={2} />
          </div>
          <span className="text-xs font-bold bg-raw-white px-1 border border-transparent group-hover:border-raw-ink group-hover:bg-raw-accent group-hover:text-raw-white transition-colors">NOTES</span>
        </button>

        <button 
          onDoubleClick={() => setIsSysMonOpen(true)}
          onClick={() => setIsSysMonOpen(true)}
          className="group flex flex-col items-center w-24 gap-2"
        >
          <div className="w-12 h-12 bg-raw-white border-2 border-raw-ink shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] group-hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all flex items-center justify-center text-emerald-600">
            <Activity size={24} strokeWidth={2} />
          </div>
          <span className="text-xs font-bold bg-raw-white px-1 border border-transparent group-hover:border-raw-ink group-hover:bg-raw-accent group-hover:text-raw-white transition-colors">SYS_MON</span>
        </button>

        <button 
          onDoubleClick={() => setIsTerminalOpen(true)}
          onClick={() => setIsTerminalOpen(true)}
          className="group flex flex-col items-center w-24 gap-2"
        >
          <div className="w-12 h-12 bg-raw-white border-2 border-raw-ink shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] group-hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all flex items-center justify-center text-raw-ink">
            <Terminal size={24} strokeWidth={2} />
          </div>
          <span className="text-xs font-bold bg-raw-white px-1 border border-transparent group-hover:border-raw-ink group-hover:bg-raw-accent group-hover:text-raw-white transition-colors">TERMINAL</span>
        </button>

        <button 
          onDoubleClick={() => setIsAIAssistantOpen(true)}
          onClick={() => setIsAIAssistantOpen(true)}
          className="group flex flex-col items-center w-24 gap-2"
        >
          <div className="w-12 h-12 bg-raw-white border-2 border-raw-ink shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] group-hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all flex items-center justify-center text-blue-600">
            <MessageSquare size={24} strokeWidth={2} />
          </div>
          <span className="text-xs font-bold bg-raw-white px-1 border border-transparent group-hover:border-raw-ink group-hover:bg-raw-accent group-hover:text-raw-white transition-colors">AI_ASSIST</span>
        </button>
      </div>

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-12 border-t-2 border-raw-ink bg-raw-white flex items-center justify-between z-50 px-2">
        <div className="flex items-center gap-2 h-full py-2">
          <button 
            onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
            className={`h-full px-4 border-2 border-raw-ink font-bold transition-colors flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] ${isStartMenuOpen ? 'bg-raw-ink text-raw-white' : 'bg-raw-white text-raw-ink hover:bg-raw-ink hover:text-raw-white'}`}
          >
            <Terminal size={16} />
            <span className="hidden sm:inline">SYS.START</span>
          </button>
          {isBrowserOpen && (
            <button 
              onClick={() => setIsBrowserOpen(!isBrowserOpen)}
              className={`h-full px-4 border-2 border-raw-ink font-bold flex items-center gap-2 transition-colors ${isBrowserOpen ? 'bg-raw-ink text-raw-white' : 'bg-raw-white text-raw-ink hover:bg-raw-accent hover:text-raw-white'}`}
            >
              <Globe size={16} />
              <span className="hidden sm:inline">HYPER_PROXY</span>
            </button>
          )}
          {isGamesOpen && (
            <button 
              onClick={() => setIsGamesOpen(!isGamesOpen)}
              className={`h-full px-4 border-2 border-raw-ink font-bold flex items-center gap-2 transition-colors ${isGamesOpen ? 'bg-raw-ink text-raw-white' : 'bg-raw-white text-raw-ink hover:bg-raw-accent hover:text-raw-white'}`}
            >
              <Gamepad2 size={16} />
              <span className="hidden sm:inline">ARCADE</span>
            </button>
          )}
          {isFileViewerOpen && (
            <button 
              onClick={() => setIsFileViewerOpen(!isFileViewerOpen)}
              className={`h-full px-4 border-2 border-raw-ink font-bold flex items-center gap-2 transition-colors ${isFileViewerOpen ? 'bg-raw-ink text-raw-white' : 'bg-raw-white text-raw-ink hover:bg-raw-accent hover:text-raw-white'}`}
            >
              <FileText size={16} />
              <span className="hidden sm:inline">FILES</span>
            </button>
          )}
          {isMoviesOpen && (
            <button 
              onClick={() => setIsMoviesOpen(!isMoviesOpen)}
              className="h-full px-4 border-2 border-raw-ink font-bold bg-raw-ink text-raw-white flex items-center gap-2 hover:bg-raw-accent transition-colors"
            >
              <Film size={16} />
              <span className="hidden sm:inline">MOVIES</span>
            </button>
          )}
          {isNotesOpen && (
            <button 
              onClick={() => setIsNotesOpen(!isNotesOpen)}
              className={`h-full px-4 border-2 border-raw-ink font-bold flex items-center gap-2 transition-colors ${isNotesOpen ? 'bg-raw-ink text-raw-white' : 'bg-raw-white text-raw-ink hover:bg-raw-accent hover:text-raw-white'}`}
            >
              <StickyNote size={16} />
              <span className="hidden sm:inline">NOTES</span>
            </button>
          )}
          {isSysMonOpen && (
            <button 
              onClick={() => setIsSysMonOpen(!isSysMonOpen)}
              className={`h-full px-4 border-2 border-raw-ink font-bold flex items-center gap-2 transition-colors ${isSysMonOpen ? 'bg-raw-ink text-raw-white' : 'bg-raw-white text-raw-ink hover:bg-raw-accent hover:text-raw-white'}`}
            >
              <Activity size={16} />
              <span className="hidden sm:inline">SYS_MON</span>
            </button>
          )}
          {isTerminalOpen && (
            <button 
              onClick={() => setIsTerminalOpen(!isTerminalOpen)}
              className={`h-full px-4 border-2 border-raw-ink font-bold flex items-center gap-2 transition-colors ${isTerminalOpen ? 'bg-raw-ink text-raw-white' : 'bg-raw-white text-raw-ink hover:bg-raw-accent hover:text-raw-white'}`}
            >
              <Terminal size={16} />
              <span className="hidden sm:inline">TERMINAL</span>
            </button>
          )}
          {isAIAssistantOpen && (
            <button 
              onClick={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
              className={`h-full px-4 border-2 border-raw-ink font-bold flex items-center gap-2 transition-colors ${isAIAssistantOpen ? 'bg-raw-ink text-raw-white' : 'bg-raw-white text-raw-ink hover:bg-raw-accent hover:text-raw-white'}`}
            >
              <MessageSquare size={16} />
              <span className="hidden sm:inline">AI_ASSIST</span>
            </button>
          )}
        </div>
        <div className="h-full flex items-center px-4 border-l-2 border-raw-ink font-bold text-sm">
          <Clock size={16} className="mr-2" />
          {time.toLocaleTimeString()}
        </div>
      </div>

      {/* Start Menu */}
      <AnimatePresence>
        {isStartMenuOpen && (
          <>
            <div 
              className="fixed inset-0 z-[55]" 
              onClick={() => setIsStartMenuOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-14 left-2 w-64 bg-raw-bg border-2 border-raw-ink shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] z-[60] flex flex-col"
            >
              <div className="bg-raw-ink text-raw-white p-3 font-bold text-xs tracking-widest flex items-center justify-between">
                <span>HYPER_OS MENU</span>
                <Zap size={12} className="text-raw-accent" />
              </div>
              <div className="p-2 flex flex-col gap-1">
                <button 
                  onClick={() => { setIsBrowserOpen(true); setIsStartMenuOpen(false); }}
                  className="flex items-center gap-3 p-2 hover:bg-raw-accent hover:text-raw-white transition-colors text-left"
                >
                  <Globe size={16} />
                  <span className="text-sm font-bold">HYPER_PROXY</span>
                </button>
                <button 
                  onClick={() => { setIsFileViewerOpen(true); setIsStartMenuOpen(false); }}
                  className="flex items-center gap-3 p-2 hover:bg-raw-accent hover:text-raw-white transition-colors text-left"
                >
                  <FileText size={16} />
                  <span className="text-sm font-bold">FILES</span>
                </button>
                <button 
                  onClick={() => { setIsMoviesOpen(true); setIsStartMenuOpen(false); }}
                  className="flex items-center gap-3 p-2 hover:bg-raw-accent hover:text-raw-white transition-colors text-left"
                >
                  <Film size={16} />
                  <span className="text-sm font-bold">MOVIES</span>
                </button>
                <button 
                  onClick={() => { setIsGamesOpen(true); setIsStartMenuOpen(false); }}
                  className="flex items-center gap-3 p-2 hover:bg-raw-accent hover:text-raw-white transition-colors text-left"
                >
                  <Gamepad2 size={16} />
                  <span className="text-sm font-bold">ARCADE</span>
                </button>
                <div className="h-px bg-raw-ink opacity-10 my-1" />
                <button 
                  onClick={() => { setIsNotesOpen(true); setIsStartMenuOpen(false); }}
                  className="flex items-center gap-3 p-2 hover:bg-raw-accent hover:text-raw-white transition-colors text-left"
                >
                  <StickyNote size={16} />
                  <span className="text-sm font-bold">NOTES</span>
                </button>
                <button 
                  onClick={() => { setIsSysMonOpen(true); setIsStartMenuOpen(false); }}
                  className="flex items-center gap-3 p-2 hover:bg-raw-accent hover:text-raw-white transition-colors text-left"
                >
                  <Activity size={16} />
                  <span className="text-sm font-bold">SYS_MON</span>
                </button>
                <button 
                  onClick={() => { setIsTerminalOpen(true); setIsStartMenuOpen(false); }}
                  className="flex items-center gap-3 p-2 hover:bg-raw-accent hover:text-raw-white transition-colors text-left"
                >
                  <Terminal size={16} />
                  <span className="text-sm font-bold">TERMINAL</span>
                </button>
                <button 
                  onClick={() => { setIsAIAssistantOpen(true); setIsStartMenuOpen(false); }}
                  className="flex items-center gap-3 p-2 hover:bg-raw-accent hover:text-raw-white transition-colors text-left"
                >
                  <MessageSquare size={16} />
                  <span className="text-sm font-bold">AI_ASSIST</span>
                </button>
              </div>
              <div className="bg-raw-bg border-t border-raw-ink p-2 text-[10px] opacity-50 flex justify-between">
                <span>USER: ROOT</span>
                <span>v2.5.0</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Browser Window */}
      <AnimatePresence>
        {isBrowserOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className={`absolute bg-raw-bg flex flex-col z-40 overflow-hidden transition-all duration-200 max-h-full max-w-full ${
              isBrowserFullscreen 
                ? 'inset-0 bottom-12 border-b-2 border-raw-ink shadow-none' 
                : 'inset-4 sm:inset-12 bottom-16 border-2 border-raw-ink shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]'
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
                src={tab.url !== 'about:blank' ? `/proxy/${tab.url}` : 'about:blank'}
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
            className={`absolute bg-raw-bg flex flex-col z-50 overflow-hidden transition-all duration-200 max-h-full max-w-full ${
              isGamesFullscreen 
                ? 'inset-0 bottom-12 border-b-2 border-raw-ink shadow-none' 
                : 'inset-4 sm:inset-12 bottom-16 border-2 border-raw-ink shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]'
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
                  src={`/api/proxy?url=${encodeURIComponent(activeGame.url)}&tabId=games`}
                  className="w-full h-full border-none bg-black"
                  allow="fullscreen; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock allow-presentation allow-downloads"
                  title={activeGame.name}
                />
              ) : (
                <div className="p-4 sm:p-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b-2 border-raw-ink pb-4 gap-4">
                    <h2 className="text-2xl font-bold">AVAILABLE TITLES ({games.filter(game => game.name.toLowerCase().includes(gameSearchQuery.toLowerCase())).length})</h2>
                    <div className="relative w-full sm:w-64">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-raw-ink/50" />
                      </div>
                      <input
                        type="text"
                        placeholder="SEARCH GAMES..."
                        value={gameSearchQuery}
                        onChange={(e) => setGameSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border-2 border-raw-ink bg-raw-white focus:border-raw-accent outline-none font-mono text-sm transition-colors"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {games.filter(game => game.name.toLowerCase().includes(gameSearchQuery.toLowerCase())).map(game => (
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

      {/* Movies Window */}
      <AnimatePresence>
        {isMoviesOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className={`absolute bg-raw-bg flex flex-col z-40 overflow-hidden transition-all duration-200 max-h-full max-w-full ${
              isMoviesFullscreen 
                ? 'inset-0 bottom-12 border-b-2 border-raw-ink shadow-none' 
                : 'inset-4 sm:inset-12 bottom-16 border-2 border-raw-ink shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]'
            }`}
          >
            {/* Movies Title Bar */}
            <div className="flex border-b border-raw-ink h-10 bg-raw-ink text-raw-white justify-between items-center px-3">
              <div className="flex items-center gap-2 font-bold tracking-widest">
                <Film size={18} />
                <span>CINEMA_STREAM</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMoviesFullscreen(!isMoviesFullscreen)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  {isMoviesFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                </button>
                <button 
                  onClick={() => setIsMoviesOpen(false)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-red-500 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Movies Content */}
            <div className="flex-1 relative bg-black overflow-hidden flex flex-col">
              {/* Source Selector */}
              <div className="bg-zinc-900/90 border-b border-white/10 p-2 flex items-center gap-2 overflow-x-auto">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2">Source:</span>
                {movieSources.map(source => (
                  <button
                    key={source.id}
                    onClick={() => handleSourceChange(source.id)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                      movieSource === source.id 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {source.name}
                  </button>
                ))}
              </div>
              
              <iframe
                src={`/api/proxy?url=${encodeURIComponent(moviesUrl)}&tabId=movies`}
                className="flex-1 w-full border-none"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock allow-presentation"
                title="Movies App"
              />
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
            className={`absolute bg-raw-bg flex flex-col z-40 overflow-hidden transition-all duration-200 max-h-full max-w-full ${
              isFileViewerFullscreen 
                ? 'inset-0 bottom-12 border-b-2 border-raw-ink shadow-none' 
                : 'inset-4 sm:inset-12 bottom-16 border-2 border-raw-ink shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]'
            }`}
          >
            {/* File Viewer Title Bar */}
            <div className="flex border-b border-raw-ink h-10 bg-raw-ink text-raw-white justify-between items-center px-3">
              <div className="flex items-center gap-2 font-bold tracking-widest">
                <FileText size={18} />
                <span>FILE_VIEWER</span>
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
                      setFileType(file.type);
                      
                      const reader = new FileReader();
                      
                      if (file.type.startsWith('text/') || 
                          file.type === 'application/json' || 
                          file.type === 'application/javascript' ||
                          file.name.endsWith('.md') ||
                          file.name.endsWith('.txt') ||
                          file.name.endsWith('.css') ||
                          file.name.endsWith('.html')) {
                        reader.onload = (event) => {
                          setFileContent(event.target?.result as string);
                          setFileDataUrl('');
                        };
                        reader.readAsText(file);
                      } else {
                        reader.onload = (event) => {
                          setFileDataUrl(event.target?.result as string);
                          setFileContent('');
                        };
                        reader.readAsDataURL(file);
                      }
                    }} 
                  />
                </label>
                <span className="text-sm font-mono opacity-60 truncate max-w-[300px]">
                  {fileName ? `Loaded: ${fileName} (${fileType || 'unknown type'})` : 'No file selected'}
                </span>
              </div>
              
              <div className="flex-1 overflow-auto bg-raw-white flex flex-col items-center justify-center p-4">
                {!fileName ? (
                  <div className="text-raw-ink/30 font-mono text-center">
                    <FileText size={48} className="mx-auto mb-4 opacity-20" />
                    <p>Select a file to preview its contents...</p>
                    <p className="text-xs mt-2">Supports Text, Images, Audio, and Video</p>
                  </div>
                ) : fileType.startsWith('image/') ? (
                  <img src={fileDataUrl} alt={fileName} className="max-w-full max-h-full object-contain shadow-lg border border-raw-ink" />
                ) : fileType.startsWith('audio/') ? (
                  <div className="w-full max-w-md p-8 border-2 border-raw-ink bg-raw-bg shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-raw-ink text-raw-white rounded-full flex items-center justify-center animate-pulse">
                      <Zap size={32} />
                    </div>
                    <div className="text-center">
                      <div className="font-bold truncate max-w-[300px]">{fileName}</div>
                      <div className="text-xs opacity-50 uppercase tracking-widest mt-1">Audio Stream</div>
                    </div>
                    <audio controls src={fileDataUrl} className="w-full mt-4" />
                  </div>
                ) : fileType.startsWith('video/') ? (
                  <video controls src={fileDataUrl} className="max-w-full max-h-full border-2 border-raw-ink shadow-lg" />
                ) : fileType === 'application/pdf' ? (
                  <embed src={fileDataUrl} type="application/pdf" className="w-full h-full" />
                ) : fileContent ? (
                  <textarea 
                    className="flex-1 w-full h-full p-4 font-mono text-sm resize-none outline-none bg-raw-white border-none"
                    value={fileContent}
                    readOnly
                  />
                ) : (
                  <div className="text-center p-8 border-2 border-dashed border-raw-ink/20 rounded-lg">
                    <FileText size={48} className="mx-auto mb-4 opacity-10" />
                    <p className="font-bold">PREVIEW NOT AVAILABLE</p>
                    <p className="text-sm opacity-50 mt-2">This file type ({fileType}) cannot be previewed natively.</p>
                    <p className="text-xs mt-4 font-mono bg-raw-bg p-2 border border-raw-ink">SIZE: {fileName ? 'Binary Data' : 'N/A'}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes Window */}
      <AnimatePresence>
        {isNotesOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className={`absolute bg-raw-bg flex flex-col z-40 overflow-hidden transition-all duration-200 max-h-full max-w-full ${
              isNotesFullscreen 
                ? 'inset-0 bottom-12 border-b-2 border-raw-ink shadow-none' 
                : 'inset-4 sm:inset-12 bottom-16 border-2 border-raw-ink shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]'
            }`}
          >
            <div className="flex border-b border-raw-ink h-10 bg-amber-500 text-raw-ink justify-between items-center px-3">
              <div className="flex items-center gap-2 font-bold tracking-widest">
                <StickyNote size={18} />
                <span>HYPER_NOTES</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsNotesFullscreen(!isNotesFullscreen)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-black/10 transition-colors"
                >
                  {isNotesFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                </button>
                <button 
                  onClick={() => setIsNotesOpen(false)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 flex flex-col bg-raw-white">
              <div className="p-2 border-b border-raw-ink bg-raw-bg flex items-center gap-2">
                <button 
                  onClick={() => setNotes('')}
                  className="px-3 py-1 border border-raw-ink text-[10px] font-bold hover:bg-red-500 hover:text-white transition-colors flex items-center gap-1"
                >
                  <Trash2 size={12} /> CLEAR
                </button>
                <div className="flex-1"></div>
                <span className="text-[10px] font-bold opacity-50 uppercase">Autosave: Enabled</span>
              </div>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="flex-1 p-6 font-mono text-sm sm:text-base resize-none outline-none bg-raw-white leading-relaxed"
                placeholder="START TYPING YOUR THOUGHTS..."
                spellCheck={false}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* System Monitor Window */}
      <AnimatePresence>
        {isSysMonOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className={`absolute bg-raw-bg flex flex-col z-40 overflow-hidden transition-all duration-200 max-h-full max-w-full ${
              isSysMonFullscreen 
                ? 'inset-0 bottom-12 border-b-2 border-raw-ink shadow-none' 
                : 'inset-4 sm:inset-12 bottom-16 border-2 border-raw-ink shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]'
            }`}
          >
            <div className="flex border-b border-raw-ink h-10 bg-emerald-600 text-raw-white justify-between items-center px-3">
              <div className="flex items-center gap-2 font-bold tracking-widest">
                <Activity size={18} />
                <span>SYS_MONITOR_v1.0</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsSysMonFullscreen(!isSysMonFullscreen)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  {isSysMonFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                </button>
                <button 
                  onClick={() => setIsSysMonOpen(false)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-red-500 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 p-6 bg-raw-ink text-emerald-500 font-mono overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="border border-emerald-500/30 p-4 bg-emerald-500/5">
                  <div className="text-[10px] uppercase tracking-widest mb-2 opacity-50">CPU_LOAD</div>
                  <div className="text-3xl font-bold">{sysStats.cpu}%</div>
                  <div className="w-full h-1 bg-emerald-500/20 mt-2">
                    <motion.div 
                      className="h-full bg-emerald-500" 
                      animate={{ width: `${sysStats.cpu}%` }}
                    />
                  </div>
                </div>
                <div className="border border-emerald-500/30 p-4 bg-emerald-500/5">
                  <div className="text-[10px] uppercase tracking-widest mb-2 opacity-50">MEM_USAGE</div>
                  <div className="text-3xl font-bold">{sysStats.mem}%</div>
                  <div className="w-full h-1 bg-emerald-500/20 mt-2">
                    <motion.div 
                      className="h-full bg-emerald-500" 
                      animate={{ width: `${sysStats.mem}%` }}
                    />
                  </div>
                </div>
                <div className="border border-emerald-500/30 p-4 bg-emerald-500/5">
                  <div className="text-[10px] uppercase tracking-widest mb-2 opacity-50">NET_TRAFFIC</div>
                  <div className="text-3xl font-bold">{sysStats.net} MB/s</div>
                  <div className="w-full h-1 bg-emerald-500/20 mt-2">
                    <motion.div 
                      className="h-full bg-emerald-500" 
                      animate={{ width: `${(sysStats.net / 110) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-emerald-500/10 pb-1">
                  <span className="opacity-50">OS_VERSION</span>
                  <span>HYPER_OS v2.5.0-STABLE</span>
                </div>
                <div className="flex justify-between border-b border-emerald-500/10 pb-1">
                  <span className="opacity-50">KERNEL</span>
                  <span>6.1.0-21-ANTIGRAVITY</span>
                </div>
                <div className="flex justify-between border-b border-emerald-500/10 pb-1">
                  <span className="opacity-50">UPTIME</span>
                  <span>12:44:02</span>
                </div>
                <div className="flex justify-between border-b border-emerald-500/10 pb-1">
                  <span className="opacity-50">PROXY_STATUS</span>
                  <span className="text-emerald-400">ENCRYPTED_TUNNEL_ACTIVE</span>
                </div>
              </div>

              <div className="mt-8">
                <div className="text-[10px] uppercase tracking-widest mb-3 opacity-50">// ACTIVE_PROCESSES</div>
                <div className="space-y-1 text-[10px]">
                  <div className="flex justify-between opacity-80">
                    <span>hyper_proxy.bin</span>
                    <span>12.4% CPU</span>
                  </div>
                  <div className="flex justify-between opacity-80">
                    <span>cinema_stream.exe</span>
                    <span>4.2% CPU</span>
                  </div>
                  <div className="flex justify-between opacity-80">
                    <span>arcade_emu.so</span>
                    <span>8.1% CPU</span>
                  </div>
                  <div className="flex justify-between opacity-80">
                    <span>sys_mon.service</span>
                    <span>0.5% CPU</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terminal Window */}
      <AnimatePresence>
        {isTerminalOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className={`absolute bg-raw-bg flex flex-col z-50 overflow-hidden transition-all duration-200 max-h-full max-w-full ${
              isTerminalFullscreen 
                ? 'inset-0 bottom-12 border-b-2 border-raw-ink shadow-none' 
                : 'inset-4 sm:inset-12 bottom-16 border-2 border-raw-ink shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]'
            }`}
          >
            <div className="flex border-b border-raw-ink h-10 bg-raw-ink text-raw-white justify-between items-center px-3">
              <div className="flex items-center gap-2 font-bold tracking-widest">
                <Terminal size={18} />
                <span>HYPER_TERMINAL</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsTerminalFullscreen(!isTerminalFullscreen)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  {isTerminalFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                </button>
                <button 
                  onClick={() => setIsTerminalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-red-500 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 bg-black text-raw-white font-mono overflow-y-auto flex flex-col gap-1 text-xs sm:text-sm">
              {terminalHistory.map((line, i) => (
                <div key={i} className={line.type === 'cmd' ? 'text-raw-accent' : 'text-emerald-400'}>
                  {line.type === 'cmd' ? `> ${line.text}` : line.text}
                </div>
              ))}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-raw-accent font-bold">{'>'}</span>
                <input 
                  autoFocus
                  className="bg-transparent outline-none flex-1 text-raw-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleTerminalCommand((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Assistant Window */}
      <AnimatePresence>
        {isAIAssistantOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className={`absolute bg-raw-bg flex flex-col z-50 overflow-hidden transition-all duration-200 max-h-full max-w-full ${
              isAIAssistantFullscreen 
                ? 'inset-0 bottom-12 border-b-2 border-raw-ink shadow-none' 
                : 'inset-4 sm:inset-12 bottom-16 border-2 border-raw-ink shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]'
            }`}
          >
            <div className="flex border-b border-raw-ink h-10 bg-raw-ink text-raw-white justify-between items-center px-3">
              <div className="flex items-center gap-2 font-bold tracking-widest">
                <MessageSquare size={18} />
                <span>AI_ASSISTANT</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsAIAssistantFullscreen(!isAIAssistantFullscreen)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  {isAIAssistantFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                </button>
                <button 
                  onClick={() => setIsAIAssistantOpen(false)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-red-500 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-xl ${msg.role === 'user' ? 'bg-raw-ink text-raw-white' : 'bg-raw-white border-2 border-raw-ink'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-raw-ink flex gap-2">
              <input 
                className="flex-1 p-2 border-2 border-raw-ink bg-raw-white outline-none"
                placeholder="Ask me anything about games or proxies..."
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    const text = (e.target as HTMLInputElement).value;
                    if (!text) return;
                    (e.target as HTMLInputElement).value = '';
                    setChatMessages(prev => [...prev, { role: 'user', text }]);
                    
                    try {
                      const chat = ai.chats.create({ 
                        model: "gemini-3-flash-preview",
                        config: {
                          systemInstruction: "You are an AI assistant for a site that provides unblocked games and proxies. Help users find games, bypass restrictions, and answer questions related to gaming and web browsing. Do not provide study help."
                        }
                      });
                      const response = await chat.sendMessage({ message: text });
                      setChatMessages(prev => [...prev, { role: 'ai', text: response.text || '...' }]);
                    } catch (err) {
                      setChatMessages(prev => [...prev, { role: 'ai', text: 'ERROR: COULD NOT CONNECT TO AI.' }]);
                    }
                  }
                }}
              />
              <button className="p-2 bg-raw-ink text-raw-white border-2 border-raw-ink">
                <Send size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
