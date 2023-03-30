import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { RegisterUseCase } from "@/services/register"
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"

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
		return reply.status(405).send()
	}

	return reply.status(201).send()
}