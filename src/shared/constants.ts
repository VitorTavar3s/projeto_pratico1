export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'senha123',
  expiresIn: '1d'
};