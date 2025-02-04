const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;
const FOLDER_PATH = './decentralized-website'; // Your website folder

async function uploadFolder() {
    if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
        console.error('❌ Missing Pinata API keys! Make sure they are set in GitHub Secrets.');
        process.exit(1);
    }

    const formData = new FormData();

    // Read all files in the folder and add them to formData
    fs.readdirSync(FOLDER_PATH).forEach(file => {
        const filePath = path.join(FOLDER_PATH, file);
        formData.append('file', fs.createReadStream(filePath), { filepath: file }); // Preserve filenames
    });

    try {
        console.log('🚀 Uploading files to Pinata...');
        
        const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
            maxBodyLength: 'Infinity',
            headers: {
                'pinata_api_key': PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_SECRET_API_KEY,
                ...formData.getHeaders(),
            },
        });

        console.log('✅ Folder successfully uploaded to IPFS!');
        console.log(`🌍 Access your website at: https://ipfs.io/ipfs/${res.data.IpfsHash}/`);
    } catch (error) {
        console.error('❌ Upload failed:', error.response?.data || error.message);
        process.exit(1);
    }
}

uploadFolder();
