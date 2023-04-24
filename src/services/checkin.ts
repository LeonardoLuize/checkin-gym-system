import { CheckInsRepository } from "@/repositories/checkins-repository"
import { CheckIn } from "@prisma/client"
import { ResourceNotFound } from "./errors/resource-not-found"
import { GymsRepository } from "@/repositories/gyms-repository"
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates"
import { MaxDistanceError } from "./errors/max-distance-error"
import { MaxCheckInsError } from "./errors/max-numbers-of-check-ins-error"

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
	constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository
	) {}

	async execute({
		userId,
		gymId,
		userLatitude,
		userLongitude,
	}: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
		const gym = await this.gymsRepository.findById(gymId)

		if (!gym) {
			throw new ResourceNotFound()
		}

		const distance = getDistanceBetweenCoordinates(
			{
				latitude: userLatitude,
				longitude: userLongitude,
			},
			{
				latitude: gym.latitude.toNumber(),
				longitude: gym.longitude.toNumber(),
			}
		)

		const MAX_DISTANCE = 0.1

		if(distance > MAX_DISTANCE){
			throw new MaxDistanceError()
		}

		const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
			userId,
			new Date()
		)

		if (checkInOnSameDate) {
			throw new MaxCheckInsError()
		}

		const checkIn = await this.checkInsRepository.create({
			gym_id: gymId,
			user_id: userId,
		})

		if (!checkIn) {
			throw new ResourceNotFound()
		}

		return { checkIn }
	}
}
