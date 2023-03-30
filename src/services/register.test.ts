import { InMemoryUsersRepository } from "@/repositories/in-memory-users-repository"
import { compare } from "bcryptjs"
import {describe, expect, it} from "vitest"
import { UserAlreadyExistsError } from "./errors/user-already-exists"
import { RegisterUseCase } from "./register"

describe("Register Use Case", () => {
	it("should be able to register a new user", async () => {
		const usersRepository = new InMemoryUsersRepository()
		const registerUserCase = new RegisterUseCase(usersRepository)

		const {user} = await registerUserCase.execute({
			name: "john",
			email: "john@gmail.com",
			password: "123456"
		})

		expect(user.id).toEqual(expect.any(String))
	})

	it("should hash user password on registration", async () => {
		const usersRepository = new InMemoryUsersRepository()
		const registerUserCase = new RegisterUseCase(usersRepository)

		const {user} = await registerUserCase.execute({
			name: "john",
			email: "john@gmail.com",
			password: "123456"
		})

		const isPasswordCorrectHashed = await compare("123456", user.password_hash)

		expect(isPasswordCorrectHashed).toBe(true)
	})

	it("should not be able to register with same email", async () => {
		const usersRepository = new InMemoryUsersRepository()
		const registerUserCase = new RegisterUseCase(usersRepository)

		const email = "john@gmail.com"

		await registerUserCase.execute({
			name: "john",
			email: "john@gmail.com",
			password: "123456"
		})

		expect(async () => {
			await registerUserCase.execute({
				name: "john",
				email: "john@gmail.com",
				password: "123456"
			})
		}).rejects.toBeInstanceOf(UserAlreadyExistsError)
	})
})