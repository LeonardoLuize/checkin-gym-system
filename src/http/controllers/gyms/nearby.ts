import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { MakeFetchNearbyGyms } from "@/services/factories/make-fetch-nearby-use-case"

export async function nearby (req: FastifyRequest, reply: FastifyReply) {
	const nearbyGymQuerySchema = z.object({
		latitude: z.coerce.number().refine(value => {
			return Math.abs(value) <= 90
		}),
		longitude: z.coerce.number().refine(value => {
			return Math.abs(value) <= 180
		}),
	})

	const { latitude, longitude } = nearbyGymQuerySchema.parse(req.query)

	const nearbyGymUseCase = MakeFetchNearbyGyms()
	const {gyms} = await nearbyGymUseCase.execute({ userLatitude: latitude, userLongitude: longitude })

	return reply.status(200).send({
		gyms
	})
}