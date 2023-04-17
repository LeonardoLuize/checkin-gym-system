import { PrismaCheckInRepository } from "@/repositories/prisma/prisma-check-ins-repository"
import { ValidateCheckInUseCase } from "../validate-check-in"

export function MakeValidateCheckIn() {
	const prismaRepository = new PrismaCheckInRepository()
	const useCase = new ValidateCheckInUseCase(prismaRepository)

	return useCase
}