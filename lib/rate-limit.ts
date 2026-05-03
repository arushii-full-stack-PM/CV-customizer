import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

const UNLIMITED_EMAILS = [
  "arushii.gupta@nmims.edu.in", // add your personal gmail here too
  "arushii.banasthali@gmail.com",
]

export async function checkIpLimit(
  ip: string,
  route: string,
  maxRequests: number,
  windowSeconds: number = 3600
): Promise<{ allowed: boolean; remaining: number }> {
  const key = `ratelimit:ip:${route}:${ip}`
  const count = await redis.incr(key)
  if (count === 1) {
    await redis.expire(key, windowSeconds)
  }
  const remaining = Math.max(0, maxRequests - count)
  return { allowed: count <= maxRequests, remaining }
}

export async function checkEmailLimit(
  email: string,
  maxAnalyses: number = 2
): Promise<{ allowed: boolean; remaining: number }> {
  if (!email) return { allowed: true, remaining: maxAnalyses }
  if (UNLIMITED_EMAILS.includes(email.toLowerCase())) {
    return { allowed: true, remaining: 999 }
  }
  const key = `usage:email:${email.toLowerCase()}`
  const count = await redis.incr(key)
  if (count === 1) {
    // Expire after 30 days
    await redis.expire(key, 60 * 60 * 24 * 30)
  }
  const remaining = Math.max(0, maxAnalyses - count)
  if (count > maxAnalyses) {
    // Decrement back since we incremented but shouldn't count this attempt
    await redis.decr(key)
    return { allowed: false, remaining: 0 }
  }
  return { allowed: true, remaining }
}

export function getIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown"
  return ip
}
