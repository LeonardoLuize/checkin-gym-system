import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository"
import { FetchNearbyGymsUseCase } from "../fetch-nearby-gyms"

export function MakeFetchNearbyGyms() {
	const prismaRepository = new PrismaGymsRepository()
	const useCase = new FetchNearbyGymsUseCase(prismaRepository)

	return useCase
}