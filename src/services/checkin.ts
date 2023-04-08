import { CheckInsRepository } from "@/repositories/checkins-repository"
import { UserRepository } from "@/repositories/users-repository"
import { CheckIn } from "@prisma/client"
import { ResourceNotFound } from "./errors/resource-not-found"
import { GymsRepository } from "@/repositories/gyms-repository"

interface CheckInUseCaseRequest {
    userId: string,
    gymId: string,
	userLatitude: number,
	userLongitude: number,
}

interface CheckInUseCaseResponse {
    checkIn: CheckIn
}

export class CheckInUseCase{
	constructor (private checkInsRepository: CheckInsRepository, private gymsRepository: GymsRepository ){}

	async execute({userId, gymId, userLatitude, userLongitude}:CheckInUseCaseRequest ): Promise<CheckInUseCaseResponse>{
		const gym = this.gymsRepository.findById(gymId)

		if(!gym){
			throw new ResourceNotFound()
		}

		const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(userId, new Date())

		if(checkInOnSameDate){
			throw new Error()
		}

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