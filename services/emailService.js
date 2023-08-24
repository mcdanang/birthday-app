const axios = require("axios");

const sendEmail = async (email, message) => {
	try {
		const baseURL = "https://email-service.digitalenvision.com.au";
		const result = await axios.post(baseURL + "/send-email", {
			email,
			message,
		});
		console.log(email, message, result.data);
	} catch (error) {
		console.log(error);
	}
};

module.exports = { sendEmail };
