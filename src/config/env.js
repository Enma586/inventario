import dotenv from 'dotenv'

dotenv.config()

const requiredVars = [
    'PORT',
    'NODE_ENV',
    'CORS_ORIGIN',
    'DATABASE_URL'  
]

const misising = requiredVars.filter(key => !process.env[key])

if (misising.length > 0) {
    throw new Error(`Missing required environment variables: ${misising.join(', ')}`)
}

export const env = {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    TZ: process.env.TZ || 'America/El_Salvador'
}