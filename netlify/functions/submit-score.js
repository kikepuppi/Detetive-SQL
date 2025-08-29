const { GoogleSpreadsheet } = require('google-spreadsheet');

// Helper para carregar as credenciais de forma segura
const creds = {
  client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  // Substitui a sequência de escape \\n por um caractere de nova linha real
  private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
};

exports.handler = async (event) => {
  // Apenas permite requisições POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { nome, tempo, telefone } = JSON.parse(event.body);

    // Validação básica para garantir que os dados essenciais foram enviados
    if (!nome || typeof tempo === 'undefined') {
      return { statusCode: 400, body: 'Bad Request: Nome e tempo são obrigatórios.' };
    }

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    
    const sheet = doc.sheetsByTitle['Leaderboard'];
    if (!sheet) {
      throw new Error("Página 'Leaderboard' não encontrada na planilha.");
    }

    await sheet.addRow({ Nome: nome, 'Tempo (segundos)': tempo, Telefone: telefone });

    const rows = await sheet.getRows();
    const scores = rows.map(row => parseInt(row['Tempo (segundos)'], 10));
    scores.sort((a, b) => a - b);
    
    // O tempo precisa ser convertido para número para a busca funcionar corretamente
    const numericTime = parseInt(tempo, 10);
    const rank = scores.indexOf(numericTime) + 1;

    return {
      statusCode: 200,
      body: JSON.stringify({ rank: rank }),
    };
  } catch (error) {
    // Loga o erro real no console da função na Netlify para depuração
    console.error('Erro na função:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'Erro interno ao processar a pontuação.', details: error.message }) 
    };
  }
};