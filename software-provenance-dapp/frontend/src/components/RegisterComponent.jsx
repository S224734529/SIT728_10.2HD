import { useState } from "react";

function RegisterComponent({ contract }) {
  const [name, setName] = useState("");
  const [version, setVersion] = useState("");
  const [file, setFile] = useState(null);
  const [fileHash, setFileHash] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Calculate SHA-256 from the selected file
  async function calculateSHA256(selectedFile) {
    const arrayBuffer = await selectedFile.arrayBuffer();

    const hashBuffer = await crypto.subtle.digest(
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
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      setFile(null);
      setFileHash("");
      return;
    }

    try {
      setMessage("Calculating SHA-256...");

      const hash = await calculateSHA256(
        selectedFile
      );

      setFile(selectedFile);
      setFileHash(hash);
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage(
        "Could not calculate the file hash."
      );
    }
  }

  async function registerComponent(event) {
    event.preventDefault();

    if (!name || !version || !file || !fileHash) {
      setMessage(
        "Please enter the component details and select a file."
      );
      return;
    }

    try {
      setLoading(true);
      setMessage(
        "Waiting for MetaMask confirmation..."
      );

      const transaction =
        await contract.registerComponent(
          name,
          version,
          fileHash
        );

      setMessage(
        "Transaction submitted. Waiting for blockchain confirmation..."
      );

      await transaction.wait();

      setMessage(
        "Software component registered successfully."
      );

      setName("");
      setVersion("");
      setFile(null);
      setFileHash("");

      // Clear file input
      document.getElementById(
        "artifact-file"
      ).value = "";

    } catch (error) {
      console.error(error);

      setMessage(
        error.shortMessage ||
        error.reason ||
        "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) {
      return bytes + " bytes";
    }

    if (bytes < 1024 * 1024) {
      return (
        (bytes / 1024).toFixed(2) + " KB"
      );
    }

    return (
      (bytes / (1024 * 1024)).toFixed(2) +
      " MB"
    );
  }

  return (
    <div className="card">
      <h2>Register Software Component</h2>

      <p>
        Register a software artefact in the
        supply chain. The file remains on your
        computer. Only its SHA-256 hash is
        recorded on the blockchain.
      </p>

      <form onSubmit={registerComponent}>
        <label>Component Name</label>

        <input
          type="text"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          placeholder="Authentication Library"
        />

        <label>Version</label>

        <input
          type="text"
          value={version}
          onChange={(event) =>
            setVersion(event.target.value)
          }
          placeholder="2.1.0"
        />

        <label>Software Artefact</label>

        <input
          id="artifact-file"
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
              <strong>File size:</strong>{" "}
              {formatFileSize(file.size)}
            </p>

            <p>
              <strong>SHA-256:</strong>
            </p>

            <div className="hash-display">
              {fileHash}
            </div>
          </div>
        )}

        <p className="help">
          SHA-256 is calculated locally in
          your browser. The software file
          itself is not uploaded to the
          blockchain.
        </p>

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : "Register Component"}
        </button>
      </form>

      {message && (
        <div className="message">
          {message}
        </div>
      )}
    </div>
  );
}

export default RegisterComponent;