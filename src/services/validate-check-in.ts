import { CheckInsRepository } from "@/repositories/checkins-repository"
import { UserRepository } from "@/repositories/users-repository"
import { CheckIn } from "@prisma/client"
import { ResourceNotFound } from "./errors/resource-not-found"
import { GymsRepository } from "@/repositories/gyms-repository"
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates"
import { MaxDistanceError } from "./errors/max-distance-error"
import { MaxCheckInsError } from "./errors/max-numbers-of-check-ins-error"
import dayjs from "dayjs"
import { LateValidationCheckInError } from "./errors/late-check-in-validation-error"

interface ValidateCheckInUseCaseRequest {
    checkInId: string
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class ValidateCheckInUseCase {
	constructor(
    private checkInsRepository: CheckInsRepository,
	) {}

	async execute({
		checkInId
	}: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
		const checkIn = await this.checkInsRepository.findById(checkInId)

		if(!checkIn){
			throw new ResourceNotFound()
		}

		const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
			checkIn.created_at,
			"minutes",
		)

		if(distanceInMinutesFromCheckInCreation > 20) {
			throw new LateValidationCheckInError()
		}

		checkIn.validated_at = new Date()

		await this.checkInsRepository.save(checkIn)

		return { checkIn }
	}
}
