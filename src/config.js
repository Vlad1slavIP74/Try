module.exports = {
	BASIC_URL: process.env.NODE_ENV === 'production' ? 'https://alfakasta.com' : 'http://localhost:3000',
	API_URL: process.env.NODE_ENV === 'production' ? 'https://alfakasta.com/api/v1/' : 'http://localhost:3000/api/v1/',
	db: process.env.NODE_ENV === 'production' ? {
		host: 'localhost',
		port: 5432,
		database: 'alfakasta',
		user: 'admin_db',
		password: 'pu1ckfzc78'
	} : {
	  host: 'alfakasta.com',
	  port: 5432,
	  database: 'alfakasta',
	  user: 'admin_db',
	  password: 'pu1ckfzc78'
	},
	mailer: {
		user: 'support@alfakasta.com',
		pass: 'QhegVGIUz3'
	},
	token: {
		'secret': 'Alfakasta-service',
		'audience': 'Alfakasta-service',
		'issuer': 'https://alfakasta.com'
	},
	fondy: {
		merchant_id: 1412164
	},
	bets: {
		categories: [
			{
				key: 0,
				value: 0,
				text: 'Спорт',
				subcategories: [
					{ key: 1, value: 1, text: 'Футбол' },
					{ key: 2, value: 2, text: 'Баскетбол' },
					{ key: 3, value: 3, text: 'Теннис' },
					{ key: 4, value: 4, text: 'Хоккей' },
					{ key: 5, value: 5, text: 'MMA' }
				]
			},
			{
				key: 1,
				value: 1,
				text: 'Киберспорт',
				subcategories: [
					{ key: 1, value: 1, text: 'CS GO' },
					{ key: 2, value: 2, text: 'Dota 2' }
				]
			},
			{
				key: 2,
				value: 2,
				text: 'Акции',
				subcategories: []
			},
			{
				key: 3,
				value: 3,
				text: 'Криптовалюта',
				subcategories: [
					{ key: 1, value: 1, text: 'Bitcoin' },
					{ key: 2, value: 2, text: 'Ethereum' },
					{ key: 3, value: 3, text: 'Betcoin Cash' },
					{ key: 4, value: 4, text: 'Litecoin' },
					{ key: 5, value: 5, text: 'Ripple' },
					{ key: 6, value: 6, text: 'Ethereum Classic' },
					{ key: 7, value: 7, text: 'NEO' },
					{ key: 8, value: 8, text: 'Monero' },
					{ key: 9, value: 9, text: 'Bitcoin Gold' }
				]
			},
			{
				key: 4,
				value: 4,
				text: 'События',
				subcategories: []
			}
		]
	},
	SERVICE_FEE: 0.05,
	BETS_ON_PAGE: 10,
	BETS_ON_PAGE_FLOAT: '10.0'
}
