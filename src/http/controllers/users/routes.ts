import { FastifyInstance } from "fastify"
import { authenticate } from "./authenticate"
import { profile } from "./profile"
import { register } from "./register"
import { verifyJWT } from "../../middlewares/verify-jwt"
import { refresh } from "./refresh"

export async function usersRoutes(app: FastifyInstance) {
	app.post("/users", register)
	app.post("/sessions", authenticate)

	app.patch("/token/refresh", refresh)

	/* Only Authenticated */
	app.get("/me", {onRequest: [verifyJWT]}, profile)
}