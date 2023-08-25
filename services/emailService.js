const axios = require("axios");
const prisma = require("../database");

const sendEmail = async (id, email, message) => {
	try {
		const baseURL = "https://email-service.digitalenvision.com.au";
		const result = await axios.post(baseURL + "/send-email", {
			email,
			message,
		});
		console.log({ id, ...result.data });
		await prisma.user.update({
			where: { id },
			data: { last_sent: new Date() },
		});
		return { id, ...result.data };
	} catch (error) {
		if (error.code == "ERR_BAD_RESPONSE") {
			console.log({ id, status: "not_sent", message: "Email not sent" });
			return { id, status: "not_sent", message: "Email not sent" };
		} else {
			console.log({ id, status: "error", message: "Something went wrong" });
			return { id, status: "error", message: "Something went wrong" };
		}
	}
};

module.exports = { sendEmail };
