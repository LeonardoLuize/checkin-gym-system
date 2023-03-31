import { InMemoryUsersRepository } from "@/repositories/in-memory-users-repository"
import { hash } from "bcryptjs"
import { describe, expect, it } from "vitest"
import { AuthenticateUseCase } from "./authenticate"
import { InvalidCredentialError } from "./errors/invalid_credential_error"

describe("Authenticate Use Case", () => {
	it("should be able to authenticate", async () => {
		const usersRepository = new InMemoryUsersRepository()
		const sut = new AuthenticateUseCase(usersRepository)

		await usersRepository.create({
			name: "john",
			email: "john@gmail.com",
			password_hash: await hash("12345", 6)
		})

		const { user } = await sut.execute({
			email: "john@gmail.com",
			password: "12345"
		})

		expect(user.id).toEqual(expect.any(String))
	})

	it("should not be able to authenticate with wrong email", async () => {
		const usersRepository = new InMemoryUsersRepository()
		const sut = new AuthenticateUseCase(usersRepository)

		await expect(() => 
			sut.execute({
				email: "john321@gmail.com",
				password: "12345"
			})
		).rejects.toBeInstanceOf(InvalidCredentialError)
	})

	it("should not be able to authenticate with wrong password", async () => {
		const usersRepository = new InMemoryUsersRepository()
		const sut = new AuthenticateUseCase(usersRepository)

		await usersRepository.create({
			name: "john",
			email: "john@gmail.com",
			password_hash: await hash("12345", 6)
		})

		

		await expect(() => 
			sut.execute({
				email: "john@gmail.com",
				password: "123456"
			})
		).rejects.toBeInstanceOf(InvalidCredentialError)
	})
})