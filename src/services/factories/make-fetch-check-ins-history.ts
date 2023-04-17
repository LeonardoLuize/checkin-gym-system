import { PrismaCheckInRepository } from "@/repositories/prisma/prisma-check-ins-repository"
import { FetchCheckInsHistoryUseCase } from "../fetch-member-check-ins-history"

export function MakeFetchCheckInHistoryUseCase() {
	const prismaRepository = new PrismaCheckInRepository()
	const useCase = new FetchCheckInsHistoryUseCase(prismaRepository)

	return useCase
}