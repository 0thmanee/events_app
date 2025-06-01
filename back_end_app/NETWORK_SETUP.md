# Network Access Setup Guide

## Basic Setup

1. Start the server:
```bash
npm run dev
```

2. The server will show available network addresses:
```
Available on:
Local:            http://localhost:3001
On Your Network:  http://192.168.x.x:3001
```

## Troubleshooting Connection Issues

### 1. Verify Server is Running
- Check the console output for the correct IP address
- Ensure the server shows "Connected to MongoDB" message
- Verify the port number matches your configuration

### 2. Check Firewall Settings

#### On Windows:
1. Open Windows Defender Firewall
2. Click "Allow an app through firewall"
3. Click "Change settings" (requires admin)
4. Click "Allow another app"
5. Browse to your Node.js executable
6. Ensure both "Private" and "Public" are checked

#### On macOS:
1. Open System Preferences > Security & Privacy
2. Select Firewall tab
3. Click "Firewall Options"
4. Add Node.js to allowed applications

#### On Linux:
Allow incoming connections on your port:
```bash
sudo ufw allow 3001
```

### 3. Test Local Access

1. On the server machine:
```bash
curl http://localhost:3001/api/users/register
```

2. Using the network IP:
```bash
curl http://<your-network-ip>:3001/api/users/register
```

### 4. Common Issues and Solutions

#### ECONNREFUSED Error
1. Verify the port is not in use:
```bash
# On Linux/macOS
lsof -i :3001

# On Windows (PowerShell)
netstat -ano | findstr :3001
```

2. Try a different port in .env:
```
PORT=3002
```

#### Network Access Denied
1. Check your antivirus firewall settings
2. Temporarily disable firewall to test (remember to re-enable)
3. Verify network permissions

#### CORS Issues
If getting CORS errors from frontend:
1. Verify cors configuration in app.js
2. Check the request headers
3. Ensure the frontend URL is allowed

## Security Considerations

1. In development:
   - CORS is set to allow all origins (*)
   - Server accessible to all devices on local network

2. For production:
   - Set specific CORS origins
   - Use HTTPS
   - Implement rate limiting
   - Configure proper firewall rules

## Testing Network Access

Use this curl command to test the API:
```bash
curl -X POST http://<your-network-ip>:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","nickname":"test"}'
```

If successful, you should receive a JSON response with user data and token.
