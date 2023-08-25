# Birthday App

A simple application to send birthday messages to users on their birthday at exactly 9 am on their local time.
For example, if one user is in New York and the second user is in Melbourne, they should be getting a birthday message in their own time zone.

## Technologies Used

- Node.js
- Prisma (ORM)
- PostgreSQL

## Requirements

- Node.js (>=14.x)
- PostgreSQL (>=12.x)

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mcdanang/birthday-app.git
   cd birthday-app
   ```
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Prisma Configuration:**
   
    Create a `.env` file based on `.env.example` and fill in your database connection details. For PostgreSQL, it looks as follows (the parts spelled all-uppercased are placeholders for your specific connection details):

    `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA`

    Here's a short explanation of each component:

      - USER: The name of your database user
      - PASSWORD: The password for your database user
      - HOST: The name of your host name (for the local environment, it is localhost)
      - PORT: The port where your database server is running (typically 5432 for PostgreSQL)
      - DATABASE: The name of the database
      - SCHEMA: The name of the schema inside the database

      If you're unsure what to provide for the schema parameter for a PostgreSQL connection URL, you can probably omit it. In that case, the default schema name public will be used.

4. **Generate Prisma Client:**
   
   Run the following command to create the first migration (and start seeding):
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Run the Application:**
   
    Runs the app in the development mode.
    ```bash
    npm start
    ```
    Open http://localhost:3000 to view it in the browser.

## API Endpoints

- `GET /user`: Get users data
- `POST /user`: Create a user
- `DELETE /user/:userId`: Delete a user
- `PUT /user/:userId`: Update user details
  
URL for published documentation
https://documenter.getpostman.com/view/17491289/2s9Y5WxiSY


## Note

- The application uses Prisma as an ORM to interact with the PostgreSQL database.
- Scheduled messages are not actually sent but logged as an example.

## Contributors

Muhamad Danang Priambodo (@mcdanang)

## License

This project is licensed under the MIT License.