import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { MakeFetchCheckInHistoryUseCase } from "@/services/factories/make-fetch-check-ins-history"

export async function history (req: FastifyRequest, reply: FastifyReply) {
	const historyQuerySchema = z.object({
		page: z.coerce.number().min(1).default(1),
	})

	const {  page } = historyQuerySchema.parse(req.query)

	const historyUseCase = MakeFetchCheckInHistoryUseCase()
	const {checkIns} = await historyUseCase.execute({ userId: req.user.sub, page })

	return reply.status(200).send({
		checkIns
	})
}