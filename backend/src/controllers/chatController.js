class ChatController {
    constructor(llamaService, conversationModel) {
        this.llamaService = llamaService;
        this.conversationModel = conversationModel;
    }

    async sendMessage(req, res) {
        const { userId, message } = req.body;

        try {
            const response = await this.llamaService.getResponse(message);
            const conversation = await this.conversationModel.create({
                userId,
                messages: [
                    { sender: 'user', content: message },
                    { sender: 'assistant', content: response }
                ]
            });

            res.status(200).json({
                success: true,
                conversationId: conversation._id,
                response
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error processing message',
                error: error.message
            });
        }
    }

    async getConversation(req, res) {
        const { conversationId } = req.params;

        try {
            const conversation = await this.conversationModel.findById(conversationId);
            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    message: 'Conversation not found'
                });
            }

            res.status(200).json({
                success: true,
                conversation
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving conversation',
                error: error.message
            });
        }
    }
}

export default ChatController;