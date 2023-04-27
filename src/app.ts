import fastifyCookie from "@fastify/cookie"
import { fastifyJwt } from "@fastify/jwt"
import fastify from "fastify"
import { ZodError } from "zod"
import { env } from "./env"
import { checkInsRoutes } from "./http/controllers/check-ins/routes"
import { gymsRoutes } from "./http/controllers/gyms/routes"
import { usersRoutes } from "./http/controllers/users/routes"

export const app = fastify()

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
	cookie: {
		cookieName: "refreshToken",
		signed: false
	},
	sign: {
		expiresIn: "10m",
	}
})
app.register(fastifyCookie)

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

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