import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { makeCheckInUseCase } from "@/services/factories/make-checkin-use-case"

export async function create (req: FastifyRequest, reply: FastifyReply) {

	const createParamsSchema = z.object({
		gymId: z.string().uuid(),
	})

	const createBodySchema = z.object({
		latitude: z.number().refine(value => {
			return Math.abs(value) <= 90
		}),
		longitude: z.number().refine(value => {
			return Math.abs(value) <= 180
		}),
	})

	const { gymId} = createParamsSchema.parse(req.params)
	const { latitude, longitude } = createBodySchema.parse(req.body)

	const createUseCase = makeCheckInUseCase()
	await createUseCase.execute({ userLatitude: latitude, userLongitude: longitude, gymId, userId: req.user.sub })

	return reply.status(201).send()
}