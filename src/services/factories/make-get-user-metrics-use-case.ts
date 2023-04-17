import { PrismaCheckInRepository } from "@/repositories/prisma/prisma-check-ins-repository"
import { GetUserMetricsUseCase } from "../get-user-metrics"

export function makeGetUserMetricsProfileUseCase() {
	const prismaRepository = new PrismaCheckInRepository()
	const useCase = new GetUserMetricsUseCase(prismaRepository)

	return useCase
}