import { PrismaCheckInRepository } from "@/repositories/prisma/prisma-check-ins-repository"
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository"
import { CheckInUseCase } from "../checkin"

export function makeCheckInUseCase() {
	const prismaRepository = new PrismaCheckInRepository()
	const prismaGymsRepository = new PrismaGymsRepository()
	const useCase = new CheckInUseCase(prismaRepository, prismaGymsRepository)

	return useCase
}