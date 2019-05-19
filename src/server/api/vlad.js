const FormData = require('form-data')

const interCassaCashout = async (req, res, next) => {
	const u_id = 33

	var data = new FormData()
	data.append('amount', 60)
	data.append('details[card]', '5168 7551 0053 8483')
	data.append('paywayId', '59dbc5d83b1eafab1c8b4567')
	data.append('purseId', '300656475524')
	// data.append('paymentNo', `${u_id}-${JSON.stringify(new Date())}`)
	data.append('paymentNo', u_id)
	data.append('action', 'process')
	data.append('calcKey', 'psPayeeAmount')

	fetch('https://api.interkassa.com/v1/withdraw', {
		method: 'POST',
		headers: {
			'Authorization': 'Basic NWI2MjAxNmYzZDFlYWYwMTIzOGI0NTcxOlp4dzFsdlBaWDFlVzhaNHpBTTIzU0RaVHJJOEhrRzEx',
			'Ik-Api-Account-Id': '5b6201a03d1eaf4a278b4569'
		},
		body: data
	}).then(response => console.log(response))

	res.status(200).json({msg: 'OK'})
}

export default interCassaCashout

module.exports = {interCassaCashout }
