const express = require('express');
const app = express();
const port = 3000;

// Queue to hold incoming requests
let requestQueue = [];
// Flag to indicate if any request is currently being processed
let isProcessing = false;

// Function to simulate processing time and interact with third party
const processRequest = async (req, res) => {
    try {
        // Simulate processing time (can be variable)
        const processingTime = Math.random() * 5000; // Random processing time up to 5 seconds
        console.log(`Processing request for ${processingTime / 1000} seconds`);
        await new Promise(resolve => setTimeout(resolve, processingTime));

        // Simulate interaction with third party
        console.log('Sending request to third party for processing...');
        // Assume third party responds via webhook after some time
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Received response from third party via webhook');
        
        res.sendStatus(200); // Send status 200 to indicate request processed successfully
    } catch (error) {
        console.error('Error processing request:', error);
        res.sendStatus(500); // Send status 500 for internal server error
    } finally {
        // After processing, check if there are more requests in the queue
        if (requestQueue.length > 0) {
            const nextRequest = requestQueue.shift();
            processRequest(nextRequest.req, nextRequest.res);
        } else {
            // If no more requests in queue, set processing flag to false
            isProcessing = false;
        }
    }
};

// Endpoint to receive requests
app.get('/', (req, res) => {
    // If no request is currently being processed, process the incoming request
    if (!isProcessing) {
        isProcessing = true;
        processRequest(req, res);
    } else {
        // If a request is being processed, add incoming request to the queue
        requestQueue.push({ req, res });
        console.log('Request added to queue');
    }
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
