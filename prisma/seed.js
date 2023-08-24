const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const moment = require("moment-timezone");
const cityTZ = require("city-timezones");

const users = [
	{
		first_name: "Khalisa",
		last_name: "Putri",
		email: "khalisa@mail.com",
		birthday: new Date("1996-08-24"),
		location: "Jakarta",
		country: "Indonesia",
	},
	{
		first_name: "Adhi",
		last_name: "Pramudito",
		email: "adhi@mail.com",
		birthday: new Date("1996-08-24"),
		location: "Denpasar",
		country: "Indonesia",
	},
	{
		first_name: "Danang",
		last_name: "Priambodo",
		email: "danang@mail.com",
		birthday: new Date("1996-08-25"),
		location: "Melbourne",
		country: "Australia",
	},
	{
		first_name: "Danar",
		last_name: "Pradono",
		email: "danar@mail.com",
		birthday: new Date("1996-08-26"),
		location: "New York",
		country: "America",
	},
];

async function main() {
	console.log(`Start seeding ...`);
	for (const data of users) {
		let timezone = cityTZ.findFromCityStateProvince(`${data.location} ${data.country}`);
		if (timezone.length === 0)
			throw { error: { name: "invalidLocationError", message: "Location is not valid" } };
		timezone = timezone[0].timezone;
		const scheduled_time = moment
			.tz(data.birthday, timezone)
			.set({ hour: 9, minute: 0, second: 0 });
		data.timezone = timezone;
		data.scheduled_time = scheduled_time;
		data.last_sent = scheduled_time;
		await prisma.user.create({ data });
	}
	console.log(`Created users`);
	console.log(`Seeding finished.`);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async e => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
