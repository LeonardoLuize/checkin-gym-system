import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository"
import { CreateGymCase } from "../create-gym"

export function MakeCreateGymsUseCase() {
	const prismaRepository = new PrismaGymsRepository()
	const useCase = new CreateGymCase(prismaRepository)

	return useCase
}