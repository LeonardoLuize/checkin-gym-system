import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository"
import { SearchGymUseCase } from "../search-gyms"

export function MakeSearchGymsUseCase() {
	const prismaRepository = new PrismaGymsRepository()
	const useCase = new SearchGymUseCase(prismaRepository)

	return useCase
}