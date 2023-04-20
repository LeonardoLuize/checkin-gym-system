/* eslint-disable @typescript-eslint/no-empty-function */
import "dotenv/config"
import { prisma } from "@/lib/prisma"
import { execSync } from "node:child_process"
import { randomUUID } from "node:crypto"
import {Environment} from "vitest"

// DATABASE_URL="postgresql://docker:docker@localhost:5432/apisolid?schema=public"
function generateDataBaseUrl(schema: string){
	if(!process.env.DATABASE_URL) {
		throw new Error("Please provide an DATABASE_URL environment variable.")
	}

	const url = new URL(process.env.DATABASE_URL)

	url.searchParams.set("schema", schema)

	return url.toString()
}

export default <Environment>{
	name: "prisma",
	async setup(){
		const schema = randomUUID()
		const dataBaseURL = generateDataBaseUrl(schema)

		process.env.DATABASE_URL = dataBaseURL

		execSync("npx prisma migrate deploy")

		return{
			async teardown() {
				await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
				await prisma.$disconnect()
			},
		}
	},
    
}