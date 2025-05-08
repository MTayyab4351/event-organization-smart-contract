const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("createEvenT", function () {
  let eventContract;
  let owner;
  let user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    const CreateEvent = await ethers.getContractFactory("createEvenT");
    eventContract = await CreateEvent.deploy();
  });

  it("should create a new event", async function () {
    const timestamp = Math.floor(Date.now() / 1000) + 3600; // 1 hour later
    await eventContract.createEvents("Music Night", timestamp, ethers.parseEther("0.1"), 100);
    const event = await eventContract.events(0);
    expect(event.name).to.equal("Music Night");
    expect(event.price).to.equal(ethers.parseEther("0.1"));
    expect(event.ticketCount).to.equal(100);
  });

  it("should allow user to buy ticket", async function () {
    const timestamp = Math.floor(Date.now() / 1000) + 3600;
    await eventContract.createEvents("Tech Talk", timestamp, ethers.parseEther("0.1"), 50);

    await eventContract.connect(user).buy(0, 1, { value: ethers.parseEther("0.1") });

    const ticketsBought = await eventContract.tickets(user.address, 0);
    expect(ticketsBought).to.equal(1);
  });

  it("should fail if not enough ETH sent", async function () {
    const timestamp = Math.floor(Date.now() / 1000) + 3600;
    await eventContract.createEvents("Blockchain Meetup", timestamp, ethers.parseEther("0.5"), 30);

    await expect(
      eventContract.connect(user).buy(0, 1, { value: ethers.parseEther("0.1") })
    ).to.be.revertedWith("not enough money");
  });
});
