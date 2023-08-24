const cron = require("node-cron");
const pool = require("../database");
const moment = require("moment-timezone");
const { sendEmail } = require("../services/emailService");

const birthdayTask = cron.schedule(
	"0 * * * *",
	async currentTime => {
		const formattedCurrentTime = moment(currentTime).format("MM/DD:HH");
		console.log(`Current time: ${currentTime}`);
		const query = `SELECT scheduled_time, email, CONCAT(first_name, ' ', last_name) AS full_name FROM users`;
		const users = await pool.query(query);
		const scheduledBirthdays = users.rows.map(user => {
			const formattedScheduledTime = moment(user.scheduled_time).format("MM/DD:HH");
			const isBirthday = formattedScheduledTime === formattedCurrentTime;
			const fullName = user.full_name;
			const email = user.email;
			return { isBirthday, fullName, formattedScheduledTime, email };
		});
		const todayBirthdays = scheduledBirthdays.filter(val => val.isBirthday);
		for (let user of todayBirthdays) {
			//Send a happy birthday message to user at exactly 9 am on their local time
			const email = user.email;
			const message = `Hey, ${user.fullName}! It’s your birthday`;
			sendEmail(email, message);
		}
	},
	{ scheduled: false, timezone: "Asia/Jakarta" }
);

module.exports = { birthdayTask };
