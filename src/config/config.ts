export default {
    port: Number(process.env.PORT) || 3001,
    
    
    //JWT
    seed: process.env.SEED || 'dev-secret',
    tokenExpires: process.env.TOKEN_EXPIRES || '48h'
}