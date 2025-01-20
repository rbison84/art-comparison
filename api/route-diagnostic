// api/route-diagnostic.js
import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
    const diagnosticResults = {
        timestamp: new Date().toISOString(),
        routes: {
            api: null,
            vercelConfig: null
        },
        files: null,
        error: null
    };

    try {
        // Check API directory
        const apiPath = path.join(process.cwd(), 'api');
        const files = await fs.readdir(apiPath);
        diagnosticResults.files = files;

        // Check vercel.json
        try {
            const vercelConfig = await fs.readFile(
                path.join(process.cwd(), 'vercel.json'),
                'utf8'
            );
            diagnosticResults.routes.vercelConfig = JSON.parse(vercelConfig);
        } catch (e) {
            diagnosticResults.routes.vercelConfig = {
                error: 'vercel.json not found or invalid'
            };
        }

    } catch (error) {
        diagnosticResults.error = {
            message: error.message,
            type: error.name
        };
    }

    res.json(diagnosticResults);
}
