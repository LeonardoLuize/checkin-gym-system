import { FastifyReply, FastifyRequest } from "fastify"
import { makeGetUserMetricsProfileUseCase } from "@/services/factories/make-get-user-metrics-use-case"

export async function metrics (req: FastifyRequest, reply: FastifyReply) {
	const metricsUseCase = makeGetUserMetricsProfileUseCase()
	const {checkInsMade} = await metricsUseCase.execute({ userId: req.user.sub })

	return reply.status(200).send({
		checkInsMade
	})
}