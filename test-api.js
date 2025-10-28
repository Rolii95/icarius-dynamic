const fetch = require('node-fetch');

const testApiEndpoint = async () => {
  try {
    const response = await fetch('http://localhost:3002/api/lead-magnet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        consent: true,
        utm: { utm_source: 'test' },
        source: 'test'
      })
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error testing API:', error.message);
  }
};

testApiEndpoint();