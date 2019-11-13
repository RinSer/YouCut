// Configure node.js environment from .env
const dotenv = require('dotenv');
dotenv.config();

// Run server
const express = require('express')
const request = require('request')
const app = express()
const port = 3000

// Serve the app files
app.use(express.static('public'))
// Redirect requests avoiding CORs
app.get('/utube', (req, res) => {
    const videoId = req.query && req.query.video_id;
    if (videoId) {
        const redirect = `https://www.youtube.com/get_video_info?video_id=${videoId}`;
        request(redirect).pipe(res);
    }
})

app.listen(port, () => console.log(`YouCut is working at http://localhost:${port}`))