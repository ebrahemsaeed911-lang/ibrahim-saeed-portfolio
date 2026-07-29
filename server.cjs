require('dotenv').config()
const express = require('express')
const nodemailer = require('nodemailer')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <ebrahemsaeed911@gmail.com>`,
      to: 'ebrahemsaeed911@gmail.com',
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
      from: `"Ibrahim Saeed" <ebrahemsaeed911@gmail.com>`,
      to: email,
      subject: 'Thanks for reaching out!',
      html: `
        <h3>Hi ${name},</h3>
        <p>Thanks for your message! I'll get back to you as soon as possible.</p>
        <br/>
        <p>Best,</p>
        <p>Ibrahim Saeed</p>
      `,
    })

    res.json({ success: true })
  } catch (err) {
    console.error('Email error:', err)
    res.status(500).json({ error: 'Failed to send message' })
  }
})

app.listen(3001, () => console.log('Server running on http://localhost:3001'))
