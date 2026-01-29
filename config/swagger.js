const swaggerJsdoc = require("swagger-jsdoc");

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "API_Pokemon",
			version: "1.0.0",
			description: "API TCG de pokemon",
		},
		servers: [
			{
				url: "http://localhost:3000",
			},
		],
		components: {
			schemas: {
				Error: {
					type: "object",
					properties: {
						message: {
							type: "string",
							description: "Message d'erreur",
						},
					},
				},
			},
		},
	},
};

module.exports = swaggerJsdoc(options);