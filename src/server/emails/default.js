export const getEmail = ({ to, subject, message }) => ({
	from: 'support@betmore.com',
	to,
	subject,
	textContent: message
})
