import { GymsRepository } from "@/repositories/gyms-repository"
import { Gym } from "@prisma/client"

interface SearchGymUseCaseProps {
  query: string,
  page: number
}

interface SearchGymUseCaseResponse {
  gyms: Gym[];
}

export class SearchGymUseCase {
	constructor(private gymsRepository: GymsRepository) {}

	async execute({
		query,
		page
	}: SearchGymUseCaseProps): Promise<SearchGymUseCaseResponse> {
		const gyms = await this.gymsRepository.searchMany(query, page)

		return { gyms }
	}
}
