import React from 'react';
import PropTypes from 'prop-types';

const MessageBubble = ({ message, isUser }) => {
    return (
        <div className={`message-bubble ${isUser ? 'user' : 'assistant'}`}>
            <p>{message}</p>
        </div>
    );
};

MessageBubble.propTypes = {
    message: PropTypes.string.isRequired,
    isUser: PropTypes.bool.isRequired,
};

export default MessageBubble;