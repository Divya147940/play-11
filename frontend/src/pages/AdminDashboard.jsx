import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, BookOpen, Trophy, 
  Settings, LayoutDashboard, PlusCircle, 
  AlertCircle, ChevronRight, Search, 
  MoreVertical, CheckCircle2, Clock,
  ArrowUpRight, ArrowDownRight, Globe, Lock, Unlock, Edit, Trash2, Shield, Upload,
  Plus, Save, Trash, Award, FileText, Image as ImageIcon, Loader2
} from 'lucide-react';
import Papa from 'papaparse';
import Tesseract from 'tesseract.js';
import { settingsService } from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(false);
  const [statsData, setStatsData] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [serverTime, setServerTime] = useState(new Date());
  const [isParsing, setIsParsing] = useState(false);
  const [parseProgress, setParseProgress] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [homeBannerUrl, setHomeBannerUrl] = useState('');
  const [quizRoomBannerUrl, setQuizRoomBannerUrl] = useState('');
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);

  // Keep server time updated
  useEffect(() => {
    const timer = setInterval(() => setServerTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Create Quiz Form State
  const defaultQuestions = Array.from({ length: 10 }, () => ({
    text: '',
    hindiText: '',
    options: Array.from({ length: 4 }, () => ({ text: '', hindiText: '' })),
    correctOptionIndex: 0
  }));

  const [newQuiz, setNewQuiz] = useState(() => {
    const saved = localStorage.getItem('play11_quiz_draft');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse quiz draft", e);
      }
    }
    return {
      title: '',
      hindiTitle: '',
      description: '',
      hindiDescription: '',
      zone_id: 'study-zone',
      category_id: 'cat-1',
      match_id: '',
      total_questions: 10,
      timer_minutes: 8,
      entry_amount: 10,
      open_at: '',
      close_at: '',
      prize_amount: 0,
      banner_url: '',
      questions: defaultQuestions
    };
  });
  const [matches, setMatches] = useState([]);

  // Auto-save draft
  useEffect(() => {
    localStorage.setItem('play11_quiz_draft', JSON.stringify(newQuiz));
  }, [newQuiz]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('play11_admin_session');
      const statsRes = await fetch('/api/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (statsRes.status === 401) {
        localStorage.removeItem('play11_admin_session');
        window.location.href = '/admin/login';
        return;
      }
      const stats = await statsRes.json();
      if (stats.success) setStatsData(stats.stats);

      if (activeTab === 'Users') {
        const usersRes = await fetch('/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (usersRes.status === 401) {
          window.location.href = '/admin/login';
          return;
        }
        const users = await usersRes.json();
        if (users.success) setAllUsers(users.users);
      }

      if (activeTab === 'Quizzes' || activeTab === 'Create Quiz') {
        const quizRes = await fetch('/api/admin/quizzes/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (quizRes.status === 401) {
          window.location.href = '/admin/login';
          return;
        }
        const qData = await quizRes.json();
        if (qData.success) setQuizzes(qData.quizzes);

        const catRes = await fetch('/api/categories/all');
        const catData = await catRes.json();
        if (catData.success) setCategories(catData.categories);

        const matchRes = await fetch('/api/matches');
        const matchData = await matchRes.json();
        if (matchData.success) setMatches(matchData.matches || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (activeTab === 'Settings' || activeTab === 'Banners') {
      fetchSettings();
    }
  }, [activeTab]);

  const fetchSettings = async () => {
    try {
      const homeData = await settingsService.getSetting('home_banner_url');
      if (homeData.success) {
        setHomeBannerUrl(homeData.value);
      }
      const quizRoomData = await settingsService.getSetting('quiz_room_banner_url');
      if (quizRoomData.success) {
        setQuizRoomBannerUrl(quizRoomData.value);
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  };

  const handleUpdateSetting = async (key, value) => {
    setIsUpdatingSettings(true);
    let finalValue = value;

    // Auto-extract direct link if it's a Google Images search link
    if (value && value.includes('google.com/imgres')) {
      try {
        const urlParams = new URLSearchParams(value.split('?')[1]);
        const extracted = urlParams.get('imgurl');
        if (extracted) {
          finalValue = decodeURIComponent(extracted);
          // Also update the local state so the user sees the change
          if (key === 'home_banner_url') setHomeBannerUrl(finalValue);
          if (key === 'quiz_room_banner_url') setQuizRoomBannerUrl(finalValue);
        }
      } catch (err) {
        console.warn('Failed to extract Google Image URL:', err);
      }
    }

    try {
      const data = await settingsService.updateSetting(key, finalValue);
      if (data.success) {
        alert(`${key.replace(/_/g, ' ')} updated successfully!`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update setting');
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('play11_admin_session');
      const quizData = {
        ...newQuiz,
        open_at: new Date(newQuiz.open_at).toISOString(),
        close_at: new Date(newQuiz.close_at).toISOString()
      };
      
      const url = isEditing ? `/api/admin/quizzes/${editId}` : '/api/admin/quizzes';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(quizData)
      });
      
      if (res.status === 401) {
        alert('Your session has expired. Please login again.');
        window.location.href = '/admin/login';
        return;
      }
      const data = await res.json();
      if (data.success) {
        alert(isEditing ? 'Quiz updated successfully!' : 'Quiz created successfully!');
        localStorage.removeItem('play11_quiz_draft'); // Clear draft on success
        resetForm();
        setActiveTab('Quizzes');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setNewQuiz({
      title: '',
      hindiTitle: '',
      description: '',
      hindiDescription: '',
      zone_id: 'study-zone',
      category_id: 'cat-1',
      match_id: '',
      total_questions: 10,
      timer_minutes: 8,
      entry_amount: 10,
      open_at: '',
      close_at: '',
      banner_url: '',
      questions: Array.from({ length: 10 }, () => ({
        text: '',
        hindiText: '',
        options: Array.from({ length: 4 }, () => ({ text: '', hindiText: '' })),
        correctOptionIndex: 0
      }))
    });
  };

  const fetchParticipants = async (quizId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('play11_admin_session');
      const res = await fetch(`/api/admin/quizzes/${quizId}/participants`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setParticipants(data.participants);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeclareWinner = async (quizId, userId) => {
    if (!window.confirm('Declare this user as the winner?')) return;
    try {
      const token = localStorage.getItem('play11_admin_session');
      const res = await fetch(`/api/admin/quizzes/${quizId}/declare-winner`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ winner_id: userId })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || 'Winner declared!');
        fetchData(); // Refresh list
        setSelectedQuiz(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSubmissionReview = async (submissionId) => {
    setReviewLoading(true);
    setShowReviewModal(true);
    try {
      const token = localStorage.getItem('play11_admin_session');
      const res = await fetch(`/api/admin/submissions/${submissionId}/review`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setReviewData(data);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to load review data');
    } finally {
      setReviewLoading(false);
    }
  };
  
  const handleDeleteQuiz = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) return;
    try {
      const token = localStorage.getItem('play11_admin_session');
      const res = await fetch(`/api/admin/quizzes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        alert('Quiz deleted successfully');
        fetchData(); // Refresh the list
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete quiz');
    }
  };

  const handleEditQuiz = async (quiz) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('play11_admin_session');
      // Fetch questions
      const res = await fetch(`/api/admin/quizzes/${quiz.id}/questions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        const questions = data.questions.map(q => ({
          text: q.question_text,
          hindiText: q.hindi_question_text || '',
          options: q.options.map(o => ({ text: o.text, hindiText: o.hindiText || '' })),
          correctOptionIndex: parseInt(q.correct_answer) || 0
        }));

        setNewQuiz({
          title: quiz.title,
          hindiTitle: quiz.hindi_title || '',
          description: quiz.description || '',
          hindiDescription: quiz.hindi_description || '',
          zone_id: quiz.zone_id,
          category_id: quiz.category_id,
          match_id: quiz.match_id || '',
          total_questions: questions.length,
          timer_minutes: quiz.timer_minutes,
          entry_amount: quiz.entry_amount,
          open_at: new Date(quiz.open_at).toISOString().slice(0, 16),
          close_at: new Date(quiz.close_at).toISOString().slice(0, 16),
          banner_url: quiz.banner_url || '',
          prize_amount: quiz.prize_amount || 0,
          questions: questions
        });
        setIsEditing(true);
        setEditId(quiz.id);
        setActiveTab('Create Quiz');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to load quiz details');
    } finally {
      setLoading(false);
    }
  };

  const autoTransliterate = async (text, toLang) => {
    if (toLang !== 'hi') return null;
    try {
      const res = await fetch(`https://inputtools.google.com/request?text=${encodeURIComponent(text)}&itc=hi-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8&app=test`);
      const data = await res.json();
      if (data[0] === 'SUCCESS') {
        return data[1][0][1][0];
      }
    } catch (err) {
      console.error('Transliteration error:', err);
    }
    return null;
  };

  const autoTranslate = async (text, fromLang, toLang) => {
    if (!text || text.trim().length < 1) return null;
    const isShort = text.trim().split(/\s+/).length <= 2;

    try {
      // For short words/names, try transliteration first if going to Hindi
      if (toLang === 'hi' && isShort) {
        const transliterated = await autoTransliterate(text, 'hi');
        if (transliterated) return transliterated;
      }

      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`);
      const data = await res.json();
      let result = data.responseData.translatedText;

      // Fallback to transliteration if translation returns English characters for Hindi
      if (toLang === 'hi' && result && /^[a-zA-Z\s.,!?]+$/.test(result)) {
        const transliterated = await autoTransliterate(text, 'hi');
        if (transliterated) result = transliterated;
      }

      if (result) return result;
    } catch (err) {
      console.error('Translation error:', err);
    }
    return null;
  };

  const handleTranslate = async (index, type, optIndex = null, fromLang, toLang, value, force = false) => {
    if (!value) return;
    
    // Check if target is already filled (skip if not forced)
    const qs = [...newQuiz.questions];
    if (!force) {
      if (type === 'question') {
        const target = toLang === 'hi' ? qs[index].hindiText : qs[index].text;
        if (target) return; 
      } else if (type === 'option') {
        const target = toLang === 'hi' ? qs[index].options[optIndex].hindiText : qs[index].options[optIndex].text;
        if (target) return;
      } else if (type === 'title') {
        const target = toLang === 'hi' ? newQuiz.hindiTitle : newQuiz.title;
        if (target) return;
      } else if (type === 'description') {
        const target = toLang === 'hi' ? newQuiz.hindiDescription : newQuiz.description;
        if (target) return;
      }
    }

    const translated = await autoTranslate(value, fromLang, toLang);
    if (translated) {
      if (type === 'question') {
        if (toLang === 'hi') qs[index].hindiText = translated;
        else qs[index].text = translated;
      } else if (type === 'option') {
        if (toLang === 'hi') qs[index].options[optIndex].hindiText = translated;
        else qs[index].options[optIndex].text = translated;
      } else if (type === 'title') {
        setNewQuiz(prev => ({ ...prev, [toLang === 'hi' ? 'hindiTitle' : 'title']: translated }));
        return;
      } else if (type === 'description') {
        setNewQuiz(prev => ({ ...prev, [toLang === 'hi' ? 'hindiDescription' : 'description']: translated }));
        return;
      }
    setNewQuiz({ ...newQuiz, questions: qs });
    }
  };

  const addQuestion = () => {
    setNewQuiz(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          text: '',
          hindiText: '',
          options: Array.from({ length: 4 }, () => ({ text: '', hindiText: '' })),
          correctOptionIndex: 0
        }
      ],
      total_questions: prev.questions.length + 1
    }));
  };

  const removeQuestion = (idx) => {
    if (newQuiz.questions.length <= 1) return;
    const qs = [...newQuiz.questions];
    qs.splice(idx, 1);
    setNewQuiz({
      ...newQuiz,
      questions: qs,
      total_questions: qs.length
    });
  };

  const handleAutoIngest = async (file) => {
    if (!file) return;
    setIsParsing(true);
    setParseProgress(0);

    const fileExt = file.name.split('.').pop().toLowerCase();
    
    try {
      if (fileExt === 'json') {
        const reader = new FileReader();
        reader.onload = e => {
          const json = JSON.parse(e.target.result);
          setNewQuiz(prev => ({ ...prev, ...json }));
          setActiveTab('Create Quiz');
          setIsParsing(false);
        };
        reader.readAsText(file);
      } 
      else if (fileExt === 'csv') {
        Papa.parse(file, {
          complete: (results) => {
            const questions = results.data.slice(1).map(row => ({
              text: row[0],
              options: [
                { text: row[1], hindiText: '' },
                { text: row[2], hindiText: '' },
                { text: row[3], hindiText: '' },
                { text: row[4], hindiText: '' }
              ],
              correctOptionIndex: parseInt(row[5]) || 0
            })).filter(q => q.text);
            setNewQuiz(prev => ({ ...prev, questions, total_questions: questions.length }));
            setActiveTab('Create Quiz');
            setIsParsing(false);
          }
        });
      }
      else if (fileExt === 'txt') {
        const reader = new FileReader();
        reader.onload = e => {
          const questions = parseTextToQuestions(e.target.result);
          setNewQuiz(prev => ({ ...prev, questions, total_questions: questions.length }));
          setActiveTab('Create Quiz');
          setIsParsing(false);
        };
        reader.readAsText(file);
      }
      else if (['png', 'jpg', 'jpeg'].includes(fileExt)) {
        const result = await Tesseract.recognize(file, 'eng+hin', {
          logger: m => {
            if (m.status === 'recognizing text') setParseProgress(Math.floor(m.progress * 100));
          }
        });
        const questions = parseTextToQuestions(result.data.text);
        setNewQuiz(prev => ({ ...prev, questions, total_questions: questions.length }));
        setActiveTab('Create Quiz');
        setIsParsing(false);
      }
    } catch (err) {
      console.error("Parsing error:", err);
      alert("Failed to parse file: " + err.message);
      setIsParsing(false);
    }
  };

  const parseTextToQuestions = (text) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    const questions = [];
    let currentQ = null;

    lines.forEach(line => {
      // New Question detection (starts with digit or Q:)
      if (/^\d+[\.\)]|Q:/i.test(line)) {
        if (currentQ) questions.push(currentQ);
        currentQ = {
          text: line.replace(/^\d+[\.\)]|Q:/i, '').trim(),
          options: [],
          correctOptionIndex: 0
        };
      } 
      // Option detection (A/B/C/D)
      else if (/^[A-D][\.\)]/i.test(line) && currentQ) {
        currentQ.options.push({ text: line.replace(/^[A-D][\.\)]/i, '').trim(), hindiText: '' });
      }
      // Answer detection
      else if (/Ans:|Answer:/i.test(line) && currentQ) {
        const ans = line.replace(/Ans:|Answer:/i, '').trim().toUpperCase();
        const index = ['A', 'B', 'C', 'D'].indexOf(ans);
        if (index !== -1) currentQ.correctOptionIndex = index;
      }
    });

    if (currentQ) questions.push(currentQ);

    // Normalize options to 4
    return questions.map(q => {
      while (q.options.length < 4) q.options.push({ text: '', hindiText: '' });
      return q;
    });
  };

  const SidebarItem = ({ icon, label }) => (
    <div 
      onClick={() => setActiveTab(label)}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem', 
        padding: '0.85rem 1.25rem', 
        borderRadius: '1rem',
        cursor: 'pointer',
        background: activeTab === label ? 'linear-gradient(90deg, #3b82f6, #2dd4bf)' : 'transparent',
        color: activeTab === label ? 'white' : '#64748b',
        fontWeight: activeTab === label ? '800' : '600',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {React.cloneElement(icon, { size: 20 })} <span>{label}</span>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: '#0f172a' }}>
      {/* Sidebar */}
      <div style={{ width: '280px', background: 'white', borderRight: '1px solid #e2e8f0', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem', padding: '0 0.5rem' }}>
           <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #3b82f6, #2dd4bf)', borderRadius: '12px' }} className="flex-center">
              <Shield size={20} color="white" />
           </div>
           <h2 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Play11 Admin</h2>
        </div>
        <SidebarItem icon={<LayoutDashboard />} label="Overview" />
        <SidebarItem icon={<Upload />} label="Upload Quiz" />
        <SidebarItem icon={<PlusCircle />} label="Create Quiz" />
        <SidebarItem icon={<Trophy />} label="Quizzes" />
        <SidebarItem icon={<ImageIcon />} label="Banners" />
        <SidebarItem icon={<Users />} label="Users" />
        <SidebarItem icon={<Settings />} label="Settings" />
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
           <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>{activeTab}</h1>
           <button 
             onClick={() => {
               localStorage.removeItem('play11_admin_session');
               window.location.href = '/admin/login';
             }}
             style={{ 
               padding: '0.6rem 1.2rem', 
               background: '#fee2e2', 
               color: '#ef4444', 
               border: 'none', 
               borderRadius: '0.75rem', 
               fontWeight: 800,
               cursor: 'pointer'
             }}
           >
             Logout
           </button>
        </div>

        {activeTab === 'Overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
             <div className="bento-card-admin" style={{ background: 'white', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Users</p>
                <h3 style={{ fontSize: '2rem', fontWeight: 900 }}>{statsData?.users || 0}</h3>
             </div>
             <div className="bento-card-admin" style={{ background: 'white', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Active Quizzes</p>
                <h3 style={{ fontSize: '2rem', fontWeight: 900 }}>{statsData?.quizzes || 0}</h3>
             </div>
             <div className="bento-card-admin" style={{ background: 'white', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Submissions</p>
                <h3 style={{ fontSize: '2rem', fontWeight: 900 }}>{statsData?.submissions || 0}</h3>
             </div>
          </div>
        )}

        {activeTab === 'Upload Quiz' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* File Upload Section */}
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '48px', height: '48px', background: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Upload size={24} color="#3b82f6" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Bulk Ingestion</h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Upload CSV, TXT, or Image</p>
                </div>
              </div>

              <div 
                style={{ 
                  border: '2px dashed #cbd5e1', 
                  borderRadius: '1rem', 
                  padding: '3rem 2rem', 
                  textAlign: 'center',
                  background: '#f8fafc',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onDragOver={e => e.preventDefault()}
                onDrop={async e => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) handleAutoIngest(file);
                }}
                onClick={() => document.getElementById('bulk-file-input').click()}
              >
                <input 
                  id="bulk-file-input"
                  type="file" 
                  accept=".json,.csv,.txt,.png,.jpg,.jpeg" 
                  onChange={e => handleAutoIngest(e.target.files[0])} 
                  style={{ display: 'none' }} 
                />
                {isParsing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <Loader2 size={40} className="animate-spin" color="#3b82f6" />
                    <p style={{ fontWeight: 800, color: '#1e40af' }}>Parsing Content... {parseProgress}%</p>
                  </div>
                ) : (
                  <>
                    <div style={{ marginBottom: '1rem', color: '#94a3b8' }}>
                      <ImageIcon size={48} style={{ marginBottom: '0.5rem' }} />
                      <p style={{ fontWeight: 700 }}>Click or drag file here</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                       <span style={{ fontSize: '0.7rem', padding: '4px 8px', background: '#e2e8f0', borderRadius: '4px', fontWeight: 800 }}>CSV</span>
                       <span style={{ fontSize: '0.7rem', padding: '4px 8px', background: '#e2e8f0', borderRadius: '4px', fontWeight: 800 }}>TXT</span>
                       <span style={{ fontSize: '0.7rem', padding: '4px 8px', background: '#e2e8f0', borderRadius: '4px', fontWeight: 800 }}>PNG/JPG</span>
                       <span style={{ fontSize: '0.7rem', padding: '4px 8px', background: '#e2e8f0', borderRadius: '4px', fontWeight: 800 }}>JSON</span>
                    </div>
                  </>
                )}
              </div>

              <div style={{ marginTop: '2rem' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 900, color: '#64748b', marginBottom: '1rem', textTransform: 'uppercase' }}>Instructions</h4>
                <ul style={{ fontSize: '0.8rem', color: '#475569', paddingLeft: '1.25rem', display: 'grid', gap: '0.5rem' }}>
                  <li><strong>CSV:</strong> Question, Option A, Option B, Option C, Option D, CorrectIndex(0-3)</li>
                  <li><strong>TXT:</strong> Q: Question Text? A: Opt1, B: Opt2... Ans: A</li>
                  <li><strong>Images:</strong> Clear screenshots of quiz questions work best.</li>
                </ul>
              </div>
            </div>

            {/* Manual Entry Quick Start */}
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
               <div style={{ width: '64px', height: '64px', background: '#f0fdf4', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <PlusCircle size={32} color="#22c55e" />
               </div>
               <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Manual Creation</h3>
               <p style={{ color: '#64748b', marginBottom: '2rem', maxWidth: '300px' }}>Start a fresh quiz from scratch with our intuitive step-by-step builder.</p>
               <button 
                 onClick={() => setActiveTab('Create Quiz')}
                 style={{ 
                   padding: '1rem 2rem', 
                   background: '#22c55e', 
                   color: 'white', 
                   border: 'none', 
                   borderRadius: '1rem', 
                   fontWeight: 800, 
                   cursor: 'pointer',
                   fontSize: '1rem'
                 }}
               >
                 Start Manual Quiz
               </button>
            </div>
          </div>
        )}

        {activeTab === 'Create Quiz' && (
          <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
            {/* Server Time Display */}
            <div style={{ 
              marginBottom: '2rem', 
              padding: '1rem 1.5rem', 
              background: '#eff6ff', 
              borderRadius: '1rem', 
              border: '1px solid #dbeafe',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', width: '100%' }}>
                <div>
                  <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Your Local Time</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1e40af', fontFamily: 'monospace' }}>
                    {serverTime.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>UTC Time (Database Standard)</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: 900, color: '#475569', fontFamily: 'monospace' }}>
                    {serverTime.toUTCString()}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                <p style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>Quizzes are stored in UTC. Your inputs above will be automatically converted to UTC before deployment.</p>
              </div>
            </div>

            <form onSubmit={handleCreateQuiz}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label>QUIZ TITLE (ENGLISH)</label>
                  </div>
                  <input className="admin-input" required value={newQuiz.title} 
                    onChange={e => setNewQuiz({...newQuiz, title: e.target.value})} 
                    onBlur={e => handleTranslate(null, 'title', null, 'en', 'hi', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label>QUIZ TITLE (HINDI)</label>
                  </div>
                  <input className="admin-input" value={newQuiz.hindiTitle} 
                    onChange={e => setNewQuiz({...newQuiz, hindiTitle: e.target.value})} 
                    onBlur={e => handleTranslate(null, 'title', null, 'hi', 'en', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>CATEGORY</label>
                  <select className="admin-input" value={newQuiz.category_id} onChange={e => {
                    const cat = categories.find(c => c.id === e.target.value);
                    setNewQuiz({...newQuiz, category_id: e.target.value, zone_id: cat?.zone_id || 'study-zone'});
                  }}>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} ({cat.zone_id.split('-')[0].toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>TIMER (MINUTES)</label>
                  <input className="admin-input" type="number" value={newQuiz.timer_minutes} onChange={e => setNewQuiz({...newQuiz, timer_minutes: parseInt(e.target.value)})} />
                </div>
                <div className="form-group">
                  <label>ENTRY AMOUNT (₹)</label>
                  <input className="admin-input" type="number" value={newQuiz.entry_amount} onChange={e => setNewQuiz({...newQuiz, entry_amount: parseInt(e.target.value)})} />
                </div>
                <div className="form-group">
                  <label>ASSOCIATED MATCH (OPTIONAL)</label>
                  <select className="admin-input" value={newQuiz.match_id} onChange={e => setNewQuiz({...newQuiz, match_id: e.target.value})}>
                    <option value="">None / Independent Quiz</option>
                    {matches.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.team_a} vs {m.team_b} ({new Date(m.start_time).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>OPEN AT</label>
                  <input className="admin-input" type="datetime-local" required value={newQuiz.open_at} onChange={e => setNewQuiz({...newQuiz, open_at: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>CLOSE AT</label>
                  <input className="admin-input" type="datetime-local" required value={newQuiz.close_at} onChange={e => setNewQuiz({...newQuiz, close_at: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>PRIZE AMOUNT (₹)</label>
                  <input className="admin-input" type="number" value={newQuiz.prize_amount} onChange={e => setNewQuiz({...newQuiz, prize_amount: parseInt(e.target.value)})} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label>DESCRIPTION (ENGLISH)</label>
                  </div>
                  <textarea className="admin-input" style={{ minHeight: '80px' }} value={newQuiz.description} 
                    onChange={e => setNewQuiz({...newQuiz, description: e.target.value})} 
                    onBlur={e => handleTranslate(null, 'description', null, 'en', 'hi', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label>DESCRIPTION (HINDI)</label>
                  </div>
                  <textarea className="admin-input" style={{ minHeight: '80px' }} value={newQuiz.hindiDescription} 
                    onChange={e => setNewQuiz({...newQuiz, hindiDescription: e.target.value})} 
                    onBlur={e => handleTranslate(null, 'description', null, 'hi', 'en', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                <label>QUIZ BANNER IMAGE URL (OPTIONAL)</label>
                <input 
                  className="admin-input" 
                  placeholder="https://example.com/banner.jpg"
                  value={newQuiz.banner_url}
                  onChange={e => setNewQuiz({...newQuiz, banner_url: e.target.value})}
                />
                {newQuiz.banner_url && (
                  <div style={{ marginTop: '1rem' }}>
                    <img src={newQuiz.banner_url} alt="Banner Preview" style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '1rem' }} />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Questions ({newQuiz.questions.length})</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {newQuiz.questions.map((q, idx) => (
                  <div key={idx} style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid #e2e8f0', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <p style={{ fontWeight: 800 }}>Question {idx + 1}</p>
                      {newQuiz.questions.length > 1 && (
                        <button type="button" onClick={() => removeQuestion(idx)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                          <Trash size={18} />
                        </button>
                      )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ position: 'relative' }}>
                        <input 
                          placeholder="Question Text (English)" 
                          className="admin-input" 
                          required
                          value={q.text}
                          onChange={e => {
                            const val = e.target.value;
                            const qs = [...newQuiz.questions];
                            qs[idx] = {...qs[idx], text: val};
                            setNewQuiz({...newQuiz, questions: qs});
                          }}
                          onBlur={e => handleTranslate(idx, 'question', null, 'en', 'hi', e.target.value)}
                        />
                      </div>
                      <div style={{ position: 'relative' }}>
                        <input 
                          placeholder="Question Text (Hindi)" 
                          className="admin-input" 
                          value={q.hindiText}
                          onChange={e => {
                            const val = e.target.value;
                            const qs = [...newQuiz.questions];
                            qs[idx] = {...qs[idx], hindiText: val};
                            setNewQuiz({...newQuiz, questions: qs});
                          }}
                          onBlur={e => handleTranslate(idx, 'question', null, 'hi', 'en', e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem', background: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <input 
                              type="radio" 
                              name={`correct-${idx}`} 
                              checked={q.correctOptionIndex === optIdx}
                              onChange={() => {
                                const qs = [...newQuiz.questions];
                                qs[idx] = {...qs[idx], correctOptionIndex: optIdx};
                                setNewQuiz({...newQuiz, questions: qs});
                              }}
                            />
                            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Correct Option {optIdx + 1}</span>
                          </div>
                          <div style={{ position: 'relative' }}>
                            <input 
                              placeholder="Option Text (English)" 
                              className="admin-input" 
                              style={{ padding: '8px 12px', fontSize: '0.85rem', width: '100%' }} 
                              required
                              value={opt.text}
                              onChange={e => {
                                const val = e.target.value;
                                const qs = [...newQuiz.questions];
                                const opts = [...qs[idx].options];
                                opts[optIdx] = { ...opts[optIdx], text: val };
                                qs[idx] = { ...qs[idx], options: opts };
                                setNewQuiz({ ...newQuiz, questions: qs });
                              }}
                              onBlur={e => handleTranslate(idx, 'option', optIdx, 'en', 'hi', e.target.value)}
                            />
                          </div>
                          <div style={{ position: 'relative' }}>
                            <input 
                              placeholder="Option Text (Hindi)" 
                              className="admin-input" 
                              style={{ padding: '8px 12px', fontSize: '0.85rem', width: '100%' }} 
                              value={opt.hindiText}
                              onChange={e => {
                                const val = e.target.value;
                                const qs = [...newQuiz.questions];
                                const opts = [...qs[idx].options];
                                opts[optIdx] = { ...opts[optIdx], hindiText: val };
                                qs[idx] = { ...qs[idx], options: opts };
                                setNewQuiz({ ...newQuiz, questions: qs });
                              }}
                              onBlur={e => handleTranslate(idx, 'option', optIdx, 'hi', 'en', e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* + / - controls */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginTop: '2rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  onClick={() => removeQuestion(newQuiz.questions.length - 1)}
                  disabled={newQuiz.questions.length <= 1}
                  style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    border: 'none', cursor: newQuiz.questions.length <= 1 ? 'not-allowed' : 'pointer',
                    background: newQuiz.questions.length <= 1 ? '#e2e8f0' : '#fee2e2',
                    color: newQuiz.questions.length <= 1 ? '#94a3b8' : '#ef4444',
                    fontSize: '1.5rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  −
                </button>
                <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', minWidth: '120px', textAlign: 'center' }}>
                  {newQuiz.questions.length} Question{newQuiz.questions.length !== 1 ? 's' : ''}
                </span>
                <button
                  type="button"
                  onClick={addQuestion}
                  style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    border: 'none', cursor: 'pointer',
                    background: '#dcfce7', color: '#16a34a',
                    fontSize: '1.5rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  +
                </button>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button 
                  type="button" 
                  onClick={() => {
                    if (window.confirm('Clear all form data?')) {
                      localStorage.removeItem('play11_quiz_draft');
                      window.location.reload();
                    }
                  }}
                  style={{ 
                    flex: 1, 
                    padding: '1.25rem',
                    background: '#f1f5f9',
                    color: '#64748b',
                    border: 'none',
                    borderRadius: '14px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Reset Form
                </button>
                <button type="submit" className="admin-primary-btn" style={{ flex: 2, padding: '1.25rem' }}>
                  {isEditing ? 'Update & Deploy Quiz' : 'Deploy Quiz to Production'}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'Quizzes' && !selectedQuiz && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {quizzes.map(q => (
              <div key={q.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontWeight: 800 }}>{q.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {q.participants_count} Participants • {q.status.toUpperCase()} • {q.zone_id.toUpperCase()}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                   <button onClick={() => { setSelectedQuiz(q); fetchParticipants(q.id); }} className="admin-secondary-btn">Manage</button>
                   <button 
                     onClick={() => handleEditQuiz(q)} 
                     style={{ 
                       padding: '8px 16px', 
                       background: '#f0fdf4', 
                       color: '#16a34a', 
                       border: 'none', 
                       borderRadius: '10px', 
                       cursor: 'pointer',
                       fontWeight: 800,
                       fontSize: '0.85rem'
                     }}
                   >
                     Modify
                   </button>
                   <button 
                     onClick={() => handleDeleteQuiz(q.id)} 
                     style={{ 
                       padding: '8px', 
                       background: '#fee2e2', 
                       color: '#ef4444', 
                       border: 'none', 
                       borderRadius: '10px', 
                       cursor: 'pointer',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center'
                     }}
                     title="Delete Quiz"
                   >
                     <Trash2 size={18} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Quizzes' && selectedQuiz && (
          <div>
            <button onClick={() => setSelectedQuiz(null)} style={{ marginBottom: '1.5rem', fontWeight: 800, color: '#3b82f6', border: 'none', background: 'none', cursor: 'pointer' }}>← Back to Quizzes</button>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '0.5rem' }}>{selectedQuiz.title}</h3>
              <p style={{ marginBottom: '2rem', color: '#64748b' }}>Winner: {selectedQuiz.winner_id || 'Not Declared'}</p>

              <h4 style={{ fontWeight: 800, marginBottom: '1rem' }}>Participants (Leaderboard)</h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                      <th style={{ padding: '1rem' }}>Rank</th>
                      <th style={{ padding: '1rem' }}>User</th>
                      <th style={{ padding: '1rem' }}>Score</th>
                      <th style={{ padding: '1rem' }}>Time Taken</th>
                      <th style={{ padding: '1rem' }}>Details</th>
                      <th style={{ padding: '1rem' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((p, idx) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '1rem', fontWeight: 800 }}>#{idx + 1}</td>
                        <td style={{ padding: '1rem' }}>
                          <p style={{ fontWeight: 700 }}>{p.name}</p>
                          <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.mobile}</p>
                        </td>
                        <td style={{ padding: '1rem' }}>
                           <span style={{ fontWeight: 800, color: '#10b981' }}>{p.correct_count}</span>
                           <span style={{ color: '#94a3b8', margin: '0 4px' }}>/</span>
                           <span style={{ fontWeight: 600, color: '#64748b' }}>{p.total_questions}</span>
                        </td>
                        <td style={{ padding: '1rem', fontWeight: 800, color: '#3b82f6' }}>{p.time_taken || 'N/A'}</td>
                        <td style={{ padding: '1rem' }}>
                           <button onClick={() => fetchSubmissionReview(p.id)} style={{ padding: '4px 8px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer' }}>View Answers</button>
                        </td>
                        <td style={{ padding: '1rem' }}>
                           {!selectedQuiz.winner_id && (
                             <button onClick={() => handleDeclareWinner(selectedQuiz.id, p.user_id)} className="admin-winner-btn">Declare Winner</button>
                           )}
                           {selectedQuiz.winner_id === p.user_id && (
                             <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontWeight: 900 }}>
                                <Award size={16} /> WON 🎉
                             </div>
                           )}
                           {selectedQuiz.winner_id && selectedQuiz.winner_id !== p.user_id && (
                             <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Ended</span>
                           )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Users' && (
          <div style={{ background: 'white', borderRadius: '1.5rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
               <thead style={{ background: '#f8fafc' }}>
                 <tr style={{ textAlign: 'left' }}>
                   <th style={{ padding: '1.25rem' }}>Name</th>
                   <th style={{ padding: '1.25rem' }}>Mobile</th>
                   <th style={{ padding: '1.25rem' }}>Status</th>
                 </tr>
               </thead>
               <tbody>
                 {allUsers.map(u => (
                   <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                     <td style={{ padding: '1.25rem', fontWeight: 700 }}>{u.name || 'N/A'}</td>
                     <td style={{ padding: '1.25rem' }}>{u.mobile}</td>
                     <td style={{ padding: '1.25rem' }}>
                        <span style={{ 
                          padding: '4px 12px', 
                          borderRadius: '999px', 
                          fontSize: '0.7rem', 
                          fontWeight: 900,
                          background: u.status === 'active' ? '#dcfce7' : '#fee2e2',
                          color: u.status === 'active' ? '#15803d' : '#b91c1c'
                        }}>
                          {u.status.toUpperCase()}
                        </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table>
           </div>
        )}

        {activeTab === 'Banners' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                <div style={{ width: '48px', height: '48px', background: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ImageIcon size={24} color="#3b82f6" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Home Page Banners</h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Manage hero section of the lobby</p>
                </div>
              </div>

              <div style={{ maxWidth: '700px' }}>
                <div className="form-group" style={{ marginBottom: '2rem' }}>
                  <label>Home Hero Banner Image URL</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <input 
                      className="admin-input" 
                      placeholder="https://example.com/image.jpg"
                      value={homeBannerUrl} 
                      onChange={e => setHomeBannerUrl(e.target.value)} 
                    />
                    <button 
                      className="admin-primary-btn" 
                      style={{ padding: '0 2rem', background: '#3b82f6' }}
                      onClick={() => handleUpdateSetting('home_banner_url', homeBannerUrl)}
                    >
                      Update
                    </button>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem', fontWeight: 600 }}>
                    Note: Use a <strong>direct link</strong> (ends in .jpg, .png). Google Search links will not work.
                  </p>
                </div>

                {homeBannerUrl && (
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '1rem' }}>Preview</label>
                    <div style={{ 
                      width: '100%', 
                      height: '180px', 
                      borderRadius: '1.25rem', 
                      overflow: 'hidden', 
                      border: '1px solid #e2e8f0',
                      position: 'relative'
                    }}>
                      {/* Blurred Background Layer */}
                      <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: `url("${homeBannerUrl}") center/100% 100% no-repeat`,
                        filter: 'blur(10px) brightness(0.7)',
                        transform: 'scale(1.1)',
                        zIndex: 0
                      }}></div>
                      {/* Clear Layer */}
                      <div style={{
                        position: 'relative',
                        zIndex: 1,
                        width: '100%',
                        height: '100%',
                        background: `url("${homeBannerUrl}") center/100% 100% no-repeat`
                      }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                <div style={{ width: '48px', height: '48px', background: '#f0fdf4', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LayoutDashboard size={24} color="#22c55e" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Quiz Room Banners</h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Manage global banner in active quizzes</p>
                </div>
              </div>

              <div style={{ maxWidth: '700px' }}>
                <div className="form-group" style={{ marginBottom: '2rem' }}>
                  <label>Quiz Room Global Banner URL</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <input 
                      className="admin-input" 
                      placeholder="Enter image URL"
                      value={quizRoomBannerUrl} 
                      onChange={e => setQuizRoomBannerUrl(e.target.value)} 
                    />
                    <button 
                      className="admin-primary-btn" 
                      style={{ padding: '0 2rem', background: '#22c55e' }}
                      onClick={() => handleUpdateSetting('quiz_room_banner_url', quizRoomBannerUrl)}
                    >
                      Update
                    </button>
                  </div>
                </div>

                {quizRoomBannerUrl && (
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '1rem' }}>Preview</label>
                    <div style={{ 
                      width: '100%', 
                      height: '150px', 
                      borderRadius: '1.25rem', 
                      overflow: 'hidden', 
                      border: '1px solid #e2e8f0',
                      position: 'relative'
                    }}>
                      {/* Blurred Background Layer */}
                      <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: `url("${quizRoomBannerUrl}") center/100% 100% no-repeat`,
                        filter: 'blur(10px) brightness(0.7)',
                        transform: 'scale(1.1)',
                        zIndex: 0
                      }}></div>
                      {/* Clear Layer */}
                      <div style={{
                        position: 'relative',
                        zIndex: 1,
                        width: '100%',
                        height: '100%',
                        background: `url("${quizRoomBannerUrl}") center/100% 100% no-repeat`
                      }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Settings' && (
          <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ width: '48px', height: '48px', background: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Settings size={24} color="#3b82f6" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Global App Settings</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Manage application-wide configurations</p>
              </div>
            </div>

            <p style={{ color: '#64748b', fontWeight: 600 }}>Banners have been moved to the <strong style={{ color: '#3b82f6', cursor: 'pointer' }} onClick={() => setActiveTab('Banners')}>Banners Section</strong>.</p>
          </div>
        )}

        {/* Review Modal */}
        {showReviewModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
            <div style={{ background: 'white', width: '100%', maxWidth: '700px', maxHeight: '90vh', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
               <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontWeight: 900 }}>Submission Detailed Review</h3>
                  <button onClick={() => { setShowReviewModal(false); setReviewData(null); }} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.75rem', fontWeight: 800, cursor: 'pointer' }}>Close</button>
               </div>
               <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                  {reviewLoading && <div style={{ textAlign: 'center', padding: '2rem' }}><Loader2 className="animate-spin" size={32} /></div>}
                  {!reviewLoading && reviewData && (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                          <div>
                             <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b' }}>SCORE</p>
                             <p style={{ fontSize: '1.25rem', fontWeight: 900, color: '#10b981' }}>{reviewData.submission.correct_count} Correct / {reviewData.submission.wrong_count} Wrong</p>
                          </div>
                          <div>
                             <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b' }}>TIME TAKEN</p>
                             <p style={{ fontSize: '1.25rem', fontWeight: 900, color: '#3b82f6' }}>{reviewData.submission.time_taken || 'N/A'}</p>
                          </div>
                       </div>
                       
                       {reviewData.answers.map((ans, idx) => (
                         <div key={idx} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '1rem' }}>
                            <p style={{ fontWeight: 800, marginBottom: '0.75rem' }}>{idx + 1}. {ans.question_text}</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                               {ans.options?.map((opt, oIdx) => {
                                 const isSelected = String(ans.selected_value) === String(opt.value);
                                 const isCorrect = String(ans.correct_value) === String(opt.value);
                                 
                                 let bgColor = 'white';
                                 let borderColor = '#e2e8f0';
                                 if (isSelected) {
                                   bgColor = isCorrect ? '#dcfce7' : '#fee2e2';
                                   borderColor = isCorrect ? '#22c55e' : '#ef4444';
                                 } else if (isCorrect) {
                                   bgColor = '#eff6ff';
                                   borderColor = '#3b82f6';
                                 }

                                 return (
                                   <div key={oIdx} style={{ padding: '0.5rem 0.75rem', borderRadius: '0.5rem', background: bgColor, border: `1px solid ${borderColor}`, fontSize: '0.85rem', fontWeight: 600 }}>
                                      {opt.text} 
                                      {isSelected && <span style={{ marginLeft: '4px', fontSize: '0.65rem', fontWeight: 900 }}>{isCorrect ? '(USER ✅)' : '(USER ❌)'}</span>}
                                      {isCorrect && !isSelected && <span style={{ marginLeft: '4px', fontSize: '0.65rem', fontWeight: 900 }}>(CORRECT)</span>}
                                   </div>
                                 );
                               })}
                            </div>
                         </div>
                       ))}
                    </div>
                  )}
               </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .admin-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #0f172a;
          font-family: inherit;
          font-weight: 500;
          transition: all 0.2s;
        }
        .admin-input:focus {
          border-color: #3b82f6;
          outline: none;
          background: white;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
        .form-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 800;
          color: #64748b;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }
        .admin-primary-btn {
          background: #0f172a;
          color: white;
          border: none;
          border-radius: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;
        }
        .admin-primary-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .admin-secondary-btn {
          padding: 8px 16px;
          background: #eff6ff;
          color: #3b82f6;
          border: none;
          border-radius: 10px;
          font-weight: 800;
          cursor: pointer;
        }
        .admin-winner-btn {
          padding: 6px 12px;
          background: #f59e0b;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 800;
          font-size: 0.75rem;
          cursor: pointer;
        }
        .flex-center { display: flex; align-items: center; justify-content: center; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
