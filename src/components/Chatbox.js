import React from 'react';
import './Chatbox.css'

const Chatbox = ({ message }) => (
    <div className="chat-box">
        <div className="chat-message">
            <h5>{message.from}</h5>
            <span className="message">
                {message.content}
            </span>
        </div>
    </div>
);
export default Chatbox;