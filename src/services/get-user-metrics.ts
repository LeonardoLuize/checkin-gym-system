import { CheckInsRepository } from "@/repositories/checkins-repository"

interface GetUserMetricsUseCaseRequest {
  userId: string;
}

interface GetUserMetricsUseCaseResponse {
  checkInsMade: number;
}

export class GetUserMetricsUseCase {
	constructor(
    private checkInsRepository: CheckInsRepository,
	) {}

	async execute({userId}: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
		const checkInsMade = await this.checkInsRepository.countByUserId(userId)

		return { checkInsMade }
	}
}
