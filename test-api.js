// Test script to verify the API endpoint
// To run: node test-api.js (after starting the server)

const fetch = require('node-fetch'); // You may need to install: npm install node-fetch

const testUserRegistration = async () => {
  try {
    const response = await fetch('http://localhost:3000/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ User registration successful:', data);
    } else {
      console.log('❌ User registration failed:', data);
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
    console.log('Make sure the server is running on http://localhost:3000');
  }
};

// Test with invalid data
const testValidation = async () => {
  try {
    const response = await fetch('http://localhost:3000/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'invalid-email',
        password: '123', // Too short
      }),
    });

    const data = await response.json();
    console.log('🧪 Validation test result:', data);
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
};

// Run tests
console.log('🚀 Testing User Registration API...\n');

setTimeout(() => {
  testUserRegistration();
  setTimeout(() => {
    testValidation();
  }, 1000);
}, 1000);
