import express from 'express'
import bodyParser from "body-parser";

import cors from 'cors'
import swaggerUI from "swagger-ui-express"
import swaggerJsDoc from "swagger-jsdoc"
import router from './routes/routes.js'
import connectDB from './DBConfig.js'

const PORT = process.env.PORT || 4000;


const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Assignment API",
			version: "1.0.0",
			description: "Assignment Multilevel API",
		},
		servers: [
			{
				url: "http://localhost:4000",
			},
		],
	},
	apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

const app = express();

app.use("/api", swaggerUI.serve, swaggerUI.setup(specs));

app.use(cors());
app.use(express.json());

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use("/users", router);
connectDB();

app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));