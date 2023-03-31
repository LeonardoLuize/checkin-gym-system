import { InMemoryUsersRepository } from "@/repositories/in-memory-users-repository"
import { hash } from "bcryptjs"
import { describe,beforeEach, expect, it } from "vitest"
import { ResourceNotFound } from "./errors/resource-not-found"
import { GetUserProfileUseCase } from "./get-user-profile"

let usersRepository: InMemoryUsersRepository
let 	sut: GetUserProfileUseCase

describe("Authenticate Use Case", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new GetUserProfileUseCase(usersRepository)
	})

	it("should be able to get user profile", async () => {
		const createdUser = await usersRepository.create({
			name: "john",
			email: "john@gmail.com",
			password_hash: await hash("123456", 6)
		})

		const {user} = await sut.execute({
			userId: createdUser.id
		})

		expect(user.name).toEqual("john")
	})

	it("should not be able to get user profile with wrong id", async () => {
		await expect(() =>  sut.execute({
			userId: "not-existing-id"
		})).rejects.toBeInstanceOf(ResourceNotFound)
	})
})