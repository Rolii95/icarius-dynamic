const http = require('http');

const testApiEndpoint = () => {
  const postData = JSON.stringify({
    email: 'test@example.com',
    consent: true,
    utm: { utm_source: 'test' },
    source: 'test'
  });

  const options = {
    hostname: 'localhost',
    port: 3002,
    path: '/api/lead-magnet',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Response status: ${res.statusCode}`);
    console.log(`Response headers:`, res.headers);
    
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
    
    res.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('Response data:', JSON.stringify(data, null, 2));
      } catch (error) {
        console.log('Response body (raw):', body);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Error testing API:', error.message);
  });

  req.write(postData);
  req.end();
};

testApiEndpoint();