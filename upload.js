const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;
const FOLDER_PATH = __dirname; // Use current directory

async function uploadFile(filePath, fileName) {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath), { filepath: fileName });

    try {
        const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
            maxBodyLength: 'Infinity',
            headers: {
                'pinata_api_key': PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_SECRET_API_KEY,
                ...formData.getHeaders(),
            },
        });

        console.log(`✅ Uploaded: ${fileName} - CID: ${res.data.IpfsHash}`);
        return res.data.IpfsHash;
    } catch (error) {
        console.error(`❌ Upload failed for ${fileName}:`, error.response?.data || error.message);
        return null;
    }
}

async function uploadFolder(folderPath) {
    console.log('🚀 Uploading files to Pinata...');

    const files = fs.readdirSync(folderPath);
    const fileCIDs = {};

    for (const file of files) {
        const filePath = path.join(folderPath, file);

        if (fs.lstatSync(filePath).isFile()) { // Ensure it's a file
            const cid = await uploadFile(filePath, file);
            if (cid) fileCIDs[file] = cid;
        }
    }

    console.log('🌍 Uploaded files:', fileCIDs);
    console.log('⚠️ Note: Each file has a different CID. IPFS does not support automatic directory structures unless you use `pinDirectoryToIPFS` API (Pinata Business Plan).');

    return fileCIDs;
}

uploadFolder(FOLDER_PATH);
