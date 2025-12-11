const http = require('http');

const postData = JSON.stringify({
    email: 'admin@university.edu',
    password: 'user123'
});

const options = {
    hostname: 'localhost',
    port: 3002,
    path: '/api/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let responseBody = '';
    res.on('data', (chunk) => { responseBody += chunk; });
    res.on('end', () => {
        console.log('BODY:', responseBody);
        try {
            const json = JSON.parse(responseBody);
            if (json.token) {
                console.log('✅ Login Successful. Token received.');
                // Test fetch users
                fetchUsers(json.token);
            } else {
                console.error('❌ Login Failed: No token.');
            }
        } catch (e) { console.error('❌ Invalid JSON response'); }
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(postData);
req.end();

function fetchUsers(token) {
    const opts = {
        hostname: 'localhost',
        port: 3002,
        path: '/api/users',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    const req2 = http.request(opts, (res) => {
        console.log(`USERS STATUS: ${res.statusCode}`);
        let body = '';
        res.on('data', c => body += c);
        res.on('end', () => {
            console.log('USERS BODY Length:', body.length);
            console.log('USERS SAMPLE:', body.substring(0, 100));
            if (res.statusCode === 200) console.log('✅ Fetch Users Successful.');
            else console.error('❌ Fetch Users Failed.');
        });
    });
    req2.end();
}
