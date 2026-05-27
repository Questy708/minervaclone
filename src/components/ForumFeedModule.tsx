import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { 
  MessageSquare, 
  Share2, 
  Search, 
  MoreHorizontal, 
  Plus, 
  Menu,
  Home,
  TrendingUp,
  Newspaper,
  Compass,
  ArrowUp, 
  ArrowDown,
  Award,
  Bell,
  User,
  PlusCircle,
  FileText,
  X,
  Bold,
  Italic,
  Strikethrough,
  Link as LinkIcon,
  Image as ImageIcon,
  Video,
  List,
  ListOrdered,
  Quote,
  ArrowLeft,
  Heart,
  Code
} from 'lucide-react';
import { UserRole } from '../App';

interface ForumComment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  replies?: ForumComment[];
}

interface ForumPost {
  id: string;
  authorName: string;
  community: string;
  title: string;
  content: string;
  upvotes: number;
  userVote: 'up' | 'down' | null;
  hearts: number;
  userHearted: boolean;
  timestamp: string;
  imageUrl?: string;
  comments: ForumComment[];
}

const COMMUNITIES = [
  { name: 'r/leagueoflegends', color: 'bg-emerald-500' },
  { name: 'r/cyberpunkgame', color: 'bg-rose-500' },
  { name: 'r/mauritius', color: 'bg-sky-500' },
  { name: 'r/CellularReprogramming', color: 'bg-amber-500' },
  { name: 'r/AiBiology', color: 'bg-teal-500' }
];

const PRESET_POSTS: ForumPost[] = [
  {
    id: 'post-4',
    authorName: 'Jojopyun',
    community: 'r/leagueoflegends',
    title: '[MKOI vs VIT] Jojopyun types to Naak Nako after killing him',
    content: '',
    upvotes: 844,
    userVote: null,
    hearts: 12,
    userHearted: false,
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    timestamp: '2 days ago',
    comments: []
  },
  {
    id: 'post-3',
    authorName: 'Mauritius_Local',
    community: 'r/mauritius',
    title: 'I wanna sell my second hand clothes, kindly help please.',
    content: "Hello I am moving abroad in 1 month. I am planning to sell my second-hand clothes which are in good condition to shops who will buy them and resell them. Since I'm moving I do need the money that's why I wanna sell it to a shop that will buy it from me. Help me out, thank youu Edit: places I've lived before they buy clothes and resell it for a profit... idk how mauritius does it... thus asking 😅 if not, then maybe I can have suggestions of places I can donate my clothes at No hate please",
    upvotes: 5,
    userVote: null,
    hearts: 0,
    userHearted: false,
    timestamp: '22 hr. ago',
    comments: [
      { id: 'c1', author: 'LocalShop', content: 'There are a few thrift stores downtown that might take them!', timestamp: '10 hr. ago', likes: 2 }
    ]
  },
  {
    id: 'post-5',
    authorName: 'Silverhand',
    community: 'r/cyberpunkgame',
    title: 'taking the punk back to cyberpunk',
    content: '',
    upvotes: 218,
    userVote: null,
    hearts: 54,
    userHearted: false,
    imageUrl: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    timestamp: '2 hr. ago',
    comments: []
  },
  {
    id: 'post-1',
    authorName: 'Dr. Evelyn Sterling',
    community: 'r/CellularReprogramming',
    title: 'New Spatial Transcriptomics Pipeline Released: Deconstructing Neural Plasticity Matrix',
    content: 'We have compiled and open-sourced our automated spatial imaging pipelines at Palo Alto! By utilizing high-capacity optical systems and convolutional matching grids, we mapped the transcription limits of hippocampus slice cells within 40 nanometers of resolution.',
    upvotes: 142,
    userVote: null,
    hearts: 14,
    userHearted: false,
    timestamp: '5 hours ago',
    comments: [
      { id: 'c2', author: 'Marika Alvarez', content: 'This resolves the resolution gaps we had in SS110! I already cloned the Python notebook.', timestamp: '1 hour ago', likes: 12 },
    ]
  },
  ...Array.from({ length: 20 }).map((_, i) => ({
    id: `post-gen-${i}`,
    authorName: `User_${Math.floor(Math.random() * 1000)}`,
    community: COMMUNITIES[i % COMMUNITIES.length].name,
    title: `Community Discussion Thread ${i+1}: What are your thoughts on recent developments?`,
    content: `This is a generated post content for testing purposes. It contains some text but no images. We are discussing various things related to this community. I am highly interested to hear what everyone else has to say about it. Let us know in the comments below!`,
    upvotes: Math.floor(Math.random() * 500) + 10,
    userVote: null as 'up' | 'down' | null,
    hearts: Math.floor(Math.random() * 50),
    userHearted: false,
    timestamp: `${(i % 12) + 1} hr. ago`,
    comments: []
  }))
];

interface ForumFeedModuleProps {
  role: UserRole;
  userInfo: { name: string; email: string; avatarColor: string };
}

const CommentNode = ({
  comment,
  postId,
  replyingToCommentId,
  setReplyingToCommentId,
  replyContent,
  setReplyContent,
  handleAddReply
}: {
  comment: ForumComment;
  postId: string;
  replyingToCommentId: string | null;
  setReplyingToCommentId: (id: string | null) => void;
  replyContent: string;
  setReplyContent: (content: string) => void;
  handleAddReply: (postId: string, commentId: string) => void;
}) => {
  return (
    <div className="group mt-1 pt-2">
      <div className="flex">
        <div className="flex flex-col items-center mr-2 relative group/line cursor-pointer shrink-0">
          <div className="w-[28px] h-[28px] rounded-full bg-[#ff4500] overflow-hidden flex items-center justify-center font-bold text-slate-100 text-[10px] z-10">
            {comment.author[0]}
          </div>
          <div className="w-[2px] bg-slate-200 group-hover/line:bg-slate-400 transition-colors absolute top-8 bottom-[-8px] sm:bottom-[-16px]"></div>
        </div>

        <div className="flex-1 min-w-0 pb-1 sm:pb-3">
           <div className="flex items-center gap-2 text-[12px] mb-1">
             <span className="font-bold text-slate-700">{comment.author}</span>
             <span className="text-slate-500">• {comment.timestamp}</span>
           </div>
           <div className="text-[15px] text-slate-800 leading-relaxed font-sans prose prose-slate max-w-none mb-0.5">
             <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
               {comment.content}
             </ReactMarkdown>
           </div>
           
           <div className="flex flex-wrap items-center gap-0.5 sm:gap-1.5 mt-1 -ml-2">
             <div className="flex items-center">
               <button className="flex items-center justify-center p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-[#ff4500] transition-colors"><ArrowUp className="w-5 h-5 sm:w-4 sm:h-4"/></button>
               <span className="text-xs font-bold text-slate-500 px-0.5">{comment.likes || 'Vote'}</span>
               <button className="flex items-center justify-center p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-[#7193ff] transition-colors"><ArrowDown className="w-5 h-5 sm:w-4 sm:h-4"/></button>
             </div>
             
             <button 
               onClick={() => setReplyingToCommentId(replyingToCommentId === comment.id ? null : comment.id)}
               className="flex items-center gap-1.5 px-2 py-1.5 text-slate-500 hover:bg-slate-100 rounded-full sm:rounded transition-colors"
             >
               <MessageSquare className="w-4 h-4"/> <span className="text-xs font-bold leading-none">Reply</span>
             </button>
             <button className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 text-slate-500 hover:bg-slate-100 rounded transition-colors">
               <Award className="w-4 h-4"/> <span className="text-xs font-bold leading-none">Award</span>
             </button>
             <button className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 text-slate-500 hover:bg-slate-100 rounded transition-colors">
               <Share2 className="w-4 h-4"/> <span className="text-xs font-bold leading-none">Share</span>
             </button>
             <button className="flex items-center gap-1.5 px-2 py-1.5 text-slate-500 hover:bg-slate-100 rounded-full sm:rounded transition-colors">
               <MoreHorizontal className="w-4 h-4"/>
             </button>
           </div>
           
           {replyingToCommentId === comment.id && (
              <div className="mt-3 flex gap-2 items-start mb-3">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="What are your thoughts?"
                  rows={3}
                  className="flex-1 bg-slate-100 border border-transparent focus:border-slate-300 focus:ring-1 focus:ring-slate-300 rounded-xl px-3 py-2 text-sm text-slate-700 outline-none transition resize-y"
                />
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => handleAddReply(postId, comment.id)}
                    disabled={!replyContent.trim()}
                    className="px-4 py-1.5 bg-slate-800 text-slate-100 font-bold rounded-full text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-900 transition"
                  >
                    Reply
                  </button>
                  <button 
                    onClick={() => setReplyingToCommentId(null)}
                    className="px-4 py-1.5 bg-transparent text-slate-700 hover:bg-slate-100 font-bold rounded-full text-xs transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
           )}

           {comment.replies && comment.replies.length > 0 && (
             <div className="mt-0">
               {comment.replies.map(reply => (
                 <CommentNode 
                   key={reply.id} 
                   comment={reply} 
                   postId={postId}
                   replyingToCommentId={replyingToCommentId}
                   setReplyingToCommentId={setReplyingToCommentId}
                   replyContent={replyContent}
                   setReplyContent={setReplyContent}
                   handleAddReply={handleAddReply}
                 />
               ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const PostSkeleton = () => (
  <article className="border-b border-slate-200 pb-2 mb-[1px] bg-slate-50 relative pointer-events-none p-4 rounded-xl">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-6 h-6 rounded-full bg-slate-200 animate-pulse" />
      <div className="w-24 h-3 bg-slate-200 rounded animate-pulse" />
      <div className="w-12 h-3 bg-slate-200 rounded animate-pulse" />
      <div className="w-20 h-3 bg-slate-200 rounded animate-pulse" />
    </div>
    
    <div className="w-3/4 h-5 bg-slate-200 rounded mb-3 animate-pulse" />
    
    <div className="space-y-2 mb-4">
      <div className="w-full h-3.5 bg-slate-200 rounded animate-pulse" />
      <div className="w-[90%] h-3.5 bg-slate-200 rounded animate-pulse" />
      <div className="w-[80%] h-3.5 bg-slate-200 rounded animate-pulse" />
    </div>
    
    <div className="flex items-center gap-2 mt-4">
      <div className="w-20 h-8 rounded-full bg-slate-200 animate-pulse" />
      <div className="w-24 h-8 rounded-full bg-slate-200 animate-pulse" />
      <div className="w-20 h-8 rounded-full bg-slate-200 animate-pulse" />
    </div>
  </article>
);

const RecentPostSkeleton = () => (
  <div className="py-2.5 border-b border-slate-200 last:border-b-0 flex gap-2 justify-between">
    <div className="flex-1 flex flex-col justify-center space-y-2">
       <div className="flex items-center gap-1.5">
         <div className="w-4 h-4 rounded-full bg-slate-200 animate-pulse" />
         <div className="w-16 h-2 bg-slate-200 rounded animate-pulse" />
         <div className="w-12 h-2 bg-slate-200 rounded animate-pulse" />
       </div>
       <div className="w-[85%] h-3.5 bg-slate-200 rounded animate-pulse" />
       <div className="w-24 h-2.5 bg-slate-200 rounded mt-1 animate-pulse" />
    </div>
  </div>
);

export default function ForumFeedModule({ role, userInfo }: ForumFeedModuleProps) {
  const [posts, setPosts] = useState<ForumPost[]>(() => {
    const saved = localStorage.getItem('artemis_forum_posts_reddit_v3');
    return saved ? JSON.parse(saved) : PRESET_POSTS;
  });

  const [activeCommunity, setActiveCommunity] = useState<string>('all');
  const [activeCategory, setActiveCategory] = useState<string>('home');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Mock initial load
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 second loading skeleton simulation
    return () => clearTimeout(timer);
  }, []);
  
  // Submit states
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  const handleSaveToLocalStorage = (newPosts: ForumPost[]) => {
    localStorage.setItem('artemis_forum_posts_reddit_v3', JSON.stringify(newPosts));
    setPosts(newPosts);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const created: ForumPost = {
      id: `post-${Date.now()}`,
      authorName: userInfo.name,
      community: activeCommunity === 'all' ? COMMUNITIES[0].name : activeCommunity,
      title: newTitle,
      content: newContent,
      upvotes: 1,
      userVote: 'up',
      hearts: 0,
      userHearted: false,
      timestamp: 'Just now',
      comments: []
    };

    const updated = [created, ...posts];
    handleSaveToLocalStorage(updated);

    // Reset inputs
    setNewTitle('');
    setNewContent('');
    setIsComposing(false);
  };

  const handleVote = (id: string, dir: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = posts.map((p) => {
      if (p.id !== id) return p;
      let diff = 0;
      let nextVote: 'up' | 'down' | null = dir;

      if (p.userVote === dir) {
        diff = dir === 'up' ? -1 : 1;
        nextVote = null;
      } else if (p.userVote === null) {
        diff = dir === 'up' ? 1 : -1;
      } else {
        diff = dir === 'up' ? 2 : -2;
      }

      return {
        ...p,
        userVote: nextVote,
        upvotes: p.upvotes + diff
      };
    });

    handleSaveToLocalStorage(updated);
  };

  const handleHeart = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = posts.map((p) => {
      if (p.id !== id) return p;
      return {
        ...p,
        userHearted: !p.userHearted,
        hearts: p.hearts + (p.userHearted ? -1 : 1)
      };
    });
    handleSaveToLocalStorage(updated);
  };

  const handleAddComment = (postId: string) => {
    if (!commentText.trim()) return;

    const newComment: ForumComment = {
      id: `comment-${Date.now()}`,
      author: userInfo.name,
      content: commentText,
      timestamp: 'Just now',
      likes: 0
    };

    const updated = posts.map((p) => {
      if (p.id !== postId) return p;
      return {
        ...p,
        comments: [...p.comments, newComment]
      };
    });

    handleSaveToLocalStorage(updated);
    setCommentText('');
  };

  const handleAddReply = (postId: string, commentId: string) => {
    if (!replyContent.trim()) return;

    const newReply: ForumComment = {
      id: `reply-${Date.now()}`,
      author: userInfo.name,
      content: replyContent,
      timestamp: 'Just now',
      likes: 0
    };

    const updated = posts.map((p) => {
      if (p.id !== postId) return p;
      
      const addReplyToComment = (comments: ForumComment[]): ForumComment[] => {
        return comments.map(c => {
          if (c.id === commentId) {
            return {
              ...c,
              replies: [...(c.replies || []), newReply]
            };
          }
          if (c.replies && c.replies.length > 0) {
            return {
              ...c,
              replies: addReplyToComment(c.replies)
            };
          }
          return c;
        });
      };

      return {
        ...p,
        comments: addReplyToComment(p.comments)
      };
    });

    handleSaveToLocalStorage(updated);
    setReplyContent('');
    setReplyingToCommentId(null);
  };

  const filteredPosts = React.useMemo(() => {
    let result = activeCommunity === 'all' 
      ? posts 
      : posts.filter(p => p.community === activeCommunity);

    if (activeCategory === 'popular') {
      result = [...result].sort((a, b) => b.upvotes - a.upvotes);
    } else if (activeCategory === 'news') {
      result = [...result].sort((a, b) => b.id.localeCompare(a.id));
    } else if (activeCategory === 'explore') {
      result = [...result].sort((a, b) => b.comments.length - a.comments.length);
    }

    return result;
  }, [posts, activeCommunity, activeCategory]);

  const selectedPost = selectedPostId ? posts.find(p => p.id === selectedPostId) : null;

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-700 font-sans text-sm selection:bg-indigo-500/30">
      
      {/* REDDIT STYLE TOP HEADER */}
      <header className="h-[48px] bg-slate-50 border-b border-slate-200 px-4 flex items-center justify-between shrink-0 sticky top-0 z-50">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-4 min-w-0 w-[240px]">
          <button className="xl:hidden p-2 hover:bg-slate-100 rounded-full text-slate-700">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 cursor-pointer select-none">
            <div className="w-8 h-8 rounded-full bg-[#ff4500] flex items-center justify-center">
               <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                 <div className="w-4 h-4 rounded-full bg-[#ff4500] relative">
                    <div className="absolute top-0.5 right-0.5 w-[3px] h-[3px] bg-white rounded-full"></div>
                 </div>
               </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 hidden md:block">artemis<span className="text-slate-500 font-normal">.arc</span></span>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-[600px] px-2 md:px-8 relative hidden sm:block">
          <div className="relative group flex items-center bg-slate-100 hover:bg-slate-200 focus-within:bg-slate-100 focus-within:border-slate-300 focus-within:ring-1 focus-within:ring-slate-300 border border-transparent rounded-full px-3 py-1.5 transition-colors">
            <Search className="w-5 h-5 text-slate-500 group-focus-within:text-slate-900 shrink-0" />
            {(selectedPost || activeCommunity !== 'all') && (
               <div className="flex items-center gap-1.5 bg-slate-200 text-slate-700 text-[13px] font-bold rounded-full pl-1.5 pr-1 ml-2 py-0.5 whitespace-nowrap">
                  <div className={`w-5 h-5 rounded-full ${COMMUNITIES.find(c => c.name === (selectedPost ? selectedPost.community : activeCommunity))?.color || 'bg-indigo-500'} flex items-center justify-center shrink-0`}>
                     <span className="text-[9px] text-slate-100 uppercase font-bold">{(selectedPost ? selectedPost.community : activeCommunity)[2]}</span>
                  </div>
                  <span>{selectedPost ? selectedPost.community : activeCommunity}</span>
                  <button className="hover:bg-[#3f4a50] rounded-full p-0.5 ml-0.5" onClick={() => { setActiveCommunity('all'); setSelectedPostId(null); }}>
                    <X className="w-3.5 h-3.5 text-slate-500 hover:text-slate-100" />
                  </button>
               </div>
            )}
            <input
              type="text"
              placeholder={selectedPost || activeCommunity !== 'all' ? `Search in ${selectedPost ? selectedPost.community : activeCommunity}` : "Find anything"}
              className="flex-1 bg-transparent border-none text-sm text-slate-900 placeholder-slate-400 outline-none ml-2 min-w-0"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 justify-end min-w-[240px]">
          <button className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-sm font-semibold transition">
            <span className="text-orange-500 font-bold tracking-widest text-[#d85e3d]">Q</span> Ask
          </button>
          <div className="flex items-center gap-1 mx-2">
            <button className="p-2 hover:bg-slate-100 rounded-full hidden lg:block"><TrendingUp className="w-5 h-5" /></button>
            <button className="p-2 hover:bg-slate-100 rounded-full hidden lg:block"><MessageSquare className="w-5 h-5" /></button>
            <button className="p-2 hover:bg-slate-100 rounded-full"><Plus className="w-5 h-5" /></button>
            <button className="p-2 hover:bg-slate-100 rounded-full"><Bell className="w-5 h-5" /></button>
          </div>
          <button onClick={() => setIsComposing(true)} className="hidden md:flex items-center gap-1 px-3 py-1.5 hover:bg-slate-100 rounded-full text-sm font-semibold transition">
            <PlusCircle className="w-4 h-4" /> Create
          </button>
          <div className="w-8 h-8 rounded-full ml-1 overflow-hidden cursor-pointer shrink-0" style={{ backgroundColor: userInfo.avatarColor }}>
             <div className="w-full h-full flex items-center justify-center font-bold text-slate-100 text-xs">{userInfo.name[0]}</div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* LEFT SIDEBAR - Navigation */}
        {!selectedPostId && (
          <aside className="w-[272px] shrink-0 border-r border-slate-200 overflow-y-auto hidden xl:block p-4 sticky top-0 h-full scrollbar-hide">
          
          <nav className="space-y-1 mb-6 pb-6 border-b border-slate-200">
            <button onClick={() => { setActiveCategory('home'); setActiveCommunity('all'); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${activeCategory === 'home' && activeCommunity === 'all' ? 'bg-slate-100 text-slate-900' : 'hover:bg-slate-100 text-slate-700'}`}>
              <Home className="w-5 h-5" />
              <span className="font-semibold text-sm">Home</span>
            </button>
            <button onClick={() => { setActiveCategory('popular'); setActiveCommunity('all'); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${activeCategory === 'popular' ? 'bg-slate-100 text-slate-900' : 'hover:bg-slate-100 text-slate-700'}`}>
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold text-sm">Popular</span>
            </button>
            <button onClick={() => { setActiveCategory('news'); setActiveCommunity('all'); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${activeCategory === 'news' ? 'bg-slate-100 text-slate-900' : 'hover:bg-slate-100 text-slate-700'}`}>
              <Newspaper className="w-5 h-5" />
              <span className="font-semibold text-sm">News</span>
            </button>
            <button onClick={() => { setActiveCategory('explore'); setActiveCommunity('all'); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${activeCategory === 'explore' ? 'bg-slate-100 text-slate-900' : 'hover:bg-slate-100 text-slate-700'}`}>
              <Compass className="w-5 h-5" />
              <span className="font-semibold text-sm">Explore</span>
            </button>
          </nav>

          <div className="mb-6">
            <h3 className="uppercase tracking-wider text-[11px] font-bold text-slate-500 mb-3 px-4 flex items-center justify-between">
              Communities <ChevronDown className="w-3.5 h-3.5" />
            </h3>
            <div className="space-y-1">
              {COMMUNITIES.map(c => (
                <button 
                  key={c.name}
                  onClick={() => setActiveCommunity(c.name)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors group ${activeCommunity === c.name ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${c.color}`}>
                    <span className="text-[10px] font-bold text-slate-100 uppercase">{c.name[2]}</span>
                  </div>
                  <span className={`text-[13px] font-medium truncate ${activeCommunity === c.name ? 'text-slate-900' : 'text-slate-700'}`}>
                    {c.name}
                  </span>
                  <div className="opacity-0 group-hover:opacity-100 ml-auto p-1 hover:bg-slate-200 rounded-full transition-colors">
                     <span className="text-slate-700">★</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="uppercase tracking-wider text-[11px] font-bold text-slate-500 mb-3 px-4 flex items-center justify-between">
              Resources <ChevronDown className="w-3.5 h-3.5" />
            </h3>
            <div className="space-y-1">
              <button className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-700">
                <span className="text-[13px] font-medium">About Artemis</span>
              </button>
              <button className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-700">
                <span className="text-[13px] font-medium">Advertise</span>
              </button>
            </div>
          </div>

        </aside>
        )}

        {/* CENTER SCROLL AREA */}
        <div className="flex-1 overflow-y-auto w-full flex justify-center pt-6 px-0 sm:px-4 md:px-6">
          <div className="flex max-w-[1040px] w-full gap-4 items-start justify-center">
            
            {/* MAIN FEED COLUMN */}
            <main className="flex-1 min-w-0 max-w-[700px] w-full flex flex-col gap-3">
              
              {isComposing ? (
                // --- COMPOSE POST VIEW ---
                <div className="bg-white sm:border border-slate-200 sm:rounded-xl min-h-[500px] mb-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
                   <div className="flex items-center justify-between p-4 border-b border-slate-200">
                      <h2 className="text-xl font-bold text-slate-900">Create post</h2>
                      <button className="text-sm font-bold text-slate-700 hover:bg-slate-100 px-3 py-1.5 rounded-full transition">Drafts</button>
                   </div>
                   
                   <form onSubmit={handleCreatePost} className="p-4 flex flex-col gap-4">
                     {/* Community Dropdown */}
                     <div className="flex items-center gap-2">
                       <select
                         value={activeCommunity === 'all' ? COMMUNITIES[0].name : activeCommunity}
                         onChange={(e) => setActiveCommunity(e.target.value)}
                         className="bg-slate-100 border border-transparent rounded-full px-4 py-2.5 text-sm text-slate-700 font-bold outline-none hover:bg-slate-200 cursor-pointer appearance-none transition-colors"
                       >
                         {COMMUNITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                       </select>
                     </div>

                     {/* Tabs */}
                     <div className="flex border-b border-slate-200 mt-2">
                        <button type="button" className="px-6 py-3 border-b-[3px] border-[#d7dadc] text-[15px] font-bold text-slate-700">Text</button>
                        <button type="button" className="px-6 py-3 border-b-[3px] border-transparent text-[15px] font-bold text-slate-500 hover:bg-slate-100 transition-colors">Images & Video</button>
                        <button type="button" className="px-6 py-3 border-b-[3px] border-transparent text-[15px] font-bold text-slate-500 hover:bg-slate-100 transition-colors">Link</button>
                        <button type="button" className="px-6 py-3 border-b-[3px] border-transparent text-[15px] font-bold text-slate-500 hover:bg-slate-100 transition-colors hidden sm:block">Poll</button>
                     </div>

                     <div>
                       <input
                         autoFocus
                         type="text"
                         placeholder="Title*"
                         value={newTitle}
                         onChange={(e) => setNewTitle(e.target.value)}
                         maxLength={300}
                         className="w-full bg-transparent border border-slate-200 focus:border-slate-300 focus:ring-1 focus:ring-slate-300 hover:border-[#8b9296] rounded-xl px-4 py-3 text-[15px] font-bold text-slate-900 placeholder-slate-400 outline-none transition"
                       />
                       <div className="text-right text-[11px] text-slate-500 mt-1">{newTitle.length}/300</div>
                     </div>
                     
                     <div className="flex gap-2">
                        <button type="button" className="px-3 py-1.5 bg-slate-100 text-slate-500 font-bold text-[13px] rounded-full flex items-center gap-1 hover:bg-slate-200 transition-colors">
                          <Plus className="w-4 h-4"/> Add tags
                        </button>
                     </div>

                     <div className="rounded-xl border border-slate-200 overflow-hidden focus-within:border-slate-300 focus-within:ring-1 focus-within:ring-slate-300 transition bg-transparent mt-2">
                        <div className="bg-[#131f24] px-4 py-2 flex items-center gap-4 border-b border-slate-200 overflow-x-auto scrollbar-hide">
                           <div className="flex gap-1 text-slate-500 shrink-0">
                              <button type="button" className="p-1.5 hover:text-slate-700 hover:bg-slate-200 rounded"><Bold className="w-[18px] h-[18px]"/></button>
                              <button type="button" className="p-1.5 hover:text-slate-700 hover:bg-slate-200 rounded"><Italic className="w-[18px] h-[18px]"/></button>
                              <button type="button" className="p-1.5 hover:text-slate-700 hover:bg-slate-200 rounded"><Strikethrough className="w-[18px] h-[18px]"/></button>
                           </div>
                           <div className="w-[1px] h-5 bg-slate-200 shrink-0"></div>
                           <div className="flex gap-1 text-slate-500 shrink-0">
                               <button type="button" className="p-1.5 hover:text-slate-700 hover:bg-slate-200 rounded"><LinkIcon className="w-[18px] h-[18px]"/></button>
                               <button type="button" className="p-1.5 hover:text-slate-700 hover:bg-slate-200 rounded"><ImageIcon className="w-[18px] h-[18px]"/></button>
                               <button type="button" className="p-1.5 hover:text-slate-700 hover:bg-slate-200 rounded"><Video className="w-[18px] h-[18px]"/></button>
                           </div>
                           <div className="w-[1px] h-5 bg-slate-200 shrink-0"></div>
                           <div className="flex gap-1 text-slate-500 shrink-0">
                               <button type="button" className="p-1.5 hover:text-slate-700 hover:bg-slate-200 rounded"><List className="w-[18px] h-[18px]"/></button>
                               <button type="button" className="p-1.5 hover:text-slate-700 hover:bg-slate-200 rounded"><ListOrdered className="w-[18px] h-[18px]"/></button>
                               <button type="button" className="p-1.5 hover:text-slate-700 hover:bg-slate-200 rounded"><Quote className="w-[18px] h-[18px]"/></button>
                               <button type="button" className="p-1.5 hover:text-slate-700 hover:bg-slate-200 rounded"><Code className="w-[18px] h-[18px]"/></button>
                           </div>
                        </div>
                        <textarea
                          placeholder="Body text (optional)"
                          value={newContent}
                          onChange={(e) => setNewContent(e.target.value)}
                          rows={6}
                          className="w-full bg-transparent p-4 text-[15px] text-slate-700 placeholder-slate-400 outline-none resize-y min-h-[150px]"
                        />
                     </div>

                     <div className="flex justify-end gap-2 mt-4 pt-4">
                       <button type="button" onClick={() => setIsComposing(false)} className="px-5 py-2 text-[15px] font-bold text-slate-700 hover:bg-slate-100 rounded-full transition">Cancel</button>
                       <button type="button" className="px-5 py-2 text-[15px] font-bold text-slate-700 border border-[#8b9296] hover:bg-slate-100 rounded-full transition">Save Draft</button>
                       <button type="submit" disabled={!newTitle.trim()} className="px-6 py-2 text-[15px] font-bold bg-slate-800 text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-900 rounded-full transition">Post</button>
                     </div>
                   </form>
                </div>
              ) : selectedPost ? (
                // --- POST DETAIL VIEW ---
                <div className="bg-white sm:border border-slate-200 sm:rounded-xl mb-4 overflow-hidden pt-2 relative">
                   <div className="p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2 text-xs text-slate-500">
                           <button 
                             onClick={() => setSelectedPostId(null)} 
                             className="p-1 hover:bg-slate-100 rounded-full transition-colors mr-1"
                           >
                             <ArrowLeft className="w-[18px] h-[18px] text-slate-700" />
                           </button>
                           {/* Community Icon */}
                           <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${COMMUNITIES.find(c => c.name === selectedPost.community)?.color || 'bg-indigo-500'}`}>
                             <span className="text-[10px] font-bold text-slate-100 uppercase">{selectedPost.community[2]}</span>
                           </div>
                           <span className="font-bold text-slate-700 hover:underline cursor-pointer flex items-center">{selectedPost.community}</span>
                           <span>•</span>
                           <span>{selectedPost.timestamp}</span>
                           <span>•</span>
                           <span className="text-slate-700 hover:underline cursor-pointer">{selectedPost.authorName}</span>
                         </div>
                         <button className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                            <MoreHorizontal className="w-5 h-5 text-slate-500" />
                         </button>
                      </div>

                      <h1 className="text-xl font-bold text-slate-900 leading-snug mt-1 inline-flex items-center flex-wrap gap-2">
                        {selectedPost.title}
                        <span className="px-2 py-0.5 bg-[#ff4500]/20 text-[#ff4500] text-[10px] font-bold rounded-full border border-[#ff4500]/30 tracking-wider">Discussion</span>
                      </h1>
                      
                      {selectedPost.content && (
                        <div className="text-[15px] text-slate-800 leading-relaxed font-sans prose prose-slate max-w-none py-1">
                          <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                            {selectedPost.content}
                          </ReactMarkdown>
                        </div>
                      )}

                      {selectedPost.imageUrl && (
                        <div className="mt-3 w-full rounded-[16px] overflow-hidden border border-slate-200">
                          <img src={selectedPost.imageUrl} alt="" className="w-full h-auto max-h-[700px] object-contain bg-black" />
                        </div>
                      )}

                      {/* Post Actions */}
                      <div className="flex items-center gap-2 py-2 mt-2">
                        <div className="flex items-center bg-slate-100 hover:bg-slate-200 rounded-full transition-colors border border-[#1a282d]">
                          <button 
                            onClick={(e) => handleVote(selectedPost.id, 'up', e)}
                            className={`p-2 hover:bg-slate-200 rounded-l-full transition-colors ${selectedPost.userVote === 'up' ? 'text-[#ff4500]' : 'text-slate-500'}`}
                          >
                            <ArrowUp className="w-5 h-5 stroke-[2.5]" />
                          </button>
                          <span className={`text-sm font-bold px-2 text-center ${selectedPost.userVote === 'up' ? 'text-[#ff4500]' : selectedPost.userVote === 'down' ? 'text-[#7193ff]' : 'text-slate-700'}`}>
                            {selectedPost.upvotes > 999 ? '1.4k' : selectedPost.upvotes}
                          </span>
                          <button 
                            onClick={(e) => handleVote(selectedPost.id, 'down', e)}
                            className={`p-2 hover:bg-slate-200 rounded-r-full transition-colors ${selectedPost.userVote === 'down' ? 'text-[#7193ff]' : 'text-slate-500'}`}
                          >
                            <ArrowDown className="w-5 h-5 stroke-[2.5]" />
                          </button>
                        </div>
                        <button 
                          onClick={(e) => handleHeart(selectedPost.id, e)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-700"
                        >
                          <Heart className={`w-5 h-5 ${selectedPost.userHearted ? 'text-rose-500 fill-rose-500' : 'text-slate-500'}`} />
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-700">
                          <MessageSquare className="w-5 h-5 text-slate-500 fill-[#8b9296]" />
                          <span className="text-sm font-bold">{selectedPost.comments.length}</span>
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-700">
                          <Share2 className="w-5 h-5 text-slate-500" />
                          <span className="text-sm font-bold">Share</span>
                        </button>
                      </div>
                   </div>

                   {/* Add Comment */}
                   <div className="px-4 py-2 mt-2 bg-white border border-slate-200 rounded-full mx-4 mb-4">
                      <div className="flex gap-3 items-center">
                         <div className="flex-1 flex flex-col justify-center">
                            <input
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              placeholder="Add a comment"
                              className="w-full bg-transparent px-2 py-1 text-sm text-slate-700 outline-none transition"
                            />
                         </div>
                         <button 
                           onClick={() => handleAddComment(selectedPost.id)}
                           disabled={!commentText.trim()}
                           className="px-4 py-1.5 bg-slate-800 text-slate-100 font-bold rounded-full text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-900 transition shrink-0"
                         >
                           Comment
                         </button>
                      </div>
                   </div>

                   <div className="px-4 py-2 flex items-center justify-between border-b border-slate-200 mx-4 mb-2">
                     <span className="text-sm font-bold text-slate-700">Sort by: Best <ChevronDown className="w-4 h-4 inline" /></span>
                     <div className="relative">
                       <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
                       <input type="text" placeholder="Search comments" className="bg-slate-100 text-slate-700 text-xs rounded-full pl-8 pr-4 py-1.5 outline-none border border-transparent focus:border-slate-300 focus:ring-1 focus:ring-slate-300" />
                     </div>
                   </div>

                   {/* Comments List */}
                   <div className="px-4 pb-4">
                      {selectedPost.comments.length === 0 ? (
                        <div className="py-8 text-center text-slate-500 text-sm">No comments yet. Be the first to share your thoughts!</div>
                      ) : (
                        <div className="space-y-4">
                          {selectedPost.comments.map(comment => (
                            <CommentNode 
                               key={comment.id}
                               comment={comment}
                               postId={selectedPost.id}
                               replyingToCommentId={replyingToCommentId}
                               setReplyingToCommentId={setReplyingToCommentId}
                               replyContent={replyContent}
                               setReplyContent={setReplyContent}
                               handleAddReply={handleAddReply}
                            />
                          ))}
                        </div>
                      )}
                   </div>
                </div>
              ) : (
                // --- FEED VIEW ---
                <>
                  {/* Create Post Interface (Compact) */}
                  <div className="bg-white sm:border border-slate-200 sm:rounded-xl p-3 flex gap-3 items-center sticky top-0 z-40 mb-3 shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                     <div className="w-10 h-10 rounded-full shrink-0 overflow-hidden bg-indigo-500 border border-slate-200">
                        <div className="w-full h-full flex items-center justify-center font-bold text-slate-100 text-[15px]">{userInfo.name[0]}</div>
                     </div>
                     <input 
                       type="text"
                       placeholder="Create Post"
                       readOnly
                       onClick={() => setIsComposing(true)}
                       className="flex-1 bg-slate-100 hover:bg-slate-200 cursor-text rounded-md border border-slate-200 hover:border-[#8b9296] px-4 py-2.5 text-slate-700 outline-none transition-colors"
                     />
                     <button onClick={() => setIsComposing(true)} className="p-2.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-700"><ImageIcon className="w-6 h-6" /></button>
                     <button onClick={() => setIsComposing(true)} className="p-2.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-700"><LinkIcon className="w-6 h-6" /></button>
                  </div>

                  {/* Optional divider */}
                  <div className="h-[1px] w-full bg-slate-200 mb-1 block hidden"></div> 

                  {/* FEED ITEMS */}
                  {isLoading ? (
                    <div className="space-y-4">
                      <PostSkeleton />
                      <PostSkeleton />
                      <PostSkeleton />
                      <PostSkeleton />
                    </div>
                  ) : (
                    filteredPosts.map(post => {
                    const isUpvoted = post.userVote === 'up';
                    const isDownvoted = post.userVote === 'down';
                    const communityDetails = COMMUNITIES.find(c => c.name === post.community);
                    
                    return (
                      <article key={post.id} className="relative border-b border-slate-200 hover:bg-slate-50 transition-colors duration-100 ease-in mb-[1px] pb-2 group">
                        <div className="p-4 flex flex-col gap-2 cursor-pointer" onClick={() => setSelectedPostId(post.id)}>
                          
                          {/* Header: Subreddit, user, time */}
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${communityDetails?.color || 'bg-indigo-500'}`}>
                              <span className="text-[9px] font-bold text-slate-100 uppercase">{post.community[2]}</span>
                            </div>
                            <span 
                              className="font-bold text-slate-700 hover:underline"
                              onClick={(e) => { e.stopPropagation(); setActiveCommunity(post.community); }}
                            >
                              {post.community}
                            </span>
                            <span>•</span>
                            <span>{post.timestamp}</span>
                            <div className="ml-auto flex items-center gap-2">
                               <button onClick={(e) => e.stopPropagation()} className="px-3 py-1 bg-white hover:bg-slate-100 border border-[#d7dadc] text-slate-700 font-bold rounded-full text-xs hidden sm:block">Join</button>
                               <button onClick={(e) => e.stopPropagation()} className="p-1 text-slate-500 hover:bg-slate-200 rounded-full mx-[-2px]"><MoreHorizontal className="w-4 h-4" /></button>
                            </div>
                          </div>

                          {/* Content Section */}
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900 leading-[1.3] mb-1 pr-4">
                              {post.title}
                            </h3>
                            {post.content && (
                              <div className="text-sm text-slate-800 leading-relaxed font-sans prose prose-sm prose-slate max-w-none line-clamp-[6] pb-1">
                                <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                                  {post.content}
                                </ReactMarkdown>
                              </div>
                            )}
                            {post.imageUrl && (
                              <div className="mt-2 w-full max-h-[500px] overflow-hidden rounded-[16px] border border-slate-200">
                                <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>

                        </div>

                        {/* Reddit Actions Bar */}
                        <div className="flex items-center gap-2 px-4 pb-2">
                          
                          {/* Vote Pill */}
                          <div className="flex items-center bg-slate-100 hover:bg-slate-200 rounded-full transition-colors border border-[#1a282d] group-hover:border-slate-200">
                            <button 
                              onClick={(e) => handleVote(post.id, 'up', e)}
                              className={`p-[7px] pl-2 hover:bg-slate-200 rounded-l-full group/up flex items-center justify-center transition-colors ${isUpvoted ? 'text-[#ff4500]' : 'text-slate-500 hover:text-[#ff4500]'}`}
                            >
                              <ArrowUp className="w-[18px] h-[18px] stroke-[2.5]" />
                            </button>
                            <span className={`text-[13px] font-bold px-1 min-w-[20px] text-center ${isUpvoted ? 'text-[#ff4500]' : isDownvoted ? 'text-[#7193ff]' : 'text-slate-700'}`}>
                              {post.upvotes > 999 ? '1.4k' : post.upvotes}
                            </span>
                            <button 
                              onClick={(e) => handleVote(post.id, 'down', e)}
                              className={`p-[7px] pr-2 hover:bg-slate-200 rounded-r-full group/down flex items-center justify-center transition-colors ${isDownvoted ? 'text-[#7193ff]' : 'text-slate-500 hover:text-[#7193ff]'}`}
                            >
                              <ArrowDown className="w-[18px] h-[18px] stroke-[2.5]" />
                            </button>
                          </div>

                          {/* Heart Pill */}
                          <button 
                            onClick={(e) => handleHeart(post.id, e)}
                            className="flex items-center gap-1.5 px-[10px] py-[7px] bg-slate-100 hover:bg-slate-200 border border-[#1a282d] group-hover:border-slate-200 rounded-full transition-colors text-slate-700"
                          >
                            <Heart className={`w-[18px] h-[18px] ${post.userHearted ? 'text-rose-500 fill-rose-500' : 'text-slate-500'}`} />
                            <span className="text-[13px] font-bold">{post.hearts > 0 ? post.hearts : ''}</span>
                          </button>

                          {/* Comments Pill */}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedPostId(expandedPostId === post.id ? null : post.id);
                            }}
                            className="flex items-center gap-1.5 px-[10px] py-[7px] bg-slate-100 hover:bg-slate-200 border border-[#1a282d] group-hover:border-slate-200 rounded-full transition-colors text-slate-700"
                          >
                            <MessageSquare className="w-[18px] h-[18px] text-slate-500" />
                            <span className="text-[13px] font-bold">{post.comments.length}</span>
                          </button>

                          {/* Award / Details Pill */}
                          <button className="items-center gap-1.5 px-[10px] py-[7px] bg-slate-100 hover:bg-slate-200 border border-[#1a282d] group-hover:border-slate-200 rounded-full transition-colors text-slate-700 hidden sm:flex">
                            <Award className="w-[18px] h-[18px] text-slate-500" />
                          </button>

                          {/* Share Pill */}
                          <button className="flex items-center gap-1.5 px-[10px] py-[7px] bg-slate-100 hover:bg-slate-200 border border-[#1a282d] group-hover:border-slate-200 rounded-full transition-colors text-slate-700">
                            <Share2 className="w-[18px] h-[18px] text-slate-500" />
                            <span className="text-[13px] font-bold pr-1 hidden sm:inline">Share</span>
                          </button>
                        </div>

                        {/* Inline Comments Section */}
                        {expandedPostId === post.id && (
                          <div className="bg-white border-t border-slate-200 px-4 py-3" onClick={(e) => e.stopPropagation()}>
                            {/* Make a comment */}
                            <div className="flex gap-3 mb-4">
                               <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-500 shrink-0">
                                  <div className="w-full h-full flex items-center justify-center font-bold text-slate-100 text-xs">{userInfo.name[0]}</div>
                               </div>
                               <div className="flex-1 flex flex-col gap-2">
                                  <textarea
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Add a comment"
                                    rows={2}
                                    className="w-full bg-slate-100 border border-transparent focus:border-slate-300 focus:ring-1 focus:ring-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none transition resize-y"
                                  />
                                  <div className="flex justify-end">
                                     <button 
                                       onClick={() => { handleAddComment(post.id); }}
                                       disabled={!commentText.trim()}
                                       className="px-4 py-1.5 bg-slate-800 text-slate-100 font-bold rounded-full text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-900 transition"
                                     >
                                       Comment
                                     </button>
                                  </div>
                               </div>
                            </div>
                            
                            {/* Comments List */}
                            <div className="space-y-4">
                              {post.comments.length === 0 ? (
                                <div className="py-4 text-center text-slate-500 text-sm">No comments yet. Be the first to share your thoughts!</div>
                              ) : (
                                post.comments.map(comment => (
                                  <CommentNode 
                                     key={comment.id}
                                     comment={comment}
                                     postId={post.id}
                                     replyingToCommentId={replyingToCommentId}
                                     setReplyingToCommentId={setReplyingToCommentId}
                                     replyContent={replyContent}
                                     setReplyContent={setReplyContent}
                                     handleAddReply={handleAddReply}
                                  />
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </article>
                    )
                  })
                  )}
                </>
              )}
            </main>

            {/* RIGHT SIDEBAR - Recent / Trending Widget */}
            <aside className="w-[316px] shrink-0 hidden lg:block">
              <div className="bg-white border border-slate-200 shadow-sm rounded-[16px] overflow-hidden">
                <div className="p-4 pb-2 border-b border-slate-200/60">
               <div className="flex justify-between items-center mb-3">
                 <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Recent Posts</h2>
                 <button className="text-[11px] font-bold text-blue-500 hover:text-blue-400">Clear</button>
               </div>
               
               {isLoading ? (
                 <div className="space-y-0">
                   <RecentPostSkeleton />
                   <RecentPostSkeleton />
                   <RecentPostSkeleton />
                   <RecentPostSkeleton />
                   <RecentPostSkeleton />
                 </div>
               ) : (
                 posts.slice(0, 10).map((post) => {
                 const postCommunity = COMMUNITIES.find(c => c.name === post.community);
                 return (
                 <div key={`recent-${post.id}`} onClick={() => setSelectedPostId(post.id)} className="py-2.5 group cursor-pointer border-b border-slate-200 last:border-b-0 flex gap-2 justify-between">
                    <div className="flex-1 min-w-0 flex flex-col justify-center space-y-1.5">
                       <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                         <div className={`w-4 h-4 ${postCommunity?.color || 'bg-indigo-500'} rounded-full flex items-center justify-center shrink-0`}>
                           <span className="text-[8px] font-bold text-[#fff] uppercase">{post.community[2]}</span>
                         </div>
                         <span className="font-semibold text-slate-700 truncate group-hover:underline">{post.community}</span>
                         <span>•</span>
                         <span>{post.timestamp}</span>
                       </div>
                       <h4 className="text-[13px] font-semibold text-slate-700 leading-tight pr-2 line-clamp-2">{post.title}</h4>
                       <div className="text-[11px] text-slate-500 pt-1 flex items-center gap-2">
                         <span>{post.upvotes} upvotes</span>
                         <span>•</span>
                         <span>{post.comments.length} comments</span>
                       </div>
                    </div>
                    {post.imageUrl && (
                      <div className="w-[72px] h-[54px] bg-slate-100 rounded overflow-hidden shrink-0 my-auto flex items-center justify-center text-xs text-slate-500 font-mono border border-slate-200">
                         <img src={post.imageUrl} className="w-full h-full object-cover" alt="" />
                      </div>
                    )}
                 </div>
                 );
               })
               )}

               {/* See more toggle */}
               <button className="w-full text-center py-3 text-[13px] font-bold text-slate-700 hover:bg-slate-100 transition-colors mt-1 rounded-b-[16px]">
                  See more
               </button>
            </div>
            
          </div>
          
          <div className="mt-4 px-4 hidden text-[11px] text-slate-500 leading-relaxed">
             Artemis Rules • Privacy Policy • User Agreement<br/>
             Accessibility<br/>
             Artemis Institute, Inc. © 2026. All rights reserved.
          </div>
          
        </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

const ChevronDown = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill="currentColor" viewBox="0 0 20 20" {...props}>
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

