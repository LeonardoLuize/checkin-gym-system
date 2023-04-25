import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { MakeSearchGymsUseCase } from "@/services/factories/make-search-gyms-use-case"

export async function search (req: FastifyRequest, reply: FastifyReply) {
	const searchQuerySchema = z.object({
		q: z.string(),
		page: z.coerce.number().min(1).default(1),
	})

	const { q, page } = searchQuerySchema.parse(req.query)

	const searchUseCase = MakeSearchGymsUseCase()
	const {gyms} = await searchUseCase.execute({ query: q, page })

	return reply.status(200).send({
		gyms
	})
}