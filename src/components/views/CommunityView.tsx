import React, { useState } from 'react';
import { UserProfile, CommunityPost, LeaderboardUser } from '../../types';
import { sendCommunityInteractionPush } from '../../services/fcmService';
import {
  Users,
  Trophy,
  Heart,
  MessageSquare,
  Share2,
  Send,
  Flame,
  Award,
  Sparkles,
  Plus,
  User,
} from 'lucide-react';

interface CommunityViewProps {
  user: UserProfile;
  posts: CommunityPost[];
  leaderboard: LeaderboardUser[];
  onAddPost: (content: string) => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  user,
  posts,
  leaderboard,
  onAddPost,
  onLikePost,
  onAddComment,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'feed' | 'leaderboard'>('feed');
  const [newPostContent, setNewPostContent] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [leaderboardFilter, setLeaderboardFilter] = useState<'daily' | 'weekly' | 'alltime'>('weekly');

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    onAddPost(newPostContent);
    setNewPostContent('');
  };

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    onAddComment(postId, text);
    
    // Dispatch FCM Push notification for Community comment
    const post = posts.find((p) => p.id === postId);
    sendCommunityInteractionPush(
      user.name || 'An Athlete',
      `commented: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`,
      post?.workoutTitle || post?.userName
    );

    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-emerald-400" />
            Moventra Community & Leaderboard
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Share workout milestones, support fellow athletes, and climb global rankings.
          </p>
        </div>

        {/* Sub Navigation */}
        <div className="flex bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800">
          <button
            onClick={() => setActiveSubTab('feed')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSubTab === 'feed' ? 'bg-emerald-500 text-black shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Activity Feed
          </button>
          <button
            onClick={() => setActiveSubTab('leaderboard')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSubTab === 'leaderboard' ? 'bg-emerald-500 text-black shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Leaderboard
          </button>
        </div>
      </div>

      {activeSubTab === 'feed' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post Box */}
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl shadow-xl">
              <div className="flex gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share your workout accomplishment, PR, or workout tip with the community..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none h-20 placeholder-zinc-500"
                />
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
                <span className="text-xs text-zinc-500">Posting as <strong>{user.name}</strong></span>
                <button
                  onClick={handlePostSubmit}
                  disabled={!newPostContent.trim()}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-black font-extrabold text-xs hover:opacity-90 transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
                >
                  Post Achievement
                </button>
              </div>
            </div>

            {/* Community Feed Posts */}
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl">
                  {/* Post Author */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-emerald-400 shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{post.userName}</h4>
                        <span className="text-[11px] text-zinc-400">{post.timestamp}</span>
                      </div>
                    </div>

                    {post.workoutTitle && (
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {post.workoutTitle}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-zinc-200 mb-4 leading-relaxed">{post.content}</p>

                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt="Post visual"
                      className="w-full h-64 object-cover rounded-2xl mb-4 border border-zinc-800"
                    />
                  )}

                  {/* Like & Comment Bar */}
                  <div className="flex items-center gap-6 py-2 border-t border-b border-zinc-800 text-xs text-zinc-400">
                    <button
                      onClick={() => {
                        onLikePost(post.id);
                        if (!post.isLiked) {
                          sendCommunityInteractionPush(user.name || 'An Athlete', 'liked your fitness update', post.workoutTitle || post.content.substring(0, 20));
                        }
                      }}
                      className={`flex items-center gap-1.5 font-bold transition-colors ${
                        post.isLiked ? 'text-rose-500' : 'hover:text-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-500' : ''}`} />
                      <span>{post.likes} Likes</span>
                    </button>

                    <div className="flex items-center gap-1.5 font-bold">
                      <MessageSquare className="w-4 h-4 text-emerald-400" />
                      <span>{post.comments.length} Comments</span>
                    </div>
                  </div>

                  {/* Comments List */}
                  {post.comments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {post.comments.map((c) => (
                        <div key={c.id} className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex items-start gap-2.5 text-xs">
                          <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-emerald-400 shrink-0">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1">
                            <span className="font-bold text-white mr-2">{c.userName}:</span>
                            <span className="text-zinc-300">{c.text}</span>
                            <span className="text-[10px] text-zinc-500 block mt-0.5">{c.timestamp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment Input */}
                  <form onSubmit={(e) => handleCommentSubmit(post.id, e)} className="mt-3 flex items-center gap-2">
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      placeholder="Write a supportive comment..."
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard Quick Widget Column */}
          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  Leaderboard Preview
                </h3>
                <button
                  onClick={() => setActiveSubTab('leaderboard')}
                  className="text-xs text-emerald-400 font-bold hover:underline"
                >
                  View Full
                </button>
              </div>

              <div className="space-y-3">
                {leaderboard.slice(0, 5).map((userRank) => (
                  <div
                    key={userRank.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                      userRank.id === user.id
                        ? 'bg-emerald-950/80 border-emerald-500/50'
                        : 'bg-zinc-950 border-zinc-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                        userRank.rank === 1 ? 'bg-amber-400 text-black' : userRank.rank === 2 ? 'bg-zinc-300 text-black' : userRank.rank === 3 ? 'bg-amber-700 text-white' : 'text-zinc-500'
                      }`}>
                        {userRank.rank}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-emerald-400 shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs">{userRank.name}</h4>
                        <span className="text-[10px] text-zinc-400">{userRank.badge}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-black text-emerald-400">{userRank.score} pts</div>
                      <div className="text-[10px] text-amber-400 font-bold">🔥 {userRank.streakDays}d</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'leaderboard' && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-xl max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-black text-white flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-400" />
                Global Fitness Leaderboard
              </h3>
              <p className="text-xs text-zinc-400">Compete with athletes globally for top workout points & streaks.</p>
            </div>

            <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800">
              {(['daily', 'weekly', 'alltime'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setLeaderboardFilter(filter)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${
                    leaderboardFilter === filter ? 'bg-emerald-500 text-black' : 'text-zinc-400'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {leaderboard.map((usr) => (
              <div
                key={usr.id}
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  usr.id === user.id
                    ? 'bg-emerald-950/80 border-emerald-500 shadow-lg shadow-emerald-500/10'
                    : 'bg-zinc-950 border-zinc-800'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm ${
                    usr.rank === 1 ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-black' : usr.rank === 2 ? 'bg-zinc-300 text-black' : usr.rank === 3 ? 'bg-amber-700 text-white' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    #{usr.rank}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-emerald-400 shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{usr.name}</h4>
                    <span className="text-xs text-emerald-400">{usr.badge}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-black text-white">{usr.score} XP</div>
                  <div className="text-xs text-amber-400 font-bold flex items-center gap-1 justify-end">
                    <Flame className="w-3.5 h-3.5 fill-amber-400" />
                    {usr.streakDays} Days Streak
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
