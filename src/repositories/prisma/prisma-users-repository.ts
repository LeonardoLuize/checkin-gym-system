import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { UserRepository } from "../users-repository"

export class PrismaUsersRepository implements UserRepository {
	async findByEmail(email: string) {
		const userWithSameEmail = await prisma.user.findUnique({
			where: {
				email
			}
		})

		return userWithSameEmail
	}

	async create(data: Prisma.UserCreateInput) {
		const user = await prisma.user.create({data})

		return user
	}
}