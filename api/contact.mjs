import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

function escapeHtml(str) {
  if (typeof str !== 'string') return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function sanitizeHeaderValue(str) {
  if (typeof str !== 'string') return ''
  return str.replace(/[\r\n]/g, '')
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_NAME = 100
const MAX_EMAIL = 254
const MAX_MESSAGE = 5000

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function getPortfolioData() {
  const { data } = await supabase
    .from('portfolio_data')
    .select('data')
    .eq('id', 1)
    .single()

  return data?.data
}

function setCorsHeaders(res) {
  const origin = process.env.ALLOWED_ORIGIN || 'http://localhost:3000'
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Max-Age', '86400')
}

export default async function handler(req, res) {
  setCorsHeaders(res)
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '0')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid input types' })
  }

  if (name.length > MAX_NAME || email.length > MAX_EMAIL || message.length > MAX_MESSAGE) {
    return res.status(400).json({ error: 'Input exceeds maximum length' })
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' })
  }

  const safeName = escapeHtml(sanitizeHeaderValue(name))
  const safeEmail = escapeHtml(sanitizeHeaderValue(email))
  const safeMessage = escapeHtml(message)

  try {
    const portfolioData = await getPortfolioData()
    const recipient = portfolioData?.contact?.email || process.env.EMAIL_USER
    const profileName = portfolioData?.profile?.name || 'Ibrahim Saeed'

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: recipient,
      subject: `Portfolio Message from ${safeName}`,
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `,
    })

    await transporter.sendMail({
      from: `"${profileName}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thanks for reaching out!',
      html: `
        <h3>Hi ${safeName},</h3>
        <p>Thanks for your message! I'll get back to you as soon as possible.</p>
        <br/>
        <p>Best,</p>
        <p>${profileName}</p>
      `,
    })

    res.json({ success: true })
  } catch (_err) {
    res.status(500).json({ error: 'Failed to send message' })
  }
}
