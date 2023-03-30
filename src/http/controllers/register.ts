import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { RegisterUseCase } from "@/services/register"
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { UserAlreadyExistsError } from "@/services/errors/user-already-exists"

export async function register (req: FastifyRequest, reply: FastifyReply) {
	const registerBodySchema = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string().min(6),
	})

	const { name, email, password } = registerBodySchema.parse(req.body)

	try {
		const prismaUsersRepository = new PrismaUsersRepository()
		const registerUseCase = new RegisterUseCase(prismaUsersRepository)
        
		await registerUseCase.execute({name, email, password})
	}catch (e) {
		if(e instanceof UserAlreadyExistsError){
			return reply.status(409).send({message: e.message})
		}

		throw e
	}

	return reply.status(201).send()
}