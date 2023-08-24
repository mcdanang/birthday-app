const cron = require("node-cron");
const prisma = require("../database");
const moment = require("moment-timezone");
const { sendEmail } = require("../services/emailService");

const birthdayTask = cron.schedule(
	"*/30 * * * *", //CRON job at every 30th minute
	async currentTime => {
		const currentYear = moment(currentTime).get("year");

		const users = await prisma.$queryRaw`
      SELECT id, email, CONCAT(first_name, ' ', last_name) AS full_name, scheduled_time, last_sent
      FROM public."User"
    `;
		const todayBirthdays = users.filter(d => {
			const scheduledBirthday = moment(d.scheduled_time).set("year", currentYear);
			return moment(currentTime) >= scheduledBirthday && d.last_sent < scheduledBirthday;
		});
		console.log(`Current time: ${currentTime}`);
		if (todayBirthdays.length == 0) {
			console.log("No scheduled email");
		} else {
			console.log("Start sending happy birthday email...");
		}
		for (let user of todayBirthdays) {
			//Send a happy birthday message to user at exactly 9 am on their local time
			const message = `Hey, ${user.full_name}! It’s your birthday`;
			sendEmail(user.id, user.email, message);
		}
	},
	{ scheduled: false, timezone: "Asia/Jakarta" }
);

module.exports = { birthdayTask };
