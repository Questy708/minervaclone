import React, { useState } from 'react';
import { 
  MessageSquare, 
  Share2, 
  ThumbsUp, 
  ArrowUp, 
  ArrowDown, 
  Bookmark, 
  Sparkles, 
  PenTool, 
  Search, 
  Trash2, 
  MoreHorizontal, 
  CheckCircle2, 
  Rss, 
  Globe, 
  Users, 
  Network, 
  TrendingUp,
  MapPin,
  Clock
} from 'lucide-react';
import { UserRole } from '../App';

interface ForumComment {
  id: string;
  author: string;
  role: string;
  avatarColor: string;
  content: string;
  timestamp: string;
  likes: number;
}

interface ForumPost {
  id: string;
  authorName: string;
  authorRole: string;
  authorCenter: string;
  avatarColor: string;
  community: string;
  title: string;
  content: string;
  tag: string;
  upvotes: number;
  likes: number;
  userVote: 'up' | 'down' | null;
  userLiked: boolean;
  userBookmarked: boolean;
  comments: ForumComment[];
  timestamp: string;
}

const PRESET_POSTS: ForumPost[] = [
  {
    id: 'post-1',
    authorName: 'Dr. Evelyn Sterling',
    authorRole: 'Lead Principal Researcher',
    authorCenter: 'Arc Institute, Palo Alto',
    avatarColor: '#EA580C',
    community: 'r/CellularReprogramming',
    title: 'New Spatial Transcriptomics Pipeline Released: Deconstructing Neural Plasticity Matrix',
    content: 'We have compiled and open-sourced our automated spatial imaging pipelines at Palo Alto! By utilizing high-capacity optical systems and convolutional matching grids, we mapped the transcription limits of hippocampus slice cells within 40 nanometers of resolution. This completely changes our approach to #neural-transduction cornerstone analytics, since we can visualize protein concentration decay during active sensor transduction loops. Feedback and notebook forks are highly welcomed!',
    tag: '#spatial-biology',
    upvotes: 142,
    likes: 88,
    userVote: null,
    userLiked: false,
    userBookmarked: false,
    timestamp: '2 hours ago',
    comments: [
      {
        id: 'c1',
        author: 'Marika Alvarez',
        role: 'Student Researcher',
        avatarColor: '#E91E63',
        content: 'This resolves the resolution gaps we had in SS110! I already cloned the Python notebook and I am mapping sensory transduction limits. Thank you, Evelyn!',
        timestamp: '1 hour ago',
        likes: 12
      },
      {
        id: 'c2',
        author: 'Prof. Tyler Vance',
        role: 'Faculty Advisor',
        avatarColor: '#9C27B0',
        content: 'Astounding spatial imaging precision. Let’s adapt this pipeline for the NS166 cohort scheduled to rotate in Heidelberg next term.',
        timestamp: '45 mins ago',
        likes: 7
      }
    ]
  },
  {
    id: 'post-2',
    authorName: 'Prof. Tyler Vance',
    authorRole: 'Metascience & Interdisciplinary Chair',
    authorCenter: 'London Crick Quantum Lab',
    avatarColor: '#9C27B0',
    community: 'r/Metascience',
    title: 'The "Rotation Program" Fallacy: How to achieve absolute research continuity across 100 global centers',
    content: 'A major critique of global rotation designs (like Minerva or standard internship rotations) is cognitive context fragmentation: students lose momentum when switching locations every 15 weeks. At our joint Arc Institute + London programs, we solve this via "continuous asynchronous workspace logs." A student studying longevity factors in Tokyo Shiba can transition their genomic model data seamlessly to Palo Alto. We maintain continuous local mentors rather than breaking the sequence. Physical relocation should amplify perspective, never restart the notebook.',
    tag: '#rotations',
    upvotes: 95,
    likes: 72,
    userVote: null,
    userLiked: false,
    userBookmarked: false,
    timestamp: '5 hours ago',
    comments: [
      {
        id: 'c3',
        author: 'Dr. Evelyn Sterling',
        role: 'Lead Principal Researcher',
        avatarColor: '#EA580C',
        content: 'Exactly why we engineered the Deconstruct Studio. Preserving academic git logs ensures complete spatial sequence logic without interruption.',
        timestamp: '3 hours ago',
        likes: 19
      }
    ]
  },
  {
    id: 'post-3',
    authorName: 'Marika Alvarez',
    authorRole: 'Student Representative',
    authorCenter: 'Shibuya Biosystems Center, Tokyo',
    avatarColor: '#E91E63',
    community: 'r/AiBiology',
    title: 'Reflecting on Tokyo Epigenetics Rotation: Merging Neuromorphic models with cellular aging factors',
    content: 'Just finalized my 3-month rotation inside Shibuya Tokyo Center! We evaluated longevity assays under a neuromorphic computing chip designed in Bengaluru. By pairing continuous learning models directly with deep biophysics lattices, we successfully predicted cellular decay paths with 93% accuracy. Physical presence inside Tokyo allowed me to directly collaborate with local microfluidics manufacturing partners—something you simply cannot replicate in standard online simulations. Here is my portfolio summary details!',
    tag: '#learning-loops',
    upvotes: 78,
    likes: 41,
    userVote: null,
    userLiked: false,
    userBookmarked: false,
    timestamp: '1 day ago',
    comments: []
  }
];

interface ForumFeedModuleProps {
  role: UserRole;
  userInfo: { name: string; email: string; avatarColor: string };
}

export default function ForumFeedModule({ role, userInfo }: ForumFeedModuleProps) {
  const [posts, setPosts] = useState<ForumPost[]>(() => {
    const saved = localStorage.getItem('artemis_forum_posts');
    return saved ? JSON.parse(saved) : PRESET_POSTS;
  });

  const [activeCommunity, setActiveCommunity] = useState<string>('all');
  const [activeSort, setActiveSort] = useState<'hot' | 'top' | 'new'>('hot');
  
  // Submit states
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('#neuroscience');
  const [newCommunity, setNewCommunity] = useState('r/CellularReprogramming');
  const [newAudience, setNewAudience] = useState<'public' | 'cohort' | 'center'>('public');

  // Input states for active commenting
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentTextState, setCommentTextState] = useState<Record<string, string>>({});

  const handleSaveToLocalStorage = (newPosts: ForumPost[]) => {
    localStorage.setItem('artemis_forum_posts', JSON.stringify(newPosts));
    setPosts(newPosts);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert("Post title and content cannot be blank.");
      return;
    }

    const created: ForumPost = {
      id: `post-${Date.now()}`,
      authorName: userInfo.name,
      authorRole: role === 'student' ? 'Undergraduate Scholar' : role === 'faculty' ? 'Faculty Academic Chair' : 'Lead Researcher',
      authorCenter: role === 'student' ? 'Shibuya Biosystems Center, Tokyo' : 'Arc Institute, Palo Alto',
      avatarColor: userInfo.avatarColor || '#3F51B5',
      community: newCommunity,
      title: newTitle,
      content: newContent,
      tag: newTag,
      upvotes: 1,
      likes: 1,
      userVote: 'up',
      userLiked: true,
      userBookmarked: false,
      timestamp: 'Just now',
      comments: []
    };

    const updated = [created, ...posts];
    handleSaveToLocalStorage(updated);

    // Reset inputs
    setNewTitle('');
    setNewContent('');
    setActiveCommunity(newCommunity);
  };

  const handleVote = (id: string, dir: 'up' | 'down') => {
    const updated = posts.map((p) => {
      if (p.id !== id) return p;
      let diff = 0;
      let nextVote: 'up' | 'down' | null = dir;

      if (p.userVote === dir) {
        // Undo vote
        diff = dir === 'up' ? -1 : 1;
        nextVote = null;
      } else if (p.userVote === null) {
        // Fresh vote
        diff = dir === 'up' ? 1 : -1;
      } else {
        // Toggle vote direction
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

  const handleLike = (id: string) => {
    const updated = posts.map((p) => {
      if (p.id !== id) return p;
      const willLike = !p.userLiked;
      return {
        ...p,
        userLiked: willLike,
        likes: p.likes + (willLike ? 1 : -1)
      };
    });
    handleSaveToLocalStorage(updated);
  };

  const handleBookmark = (id: string) => {
    const updated = posts.map((p) => {
      if (p.id !== id) return p;
      return {
        ...p,
        userBookmarked: !p.userBookmarked
      };
    });
    handleSaveToLocalStorage(updated);
  };

  const handleDeletePost = (id: string) => {
    const filtered = posts.filter((p) => p.id !== id);
    handleSaveToLocalStorage(filtered);
  };

  const handleAddComment = (postId: string) => {
    const commentText = commentTextState[postId] || '';
    if (!commentText.trim()) return;

    const newComment: ForumComment = {
      id: `comment-${Date.now()}`,
      author: userInfo.name,
      role: role === 'student' ? 'Student Scholar' : 'Research Fellow',
      avatarColor: userInfo.avatarColor || '#4CAF50',
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
    setCommentTextState({
      ...commentTextState,
      [postId]: ''
    });
  };

  // Sort and filter logic
  const filteredPosts = posts
    .filter((p) => {
      if (activeCommunity === 'all') return true;
      return p.community === activeCommunity;
    })
    .sort((a, b) => {
      if (activeSort === 'new') return 0; // Pre-loaded orders retain order or timestamp
      if (activeSort === 'top') return b.upvotes - a.upvotes;
      return (b.upvotes + b.likes) - (a.upvotes + a.likes); // Hot calculated by aggregate engagement
    });

  const COMMUNITIES = [
    { name: 'all', label: 'All Feeds', icon: Rss, color: 'text-indigo-500' },
    { name: 'r/CellularReprogramming', label: 'Cellular Reprogramming', icon: Network, color: 'text-amber-500' },
    { name: 'r/NeurogenesisHub', label: 'Neurogenesis Hub', icon: Sparkles, color: 'text-rose-500' },
    { name: 'r/PaloAltoRotations', label: 'Palo Alto Rotations', icon: MapPin, color: 'text-emerald-500' },
    { name: 'r/Metascience', label: 'Metascience Inquiry', icon: PenTool, color: 'text-sky-500' },
    { name: 'r/AiBiology', label: 'AI + Biology', icon: Globe, color: 'text-teal-500' }
  ];

  const POPULAR_TAGS = ['#neuroscience', '#spatial-biology', '#rotations', '#cell-repro', '#quantum', '#learning-loops', '#metascience'];

  return (
    <div className="flex flex-col h-full bg-slate-100 overflow-hidden font-sans text-slate-800" id="forum-feed-module">
      
      {/* Dynamic professional forum banner */}
      <div className="bg-white border-b border-slate-200 px-6 py-4.5 flex flex-col md:flex-row md:items-center md:justify-between shrink-0" id="forum-banner">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5.5 h-5.5 text-indigo-600" />
            <span>Academic Forum & LinkedIn Feed</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Discuss spatial transcriptomics, coordinate rotation research logs, and rate global peers
          </p>
        </div>
        <div className="flex items-center gap-2 mt-3 md:mt-0 bg-slate-50 border border-slate-200 p-1.5 rounded-lg">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] text-slate-700 font-bold">142 Intellectuals active online to-date</span>
        </div>
      </div>

      {/* Grid container: Left channels sidebar, center feed stream, right widgets rail */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-0">
        
        {/* Left column: Communities and persona card */}
        <div className="hidden lg:col-span-3 border-r border-slate-200 bg-white p-5 space-y-6 overflow-y-auto" id="forum-left-sidebar">
          {/* User network statistics card */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white tracking-widest text-sm" style={{ backgroundColor: userInfo.avatarColor }}>
                {userInfo.name.split(' ').map(n=>n[0]).join('')}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-slate-900 truncate">{userInfo.name}</h4>
                <p className="text-[10px] text-slate-500 font-mono capitalize tracking-wide">{role} Advisor</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center border-t border-slate-100 pt-3 select-none">
              <div className="bg-white border border-slate-200 rounded-lg p-2">
                <span className="text-xs font-black text-slate-800 font-mono">248</span>
                <p className="text-[8px] font-mono tracking-widest text-slate-400 uppercase">Peers connected</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-2">
                <span className="text-xs font-black text-indigo-600 font-mono">18</span>
                <p className="text-[8px] font-mono tracking-widest text-slate-400 uppercase">Draft log files</p>
              </div>
            </div>
          </div>

          {/* Communities/Subreddits */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Inquiry Communities</h3>
            <div className="space-y-0.5">
              {COMMUNITIES.map((c) => {
                const isActive = activeCommunity === c.name;
                const Icon = c.icon;
                return (
                  <button
                    key={c.name}
                    onClick={() => setActiveCommunity(c.name)}
                    className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
                      isActive 
                        ? 'bg-slate-900 text-white font-bold' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : c.color}`} />
                    <span className="truncate">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-150 pt-5 space-y-2">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Trending Outlets</h3>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {POPULAR_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setNewTag(tag)}
                  className="text-[9.5px] font-mono font-extrabold bg-slate-50 border border-slate-200 hover:border-indigo-300 text-slate-600 px-2 py-1 rounded transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center column: Feed streamer / composer */}
        <div className="col-span-1 lg:col-span-6 bg-slate-100 flex flex-col overflow-y-auto p-4 md:p-6 space-y-4" id="forum-feed-stream">
          
          {/* Post composer panel (LinkedIn card format with fields) */}
          <form onSubmit={handleCreatePost} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3.5 hover:border-slate-300 transition duration-150">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <PenTool className="w-4 h-4 text-indigo-600" />
              <legend className="text-xs font-bold uppercase tracking-wider text-slate-800">Share research updates & deep questions</legend>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                value={newCommunity}
                onChange={(e) => setNewCommunity(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700"
              >
                {COMMUNITIES.filter(c=>c.name!=='all').map((c) => (
                  <option key={c.name} value={c.name}>{c.label}</option>
                ))}
              </select>

              <select
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 font-mono"
              >
                {POPULAR_TAGS.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>

              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 select-none">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] text-slate-600 font-semibold truncate">To: All Centers</span>
              </div>
            </div>

            <input
              type="text"
              placeholder="Thesis title / inquiry topic..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
            />

            <textarea
              placeholder="Frame your background logic, attach your datasets, or ask for peer critique..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition leading-relaxed font-sans"
            />

            <div className="flex justify-between items-center pt-1">
              <span className="text-[10px] text-slate-400 font-mono">Compose limits: 2k chars</span>
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-1.5 rounded-lg cursor-pointer transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Publish Post</span>
              </button>
            </div>
          </form>

          {/* Sort Controller bar */}
          <div className="flex items-center justify-between border-t border-slate-200/60 pt-2 shrink-0">
            <span className="text-[11px] font-mono font-bold tracking-wider text-slate-500 capitalize">
              Viewing {activeCommunity === 'all' ? 'Universal Feed' : activeCommunity}
            </span>
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
              {(['hot', 'top', 'new'] as const).map((srt) => (
                <button
                  key={srt}
                  onClick={() => setActiveSort(srt)}
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded transition select-none ${
                    activeSort === srt 
                      ? 'bg-slate-100 text-slate-800 font-extrabold' 
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {srt}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Stream Card list */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
                <MessageSquare className="w-10 h-10 mx-auto text-slate-350 mb-3" />
                <p className="text-xs font-bold">No academic updates found in this category.</p>
              </div>
            ) : (
              filteredPosts.map((post) => {
                const commentCount = post.comments.length;
                const isOp = post.authorName === userInfo.name;
                return (
                  <article key={post.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition duration-200 space-y-4">
                    {/* LinkedIn Style post header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white tracking-widest text-sm shrink-0" style={{ backgroundColor: post.avatarColor }}>
                          {post.authorName.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-slate-900 hover:underline cursor-pointer">{post.authorName}</span>
                            <span className="text-[9px] bg-slate-100 border border-slate-200 text-slate-500 px-1.5 py-0.2 rounded font-mono font-extrabold uppercase">
                              {post.community}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-tight">
                            {post.authorRole} • <span className="font-mono text-[9px] font-bold text-indigo-700">{post.authorCenter}</span>
                          </p>
                          <div className="flex items-center gap-1 text-[9px] text-slate-400">
                            <Clock className="w-3 h-3 text-slate-350" />
                            <span>{post.timestamp}</span>
                          </div>
                        </div>
                      </div>

                      {isOp && (
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="text-slate-400 hover:text-red-650 p-1 transition cursor-pointer"
                          title="Delete academic update"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-black text-slate-900 leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-xs font-medium text-slate-600 leading-relaxed whitespace-pre-line font-sans">
                        {post.content}
                      </p>
                      <span className="inline-block text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-sm">
                        {post.tag}
                      </span>
                    </div>

                    {/* Reddit Style vote toolbar + LinkedIn interactions hybrid */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 select-none">
                      
                      {/* Reddit Arrows */}
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg">
                        <button
                          onClick={() => handleVote(post.id, 'up')}
                          className={`p-1.5 hover:bg-slate-100 rounded-l-lg transition cursor-pointer ${post.userVote === 'up' ? 'text-orange-600 bg-orange-50' : 'text-slate-400'}`}
                          title="Upvote logic"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-mono font-bold px-2 text-slate-700">{post.upvotes}</span>
                        <button
                          onClick={() => handleVote(post.id, 'down')}
                          className={`p-1.5 hover:bg-slate-100 rounded-r-lg transition cursor-pointer ${post.userVote === 'down' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}
                          title="Downvote logic"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>

                      {/* LinkedIn Like + Comment Counts */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                            post.userLiked 
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-extrabold' 
                              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${post.userLiked ? 'fill-emerald-500 text-emerald-600' : 'text-slate-400'}`} />
                          <span>{post.likes} Applause</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id);
                          }}
                          className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                            activeCommentPostId === post.id
                              ? 'bg-slate-900 border-slate-900 text-white'
                              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                          <span>{commentCount} Reply</span>
                        </button>

                        <button
                          onClick={() => handleBookmark(post.id)}
                          className={`p-1.5 border border-slate-200 bg-white rounded-lg transition hover:bg-slate-50 cursor-pointer ${
                            post.userBookmarked ? 'text-orange-600 bg-orange-50 border-orange-200' : 'text-slate-400 hover:text-slate-700'
                          }`}
                          title="Bookmark update"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>

                    {/* Expandable replies list */}
                    {activeCommentPostId === post.id && (
                      <div className="mt-2.5 pt-4 border-t border-slate-100 space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-150">
                        <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">Intellectual Discussions</h4>
                        
                        {/* Nested comments */}
                        {post.comments.length > 0 && (
                          <div className="space-y-3.5">
                            {post.comments.map((comment) => (
                              <div key={comment.id} className="flex gap-2.5 items-start text-xs border-l-2 border-indigo-100 pl-3.5">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-white tracking-widest text-[9px] shrink-0" style={{ backgroundColor: comment.avatarColor }}>
                                  {comment.author[0]}
                                </div>
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-extrabold text-slate-900">{comment.author}</span>
                                    <span className="text-[8.5px] text-indigo-700 font-mono font-medium">{comment.role}</span>
                                    <span className="text-[8.5px] text-slate-400">• {comment.timestamp}</span>
                                  </div>
                                  <p className="text-slate-600 font-sans leading-relaxed text-[11px]">
                                    {comment.content}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Leave a reply input */}
                        <div className="flex items-center gap-2 pt-2">
                          <input
                            type="text"
                            placeholder="Contrubute your argument or request reference logs..."
                            value={commentTextState[post.id] || ''}
                            onChange={(e) => setCommentTextState({
                              ...commentTextState,
                              [post.id]: e.target.value
                            })}
                            className="flex-1 bg-white border border-slate-250 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddComment(post.id);
                            }}
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg cursor-pointer"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    )}

                  </article>
                );
              })
            )}
          </div>
        </div>

        {/* Right column: Rotating schedule opportunities & regional news */}
        <div className="hidden lg:col-span-3 border-l border-slate-200 bg-white p-5 space-y-6 overflow-y-auto" id="forum-right-sidebar">
          {/* Active Rotational program status */}
          <div className="space-y-3.5">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
              <span>Rotation Live Wire</span>
            </h3>

            <div className="border border-indigo-120 bg-indigo-50/15 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-start text-xs">
                <strong className="font-extrabold text-[#EA580C]">Arc Palo Alto Hub</strong>
                <span className="text-[8.5px] font-mono bg-emerald-100 text-emerald-800 font-bold px-1.5 rounded-full">ACTIVE</span>
              </div>
              <p className="text-[10.5px] text-slate-500 leading-relaxed font-sans">
                Next rotation slot schedules published. Opening <strong> cellular lab sequence assays</strong> under Evelyn Sterling's direct supervision.
              </p>
              <div className="text-[9.5px] text-indigo-700 font-bold hover:underline cursor-pointer flex items-center gap-1">
                <span>Request placement checklist</span>
                <span>→</span>
              </div>
            </div>
          </div>

          {/* Regional announcements panel */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Global Center Updates</h3>
            <div className="space-y-4 divide-y divide-slate-100">
              <div className="space-y-1 block pt-3 first:pt-0">
                <span className="text-[9px] font-bold text-slate-400 font-mono tracking-wider">Tokyo Shibuya Lab • 8h ago</span>
                <h5 className="text-xs font-black text-slate-800 leading-tight">Longevity cellular reprogram sequencer successfully booted</h5>
                <p className="text-[10px] text-slate-500">Completed 1,200 microfluidics assays inside Palo Alto database synchronization registry.</p>
              </div>

              <div className="space-y-1 block pt-3">
                <span className="text-[9px] font-bold text-slate-400 font-mono tracking-wider">Sydney CSIRO Marine • Yesterday</span>
                <h5 className="text-xs font-black text-slate-800 leading-tight">Cloned coral genomics database mapping complete</h5>
                <p className="text-[10px] text-slate-500">Sydney rotation scholars isolated 14 temperature-resilient gene chains matching high-contrast modeling.</p>
              </div>
            </div>
          </div>

          {/* Forum moderation status */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 space-y-1">
            <span className="text-[9px] font-mono tracking-wider uppercase font-bold text-slate-700 block">System Moderator Core</span>
            <p className="text-[10px] leading-relaxed">
              Artemis Academic forum has strict peer check guidelines. Keep comments descriptive, construct-oriented, and cite outcome anchors where feasible.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
