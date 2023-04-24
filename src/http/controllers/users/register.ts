import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { UserAlreadyExistsError } from "@/services/errors/user-already-exists"
import { makeRegisterUseCase } from "@/services/factories/make-register-use-case"

export async function register (req: FastifyRequest, reply: FastifyReply) {
	const registerBodySchema = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string().min(6),
	})

	const { name, email, password } = registerBodySchema.parse(req.body)

	try {
		const registerUseCase = makeRegisterUseCase()
        
		await registerUseCase.execute({name, email, password})
	}catch (e) {
		if(e instanceof UserAlreadyExistsError){
			return reply.status(409).send({message: e.message})
		}

		throw e
	}

	return reply.status(201).send()
}