// api/api-diagnostic.js
export default async function handler(req, res) {
    const diagnosticResults = {
        timestamp: new Date().toISOString(),
        request: {
            method: req.method,
            headers: req.headers,
            body: req.body,
            query: req.query
        },
        endpoints: {
            current: `/api/api-diagnostic`,
            comparisons: `/api/comparisons`
        }
    };

    // Test comparisons endpoint
    try {
        const response = await fetch(`${req.headers.host}/api/comparisons`);
        diagnosticResults.comparisonsEndpoint = {
            status: response.status,
            working: response.ok
        };
    } catch (error) {
        diagnosticResults.comparisonsEndpoint = {
            error: error.message
        };
    }

    res.json(diagnosticResults);
}
