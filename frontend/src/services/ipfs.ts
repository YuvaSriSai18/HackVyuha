import axios from 'axios';

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_API_KEY = import.meta.env.VITE_PINATA_SECRET_API_KEY;
const PINATA_GATEWAY_URL = 'https://moccasin-advisory-hippopotamus-71.mypinata.cloud/ipfs/';

/**
 * Uploads a paper (PDF or document) to IPFS
 * @param file - The paper file (e.g., PDF, DOCX)
 * @returns CID and full gateway URL
 */
export async function uploadPaperToIPFS(file: File): Promise<{ cid: string; url: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        uploadedBy: 'PeerReviewSystem',
        type: 'paper',
        timestamp: Date.now().toString()
      }
    });

    const options = JSON.stringify({ cidVersion: 0 });
    formData.append('pinataMetadata', metadata);
    formData.append('pinataOptions', options);

    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_API_KEY,
        },
      }
    );

    const cid = response.data.IpfsHash;
    return { cid, url: `${PINATA_GATEWAY_URL}${cid}` };
  } catch (error) {
    console.error('Error uploading paper to IPFS:', error);
    throw new Error('Failed to upload paper to IPFS');
  }
}

/**
 * Uploads a JSON-based peer review to IPFS
 * @param reviewData - JSON review content
 * @param name - Optional name (e.g., "review_123.json")
 * @returns CID and full gateway URL
 */
export async function uploadReviewToIPFS(reviewData: any, name = 'review.json'): Promise<{ cid: string; url: string }> {
  try {
    const payload = {
      pinataOptions: { cidVersion: 0 },
      pinataMetadata: {
        name,
        keyvalues: {
          type: 'review',
          uploadedBy: 'Reviewer',
          timestamp: Date.now().toString()
        }
      },
      pinataContent: reviewData
    };

    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      JSON.stringify(payload),
      {
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_API_KEY
        }
      }
    );

    const cid = response.data.IpfsHash;
    return { cid, url: `${PINATA_GATEWAY_URL}${cid}` };
  } catch (error) {
    console.error("Error uploading review to IPFS:", error);
    throw new Error("Failed to upload review to IPFS");
  }
}

/**
 * Fetches data (paper or review) from IPFS
 * @param ipfsHash - CID or full IPFS URL
 * @returns File or JSON content
 */
export async function getFromIPFS(ipfsHash: string): Promise<any> {
  try {
    const cleanHash = ipfsHash.startsWith('http') ? ipfsHash.split('/').pop() || '' : ipfsHash;
    const response = await axios.get(`${PINATA_GATEWAY_URL}${cleanHash}`);
    return response.data;
  } catch (error) {
    console.error("Error retrieving from IPFS:", error);
    throw new Error("Failed to fetch content from IPFS");
  }
}

/**
 * Unpins a CID from IPFS (optional)
 * @param ipfsHash - CID or IPFS URL
 */
export async function unpinFromIPFS(ipfsHash: string): Promise<void> {
  try {
    const cleanHash = ipfsHash.startsWith('http') ? ipfsHash.split('/').pop() || '' : ipfsHash;
    await axios.delete(
      `https://api.pinata.cloud/pinning/unpin/${cleanHash}`,
      {
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_API_KEY
        }
      }
    );
  } catch (error) {
    console.error("Error unpinning file from IPFS:", error);
    throw new Error("Failed to unpin file from IPFS");
  }
}
