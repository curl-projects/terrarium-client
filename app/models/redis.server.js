import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: 'https://usw1-major-sponge-33693.upstash.io',
  token: process.env.REDIS_TOKEN
})
