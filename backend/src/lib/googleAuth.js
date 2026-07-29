const { OAuth2Client } = require('google-auth-library')

let client = null

function getClient() {
  if (!client) {
    client = new OAuth2Client()
  }
  return client
}

// Verifica o ID Token do Google inteiramente no servidor: a biblioteca oficial
// valida a assinatura contra as chaves públicas do Google, o emissor (iss),
// a audiência (aud === nosso client ID) e a expiração. Nenhum dado de perfil
// enviado pelo frontend é confiado — só o que sai deste payload verificado.
async function verifyGoogleIdToken(idToken) {
  const audience = process.env.GOOGLE_CLIENT_ID
  if (!audience) {
    throw new Error('GOOGLE_CLIENT_ID não configurado no servidor.')
  }

  const ticket = await getClient().verifyIdToken({ idToken, audience })
  const payload = ticket.getPayload()

  if (!payload || !payload.sub || !payload.email) {
    throw new Error('Token do Google inválido.')
  }

  if (!payload.email_verified) {
    throw new Error('O e-mail da conta Google não foi verificado.')
  }

  return {
    googleId: payload.sub,
    email: payload.email.toLowerCase(),
    name: payload.name || payload.email.split('@')[0],
  }
}

module.exports = { verifyGoogleIdToken }
