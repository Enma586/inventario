import dotenv from 'dotenv'

dotenv.config()

const requiredVars = [
    'PORT',
    'MONGO_URI',
    'NODE_ENV',
    'CORS_ORIGIN'
]

const misising = requiredVars.filter(key => !process.env[key])

if (misising.length > 0) {
    throw new Error(`Missing required environment variables: ${misising.join(', ')}`)
}

export const env = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    NODE_ENV: process.env.NODE_ENV,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    TZ: process.env.TZ || 'America/El_Salvador'
}