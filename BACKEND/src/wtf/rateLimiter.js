

    const limit = 20;
    const interval = 10;
    const threshold = 3;
    let tokens = new Map();
    tokens.set("qpp",23);
    console.log(tokens.get("qps"))
    const now = Date.now();
    console.log(now);
    // Method to get a token for a given key
    class RateLimiter {
        constructor(limit, windowSize, threshold) {
            this.limit = limit; // Maximum number of requests allowed in the window
            this.windowSize = windowSize; // Time window for tracking requests
            this.threshold = threshold; // Consecutive failures threshold
            this.requests = new Map(); // Map to store request timestamps for each key
        }

        canMakeRequest(key) {
            const now = Date.now();

            // Retrieve the request timestamps for the given key
            const timestamps = this.requests.get(key) || [];

            // Remove timestamps that are older than the window
            const recentTimestamps = timestamps.filter((timestamp) => now - timestamp <= this.windowSize);

            // Update the timestamps for the key
            this.requests.set(key, [...recentTimestamps, now]);

            // Check if the number of recent timestamps is below the limit
            if (recentTimestamps.length < this.limit) {
                return true; // Can make a request
            } else {
                // Check if consecutive failures reach the threshold
                if (timestamps.length >= this.threshold) {
                    // If consecutive failures reach the threshold, clear all timestamps
                    this.requests.set(key, []);
                }

                return false; // Cannot make a request
            }
        }
    }

    // Example Usage:
    const rateLimiter = new RateLimiter(5, 10000, 3); // Allow 5 requests in 10 seconds with a threshold of 3 consecutive failures

    // Simulate requests for a key
    for (let i = 0; i < 10; i++) {
        const key = "user123";
        if (rateLimiter.canMakeRequest(key)) {
            console.log(`Request ${i + 1}: Allowed`);
        } else {
            console.log(`Request ${i + 1}: Denied`);
        }
    }
