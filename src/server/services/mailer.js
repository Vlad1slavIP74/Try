import nodemailer from 'nodemailer'
import {mailer} from '../../config'

export async function sendMail ({ to, subject, textContent }) {
	let transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 465,
			secure: true,
			auth: mailer,
	    tls: {
	        rejectUnauthorized: false
	    }

		}),
		mailOptions = {
			to: to,
			subject: subject,
			html: textContent
		}

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error)
			return error
		} else {
			console.log('Email sent: ' + info.response)
		}
	})
}
