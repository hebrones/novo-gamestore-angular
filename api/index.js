// Serverless function para Vercel
// Este arquivo serve como proxy para a API Node.js

module.exports = (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Resposta básica para teste
  if (req.url === '/api/health') {
    res.status(200).json({ 
      status: 'ok', 
      message: 'GameStore API is running on Vercel',
      timestamp: new Date().toISOString()
    });
    return;
  }

  // Resposta para rotas não implementadas
  res.status(404).json({ 
    error: 'API endpoint not found',
    message: 'This is a basic API proxy. Full API functionality needs to be implemented.',
    availableEndpoints: ['/api/health']
  });
};