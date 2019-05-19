import crontab from 'node-crontab'
import axios from 'axios'

const API_URL = process.env.NODE_ENV === 'production' ? 'https://alfakasta.com' : 'http://localhost:3000'

// CHECK BET EXPERING TIME
var jobId = crontab.scheduleJob('*/1 * * * *', () => {
	// console.log('CRONTAB, time: ' + new Date())

	axios.get(`${API_URL}/api/v1/bets/check-expiration`)
  	.then(res => {
  		// console.log('success crontab')
  	})
  	.catch(err => console.log(err))
})

export default crontab
