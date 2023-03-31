import { CheckInsRepository } from "@/repositories/checkins-repository"
import { UserRepository } from "@/repositories/users-repository"
import { CheckIn } from "@prisma/client"
import { ResourceNotFound } from "./errors/resource-not-found"

interface CheckInUseCaseRequest {
    userId: string,
    gymId: string,
}

interface CheckInUseCaseResponse {
    checkIn: CheckIn
}

export class CheckInUseCase{
	constructor (private checkInsRepository: CheckInsRepository){}

	async execute({userId, gymId}:CheckInUseCaseRequest ): Promise<CheckInUseCaseResponse>{
		const checkIn = await this.checkInsRepository.create({
			gym_id: gymId,
			user_id: userId,
		})

		if(!checkIn){
			throw new ResourceNotFound()
		}

		return { checkIn }
	}
}