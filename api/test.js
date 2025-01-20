// api/test.js
export default function handler(req, res) {
    res.json({
        message: "API is working",
        time: new Date().toISOString()
    });
}
