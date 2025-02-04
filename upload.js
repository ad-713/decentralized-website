const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

async function uploadToIPFS() {
    const data = new FormData();
    data.append('file', fs.createReadStream('./index.html'));

    const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', data, {
        headers: {
            'pinata_api_key': PINATA_API_KEY,
            'pinata_secret_api_key': PINATA_SECRET_API_KEY,
            'Content-Type': `multipart/form-data;`,
        },
    });

    console.log('IPFS Hash:', res.data.IpfsHash);
}
uploadToIPFS();
