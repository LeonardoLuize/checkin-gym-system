import { MakeValidateCheckIn } from "@/services/factories/make-validate-check-in-use-case"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function validate (req: FastifyRequest, reply: FastifyReply) {
	const validateQuerySchema = z.object({
		checkInId: z.string().uuid(),
	})

	const {  checkInId } = validateQuerySchema.parse(req.params)

	const validateUseCase = MakeValidateCheckIn()
	await validateUseCase.execute({ checkInId })

	return reply.status(204).send()
}