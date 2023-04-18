/* eslint-disable @typescript-eslint/no-empty-function */
import {Environment} from "vitest"

export default <Environment>{
	name: "prisma",
	async setup(){
		console.log("Executou")

		return{
			teardown() {},
		}
	},
    
}