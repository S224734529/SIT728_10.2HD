import { useState } from "react";

function VerifyComponent({ contract }) {
  const [componentId, setComponentId] =
    useState("");

  const [file, setFile] = useState(null);

  const [fileHash, setFileHash] =
    useState("");

  const [storedHash, setStoredHash] =
    useState("");

  const [result, setResult] =
    useState(null);

  const [message, setMessage] =
    useState("");

  async function calculateSHA256(
    selectedFile
  ) {
    const arrayBuffer =
      await selectedFile.arrayBuffer();

    const hashBuffer =
      await crypto.subtle.digest(
        "SHA-256",
        arrayBuffer
      );

    const hashArray = Array.from(
      new Uint8Array(hashBuffer)
    );

    const hashHex = hashArray
      .map((byte) =>
        byte.toString(16).padStart(2, "0")
      )
      .join("");

    return "0x" + hashHex;
  }

  async function handleFileChange(event) {
    const selectedFile =
      event.target.files[0];

    setResult(null);
    setStoredHash("");

    if (!selectedFile) {
      setFile(null);
      setFileHash("");
      return;
    }

    try {
      setMessage(
        "Calculating SHA-256..."
      );

      const hash =
        await calculateSHA256(
          selectedFile
        );

      setFile(selectedFile);
      setFileHash(hash);
      setMessage("");

    } catch (error) {
      console.error(error);

      setMessage(
        "Could not calculate file hash."
      );
    }
  }

  async function verifyComponent() {
    if (!componentId || !file) {
      setMessage(
        "Enter a component ID and select a file."
      );
      return;
    }

    try {
      setMessage(
        "Checking blockchain record..."
      );

      // Get registered component information
      const component =
        await contract.getComponent(
          componentId
        );

      setStoredHash(
        component.artifactHash
      );

      // Compare selected file hash
      // against blockchain value
      const valid =
        await contract.checkComponentHash(
          componentId,
          fileHash
        );

      setResult(valid);

      if (valid) {
        setMessage(
          "The selected software artefact matches the blockchain record."
        );
      } else {
        setMessage(
          "The selected software artefact does not match the blockchain record."
        );
      }

    } catch (error) {
      console.error(error);

      setResult(null);

      setMessage(
        error.shortMessage ||
        error.reason ||
        "Verification failed. Check the component ID."
      );
    }
  }

  return (
    <div className="card">
      <h2>
        Verify Software Artefact
      </h2>

      <p>
        Select a software artefact to
        calculate its SHA-256 hash and
        compare it with the hash registered
        on the blockchain.
      </p>

      <label>Component ID</label>

      <input
        type="number"
        min="1"
        value={componentId}
        onChange={(event) =>
          setComponentId(
            event.target.value
          )
        }
        placeholder="1"
      />

      <label>Software Artefact</label>

      <input
        type="file"
        onChange={handleFileChange}
      />

      {file && (
        <div className="file-information">
          <p>
            <strong>Selected file:</strong>{" "}
            {file.name}
          </p>

          <p>
            <strong>
              Calculated SHA-256:
            </strong>
          </p>

          <div className="hash-display">
            {fileHash}
          </div>
        </div>
      )}

      <button
        onClick={verifyComponent}
        disabled={!file || !componentId}
      >
        Verify Integrity
      </button>

      {storedHash && (
        <div className="verification-details">
          <p>
            <strong>
              Blockchain Hash
            </strong>
          </p>

          <div className="hash-display">
            {storedHash}
          </div>

          <p>
            <strong>
              Selected File Hash
            </strong>
          </p>

          <div className="hash-display">
            {fileHash}
          </div>
        </div>
      )}

      {result === true && (
        <div className="success">
          ✓ INTEGRITY VERIFIED
          <br />
          <small>
            The selected artefact matches
            the software component
            registered on the blockchain.
          </small>
        </div>
      )}

      {result === false && (
        <div className="error">
          ✕ INTEGRITY VERIFICATION FAILED
          <br />
          <small>
            The selected artefact has a
            different SHA-256 hash from the
            registered component.
          </small>
        </div>
      )}

      {message && (
        <div className="message">
          {message}
        </div>
      )}
    </div>
  );
}

export default VerifyComponent;