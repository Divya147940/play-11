// Play11 API Service Layer (Connected to Neon DB with In-Memory 0ms Cache Layer)
const API_BASE = '/api';

// Lightweight, highly-efficient client-side cache store
const cacheStore = {
  store: new Map(),
  get(key, ttl = 8000) { // Default TTL: 8 seconds
    const item = this.store.get(key);
    if (!item) return null;
    const isExpired = Date.now() - item.timestamp > ttl;
    if (isExpired) {
      this.store.delete(key);
      return null;
    }
    return item.data;
  },
  set(key, data) {
    this.store.set(key, { data, timestamp: Date.now() });
  },
  invalidate() {
    this.store.clear(); // Complete cache invalidation on mutations to guarantee fresh data
  }
};

// Interceptor function to cache GET requests and dynamically invalidate on updates
const cachedFetch = async (url, options = {}, ttl = 8000) => {
  const method = options.method || 'GET';
  
  // Mutations (POST, PUT, DELETE) immediately wipe cache to prevent stale views
  if (method.toUpperCase() !== 'GET') {
    cacheStore.invalidate();
    return fetch(url, options);
  }

  // Create key based on URL and user token to prevent cross-account cache contamination
  const authHeader = options.headers ? options.headers['Authorization'] : '';
  const cacheKey = `${url}:${authHeader || ''}`;
  
  const cachedData = cacheStore.get(cacheKey, ttl);
  if (cachedData) {
    // Emulate standard Fetch response object to ensure perfect API compatibility
    return {
      ok: true,
      status: 200,
      json: async () => JSON.parse(JSON.stringify(cachedData)),
      _fromCache: true
    };
  }

  const response = await fetch(url, options);
  if (response.ok) {
    const clone = response.clone();
    try {
      const data = await clone.json();
      cacheStore.set(cacheKey, data);
    } catch (e) {
      // Ignore if body is not JSON format
    }
  }
  return response;
};

const getAuthHeader = () => {
  const session = localStorage.getItem('play11_session') || localStorage.getItem('play11_admin_session');
  if (session) {
    try {
      // Try parsing as JSON (user session)
      const parsed = JSON.parse(session);
      const token = typeof parsed === 'object' ? (parsed.token || session) : session;
      return { 'Authorization': `Bearer ${token}` };
    } catch (e) {
      // Not JSON (admin session is just a token string)
      return { 'Authorization': `Bearer ${session}` };
    }
  }
  return {};
};

const handleResponse = async (response) => {
  if (response.status === 401) {
    localStorage.removeItem('play11_session');
    localStorage.removeItem('play11_admin_session');
    throw new Error('Session expired. Please login again.');
  }

  if (!response.ok) {
    let errorMessage = 'API request failed';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (e) {
      // Fallback if response is not JSON
    }
    throw new Error(errorMessage);
  }
  const data = await response.json();
  return data.history || data.categories || data.quizzes || data.questions || data.quiz || data.user || data.stats || data.users || data;
};

export const authService = {
  sendOtp: async (mobile) => {
    const response = await cachedFetch(`${API_BASE}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile }),
    });
    return handleResponse(response);
  },
  verifyOtp: async (mobile, otp_code, firebaseToken) => {
    const response = await cachedFetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, otp_code, firebaseToken }),
    });
    const data = await handleResponse(response);
    if (data.token) {
      localStorage.setItem('play11_session', JSON.stringify({ token: data.token, user: data.user }));
    }
    return data;
  },
  updateProfile: async (name) => {
    const response = await cachedFetch(`${API_BASE}/auth/update-profile`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ name }),
    });
    return handleResponse(response);
  },
  getHistory: async () => {
    const response = await cachedFetch(`${API_BASE}/auth/history`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(response);
  },
  logout: () => {
    cacheStore.invalidate();
    localStorage.removeItem('play11_session');
    localStorage.removeItem('play11_admin_session');
  }
};

export const quizService = {
  getStudyCategories: async () => {
    const response = await cachedFetch(`${API_BASE}/categories/study`);
    const data = await handleResponse(response);
    return data;
  },
  getGameCategories: async () => {
    const response = await cachedFetch(`${API_BASE}/categories/game`);
    const data = await handleResponse(response);
    return data;
  },
  getQuizzesByZone: async (zoneId) => {
    const response = await cachedFetch(`${API_BASE}/quizzes/zone/${zoneId}`, {
      headers: { ...getAuthHeader() }
    });
    const data = await handleResponse(response);
    return data;
  },
  getAllQuizzes: async () => {
    const response = await cachedFetch(`${API_BASE}/quizzes`, {
      headers: { ...getAuthHeader() }
    });
    const data = await handleResponse(response);
    return data;
  },
  getJoinedQuizzes: async () => {
    const response = await cachedFetch(`${API_BASE}/quizzes/joined`, {
      headers: { ...getAuthHeader() }
    });
    const data = await handleResponse(response);
    return data;
  },
  getQuizzes: async (categoryId) => {
    const response = await cachedFetch(`${API_BASE}/quizzes/category/${categoryId}`);
    const data = await handleResponse(response);
    return data;
  },
  getQuizById: async (id) => {
    const response = await cachedFetch(`${API_BASE}/quizzes/${id}`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(response);
  },
  getQuestions: async (quizId) => {
    const response = await cachedFetch(`${API_BASE}/quizzes/${quizId}/questions`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(response);
  },
  submitQuiz: async (quizId, answers) => {
    const response = await cachedFetch(`${API_BASE}/quizzes/${quizId}/submit`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ answers }),
    });
    return handleResponse(response);
  }
};

export const adminService = {
  getStats: async () => {
    const response = await cachedFetch(`${API_BASE}/admin/dashboard`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(response);
  },
  getUsers: async (page = 1) => {
    const response = await cachedFetch(`${API_BASE}/admin/users?page=${page}`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(response);
  }
};

export const settingsService = {
  getSetting: async (key) => {
    const response = await cachedFetch(`${API_BASE}/settings/${key}`);
    return handleResponse(response);
  },
  updateSetting: async (key, value) => {
    const response = await cachedFetch(`${API_BASE}/settings/update`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ key, value }),
    });
    return handleResponse(response);
  }
};

