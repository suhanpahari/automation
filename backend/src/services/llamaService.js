const axios = require('axios');

class LlamaService {
    constructor(apiUrl, apiKey) {
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
    }

    async sendMessage(message) {
        try {
            const response = await axios.post(this.apiUrl, {
                message: message
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error sending message to LLaMA:', error);
            throw error;
        }
    }
}

module.exports = new LlamaService(process.env.LLAMA_API_URL, process.env.LLAMA_API_KEY);