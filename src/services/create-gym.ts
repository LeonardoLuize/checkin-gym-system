import { GymsRepository } from "@/repositories/gyms-repository"
import { Gym } from "@prisma/client"

interface CreateGymCaseProps {
  title: string;
  description?: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

interface CreateGymCaseResponse {
  gym: Gym;
}

export class CreateGymCase {
	constructor(private gymsRepository: GymsRepository) {}

	async execute({
		title,
		description,
		phone,
		longitude,
		latitude,
	}: CreateGymCaseProps): Promise<CreateGymCaseResponse> {
		const gym = await this.gymsRepository.create({
			title,
			description,
			phone,
			longitude,
			latitude,
		})

		return { gym }
	}
}
