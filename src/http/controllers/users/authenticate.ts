import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { InvalidCredentialError } from "@/services/errors/invalid_credential_error"
import { makeAuthenticateUseCase } from "@/services/factories/make-authenticate-use-case"

export async function authenticate (req: FastifyRequest, reply: FastifyReply) {
	const AuthenticateBodySchema = z.object({
		email: z.string().email(),
		password: z.string().min(6),
	})

	const { email, password } = AuthenticateBodySchema.parse(req.body)

	try {
		const authenticateUseCase = makeAuthenticateUseCase()
		const {user} = await authenticateUseCase.execute({email, password})

		const token = await reply.jwtSign({}, {
			sign: {
				sub: user.id
			}
		})

		const refreshToken = await reply.jwtSign({}, {
			sign: {
				sub: user.id,
				expiresIn: "7d",
			}
		})


		return reply
			.setCookie("refreshToken", refreshToken, {
				path: "/",
				secure: true,
				sameSite: true,
				httpOnly: true,
			})
			.status(200)
			.send({token})

	}catch (e) {
		if(e instanceof InvalidCredentialError){
			return reply.status(401).send({message: e.message})
		}

		throw e
	}

}