import React, { useState, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import FileUploader from './FileUploader';
import { sendMessage, fetchMessages } from '../utils/api';

const ChatWindow = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        const loadMessages = async () => {
            const fetchedMessages = await fetchMessages();
            setMessages(fetchedMessages);
        };
        loadMessages();
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (input.trim()) {
            const newMessage = { text: input, sender: 'user' };
            setMessages([...messages, newMessage]);
            setInput('');
            await sendMessage(input);
        }
    };

    return (
        <div className="chat-window">
            <div className="messages">
                {messages.map((msg, index) => (
                    <MessageBubble key={index} message={msg} />
                ))}
            </div>
            <FileUploader />
            <form onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default ChatWindow;