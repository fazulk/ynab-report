
import { readFileSync } from 'fs'
import { resolve } from 'path'
import * as url from 'url'
import { createTransport } from 'nodemailer'
import { config } from 'dotenv'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

config()

async function sendMail(html) {
  const transporter = createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY,
    },
  })

  await transporter.sendMail({
    replyTo: process.env.EMAIL_REPLY_TO || process.env.SENGRID_EMAIL,
    from: process.env.SENGRID_EMAIL, // sender address
    to: [process.env.EMAIL], // list of receivers
    subject: `${process.env.REPORT_TITLE} ${new Date().toLocaleDateString()} 💵`, // Subject line
    html, // html body
  })
}

async function go() {
  const file = readFileSync(resolve(__dirname, './dist/index.html'))
  // eslint-disable-next-line no-console
  console.log(`sending to ${process.env.EMAIL}`)
  process.env.NODE_ENV !== 'development' && (await sendMail(file.toString()))
}

go()
