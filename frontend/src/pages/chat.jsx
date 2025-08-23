import React, { useState, useEffect } from 'react';
import ChatWindow from '../components/ChatWindow';
import { fetchChatHistory } from '../utils/api';

const ChatPage = () => {
    const [chatHistory, setChatHistory] = useState([]);

    useEffect(() => {
        const loadChatHistory = async () => {
            const history = await fetchChatHistory();
            setChatHistory(history);
        };

        loadChatHistory();
    }, []);

    return (
        <div className="chat-page">
            <h1>Chat Interface</h1>
            <ChatWindow chatHistory={chatHistory} />
        </div>
    );
};

export default ChatPage;