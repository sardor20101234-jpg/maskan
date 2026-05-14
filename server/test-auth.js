const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAuth() {
  console.log('🧪 Starting Auth Verification...');

  try {
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'password123';

    // 1. Register
    console.log('1. Testing Registration...');
    const regRes = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test User',
      email: testEmail,
      password: testPassword,
      role: 'student'
    });
    console.log('✅ Registration successful!');
    const token = regRes.data.token;

    // 2. Login
    console.log('2. Testing Login...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: testEmail,
      password: testPassword
    });
    console.log('✅ Login successful!');

    // 3. Me
    console.log('3. Testing /me endpoint...');
    const meRes = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ /me endpoint returned correct user:', meRes.data.name);

    console.log('\n✨ ALL AUTH TESTS PASSED!');
  } catch (err) {
    console.error('❌ Auth test failed!');
    console.error(err.response?.data || err.message);
    process.exit(1);
  }
}

testAuth();
