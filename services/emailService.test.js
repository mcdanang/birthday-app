const { sendEmail } = require("./emailService");

test("send a happy birthday message", () => {
	return sendEmail(1, "khalisa@mail.com", `Hey, Khalisa Putri! It’s your birthday`).then(data => {
		expect(data.id).toBe(1);
		expect(data.status).toBe("sent");
	});
});
