import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { InvalidCredentialError } from "@/services/errors/invalid_credential_error"
import { AuthenticateUseCase } from "@/services/authenticate"

export async function authenticate (req: FastifyRequest, reply: FastifyReply) {
	const AuthenticateBodySchema = z.object({
		email: z.string().email(),
		password: z.string().min(6),
	})

	const { email, password } = AuthenticateBodySchema.parse(req.body)

	try {
		const prismaUsersRepository = new PrismaUsersRepository()
		const authenticateUseCase = new AuthenticateUseCase(prismaUsersRepository)
        
		await authenticateUseCase.execute({email, password})
	}catch (e) {
		if(e instanceof InvalidCredentialError){
			return reply.status(401).send({message: e.message})
		}

		throw e
	}

	return reply.status(200).send()
}