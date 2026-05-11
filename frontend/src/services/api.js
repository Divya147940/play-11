// Play11 API Service Layer (Connected to Neon DB)
const API_BASE = '/api';

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
    const response = await fetch(`${API_BASE}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile }),
    });
    return handleResponse(response);
  },
  verifyOtp: async (mobile, otp_code, firebaseToken) => {
    const response = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, otp_code, firebaseToken }),
    });
    const data = await handleResponse(response);
    // Handle the wrapper if needed, but verifyOtp returns { success, token, user, isNewUser }
    if (data.token) {
      localStorage.setItem('play11_session', JSON.stringify({ token: data.token, user: data.user }));
    }
    return data;
  },
  updateProfile: async (name) => {
    const response = await fetch(`${API_BASE}/auth/update-profile`, {
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
    const response = await fetch(`${API_BASE}/auth/history`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(response);
  },
  logout: () => {
    localStorage.removeItem('play11_session');
    localStorage.removeItem('play11_admin_session');
  }
};

export const quizService = {
  getStudyCategories: async () => {
    const response = await fetch(`${API_BASE}/categories/study`);
    const data = await handleResponse(response);
    return data;
  },
  getGameCategories: async () => {
    const response = await fetch(`${API_BASE}/categories/game`);
    const data = await handleResponse(response);
    return data;
  },
  getQuizzesByZone: async (zoneId) => {
    const response = await fetch(`${API_BASE}/quizzes/zone/${zoneId}`, {
      headers: { ...getAuthHeader() }
    });
    const data = await handleResponse(response);
    return data;
  },
  getAllQuizzes: async () => {
    const response = await fetch(`${API_BASE}/quizzes`, {
      headers: { ...getAuthHeader() }
    });
    const data = await handleResponse(response);
    return data;
  },
  getJoinedQuizzes: async () => {
    const response = await fetch(`${API_BASE}/quizzes/joined`, {
      headers: { ...getAuthHeader() }
    });
    const data = await handleResponse(response);
    return data;
  },
  getQuizzes: async (categoryId) => {
    const response = await fetch(`${API_BASE}/quizzes/category/${categoryId}`);
    const data = await handleResponse(response);
    return data;
  },
  getQuizById: async (id) => {
    const response = await fetch(`${API_BASE}/quizzes/${id}`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(response);
  },
  getQuestions: async (quizId) => {
    const response = await fetch(`${API_BASE}/quizzes/${quizId}/questions`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(response);
  },
  submitQuiz: async (quizId, answers) => {
    const response = await fetch(`${API_BASE}/quizzes/${quizId}/submit`, {
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
    const response = await fetch(`${API_BASE}/admin/dashboard`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(response);
  },
  getUsers: async (page = 1) => {
    const response = await fetch(`${API_BASE}/admin/users?page=${page}`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(response);
  }
};

export const settingsService = {
  getSetting: async (key) => {
    const response = await fetch(`${API_BASE}/settings/${key}`);
    return handleResponse(response);
  },
  updateSetting: async (key, value) => {
    const response = await fetch(`${API_BASE}/settings/update`, {
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
