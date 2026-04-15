// Play11 API Service Layer (Mocks Section 7.x)
const API_BASE = '/api';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  sendOtp: async (mobile) => {
    await sleep(800);
    return { success: true, message: 'OTP Sent Successfully' };
  },
  verifyOtp: async (mobile, otp) => {
    await sleep(1000);
    const mockUser = { id: 'u1', mobile, name: 'Elite Player', status: 'Active' };
    localStorage.setItem('play11_session', JSON.stringify({ token: 'mock_jwt_token', user: mockUser }));
    return { success: true, user: mockUser };
  },
  logout: () => {
    localStorage.removeItem('play11_session');
  }
};

export const quizService = {
  getStudyCategories: async () => {
    await sleep(500);
    return [
      { id: 'ssc', name: 'SSC', count: 124 },
      { id: 'upsc', name: 'UPSC', count: 86 },
      { id: 'banking', name: 'Banking', count: 145 }
    ];
  },
  getQuizzes: async (categoryId) => {
    await sleep(600);
    return [
      { id: 'q1', title: 'CGL Mock 1', subject: 'Reasoning', questions: 25, time: 20, status: 'free', difficulty: 'Medium' }
    ];
  }
};

export const adminService = {
  getStats: async () => {
    await sleep(400);
    return {
      totalUsers: 12450,
      activeQuizzes: 142,
      liveMatches: 18,
      revenue: '4.2L'
    };
  },
  getUsers: async () => {
    await sleep(600);
    return [
      { id: 1, name: 'Rahul Kumar', mobile: '98*** **321', status: 'Active', joined: '2m ago', score: '1,450' },
      { id: 2, name: 'Surbhi Sharma', mobile: '70*** **984', status: 'Active', joined: '15m ago', score: '3,210' },
      { id: 3, name: 'Amit Singh', mobile: '88*** **112', status: 'Blocked', joined: '1h ago', score: '0' }
    ];
  }
};
