import React, { useState, useEffect } from 'react';
import {
  BarChart3, Users, BookOpen, Trophy,
  Settings, LayoutDashboard, PlusCircle,
  AlertCircle, ChevronRight, Search,
  MoreVertical, CheckCircle2, Clock, ArrowRight,
  ArrowUpRight, ArrowDownRight, Globe, Lock, Unlock, Edit, Trash2, Shield, Upload,
  Plus, Save, Trash, Award, FileText, Image as ImageIcon, Loader2, X, Landmark, Ticket, Clipboard
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
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [newVoucher, setNewVoucher] = useState({
    title: '',
    code: '',
    discount_text: '',
    amount: 0,
    type: 'bonus',
    color: '#7c3aed',
    expiry_days: 30,
    expires_at: ''
  });
  const [expiryType, setExpiryType] = useState('days');
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
  const [studyZoneBannerUrl, setStudyZoneBannerUrl] = useState('');
  const [sportZoneBannerUrl, setSportZoneBannerUrl] = useState('');
  const [gameZoneBannerUrl, setGameZoneBannerUrl] = useState('');
  const [movieZoneBannerUrl, setMovieZoneBannerUrl] = useState('');
  const [newsZoneBannerUrl, setNewsZoneBannerUrl] = useState('');
  const [welcomeBonus, setWelcomeBonus] = useState('0');
  const [referralReferrerBonus, setReferralReferrerBonus] = useState('0');
  const [referralRefereeBonus, setReferralRefereeBonus] = useState('0');
  const [selectedBonusKey, setSelectedBonusKey] = useState('welcome_bonus');
  const [dailyLoginBonus, setDailyLoginBonus] = useState('0');
  const [firstDepositBonus, setFirstDepositBonus] = useState('0');


  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);
  const [showIngestionPreview, setShowIngestionPreview] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [showImagePasteModal, setShowImagePasteModal] = useState(false);
  const [showIngestOptions, setShowIngestOptions] = useState(false);
  const [activeIngestFormat, setActiveIngestFormat] = useState('CSV');
  const [pastedText, setPastedText] = useState('');
  const [ingestedQuestions, setIngestedQuestions] = useState([]);

  // Keep server time updated
  useEffect(() => {
    const timer = setInterval(() => setServerTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Global Paste Listener for easy ingestion
  useEffect(() => {
    const handleGlobalPaste = async (e) => {
      // Only handle paste if we are on the 'Upload Quiz' tab and no other modal is blocking
      if (activeTab !== 'Upload Quiz' || showIngestionPreview) return;

      const items = e.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          handleAutoIngest(file);
          setShowIngestOptions(false); 
          setShowImagePasteModal(false);
          return;
        }
      }
      
      // Also handle text paste if the target is not an input/textarea
      const target = e.target;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        const text = e.clipboardData.getData('text');
        if (text) {
          // Try JSON
          try {
            const json = JSON.parse(text);
            if (json.questions || Array.isArray(json)) {
              setIngestedQuestions(json.questions || json);
              setShowIngestionPreview(true);
              setShowIngestOptions(false);
              setShowImagePasteModal(false);
              return;
            }
          } catch (e) {}

          const questions = parseTextToQuestions(text);
          if (questions.length > 0) {
            setIngestedQuestions(questions);
            setShowIngestionPreview(true);
            setShowIngestOptions(false);
            setShowImagePasteModal(false);
          }
        }
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, [activeTab, showIngestionPreview]);

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

      if (activeTab === 'Payments') {
        const transRes = await fetch('/api/admin/transactions/pending', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const tData = await transRes.json();
        console.log('[AdminDashboard] Pending Transactions Fetch Result:', tData);
        if (tData.success) {
          setPendingTransactions(tData.transactions || []);
        } else {
          console.error('[AdminDashboard] Failed to fetch transactions:', tData.error);
          alert('Fetch Error: ' + (tData.error || 'Unknown error'));
        }
      }

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
        console.log('[AdminDashboard] Quizzes Stats Received:', qData);
        if (qData.success) {
          setQuizzes(qData.quizzes || []);
        } else {
          setQuizzes([]);
        }

        const catRes = await fetch('/api/categories/all');
        const catData = await catRes.json();
        if (catData.success) setCategories(catData.categories);

        const matchRes = await fetch('/api/matches');
        const matchData = await matchRes.json();
        if (matchData.success) setMatches(matchData.matches || []);
      }

      if (activeTab === 'Vouchers') {
        const vRes = await fetch('/api/admin/vouchers', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const vData = await vRes.json();
        if (vData.success) setVouchers(vData.vouchers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (activeTab === 'Settings' || activeTab === 'Banners' || activeTab === 'Bonuses') {
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
      
      const studyData = await settingsService.getSetting('banner_zone_study-zone');
      if (studyData.success) setStudyZoneBannerUrl(studyData.value);
      
      const sportData = await settingsService.getSetting('banner_zone_sport-zone');
      if (sportData.success) setSportZoneBannerUrl(sportData.value);
      
      const gameData = await settingsService.getSetting('banner_zone_game-zone');
      if (gameData.success) setGameZoneBannerUrl(gameData.value);
      
      const movieData = await settingsService.getSetting('banner_zone_movie-zone');
      if (movieData.success) setMovieZoneBannerUrl(movieData.value);
      
      const newsData = await settingsService.getSetting('banner_zone_news-zone');
      if (newsData.success) setNewsZoneBannerUrl(newsData.value);

      const welcomeData = await settingsService.getSetting('welcome_bonus');
      if (welcomeData.success) setWelcomeBonus(welcomeData.value);

      const refRefData = await settingsService.getSetting('referral_referrer_bonus');
      if (refRefData.success) setReferralReferrerBonus(refRefData.value);

      const refRefeData = await settingsService.getSetting('referral_referee_bonus');
      if (refRefeData.success) setReferralRefereeBonus(refRefeData.value);

      const dailyData = await settingsService.getSetting('daily_login_bonus');
      if (dailyData.success) setDailyLoginBonus(dailyData.value);

      const firstDepData = await settingsService.getSetting('first_deposit_bonus');
      if (firstDepData.success) setFirstDepositBonus(firstDepData.value);

    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  };

  const extractImageUrl = (url) => {
    if (url && url.includes('google.com/imgres')) {
      try {
        const urlParams = new URLSearchParams(url.split('?')[1]);
        const extracted = urlParams.get('imgurl');
        if (extracted) return decodeURIComponent(extracted);
      } catch (e) {
        console.error('Failed to extract Google Image URL', e);
      }
    }
    return url;
  };

  const handleUpdateSetting = async (key, value) => {
    setIsUpdatingSettings(true);
    const finalValue = extractImageUrl(value);

    try {
      const data = await settingsService.updateSetting(key, finalValue);
      if (data.success) {
        if (key === 'home_banner_url') setHomeBannerUrl(finalValue);
        if (key === 'quiz_room_banner_url') setQuizRoomBannerUrl(finalValue);
        if (key === 'banner_zone_study-zone') setStudyZoneBannerUrl(finalValue);
        if (key === 'banner_zone_sport-zone') setSportZoneBannerUrl(finalValue);
        if (key === 'banner_zone_game-zone') setGameZoneBannerUrl(finalValue);
        if (key === 'banner_zone_movie-zone') setMovieZoneBannerUrl(finalValue);
        if (key === 'banner_zone_news-zone') setNewsZoneBannerUrl(finalValue);
        if (key === 'welcome_bonus') setWelcomeBonus(finalValue);
        if (key === 'referral_referrer_bonus') setReferralReferrerBonus(finalValue);
        if (key === 'referral_referee_bonus') setReferralRefereeBonus(finalValue);
        if (key === 'daily_login_bonus') setDailyLoginBonus(finalValue);
        if (key === 'first_deposit_bonus') setFirstDepositBonus(finalValue);

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
        // Update local state instead of closing
        setSelectedQuiz(prev => ({ ...prev, winner_id: userId }));
        fetchData(); // Refresh global list
        fetchParticipants(quizId); // Refresh participants to show 'WON'
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

  const handleCreateVoucher = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('play11_admin_session');
      const requestBody = {
        ...newVoucher,
        expiry_days: expiryType === 'days' ? Number(newVoucher.expiry_days) : null,
        expires_at: expiryType === 'date' ? newVoucher.expires_at : null
      };
      
      const res = await fetch('/api/admin/vouchers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });
      const data = await res.json();
      if (data.success) {
        alert('Voucher created successfully!');
        setNewVoucher({
          title: '',
          code: '',
          discount_text: '',
          amount: 0,
          type: 'bonus',
          color: '#7c3aed',
          expiry_days: 30,
          expires_at: ''
        });
        setExpiryType('days');
        fetchData();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVoucher = async (id) => {
    if (!window.confirm('Delete this voucher?')) return;
    try {
      const token = localStorage.getItem('play11_admin_session');
      const res = await fetch(`/api/admin/vouchers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleVoucherStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const token = localStorage.getItem('play11_admin_session');
      const res = await fetch(`/api/admin/vouchers/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
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
    console.log(`Ingesting file: ${file.name} (Ext: ${fileExt})`);

    try {
      if (fileExt === 'json') {
        const reader = new FileReader();
        reader.onload = e => {
          try {
            const json = JSON.parse(e.target.result);
            if (json.questions) {
              setIngestedQuestions(json.questions);
              setShowIngestionPreview(true);
            } else {
              setNewQuiz(prev => ({ ...prev, ...json }));
              setActiveTab('Create Quiz');
              alert('JSON Data applied directly to form');
            }
          } catch (err) {
            alert('Invalid JSON format');
          }
          setIsParsing(false);
        };
        reader.readAsText(file);
      }
      else if (fileExt === 'csv') {
        Papa.parse(file, {
          header: false,
          skipEmptyLines: true,
          complete: (results) => {
            console.log('CSV Results:', results.data);
            // Check if first row is header
            const data = results.data;
            const hasHeader = data[0][0]?.toLowerCase().includes('question') || data[0][0]?.toLowerCase().includes('q:');
            const startIndex = hasHeader ? 1 : 0;

            const questions = data.slice(startIndex).map(row => {
              if (!row[0]) return null;
              return {
                text: row[0],
                options: [
                  { text: row[1] || '', hindiText: '' },
                  { text: row[2] || '', hindiText: '' },
                  { text: row[3] || '', hindiText: '' },
                  { text: row[4] || '', hindiText: '' }
                ],
                correctOptionIndex: isNaN(parseInt(row[5])) ? 0 : parseInt(row[5])
              };
            }).filter(q => q && q.text);

            if (questions.length > 0) {
              setIngestedQuestions(questions);
              setShowIngestionPreview(true);
            } else {
              alert('No questions found in CSV. Expected format: Question, OptA, OptB, OptC, OptD, CorrectIdx(0-3)');
            }
            setIsParsing(false);
          },
          error: (err) => {
            alert('CSV Parsing Error: ' + err.message);
            setIsParsing(false);
          }
        });
      }
      else if (fileExt === 'txt') {
        const reader = new FileReader();
        reader.onload = e => {
          const questions = parseTextToQuestions(e.target.result);
          if (questions.length > 0) {
            setIngestedQuestions(questions);
            setShowIngestionPreview(true);
          } else {
            alert('No questions detected in text file.');
          }
          setIsParsing(false);
        };
        reader.readAsText(file);
      }
      else if (['png', 'jpg', 'jpeg'].includes(fileExt)) {
        try {
          const result = await Tesseract.recognize(file, 'eng+hin', {
            logger: m => {
              if (m.status === 'recognizing text') setParseProgress(Math.floor(m.progress * 100));
            }
          });
          const questions = parseTextToQuestions(result.data.text);
          if (questions.length > 0) {
            setIngestedQuestions(questions);
            setShowIngestionPreview(true);
          } else {
            alert('No questions recognized in image. Try a clearer image or different format.');
          }
        } catch (err) {
          alert('OCR Error: ' + err.message);
        }
        setIsParsing(false);
      } else {
        alert('Unsupported file format: ' + fileExt);
        setIsParsing(false);
      }
    } catch (err) {
      console.error("Parsing error:", err);
      alert("Failed to parse file: " + err.message);
      setIsParsing(false);
    }

    // Reset input so the same file can be selected again
    const input = document.getElementById('bulk-file-input');
    if (input) input.value = '';
  };

  const handlePasteSubmit = () => {
    if (!pastedText.trim()) return;
    
    // 1. Try JSON first
    try {
      const json = JSON.parse(pastedText);
      if (json.questions && Array.isArray(json.questions)) {
        setIngestedQuestions(json.questions);
        setShowPasteModal(false);
        setPastedText('');
        setShowIngestionPreview(true);
        return;
      }
      if (Array.isArray(json)) {
        setIngestedQuestions(json);
        setShowPasteModal(false);
        setPastedText('');
        setShowIngestionPreview(true);
        return;
      }
    } catch (e) {
      // Not JSON
    }

    // 2. Try CSV Parsing (if it contains commas or tabs)
    if (pastedText.includes(',') || pastedText.includes('\t')) {
       const results = Papa.parse(pastedText, { header: false, skipEmptyLines: true });
       if (results.data && results.data.length > 0 && results.data[0].length > 1) {
          const data = results.data;
          const hasHeader = data[0][0]?.toLowerCase().includes('question') || data[0][0]?.toLowerCase().includes('q:');
          const startIndex = hasHeader ? 1 : 0;

          const questions = data.slice(startIndex).map(row => {
            if (!row[0]) return null;
            return {
              text: row[0],
              options: [
                { text: row[1] || '', hindiText: '' },
                { text: row[2] || '', hindiText: '' },
                { text: row[3] || '', hindiText: '' },
                { text: row[4] || '', hindiText: '' }
              ],
              correctOptionIndex: isNaN(parseInt(row[5])) ? 0 : parseInt(row[5])
            };
          }).filter(q => q && q.text);

          if (questions.length > 0) {
            setIngestedQuestions(questions);
            setShowPasteModal(false);
            setPastedText('');
            setShowIngestionPreview(true);
            return;
          }
       }
    }

    // 3. Fallback to Plain Text Parser
    const questions = parseTextToQuestions(pastedText);
    if (questions.length === 0) {
      alert("No questions found. Please check the format (Plain Text, CSV, or JSON).");
      return;
    }
    setIngestedQuestions(questions);
    setShowPasteModal(false);
    setPastedText('');
    setShowIngestionPreview(true);
  };

  const confirmIngestion = () => {
    setNewQuiz(prev => ({ 
      ...prev, 
      questions: ingestedQuestions, 
      total_questions: ingestedQuestions.length 
    }));
    setShowIngestionPreview(false);
    setActiveTab('Create Quiz');
  };

  const parseTextToQuestions = (text) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    const questions = [];
    let currentQ = null;

    lines.forEach(line => {
      // 1. Detect Question Starters
      const qNumMatch = line.match(/^(\d+)[\.\)]\s*(.*)/i);
      const qWordMatch = line.match(/^Question\s*(\d+)[:\s]*(.*)/i);
      const qMarkerMatch = line.match(/^Q[:\s]*(.*)/i);

      if (qNumMatch || qWordMatch || qMarkerMatch) {
        if (currentQ) questions.push(currentQ);
        
        let qText = "";
        if (qNumMatch) qText = qNumMatch[2];
        else if (qWordMatch) qText = qWordMatch[2];
        else if (qMarkerMatch) qText = qMarkerMatch[1];

        // Filter out noisy titles like "Quiz Questions"
        if (qText.toLowerCase().includes('questions') && qText.length < 20) {
          currentQ = null;
          return;
        }

        currentQ = {
          text: qText.trim(),
          options: [],
          correctOptionIndex: 0
        };
        return;
      }

      // 2. Detect Options (A, B, C, D or (a), (b)...)
      const optMatch = line.match(/^([A-D]|[a-d])[\.\)]\s*(.*)/i) || line.match(/^\(([A-D]|[a-d])\)\s*(.*)/i);
      if (optMatch && currentQ) {
        const isCorrect = line.includes('✅') || /v\s*Correct/i.test(line) || /\(Correct\)/i.test(line);
        const optText = optMatch[2].replace(/v\s*Correct/i, '').replace(/\(Correct\)/i, '').replace('✅', '').trim();
        
        currentQ.options.push({ text: optText, hindiText: '' });
        if (isCorrect) currentQ.correctOptionIndex = currentQ.options.length - 1;
        return;
      }

      // 3. Detect Answer Keys (Ans: A)
      const ansMatch = line.match(/^(Ans|Answer|Correct)[:\s]*([A-D])/i);
      if (ansMatch && currentQ) {
        const ans = ansMatch[2].toUpperCase();
        const index = ['A', 'B', 'C', 'D'].indexOf(ans);
        if (index !== -1) currentQ.correctOptionIndex = index;
        return;
      }

      // 4. Fallback: Multi-line question text or plain options
      if (currentQ) {
        if (currentQ.options.length === 0) {
          // If no options yet, append to question text
          currentQ.text = (currentQ.text + " " + line).trim();
        } else if (currentQ.options.length < 4) {
          // If we have some options but this line doesn't match A/B/C/D, 
          // it might be a plain text option (OCR often misses the letter)
          const isCorrect = line.includes('✅') || /v\s*Correct/i.test(line);
          const optText = line.replace(/v\s*Correct/i, '').replace('✅', '').trim();
          currentQ.options.push({ text: optText, hindiText: '' });
          if (isCorrect) currentQ.correctOptionIndex = currentQ.options.length - 1;
        }
      }
    });

    if (currentQ) questions.push(currentQ);
    
    // Final cleanup and normalization
    return questions
      .filter(q => q.text.length > 1) // Remove empty/junk questions
      .map(q => {
        const normalizedOptions = [...q.options];
        while (normalizedOptions.length < 4) {
          normalizedOptions.push({ text: '', hindiText: '' });
        }
        // If more than 4, take first 4
        if (normalizedOptions.length > 4) normalizedOptions.length = 4;
        return { ...q, options: normalizedOptions };
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
        <SidebarItem icon={<Ticket />} label="Vouchers" />
        <SidebarItem icon={<Award />} label="Bonuses" />
        <SidebarItem icon={<Landmark />} label="Payments" />
        <SidebarItem icon={<Settings />} label="Settings" />
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '2.5rem', overflowX: 'auto', minWidth: '0' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 950, letterSpacing: '-0.02em', color: '#0f172a' }}>{activeTab}</h2>
            <button 
              onClick={() => setActiveTab('Overview')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '8px 16px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                color: '#64748b',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'}
              onMouseOut={e => e.currentTarget.style.background = '#f8fafc'}
            >
              <ArrowRight style={{ transform: 'rotate(180deg)' }} size={16} /> Back to Dashboard
            </button>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('play11_admin_session');
              window.location.href = '/admin/login';
            }}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#fee2e2',
              color: '#ef4444',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </header>

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
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2.5rem' }}>
            {/* File Upload Section */}
            <div style={{ background: 'white', padding: '3rem', borderRadius: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2.5rem' }}>
                <div style={{ width: '56px', height: '56px', background: '#eff6ff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 2px 4px rgba(59, 130, 246, 0.1)' }}>
                  <Upload size={28} color="#3b82f6" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a' }}>Bulk Ingestion</h3>
                  <p style={{ fontSize: '1rem', color: '#64748b', fontWeight: 600 }}>Upload CSV, TXT, or Image</p>
                </div>
              </div>

              <div
                style={{ 
                  background: '#f8fafc', 
                  border: '2px dashed #e2e8f0', 
                  borderRadius: '2rem', 
                  padding: '3.5rem 2rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  outline: 'none'
                }}
                tabIndex="0"
                onDragOver={e => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.background = '#eff6ff';
                }}
                onDragLeave={e => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.background = '#f8fafc';
                }}
                onDrop={async e => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.background = '#f8fafc';
                  const file = e.dataTransfer.files[0];
                  if (file) handleAutoIngest(file);
                }}
                onPaste={async (e) => {
                  const items = e.clipboardData.items;
                  for (let i = 0; i < items.length; i++) {
                    if (items[i].type.indexOf('image') !== -1) {
                      const file = items[i].getAsFile();
                      handleAutoIngest(file);
                      return;
                    }
                  }
                  const text = e.clipboardData.getData('text');
                  if (text) {
                    // Try parsing as JSON first
                    try {
                      const json = JSON.parse(text);
                      if (json.questions && Array.isArray(json.questions)) {
                        setIngestedQuestions(json.questions);
                        setShowIngestionPreview(true);
                        return;
                      }
                      if (Array.isArray(json)) {
                        setIngestedQuestions(json);
                        setShowIngestionPreview(true);
                        return;
                      }
                    } catch (err) {
                      // Not JSON, continue to plain text
                    }

                    const questions = parseTextToQuestions(text);
                    if (questions.length > 0) {
                      setIngestedQuestions(questions);
                      setShowIngestionPreview(true);
                    }
                  }
                }}
                onClick={() => document.getElementById('bulk-file-input').click()}
                onMouseOver={e => e.currentTarget.style.borderColor = '#3b82f6'}
                onMouseOut={e => e.currentTarget.style.borderColor = '#e2e8f0'}
              >
                {isParsing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                      <Loader2 size={80} className="animate-spin" color="#3b82f6" style={{ opacity: 0.2 }} />
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#3b82f6', fontSize: '1rem' }}>
                        {parseProgress}%
                      </div>
                    </div>
                    <p style={{ fontWeight: 800, color: '#1e40af', fontSize: '1.25rem' }}>Analyzing Content...</p>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Please wait while we extract data</p>
                  </div>
                ) : (
                  <>
                    <div style={{ marginBottom: '2rem', color: '#94a3b8' }}>
                      <div style={{ width: '100px', height: '100px', background: 'white', borderRadius: '30px', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <ImageIcon size={48} color="#cbd5e1" />
                      </div>
                      <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' }}>Click, Drag or Paste Image/Text</p>
                      <p style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>Supports CSV, JSON, PNG, JPG, TXT</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                      {[
                        { label: 'CSV', id: 'csv' },
                        { label: 'TXT (Paste/Upload)', id: 'txt' },
                        { label: 'PNG/JPG', id: 'img' },
                        { label: 'JSON', id: 'json' }
                      ].map(btn => (
                        <span 
                          key={btn.id} 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveIngestFormat(btn.label);
                            setShowIngestOptions(true);
                          }}
                          style={{ 
                            fontSize: '0.8rem', 
                            padding: '6px 14px', 
                            background: 'white', 
                            color: '#475569', 
                            borderRadius: '10px', 
                            fontWeight: 800, 
                            border: '1px solid #e2e8f0',
                            cursor: 'pointer'
                          }}
                        >
                          {btn.label}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <input
                id="bulk-file-input"
                type="file"
                accept={
                  activeIngestFormat === 'CSV' ? '.csv' :
                  activeIngestFormat === 'JSON' ? '.json' :
                  activeIngestFormat === 'PNG/JPG' ? '.png,.jpg,.jpeg' :
                  activeIngestFormat.includes('TXT') ? '.txt' :
                  '.json,.csv,.txt,.png,.jpg,.jpeg'
                }
                onChange={e => handleAutoIngest(e.target.files[0])}
                style={{ display: 'none' }}
              />

              <div style={{ marginTop: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                   <div style={{ width: '4px', height: '16px', background: '#3b82f6', borderRadius: '2px' }}></div>
                   <h4 style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Instructions</h4>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '1.25rem', border: '1px solid #f1f5f9' }}>
                    <p style={{ fontWeight: 800, fontSize: '0.85rem', color: '#3b82f6', marginBottom: '0.5rem' }}>CSV FORMAT</p>
                    <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>Question, Option A, Option B, Option C, Option D, CorrectIndex(0-3)</p>
                  </div>
                  <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '1.25rem', border: '1px solid #f1f5f9' }}>
                    <p style={{ fontWeight: 800, fontSize: '0.85rem', color: '#3b82f6', marginBottom: '0.5rem' }}>TXT FORMAT</p>
                    <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>Q: Question?<br/>A: Opt1, B: Opt2...<br/>Ans: A</p>
                  </div>
                </div>
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
                    onChange={e => setNewQuiz({ ...newQuiz, title: e.target.value })}
                    onBlur={e => handleTranslate(null, 'title', null, 'en', 'hi', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label>QUIZ TITLE (HINDI)</label>
                  </div>
                  <input className="admin-input" value={newQuiz.hindiTitle}
                    onChange={e => setNewQuiz({ ...newQuiz, hindiTitle: e.target.value })}
                    onBlur={e => handleTranslate(null, 'title', null, 'hi', 'en', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>CATEGORY</label>
                  <select className="admin-input" value={newQuiz.category_id} onChange={e => {
                    const cat = categories.find(c => c.id === e.target.value);
                    setNewQuiz({ ...newQuiz, category_id: e.target.value, zone_id: cat?.zone_id || 'study-zone' });
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
                  <input className="admin-input" type="number" value={newQuiz.timer_minutes} onChange={e => setNewQuiz({ ...newQuiz, timer_minutes: parseInt(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label>ENTRY AMOUNT (₹)</label>
                  <input className="admin-input" type="number" value={newQuiz.entry_amount} onChange={e => setNewQuiz({ ...newQuiz, entry_amount: parseInt(e.target.value) })} />
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {[0, 10, 20, 50, 100].map(amt => (
                      <button key={amt} type="button" onClick={() => setNewQuiz({ ...newQuiz, entry_amount: amt })} 
                        style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '6px', background: '#f1f5f9', border: '1px solid #e2e8f0', cursor: 'pointer', fontWeight: 700 }}>
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>ASSOCIATED MATCH (OPTIONAL)</label>
                  <select className="admin-input" value={newQuiz.match_id} onChange={e => setNewQuiz({ ...newQuiz, match_id: e.target.value })}>
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
                  <input className="admin-input" type="datetime-local" required value={newQuiz.open_at} onChange={e => setNewQuiz({ ...newQuiz, open_at: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>CLOSE AT</label>
                  <input className="admin-input" type="datetime-local" required value={newQuiz.close_at} onChange={e => setNewQuiz({ ...newQuiz, close_at: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>PRIZE AMOUNT (₹)</label>
                  <input className="admin-input" type="number" value={newQuiz.prize_amount} onChange={e => setNewQuiz({ ...newQuiz, prize_amount: parseInt(e.target.value) })} />
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {[0, 50, 100, 200, 500, 1000].map(amt => (
                      <button key={amt} type="button" onClick={() => setNewQuiz({ ...newQuiz, prize_amount: amt })} 
                        style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '6px', background: '#f0fdf4', border: '1px solid #dcfce7', color: '#16a34a', cursor: 'pointer', fontWeight: 700 }}>
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label>DESCRIPTION (ENGLISH)</label>
                  </div>
                  <textarea className="admin-input" style={{ minHeight: '80px' }} value={newQuiz.description}
                    onChange={e => setNewQuiz({ ...newQuiz, description: e.target.value })}
                    onBlur={e => handleTranslate(null, 'description', null, 'en', 'hi', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label>DESCRIPTION (HINDI)</label>
                  </div>
                  <textarea className="admin-input" style={{ minHeight: '80px' }} value={newQuiz.hindiDescription}
                    onChange={e => setNewQuiz({ ...newQuiz, hindiDescription: e.target.value })}
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
                  onChange={e => setNewQuiz({ ...newQuiz, banner_url: extractImageUrl(e.target.value) })}
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
                            qs[idx] = { ...qs[idx], text: val };
                            setNewQuiz({ ...newQuiz, questions: qs });
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
                            qs[idx] = { ...qs[idx], hindiText: val };
                            setNewQuiz({ ...newQuiz, questions: qs });
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
                                qs[idx] = { ...qs[idx], correctOptionIndex: optIdx };
                                setNewQuiz({ ...newQuiz, questions: qs });
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
                  âˆ’
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
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', fontWeight: 800 }}>Loading quizzes...</div>
            ) : quizzes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem', background: 'white', borderRadius: '1.5rem', border: '1px dashed #e2e8f0' }}>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem', fontWeight: 700 }}>No quizzes found in the database.</p>
                <button onClick={fetchData} className="admin-secondary-btn" style={{ marginTop: '1rem' }}>Refresh List</button>
              </div>
            ) : (
              quizzes.map(q => (
                <div key={q.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontWeight: 800 }}>{q.title || 'Untitled Quiz'}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {q.participants_count || 0} Participants • {(q.status || 'unknown').toUpperCase()} • {(q.zone_id || 'general').toUpperCase()}
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
            )))}
          </div>
        )}

        {activeTab === 'Quizzes' && selectedQuiz && (
          <div>
            <button onClick={() => setSelectedQuiz(null)} style={{ marginBottom: '1.5rem', fontWeight: 800, color: '#3b82f6', border: 'none', background: 'none', cursor: 'pointer' }}>â† Back to Quiz List</button>
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
                              <Award size={16} /> WON ðŸŽ‰
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

        {activeTab === 'Payments' && (
          <div style={{ background: 'white', borderRadius: '1.5rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>Pending Payment Requests</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Verify manual transfers before approving</p>
              </div>
              <button 
                onClick={fetchData}
                style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Loader2 size={16} className={loading ? "animate-spin" : ""} /> Refresh
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', minWidth: '950px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                  <th style={{ padding: '1.25rem' }}>User</th>
                  <th style={{ padding: '1.25rem' }}>Type</th>
                  <th style={{ padding: '1.25rem' }}>Amount</th>
                  <th style={{ padding: '1.25rem' }}>UPI ID</th>
                  <th style={{ padding: '1.25rem' }}>Status</th>
                  <th style={{ padding: '1.25rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8', fontWeight: 700 }}>
                      <CheckCircle2 size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                      <p>All caught up! No transactions found.</p>
                    </td>
                  </tr>
                ) : (
                  pendingTransactions.map(tx => (
                    <tr key={tx.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '1.25rem' }}>
                        <p style={{ fontWeight: 800 }}>{tx.name || 'User'}</p>
                        <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{tx.mobile || 'N/A'}</p>
                        {tx.last_won_quiz && (
                          <div style={{ marginTop: '4px', fontSize: '0.7rem', background: '#f0f9ff', color: '#0369a1', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', fontWeight: 700 }}>
                            🏆 Won: {tx.last_won_quiz}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '1.25rem' }}>
                        <span style={{ 
                          padding: '6px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 900,
                          background: tx.category === 'deposit' ? '#dcfce7' : '#fee2e2',
                          color: tx.category === 'deposit' ? '#15803d' : '#b91c1c',
                          display: 'inline-flex', alignItems: 'center', gap: '4px'
                        }}>
                          {tx.category === 'deposit' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                          {tx.category === 'deposit' ? 'DEPOSIT' : 'WITHDRAWAL'}
                        </span>
                      </td>
                      <td style={{ padding: '1.25rem', fontWeight: 900, fontSize: '1.2rem', color: tx.category === 'deposit' ? '#10b981' : '#f43f5e' }}>
                        {tx.category === 'deposit' ? '+' : '-'}₹{Math.abs(tx.amount)}
                      </td>
                      <td style={{ padding: '1.25rem' }}>
                        <code style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', fontWeight: 800 }}>{tx.upi_id || 'N/A'}</code>
                        {tx.qr_code && (
                          <button 
                            onClick={() => {
                              const win = window.open("");
                              win.document.write(`<img src="${tx.qr_code}" style="max-width:100%" />`);
                            }}
                            style={{ display: 'block', marginTop: '5px', fontSize: '0.65rem', color: '#3b82f6', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 800 }}
                          >
                            View QR 📸
                          </button>
                        )}
                      </td>
                      <td style={{ padding: '1.25rem' }}>
                        <span style={{ 
                          padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 900,
                          background: tx.status === 'pending' ? '#fef3c7' : tx.status === 'success' ? '#dcfce7' : '#fee2e2',
                          color: tx.status === 'pending' ? '#92400e' : tx.status === 'success' ? '#15803d' : '#b91c1c'
                        }}>
                          {tx.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '1.25rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {tx.status === 'pending' ? (
                            <>
                              <button 
                                onClick={async () => {
                                  if (window.confirm(`Approve ₹${Math.abs(tx.amount)}?`)) {
                                    const token = localStorage.getItem('play11_admin_session');
                                    const res = await fetch(`/api/admin/transactions/${tx.id}/approve`, {
                                      method: 'POST',
                                      headers: { 'Authorization': `Bearer ${token}` }
                                    });
                                    const data = await res.json();
                                    if (data.success) fetchData();
                                    else alert(data.error);
                                  }
                                }}
                                style={{ padding: '8px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '0.75rem' }}
                              >
                                Approve
                              </button>
                              <button 
                                onClick={async () => {
                                  if (window.confirm(`Reject ₹${Math.abs(tx.amount)}?`)) {
                                    const token = localStorage.getItem('play11_admin_session');
                                    const res = await fetch(`/api/admin/transactions/${tx.id}/reject`, {
                                      method: 'POST',
                                      headers: { 'Authorization': `Bearer ${token}` }
                                    });
                                    const data = await res.json();
                                    if (data.success) fetchData();
                                    else alert(data.error);
                                  }
                                }}
                                style={{ padding: '8px 12px', background: '#f43f5e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '0.75rem' }}
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>Processed</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          </div>
        )}

        {activeTab === 'Vouchers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Create Voucher Form */}
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                <div style={{ width: '48px', height: '48px', background: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Ticket size={24} color="#3b82f6" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Create New Voucher</h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Generate codes for users to redeem</p>
                </div>
              </div>

              <form onSubmit={handleCreateVoucher} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div className="form-group">
                  <label>Voucher Title</label>
                  <input 
                    className="admin-input" 
                    placeholder="e.g. Welcome Bonus" 
                    value={newVoucher.title}
                    onChange={e => setNewVoucher({...newVoucher, title: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Voucher Code</label>
                  <input 
                    className="admin-input" 
                    placeholder="e.g. WELCOME100" 
                    value={newVoucher.code}
                    onChange={e => setNewVoucher({...newVoucher, code: e.target.value.toUpperCase()})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Display Text</label>
                  <input 
                    className="admin-input" 
                    placeholder="e.g. ₹100 Bonus Cash" 
                    value={newVoucher.discount_text}
                    onChange={e => setNewVoucher({...newVoucher, discount_text: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input 
                    className="admin-input" 
                    type="number"
                    value={newVoucher.amount}
                    onChange={e => setNewVoucher({...newVoucher, amount: parseFloat(e.target.value)})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select 
                    className="admin-input"
                    value={newVoucher.type}
                    onChange={e => setNewVoucher({...newVoucher, type: e.target.value})}
                  >
                    <option value="bonus">Bonus Cash</option>
                    <option value="cash">Real Cash (Deposit)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Color (Hex)</label>
                  <input 
                    className="admin-input" 
                    type="color"
                    style={{ padding: '0.2rem', height: '48px', cursor: 'pointer' }}
                    value={newVoucher.color}
                    onChange={e => setNewVoucher({...newVoucher, color: e.target.value})}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontWeight: 700, color: '#475569', marginBottom: '8px', display: 'block' }}>Expiry Setting</label>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <button 
                      type="button"
                      onClick={() => setExpiryType('days')}
                      style={{ 
                        flex: 1, 
                        padding: '10px 14px', 
                        borderRadius: '12px', 
                        border: expiryType === 'days' ? '2px solid #3b82f6' : '1px solid #e2e8f0', 
                        background: expiryType === 'days' ? '#eff6ff' : 'white', 
                        color: expiryType === 'days' ? '#1d4ed8' : '#64748b', 
                        fontWeight: 800,
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        transition: 'all 0.2s'
                      }}
                    >
                      🕒 Expire in X Days
                    </button>
                    <button 
                      type="button"
                      onClick={() => setExpiryType('date')}
                      style={{ 
                        flex: 1, 
                        padding: '10px 14px', 
                        borderRadius: '12px', 
                        border: expiryType === 'date' ? '2px solid #3b82f6' : '1px solid #e2e8f0', 
                        background: expiryType === 'date' ? '#eff6ff' : 'white', 
                        color: expiryType === 'date' ? '#1d4ed8' : '#64748b', 
                        fontWeight: 800,
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        transition: 'all 0.2s'
                      }}
                    >
                      📅 Specific Expiry Date & Time
                    </button>
                  </div>

                  {expiryType === 'days' ? (
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '6px', display: 'block' }}>Enter Expiry Days</label>
                      <input 
                        className="admin-input" 
                        type="number"
                        value={newVoucher.expiry_days}
                        onChange={e => setNewVoucher({...newVoucher, expiry_days: parseInt(e.target.value) || 0})}
                        required
                        placeholder="e.g. 30"
                      />
                    </div>
                  ) : (
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '6px', display: 'block' }}>Select Specific Date & Time</label>
                      <input 
                        className="admin-input" 
                        type="datetime-local"
                        value={newVoucher.expires_at}
                        onChange={e => setNewVoucher({...newVoucher, expires_at: e.target.value})}
                        required
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button type="submit" className="admin-primary-btn" style={{ width: '100%', padding: '12px', background: '#3b82f6' }} disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : 'Create Voucher'}
                  </button>
                </div>
              </form>
            </div>

            {/* Vouchers List */}
            <div style={{ background: 'white', borderRadius: '1.5rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f8fafc' }}>
                  <tr style={{ textAlign: 'left' }}>
                    <th style={{ padding: '1.25rem' }}>Code</th>
                    <th style={{ padding: '1.25rem' }}>Reward</th>
                    <th style={{ padding: '1.25rem' }}>Type</th>
                    <th style={{ padding: '1.25rem' }}>Status</th>
                    <th style={{ padding: '1.25rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vouchers.map(v => (
                    <tr key={v.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '1.25rem' }}>
                        <code style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', fontWeight: 900, color: v.color }}>{v.code}</code>
                        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>{v.title}</p>
                      </td>
                      <td style={{ padding: '1.25rem', fontWeight: 800 }}>{v.discount_text}</td>
                      <td style={{ padding: '1.25rem' }}>
                        <span style={{ textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 900, color: '#64748b' }}>{v.type}</span>
                      </td>
                      <td style={{ padding: '1.25rem' }}>
                        <button 
                          onClick={() => handleToggleVoucherStatus(v.id, v.status)}
                          style={{
                            padding: '4px 12px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 900, border: 'none', cursor: 'pointer',
                            background: v.status === 'active' ? '#dcfce7' : '#fee2e2',
                            color: v.status === 'active' ? '#15803d' : '#b91c1c'
                          }}
                        >
                          {v.status.toUpperCase()}
                        </button>
                      </td>
                      <td style={{ padding: '1.25rem' }}>
                        <button onClick={() => handleDeleteVoucher(v.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  <th style={{ padding: '1.25rem' }}>Referral Code</th>
                  <th style={{ padding: '1.25rem' }}>Bonus</th>
                  <th style={{ padding: '1.25rem' }}>Wallet</th>
                  <th style={{ padding: '1.25rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1.25rem', fontWeight: 700 }}>{u.name || 'N/A'}</td>
                    <td style={{ padding: '1.25rem' }}>{u.mobile}</td>
                    <td style={{ padding: '1.25rem' }}>
                      <code style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', fontWeight: 800, color: '#3b82f6' }}>{u.referral_code || '---'}</code>
                    </td>
                    <td style={{ padding: '1.25rem', fontWeight: 800, color: '#10b981' }}>₹{u.bonus || 0}</td>
                    <td style={{ padding: '1.25rem', fontWeight: 800, color: '#0f172a' }}>₹{u.wallet || 0}</td>
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
                    Note: Use a <strong>direct link</strong> (ends in .jpg, .png).
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
                      <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: `url("${homeBannerUrl}") center/100% 100% no-repeat`,
                        filter: 'blur(10px) brightness(0.7)',
                        transform: 'scale(1.1)',
                        zIndex: 0
                      }}></div>
                      <div style={{
                        position: 'relative',
                        zIndex: 1,
                        width: '100%',
                        height: '100%',
                        background: `url("${homeBannerUrl}") center/contain no-repeat`,
                      }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                <div style={{ width: '48px', height: '48px', background: '#fef3c7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ImageIcon size={24} color="#d97706" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Quiz Arena Banners</h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Default background for quizzes without a specific banner</p>
                </div>
              </div>

              <div style={{ maxWidth: '700px' }}>
                <div className="form-group" style={{ marginBottom: '2rem' }}>
                  <label>Global Quiz Room Banner URL</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                      className="admin-input"
                      placeholder="https://example.com/quiz-banner.jpg"
                      value={quizRoomBannerUrl}
                      onChange={e => setQuizRoomBannerUrl(e.target.value)}
                    />
                    <button
                      className="admin-primary-btn"
                      style={{ padding: '0 2rem', background: '#d97706' }}
                      onClick={() => handleUpdateSetting('quiz_room_banner_url', quizRoomBannerUrl)}
                    >
                      Update
                    </button>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem', fontWeight: 600 }}>
                    Note: This banner will show up in the Quiz Arena if no specific banner is set for a quiz.
                  </p>
                </div>

                {quizRoomBannerUrl && (
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
                      <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: `url("${quizRoomBannerUrl}") center/cover no-repeat`,
                        filter: 'blur(10px) brightness(0.7)',
                        transform: 'scale(1.1)',
                        zIndex: 0
                      }}></div>
                      <div style={{
                        position: 'relative',
                        zIndex: 1,
                        width: '100%',
                        height: '100%',
                        background: `url("${quizRoomBannerUrl}") center/contain no-repeat`,
                      }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Zone Specific Banners */}
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                <div style={{ width: '48px', height: '48px', background: '#ecfdf5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ImageIcon size={24} color="#10b981" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Zone Specific Banners</h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Custom banners for Study Arena, Game Zone, etc.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '2rem' }}>
                {[
                  { id: 'study-zone', label: 'Study Arena Banner', value: studyZoneBannerUrl, setter: setStudyZoneBannerUrl },
                  { id: 'sport-zone', label: 'Sport Arena Banner', value: sportZoneBannerUrl, setter: setSportZoneBannerUrl },
                  { id: 'game-zone', label: 'Game Zone Banner', value: gameZoneBannerUrl, setter: setGameZoneBannerUrl },
                  { id: 'movie-zone', label: 'Movie Arena Banner', value: movieZoneBannerUrl, setter: setMovieZoneBannerUrl },
                  { id: 'news-zone', label: 'News Arena Banner', value: newsZoneBannerUrl, setter: setNewsZoneBannerUrl }
                ].map(zone => (
                  <div key={zone.id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '2rem' }}>
                    <div className="form-group">
                      <label>{zone.label}</label>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <input
                          className="admin-input"
                          placeholder={`https://example.com/${zone.id}-banner.jpg`}
                          value={zone.value}
                          onChange={e => zone.setter(e.target.value)}
                        />
                        <button
                          className="admin-primary-btn"
                          style={{ padding: '0 2rem', background: '#10b981' }}
                          onClick={() => handleUpdateSetting(`banner_zone_${zone.id}`, zone.value)}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                    {zone.value && (
                      <div style={{ marginTop: '1rem' }}>
                        <img src={zone.value} alt="Preview" style={{ width: '100%', maxHeight: '120px', objectFit: 'contain', background: '#0d1f3c', borderRadius: '0.75rem' }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Bonuses' && (() => {
          const activeValue = selectedBonusKey === 'welcome_bonus' ? welcomeBonus 
                            : selectedBonusKey === 'referral_referrer_bonus' ? referralReferrerBonus 
                            : selectedBonusKey === 'referral_referee_bonus' ? referralRefereeBonus
                            : selectedBonusKey === 'daily_login_bonus' ? dailyLoginBonus
                            : firstDepositBonus;
          const activeSetter = selectedBonusKey === 'welcome_bonus' ? setWelcomeBonus 
                             : selectedBonusKey === 'referral_referrer_bonus' ? setReferralReferrerBonus 
                             : selectedBonusKey === 'referral_referee_bonus' ? setReferralRefereeBonus
                             : selectedBonusKey === 'daily_login_bonus' ? setDailyLoginBonus
                             : setFirstDepositBonus;
          const activeDescription = selectedBonusKey === 'welcome_bonus' ? 'Credited to every new user immediately after OTP verification.'
                                  : selectedBonusKey === 'referral_referrer_bonus' ? 'Credited to the person whose referral code was used.'
                                  : selectedBonusKey === 'referral_referee_bonus' ? 'Additional bonus for the new user if they join via a valid code.'
                                  : selectedBonusKey === 'daily_login_bonus' ? 'Bonus cash credited to the user\'s wallet for logging in daily.'
                                  : 'Additional bonus cash rewarded when a user completes their first deposit.';
          const activeLabel = selectedBonusKey === 'welcome_bonus' ? 'Welcome Bonus Amount (₹)'
                            : selectedBonusKey === 'referral_referrer_bonus' ? 'Referrer Reward (₹)'
                            : selectedBonusKey === 'referral_referee_bonus' ? 'Referee Join Bonus (₹)'
                            : selectedBonusKey === 'daily_login_bonus' ? 'Daily Login Bonus (₹)'
                            : 'First Deposit Bonus (₹)';

          return (
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                <div style={{ width: '48px', height: '48px', background: '#fef3c7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={24} color="#d97706" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Bonus & Referral System</h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Configure automated rewards for users</p>
                </div>
              </div>

              <div style={{ maxWidth: '600px', background: '#f8fafc', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0', margin: '0 auto' }}>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>SELECT BONUS TYPE</label>
                  <select 
                    className="admin-input" 
                    value={selectedBonusKey} 
                    onChange={e => setSelectedBonusKey(e.target.value)}
                    style={{ background: 'white', marginTop: '0.5rem' }}
                  >
                    <option value="welcome_bonus">🎁 Welcome Bonus (₹)</option>
                    <option value="referral_referrer_bonus">👥 Referrer Reward (₹)</option>
                    <option value="referral_referee_bonus">🔗 Referee Join Bonus (₹)</option>
                    <option value="daily_login_bonus">📅 Daily Login Bonus (₹)</option>
                    <option value="first_deposit_bonus">💳 First Deposit Bonus (₹)</option>
                  </select>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.75rem', fontWeight: 500, fontStyle: 'italic' }}>
                    ℹ️ {activeDescription}
                  </p>
                </div>

                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>{activeLabel.toUpperCase()}</label>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <input
                      className="admin-input"
                      type="number"
                      placeholder="e.g. 100"
                      value={activeValue}
                      onChange={e => activeSetter(e.target.value)}
                      style={{ background: 'white' }}
                    />
                    <button
                      className="admin-primary-btn"
                      style={{ padding: '0 2rem', background: '#3b82f6', whiteSpace: 'nowrap' }}
                      onClick={() => handleUpdateSetting(selectedBonusKey, activeValue)}
                      disabled={isUpdatingSettings}
                    >
                      {isUpdatingSettings ? <Loader2 className="animate-spin" size={16} /> : 'Save Amount'}
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#eff6ff', borderRadius: '1rem', border: '1px solid #dbeafe' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                   <AlertCircle size={18} color="#3b82f6" />
                   <h4 style={{ fontSize: '0.9rem', fontWeight: 900, color: '#1e40af' }}>System Information</h4>
                 </div>
                 <p style={{ fontSize: '0.8rem', color: '#1e40af', opacity: 0.8, lineHeight: 1.6 }}>
                   These settings are applied globally. Any changes will take effect for all future registrations. 
                   Bonuses are credited as "Bonus Cash" and can be tracked in the user's transaction history.
                 </p>
              </div>
            </div>
          );
        })()}

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

            <div style={{ display: 'grid', gap: '1.5rem' }}>
               <div style={{ padding: '2rem', border: '2px dashed #e2e8f0', borderRadius: '1rem', textAlign: 'center' }}>
                  <p style={{ color: '#64748b', fontWeight: 600 }}>Banners have been moved to the <strong style={{ color: '#3b82f6', cursor: 'pointer' }} onClick={() => setActiveTab('Banners')}>Banners Section</strong>.</p>
               </div>
               <div style={{ padding: '2rem', border: '2px dashed #e2e8f0', borderRadius: '1rem', textAlign: 'center' }}>
                  <p style={{ color: '#64748b', fontWeight: 600 }}>Bonus & Referral settings have been moved to the <strong style={{ color: '#3b82f6', cursor: 'pointer' }} onClick={() => setActiveTab('Bonuses')}>Bonuses Section</strong>.</p>
               </div>
            </div>
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem' }}>
                      <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                        <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Submission Stats</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Score:</span>
                            <span style={{ fontSize: '1rem', fontWeight: 900, color: '#10b981' }}>{reviewData.submission.correct_count} Correct / {reviewData.submission.wrong_count} Wrong</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Time Taken:</span>
                            <span style={{ fontSize: '1rem', fontWeight: 900, color: '#3b82f6' }}>{reviewData.submission.time_taken || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                        <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>User Details</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <p style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>{participants.find(p => p.id === reviewData.submission.id)?.name || 'User'}</p>
                          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>{participants.find(p => p.id === reviewData.submission.id)?.mobile || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e293b', textTransform: 'uppercase' }}>Question Wise Details</p>
                      {reviewData.answers.map((ans, idx) => {
                        // Normalize correct answer value (could be A,B,C,D or 0,1,2,3)
                        const normalizeIndex = (val) => {
                          if (val === null || val === undefined) return -1;
                          const v = String(val).toUpperCase();
                          const mapping = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, '0': 0, '1': 1, '2': 2, '3': 3 };
                          return mapping[v] ?? -1;
                        };

                        const isResultDeclared = !!reviewData.submission.quiz_winner_id;

                        // High-precision cleanup logic for corrupted ingestion
                        const subTitle = reviewData.submission.title?.trim().toLowerCase();
                        const qText = ans.question_text?.trim().toLowerCase();

                        // Check if the saved question text is actually just the quiz title
                        const isTitleMatch = qText === subTitle || qText === "question" || !ans.question_text;
                        // Check if the real question text (with ?) is hidden in the options
                        const opt0HasQMark = ans.options?.[0]?.text?.includes('?');

                        const isCorrupted = (isTitleMatch || (!ans.question_text?.includes('?') && opt0HasQMark)) && ans.options?.length > 1;

                        const displayQuestion = isCorrupted ? ans.options[0].text : ans.question_text;
                        const optionsToDisplay = [...(isCorrupted ? ans.options.slice(1) : (ans.options || []))];

                        // Data Recovery padding
                        const selIdx = normalizeIndex(ans.selected_value);
                        const corIdxRaw = normalizeIndex(ans.correct_value);
                        let corIdx = corIdxRaw;
                        if (isCorrupted && ans.options?.[corIdxRaw]?.text?.trim() === (isCorrupted ? ans.options[0].text : ans.question_text)?.trim()) {
                          corIdx = corIdxRaw + 1;
                        }
                        const targetLen = Math.max(4, selIdx + 1, corIdx + 1);
                        
                        while (optionsToDisplay.length < targetLen && optionsToDisplay.length < 10) {
                          optionsToDisplay.push({ 
                            text: 'Option data not available', 
                            value: String(optionsToDisplay.length + (isCorrupted ? 1 : 0)) 
                          });
                        }

                        // Adjusted correct index: If corrupted and pointing to the question text, shift by 1
                        const correctIdxRaw = normalizeIndex(ans.correct_value);
                        let correctIdx = correctIdxRaw;
                        if (isCorrupted && ans.options?.[correctIdxRaw]?.text?.trim() === displayQuestion?.trim()) {
                          correctIdx = correctIdxRaw + 1;
                        }

                        return (
                          <div key={idx} style={{ padding: '2.5rem', border: '1px solid #f1f5f9', borderRadius: '2rem', background: 'white', boxShadow: '0 8px 30px rgba(0,0,0,0.02)', marginBottom: '2.5rem' }}>
                            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', alignItems: 'flex-start' }}>
                              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 950, color: 'white', flexShrink: 0 }}>
                                {idx + 1}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.6rem', letterSpacing: '0.1em' }}>QUESTION TEXT</p>
                                  <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#3b82f6', background: '#eff6ff', padding: '4px 10px', borderRadius: '20px' }}>POINT: {ans.marks || 1}</span>
                                </div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.4, margin: 0 }}>{displayQuestion}</h3>
                                {ans.hindi_question_text && <p style={{ fontSize: '1.1rem', color: '#475569', marginTop: '1rem', fontWeight: 600, margin: 0, paddingLeft: '1.25rem', borderLeft: '4px solid #e2e8f0' }}>{ans.hindi_question_text}</p>}
                              </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                              {optionsToDisplay.map((opt, oIdx) => {
                                // Map back to original indices if we shifted/filtered
                                const actualVal = opt.value;
                                const selectedIdx = normalizeIndex(ans.selected_value);

                                const isSelected = String(selectedIdx) === String(actualVal);
                                const isCorrect = String(correctIdx) === String(actualVal);

                                let bgColor = '#f8fafc';
                                let borderColor = '#e2e8f0';
                                let textColor = '#475569';
                                let badge = null;

                                if (isCorrect) {
                                  bgColor = '#f0fdf4';
                                  borderColor = '#10b981';
                                  textColor = '#166534';
                                  badge = isSelected ? 'CORRECTLY ANSWERED' : 'CORRECT ANSWER';
                                } else if (isSelected && !isCorrect) {
                                  bgColor = '#fef2f2';
                                  borderColor = '#ef4444';
                                  textColor = '#991b1b';
                                  badge = 'WRONG SELECTION';
                                }

                                return (
                                  <div key={oIdx} style={{
                                    padding: '1.5rem 2rem',
                                    borderRadius: '1.5rem',
                                    background: bgColor,
                                    border: `2px solid ${borderColor}`,
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    color: textColor,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    transition: 'all 0.3s ease'
                                  }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: isCorrect ? '#10b981' : (isSelected ? '#ef4444' : '#64748b'), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900 }}>
                                        {String.fromCharCode(65 + oIdx)}
                                      </div>
                                      <span style={{ lineHeight: 1.4 }}>{opt.text}</span>
                                    </div>
                                    {badge && (
                                      <span style={{ fontSize: '0.65rem', fontWeight: 950, padding: '6px 12px', borderRadius: '8px', background: isCorrect ? '#10b981' : '#ef4444', color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {badge}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {isResultDeclared && !optionsToDisplay.some(opt => String(correctIdx) === String(opt.value)) && (
                              <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: '#f0fdf4', borderRadius: '1.25rem', border: '1px solid #10b981', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>âœ“</div>
                                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#166534' }}>
                                  CORRECT ANSWER (IN DATABASE): {ans.options?.find(o => normalizeIndex(o.value) === correctIdx)?.text || 'N/A'}
                                </span>
                              </div>
                            )}

                            {!ans.selected_value && (
                              <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#fffbeb', borderRadius: '1.5rem', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#b45309' }}>âš ï¸ QUESTION WAS SKIPPED BY USER</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Ingestion Preview Modal */}
        {showIngestionPreview && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ background: 'white', width: '100%', maxWidth: '900px', maxHeight: '90vh', borderRadius: '2rem', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
              <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>Review Ingested Content</h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>We found {ingestedQuestions.length} questions in your file</p>
                </div>
                <button onClick={() => setShowIngestionPreview(false)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {ingestedQuestions.map((q, idx) => (
                    <div key={idx} style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
                      <p style={{ fontWeight: 800, color: '#3b82f6', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase' }}>Question {idx + 1}</p>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: '#1e293b' }}>{q.text}</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} style={{ 
                            padding: '0.75rem 1rem', borderRadius: '0.75rem', 
                            background: q.correctOptionIndex === oIdx ? '#dcfce7' : 'white',
                            border: `1px solid ${q.correctOptionIndex === oIdx ? '#22c55e' : '#e2e8f0'}`,
                            fontSize: '0.9rem', fontWeight: 600,
                            color: q.correctOptionIndex === oIdx ? '#15803d' : '#475569',
                            display: 'flex', justifyContent: 'space-between'
                          }}>
                            <span>{opt.text || `Option ${oIdx + 1}`}</span>
                            {q.correctOptionIndex === oIdx && <CheckCircle2 size={16} />}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '1rem', background: '#f8fafc' }}>
                <button onClick={() => setShowIngestionPreview(false)} style={{ flex: 1, padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0', background: 'white', fontWeight: 800, color: '#64748b', cursor: 'pointer' }}>Discard & Retry</button>
                <button onClick={confirmIngestion} style={{ flex: 2, padding: '1rem', borderRadius: '1rem', border: 'none', background: '#0f172a', color: 'white', fontWeight: 900, cursor: 'pointer' }}>Confirm & Open Editor</button>
              </div>
            </div>
          </div>
        )}
        {/* Paste Text Modal */}
        {showPasteModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', zIndex: 2100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ background: 'white', width: '100%', maxWidth: '700px', borderRadius: '2rem', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
              <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontWeight: 900, color: '#0f172a' }}>Paste Questions or JSON</h3>
                <button onClick={() => setShowPasteModal(false)} style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer' }}><X size={16} /></button>
              </div>
              <div style={{ padding: '2rem' }}>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem', fontWeight: 600 }}>Paste your questions (Plain Text or JSON array) below.</p>
                <textarea
                  style={{ width: '100%', minHeight: '300px', padding: '1.5rem', borderRadius: '1rem', border: '2px solid #e2e8f0', fontFamily: 'monospace', fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s' }}
                  placeholder={'Example JSON: [{"text":"Q1","options":[{"text":"A"}]}] \n\nOR Plain Text: \nQ: Question?\nA: Opt1, B: Opt2... \nAns: A'}
                  value={pastedText}
                  onChange={e => setPastedText(e.target.value)}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                   <button onClick={() => document.getElementById('bulk-file-input').click()} style={{ flex: 1, padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0', background: 'white', fontWeight: 800, color: '#3b82f6', cursor: 'pointer' }}>Upload Instead</button>
                   <button onClick={handlePasteSubmit} style={{ flex: 2, padding: '1rem', borderRadius: '1rem', border: 'none', background: '#3b82f6', color: 'white', fontWeight: 900, cursor: 'pointer' }}>Process & Preview</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showIngestOptions && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', zIndex: 2100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ background: 'white', width: '100%', maxWidth: '600px', borderRadius: '2rem', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
              <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontWeight: 900, color: '#0f172a' }}>{activeIngestFormat} Ingestion Options</h3>
                <button onClick={() => setShowIngestOptions(false)} style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer' }}><X size={16} /></button>
              </div>
              <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <div 
                  onClick={() => { setShowIngestOptions(false); setShowPasteModal(true); }}
                  style={{ padding: '1.5rem', borderRadius: '1.25rem', border: '2px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '1rem' }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.background = '#f0f9ff'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white'; }}
                >
                  <div style={{ width: '48px', height: '48px', background: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clipboard size={24} color="#3b82f6" />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 800, color: '#1e293b' }}>
                      {activeIngestFormat === 'PNG/JPG' ? 'Paste Image Content' : `Paste ${activeIngestFormat} Text`}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Copy and paste the raw content manually</p>
                  </div>
                </div>

                <div 
                  onClick={() => { setShowIngestOptions(false); document.getElementById('bulk-file-input').click(); }}
                  style={{ padding: '1.5rem', borderRadius: '1.25rem', border: '2px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '1rem' }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.background = '#f0f9ff'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white'; }}
                >
                  <div style={{ width: '48px', height: '48px', background: '#ecfdf5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Upload size={24} color="#10b981" />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 800, color: '#1e293b' }}>Upload {activeIngestFormat} File</h4>
                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Browse your computer for the file</p>
                  </div>
                </div>

                <div 
                  onClick={() => { setShowIngestOptions(false); setShowImagePasteModal(true); }}
                  style={{ 
                    padding: '1.5rem', borderRadius: '1.25rem', border: '2px dashed #3b82f6', 
                    background: activeIngestFormat === 'PNG/JPG' ? '#dbeafe' : '#eff6ff', 
                    cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '1rem' 
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = '#dbeafe'; }}
                  onMouseOut={e => { e.currentTarget.style.background = activeIngestFormat === 'PNG/JPG' ? '#dbeafe' : '#eff6ff'; }}
                >
                  <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ImageIcon size={24} color="#3b82f6" />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 800, color: '#1e293b' }}>Direct Image Paste</h4>
                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Click to open paste area or press <strong>Ctrl+V</strong> anywhere!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {showImagePasteModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', zIndex: 2200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ background: 'white', width: '100%', maxWidth: '600px', borderRadius: '2rem', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
              <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontWeight: 900, color: '#0f172a' }}>Paste Image Area</h3>
                <button onClick={() => setShowImagePasteModal(false)} style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer' }}><X size={16} /></button>
              </div>
              <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                <div 
                  style={{ 
                    width: '120px', height: '120px', background: '#eff6ff', borderRadius: '40px', 
                    margin: '0 auto 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '3px dashed #3b82f6', color: '#3b82f6'
                  }}
                >
                  <ImageIcon size={48} />
                </div>
                <h2 style={{ fontWeight: 900, color: '#1e293b', marginBottom: '1rem' }}>Ready to Paste!</h2>
                <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                  Copy any quiz image and press <strong style={{ color: '#3b82f6', background: '#eff6ff', padding: '4px 10px', borderRadius: '8px' }}>Ctrl + V</strong> here to start extraction.
                </p>
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid #e2e8f0', fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>
                  Supports PNG, JPG, JPEG from Clipboard
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
