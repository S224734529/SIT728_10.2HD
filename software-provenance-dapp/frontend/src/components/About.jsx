function About() {
  return (
    <div>
      <div className="card">
        <h2>
          About the Software Provenance DApp
        </h2>

        <p>
          This decentralized application
          provides provenance and integrity
          tracking for software components
          moving through a software supply
          chain.
        </p>

        <p>
          Software components may pass
          between suppliers, developers,
          testing teams and release
          processes. The DApp records
          important lifecycle activities on
          a blockchain so that the history
          of a component can be inspected
          later.
        </p>
      </div>

      <div className="card">
        <h3>
          Blockchain Provenance Tracking
        </h3>

        <p>
          When a supplier registers a
          software component, the smart
          contract records its name,
          version, cryptographic hash,
          supplier address, current owner
          and blockchain timestamp.
        </p>

        <p>
          Later activities, including
          ownership transfers, builds,
          security testing, approval and
          release, can be added to the
          component's provenance history.
        </p>
      </div>

      <div className="card">
        <h3>
          SHA-256 Artefact Verification
        </h3>

        <p>
          The DApp calculates a SHA-256
          digest of a selected software
          artefact in the user's browser.
          The complete file is not stored
          on the blockchain. Only its
          32-byte cryptographic hash is
          registered.
        </p>

        <p>
          A software artefact can later be
          verified by calculating its hash
          again and comparing it with the
          blockchain record. A modification
          to the file produces a different
          hash and causes integrity
          verification to fail.
        </p>
      </div>

      <div className="card">
        <h3>
          Role-Based Access Control
        </h3>

        <p>
          Participants are identified by
          their Ethereum addresses. The
          smart contract defines Supplier,
          Developer and Auditor roles, while
          the account that deploys the
          contract acts as the administrator.
        </p>

        <p>
          Solidity modifiers restrict
          protected operations. For example,
          only an account assigned the
          Supplier role can register a new
          software component.
        </p>
      </div>

      <div className="card">
        <h3>
          Supply-Chain Transparency
        </h3>

        <p>
          Provenance records identify the
          blockchain account that performed
          an activity and the time at which
          it occurred. This creates a
          traceable history from initial
          registration through later
          development and release
          activities.
        </p>
      </div>

      <div className="card">
        <h3>
          Privacy and Scalability
        </h3>

        <p>
          The application does not place
          complete software artefacts on
          the blockchain. Only the
          cryptographic digest and limited
          provenance information are
          recorded. This reduces on-chain
          storage while allowing the
          integrity of an external artefact
          to be checked.
        </p>

        <p>
          Role-based permissions control
          which accounts can perform
          protected operations. They do not
          make blockchain records
          confidential. Sensitive source
          code and private files should
          therefore remain off-chain.
        </p>
      </div>

      <div className="card">
        <h3>Technology</h3>

        <p>
          The DApp uses Solidity for the
          smart contract, Ganache as the
          local Ethereum blockchain,
          MetaMask for wallet transactions,
          ethers.js for blockchain
          communication and React for the
          user interface.
        </p>
      </div>
    </div>
  );
}

export default About;