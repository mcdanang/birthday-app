const moment = require("moment-timezone");
const cityTZ = require("city-timezones");
const prisma = require("../database");

const getUser = async (req, res) => {
	try {
		const allUsers = await prisma.user.findMany();
		res.status(200).json(allUsers);
	} catch (error) {
		console.error("Error getting users:", error);
		res.status(500).json({
			error: {
				name: "internalServerError",
				message: "An error occurred",
			},
		});
	}
};

const createUser = async (req, res) => {
	try {
		const { first_name, last_name, birthday, location, country, email } = req.body;
		if (!first_name || !last_name || !birthday || !location || !country || !email) {
			return res
				.status(400)
				.json({ error: { name: "malformedRequestError", message: "Must have required property" } });
		}
		let timezone = cityTZ.findFromCityStateProvince(`${location} ${country}`);
		if (timezone.length === 0) {
			return res
				.status(400)
				.json({ error: { name: "invalidLocationError", message: "Location is not valid" } });
		}
		timezone = timezone[0].timezone;
		const scheduled_time = moment.tz(birthday, timezone).set({ hour: 9, minute: 0, second: 0 });

		await prisma.user.create({
			data: {
				first_name,
				last_name,
				birthday: new Date(birthday),
				location,
				country,
				timezone,
				scheduled_time,
				email,
				last_sent: scheduled_time,
			},
		});

		res.status(201).json({ message: "User created successfully" });
	} catch (error) {
		console.error("Error creating user:", error);
		res.status(500).json({
			error: {
				name: "internalServerError",
				message: "An error occurred",
			},
		});
	}
};

const deleteUser = async (req, res) => {
	try {
		const userId = Number(req.params.userId);
		await prisma.user.delete({
			where: {
				id: userId,
			},
		});
		res.status(200).json({ message: "User deleted successfully" });
	} catch (error) {
		console.error("Error deleting user:", error);
		if (error.code === "P2025") {
			return res.status(400).json({
				error: {
					name: "instanceNotFoundError",
					message: "Record to delete does not exist.",
				},
			});
		}
		res.status(500).json({
			error: {
				name: "internalServerError",
				message: "An error occurred",
			},
		});
	}
};

const updateUser = async (req, res) => {
	try {
		const userId = Number(req.params.userId);
		let { first_name, last_name, birthday, location, country, email } = req.body;
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		});

		if (location) user.location = location;
		if (country) user.country = country;
		if (birthday) user.birthday = new Date(birthday);

		let timezone = cityTZ.findFromCityStateProvince(`${user.location} ${user.country}`);
		if (timezone.length === 0) {
			return res
				.status(400)
				.json({ error: { name: "invalidLocationError", message: "Location is not valid" } });
		}
		user.timezone = timezone[0].timezone;
		user.scheduled_time = moment
			.tz(user.birthday, user.timezone)
			.set({ hour: 9, minute: 0, second: 0 });

		await prisma.user.update({
			where: {
				id: userId,
			},
			data: user,
		});
		res.status(200).json({ message: "User updated successfully" });
	} catch (error) {
		console.error("Error updating user:", error);
		res.status(500).json({
			error: {
				name: "internalServerError",
				message: "An error occurred",
			},
		});
	}
};

module.exports = {
	getUser,
	createUser,
	deleteUser,
	updateUser,
};
