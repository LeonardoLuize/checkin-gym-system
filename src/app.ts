import fastify from "fastify"
import { ZodError } from "zod"
import { env } from "./env"
import { appRoutes } from "./http/routes"

export const app = fastify()

app.register(appRoutes)

app.setErrorHandler((error, request, reply) => {
	if(error instanceof ZodError){
		return reply.code(400).send({message: "Validation error", issues: error.format()})
	}

	if(env.NODE_ENV !== "prod") {
		console.error(error)
	} else {
		// TODO log to external tool
	}

	return reply.code(500).send({message: "Internal Server Error."})
})