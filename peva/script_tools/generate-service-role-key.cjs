/**
 * Génère la clé service_role à partir du JWT_SECRET
 */

const crypto = require('crypto');

const JWT_SECRET = 'sNul87S0DBIlifOvCQwxLtdGqxNwqbF2UvzxKUDB';

// Payload pour service_role (même format que Supabase)
const header = {
  alg: 'HS256',
  typ: 'JWT'
};

const payload = {
  role: 'service_role',
  iss: 'supabase',
  iat: Math.floor(new Date('2025-06-22').getTime() / 1000), // Même date que anon key
  exp: Math.floor(new Date('2030-06-22').getTime() / 1000)  // Expire dans 5 ans
};

function base64UrlEncode(obj) {
  return Buffer.from(JSON.stringify(obj))
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

const headerEncoded = base64UrlEncode(header);
const payloadEncoded = base64UrlEncode(payload);

const signature = crypto
  .createHmac('sha256', JWT_SECRET)
  .update(`${headerEncoded}.${payloadEncoded}`)
  .digest('base64')
  .replace(/=/g, '')
  .replace(/\+/g, '-')
  .replace(/\//g, '_');

const serviceRoleKey = `${headerEncoded}.${payloadEncoded}.${signature}`;

console.log('='.repeat(60));
console.log('SUPABASE SERVICE ROLE KEY');
console.log('='.repeat(60));
console.log(serviceRoleKey);
console.log('='.repeat(60));
console.log('\nAjouter cette variable sur Vercel:');
console.log('SUPABASE_SERVICE_ROLE_KEY=' + serviceRoleKey);
