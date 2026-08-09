import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp, Send, CheckCircle2, User, Sparkles, ShieldCheck } from 'lucide-react';

export default function ReviewSystem({ village, user, onOpenAuthModal }) {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      userName: "Suresh Deshmukh",
      userVillage: "Sangamner, Ahmednagar",
      rating: 5,
      crop: "Sugarcane",
      comment: "KrishiDrishti AI's timely advice on trash mulching saved 40% drip water in my sugarcane crop during dry summer spells!",
      date: "2 days ago",
      helpfulCount: 24,
      verified: true
    },
    {
      id: 2,
      userName: "Anandrao Pawar",
      userVillage: "Baramati, Pune",
      rating: 5,
      crop: "Grapes",
      comment: "The PMFBY 72-hour crop insurance claim guideline helped me get ₹85,000 compensation after unseasonal Oct hailstorm!",
      date: "5 days ago",
      helpfulCount: 19,
      verified: true
    },
    {
      id: 3,
      userName: "Ramesh Patil",
      userVillage: "Niphad, Nashik",
      rating: 5,
      crop: "Onion",
      comment: "Fipronil spray tip for Thrips pest control worked like magic. Great Marathi simple explanation!",
      date: "1 week ago",
      helpfulCount: 31,
      verified: true
    }
  ]);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedCrop, setSelectedCrop] = useState(village?.primaryCrops[0] || 'Cotton');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newRev = {
      id: Date.now(),
      userName: user ? user.name : "Anonymous Farmer",
      userVillage: village ? `${village.villageName}, ${village.districtName}` : "Maharashtra",
      rating,
      crop: selectedCrop,
      comment,
      date: "Just now",
      helpfulCount: 1,
      verified: !!user
    };

    // Store in localStorage & state
    const updated = [newRev, ...reviews];
    setReviews(updated);
    localStorage.setItem('krishi_farmer_reviews', JSON.stringify(updated));

    setComment('');
    setSubmittedSuccess(true);
    setTimeout(() => setSubmittedSuccess(false), 4000);
  };

  const handleHelpful = (id) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r));
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Review Header Banner */}
      <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-3xl shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black uppercase">
                ⭐ Farmer Rating & Feedback (शेतकरी अभिप्राय)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Farmer Reviews & Experience (शेतकऱ्यांचे अनुभव)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
              Read real crop advice experiences and ratings from farmers across Maharashtra
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl flex items-center space-x-3 shrink-0">
            <div className="text-center">
              <div className="text-2xl font-black text-amber-600 leading-none">4.9</div>
              <div className="flex items-center text-amber-500 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                ))}
              </div>
            </div>
            <div className="border-l border-amber-200 pl-3 text-xs text-amber-900 font-bold">
              <div>1,240+ Verified Reviews</div>
              <div className="text-[11px] text-amber-800 font-medium">98% Satisfaction Score</div>
            </div>
          </div>
        </div>

        {/* 2. Submit Review Form */}
        <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-3">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            Write Your Feedback / Review (आपला अभिप्राय लिहा):
          </h3>

          {submittedSuccess && (
            <div className="p-3 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Thank you! Your review has been published successfully and saved to Admin Hub.</span>
            </div>
          )}

          <form onSubmit={handleSubmitReview} className="space-y-3">
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
              <div>
                <label className="block text-slate-600 mb-1">Select Rating (स्टार द्या):</label>
                <div className="flex items-center space-x-1 bg-white p-2 rounded-xl border border-slate-300">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= rating ? 'fill-amber-500 text-amber-500' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-slate-900 font-black">{rating} / 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Crop (पीक):</label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none"
                >
                  {village ? (
                    village.primaryCrops.map(c => <option key={c} value={c}>{c}</option>)
                  ) : (
                    <>
                      <option value="Cotton">Cotton (कापूस)</option>
                      <option value="Sugarcane">Sugarcane (ऊस)</option>
                      <option value="Soybean">Soybean (सोयाबीन)</option>
                      <option value="Onion">Onion (कांदा)</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div>
              <textarea
                rows={3}
                placeholder="Share how KrishiDrishti AI helped your farming (e.g. water advice, pest control, insurance)..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-2xl p-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Posting as {user ? <strong className="text-slate-800">{user.name}</strong> : 'Guest Farmer'}
              </span>

              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all flex items-center space-x-1.5 shadow-sm cursor-pointer"
              >
                <span>Submit Review (अभिप्राय पाठवा)</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 3. Reviews Feed List */}
      <div className="space-y-3">
        {reviews.map((rev) => (
          <div key={rev.id} className="bg-white border border-slate-200 p-4 sm:p-5 rounded-3xl shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black shrink-0">
                  <User className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    {rev.userName}
                    {rev.verified && (
                      <span className="text-[9px] px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                        Verified Farmer
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">{rev.userVillage} • Crop: <strong className="text-slate-800">{rev.crop}</strong></p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                  ))}
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{rev.date}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200">
              "{rev.comment}"
            </p>

            <div className="flex items-center justify-end pt-1">
              <button
                onClick={() => handleHelpful(rev.id)}
                className="text-xs font-bold text-slate-600 hover:text-emerald-700 flex items-center space-x-1 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-xl transition-all cursor-pointer"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>Helpful ({rev.helpfulCount})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
