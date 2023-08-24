const moment = require("moment-timezone");
const cityTZ = require("city-timezones");
const pool = require("../database");

const getUser = async (req, res) => {
	try {
		const query = `SELECT * FROM users`;
		const result = await pool.query(query);
		res.status(200).json(result.rows);
	} catch (error) {
		console.error("Error getting users:", error);
		res.status(500).json({
			error: {
				name: "InternalServerError",
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

		const query = `
		  INSERT INTO users (first_name, last_name, birthday, location, country, timezone, scheduled_time, email)
		  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		  RETURNING id
		`;
		const values = [
			first_name,
			last_name,
			birthday,
			location,
			country,
			timezone,
			scheduled_time,
			email,
		];

		const result = await pool.query(query, values);

		res.status(201).json({ message: "User created successfully" });
	} catch (error) {
		console.error("Error creating user:", error);
		res.status(500).json({
			error: {
				name: "InternalServerError",
				message: "An error occurred",
			},
		});
	}
};

const deleteUser = async (req, res) => {
	try {
		const userId = req.params.userId;
		const query = `
      DELETE FROM users
      WHERE id = $1
    `;
		const values = [userId];
		await pool.query(query, values);
		res.status(200).json({ message: "User deleted successfully" });
	} catch (error) {
		console.error("Error deleting user:", error);
		res.status(500).json({
			error: {
				name: "InternalServerError",
				message: "An error occurred",
			},
		});
	}
};

const updateUser = async (req, res) => {
	try {
		const userId = req.params.userId;
		const { first_name, last_name, birthday, location, country, email } = req.body;
		console.log(req.body);
		let timezone = cityTZ.findFromCityStateProvince(`${location} ${country}`);
		if (timezone.length === 0) {
			return res
				.status(400)
				.json({ error: { name: "invalidLocationError", message: "Location is not valid" } });
		}
		timezone = timezone[0].timezone;
		const scheduled_time = moment.tz(birthday, timezone).set({ hour: 9, minute: 0, second: 0 });
		const query = `
      UPDATE users
      SET first_name = $1, last_name = $2, birthday = $3, location = $4, country = $5, timezone = $6, scheduled_time = $7, email = $8,
      WHERE id = $9
    `;
		const values = [
			first_name,
			last_name,
			birthday,
			location,
			country,
			timezone,
			scheduled_time,
			email,
			userId,
		];

		await pool.query(query, values);
		res.status(200).json({ message: "User updated successfully" });
	} catch (error) {
		console.error("Error updating user:", error);
		res.status(500).json({
			error: {
				name: "InternalServerError",
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
