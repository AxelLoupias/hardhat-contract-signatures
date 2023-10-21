import { ethers } from 'hardhat'

async function main() {
	const initialMessage = 'Hello World'

	const HelloWorld = await ethers.getContractFactory('HelloWorld')
	const helloWorld = await HelloWorld.deploy(initialMessage)

	await helloWorld.waitForDeployment()
	console.log(
		`HelloWorld with initialMessage: ${await helloWorld._message()}} and deployed to ${await helloWorld.getAddress()}`
	)
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
