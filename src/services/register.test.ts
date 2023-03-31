import { InMemoryUsersRepository } from "@/repositories/in-memory-users-repository"
import { compare } from "bcryptjs"
import {beforeEach, describe, expect, it} from "vitest"
import { UserAlreadyExistsError } from "./errors/user-already-exists"
import { RegisterUseCase } from "./register"

let usersRepository: InMemoryUsersRepository
let registerUserCase: RegisterUseCase

describe("Register Use Case", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		registerUserCase = new RegisterUseCase(usersRepository)
	})

	it("should be able to register a new user", async () => {
		const {user} = await registerUserCase.execute({
			name: "john",
			email: "john@gmail.com",
			password: "123456"
		})

		expect(user.id).toEqual(expect.any(String))
	})

	it("should hash user password on registration", async () => {
		const {user} = await registerUserCase.execute({
			name: "john",
			email: "john@gmail.com",
			password: "123456"
		})

		const isPasswordCorrectHashed = await compare("123456", user.password_hash)

		expect(isPasswordCorrectHashed).toBe(true)
	})

	it("should not be able to register with same email", async () => {
		const email = "john@gmail.com"

		await registerUserCase.execute({
			name: "john",
			email,
			password: "123456"
		})

		await expect(() => 
			registerUserCase.execute({
				name: "john",
				email,
				password: "123456"
			})
		).rejects.toBeInstanceOf(UserAlreadyExistsError)
	})
})