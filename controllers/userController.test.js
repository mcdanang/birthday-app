const request = require("supertest");
const baseURL = "http://localhost:3000";

describe("GET /user", () => {
	it("should return 200", async () => {
		const response = await request(baseURL).get("/user");
		expect(response.statusCode).toBe(200);
	});
	it("should return users array", async () => {
		const response = await request(baseURL).get("/user");
		expect(response.body.length >= 1).toBe(true);
	});
});

describe("POST /user", () => {
	const newUser = {
		first_name: "Rizky",
		last_name: "Rahadianto",
		email: "rizky@mail.com",
		birthday: "1996-08-24",
		location: "Jakarta",
		country: "Indonesia",
	};
	it("should add new user to DB", async () => {
		const response = await request(baseURL).post("/user").send(newUser);
		expect(response.statusCode).toBe(201);
		expect(response.text).toBe(`{"message":"User created successfully"}`);
	});
});

describe("DELETE /user/:id", () => {
	it("should delete one user", async () => {
		const response = await request(baseURL).delete(`/user/4`);
		expect(response.statusCode).toBe(200);
		expect(response.text).toBe(`{"message":"User deleted successfully"}`);
	});
});
