import { expect } from 'chai'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { ethers } from 'hardhat'
import { type HelloWorld } from '@typechain/HelloWorld'

describe('HelloWorld Tests', () => {
	let helloWorld: HelloWorld
	const initialMessage = 'Hello World'

	async function deployFixture(): Promise<void> {
		helloWorld = await ethers
			.getContractFactory('HelloWorld')
			.then(async (contract) => await contract.deploy(initialMessage))
	}

	beforeEach(async () => {
		await loadFixture(deployFixture)
	})

	it('test initial value', async function () {
		expect(await helloWorld._message()).to.equal(initialMessage)
	})

	it('test update message and retrieving updated message', async function () {
		const newMessage = 'New message'
		await helloWorld.updateMessage(newMessage)
		expect(await helloWorld._message()).to.equal(newMessage)
	})
})
