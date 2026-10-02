const SoftwareProvenance = artifacts.require("SoftwareProvenance");

contract("SoftwareProvenance", (accounts) => {
  const [admin, supplier, developer, unauthorized] = accounts;
  let contract;

  beforeEach(async () => {
    contract = await SoftwareProvenance.new({ from: admin });
    await contract.assignRole(supplier, 1, { from: admin });
    await contract.assignRole(developer, 2, { from: admin });
  });

  it("allows a supplier to register a component", async () => {
    const hash = web3.utils.keccak256("authentication-library-v2.1");
    await contract.registerComponent("Authentication Library", "2.1.0", hash, { from: supplier });
    const c = await contract.getComponent(1);
    assert.equal(c.name, "Authentication Library");
    assert.equal(c.owner, supplier);
  });

  it("rejects unauthorized registration", async () => {
    try {
      await contract.registerComponent("Bad", "1.0", web3.utils.keccak256("bad"), { from: unauthorized });
      assert.fail("Expected revert");
    } catch (e) {
      assert(e.message.includes("Only suppliers"));
    }
  });

  it("prevents duplicate artifact hashes", async () => {
    const hash = web3.utils.keccak256("same-component");
    await contract.registerComponent("Library", "1.0", hash, { from: supplier });
    try {
      await contract.registerComponent("Copy", "1.0", hash, { from: supplier });
      assert.fail("Expected revert");
    } catch (e) {
      assert(e.message.includes("Artifact already registered"));
    }
  });

  it("verifies correct and detects modified hashes", async () => {
    const original = web3.utils.keccak256("original");
    await contract.registerComponent("Component", "1.0", original, { from: supplier });
    assert.equal(await contract.checkComponentHash(1, original), true);
    assert.equal(await contract.checkComponentHash(1, web3.utils.keccak256("modified")), false);
  });

  it("transfers ownership to an authorised participant", async () => {
    const hash = web3.utils.keccak256("transfer");
    await contract.registerComponent("Transfer Component", "1.0", hash, { from: supplier });
    await contract.transferComponent(1, developer, { from: supplier });
    const c = await contract.getComponent(1);
    assert.equal(c.owner, developer);
  });
});
