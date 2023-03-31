import { InMemoryUsersRepository } from "@/repositories/in-memory-users-repository"
import { hash } from "bcryptjs"
import { describe, expect, it, beforeEach} from "vitest"
import { AuthenticateUseCase } from "./authenticate"
import { InvalidCredentialError } from "./errors/invalid_credential_error"

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe("Authenticate Use Case", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new AuthenticateUseCase(usersRepository)
	})

	it("should be able to authenticate", async () => {
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
		await expect(() => 
			sut.execute({
				email: "john321@gmail.com",
				password: "12345"
			})
		).rejects.toBeInstanceOf(InvalidCredentialError)
	})

	it("should not be able to authenticate with wrong password", async () => {
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