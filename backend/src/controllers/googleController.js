class GoogleController {
    constructor(appsScriptService) {
        this.appsScriptService = appsScriptService;
    }

    async executeJson(req, res) {
        try {
            const jsonResponse = await this.appsScriptService.execute(req.body);
            res.status(200).json(jsonResponse);
        } catch (error) {
            console.error('Error executing JSON via Google Apps Script:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default GoogleController;