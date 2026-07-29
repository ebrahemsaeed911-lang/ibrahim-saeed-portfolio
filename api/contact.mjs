import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    const portfolioData = await getPortfolioData()
    const recipient = portfolioData?.contact?.email || process.env.EMAIL_USER
    const profileName = portfolioData?.profile?.name || 'Ibrahim Saeed'

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: recipient,
      subject: `Portfolio Message from ${name}`,
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    })

    await transporter.sendMail({
      from: `"${profileName}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thanks for reaching out!',
      html: `
        <h3>Hi ${name},</h3>
        <p>Thanks for your message! I'll get back to you as soon as possible.</p>
        <br/>
        <p>Best,</p>
        <p>${profileName}</p>
      `,
    })

    res.json({ success: true })
  } catch (err) {
    console.error('Email error:', err)
    res.status(500).json({ error: 'Failed to send message' })
  }
}
