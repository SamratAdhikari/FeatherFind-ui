import Chatbot from "react-chatbot-kit";
import { createChatBotMessage } from "react-chatbot-kit";

import React from "react";
import "./ChatBox.css";
import OpenAI from "openai";
import PropTypes from "prop-types";
import { useState } from "react";
import { Chat } from "react-bootstrap-icons";

function ChatBot(props) {
    const openai = new OpenAI({
        apiKey: props.OPEN_AI_KEY,
        dangerouslyAllowBrowser: true,
    });
    const getResponse = async (message) => {
        const completion = await openai.chat.completions.create({
            messages: message,
            model: props.model,
            max_tokens: props.max_tokens,
        });

        return {
            role: "assistant",
            content: completion.choices[0].message.content,
        };
    };
    let messages = [
        {
            role: "assistant",
            content: props.chatbot_prompt,
        },
    ];

    //Action Provider
    // eslint-disable-next-line react/prop-types
    const ActionProvider = ({ createChatBotMessage, setState, children }) => {
        const handle = async (message) => {
            let json = {
                role: "user",
                content: message,
            };
            messages.push(json);
            const response = await getResponse(messages);
            messages.push(response);
            const botMessage = createChatBotMessage(
                response.content
                    ? response.content
                    : "Sorry, I did not understand that."
            );

            setState((prev) => ({
                ...prev,
                messages: [...prev.messages, botMessage],
            }));
        };

        // Put the handleHello function in the actions object to pass to the MessageParser
        return (
            <div>
                {React.Children.map(children, (child) => {
                    return React.cloneElement(child, {
                        actions: {
                            handle,
                        },
                    });
                })}
            </div>
        );
    };

    // eslint-disable-next-line react/prop-types
    const MessageParser = ({ children, actions }) => {
        const parse = (message) => {
            // eslint-disable-next-line react/prop-types
            actions.handle(message);
        };

        return (
            <div>
                {React.Children.map(children, (child) => {
                    return React.cloneElement(child, {
                        parse: parse,
                        actions,
                    });
                })}
            </div>
        );
    };

    const botName = "HERMES Group";

    const config = {
        initialMessages: [createChatBotMessage("Hi! How can I help you?")],
        botName: botName,
        customStyles: {},
    };

    const [isOpen, setIsOpen] = useState(false);
    const handleChatBot = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="chatcontainer z-1000">
            <div className="chatbotbutton">
                <button
                    className="flex gap-2 items-center h-10"
                    onClick={handleChatBot}
                >
                    <span className="button_text">{props.buttonText}</span>
                    <Chat />
                </button>
            </div>

            <div className={isOpen ? "openedChat" : "closedChat"}>
                <Chatbot
                    config={config}
                    messageParser={MessageParser}
                    actionProvider={ActionProvider}
                    headerText={props.headerText}
                    placeholderText={props.placeholderText}
                    className="z-50"
                />
            </div>
        </div>
    );
}

ChatBot.propTypes = {
    OPEN_AI_KEY: PropTypes.string.isRequired,
    model: PropTypes.oneOf([
        "gpt-4-1106-preview",
        "gpt-4",
        "gpt-3.5-turbo-1106",
        "gpt-3.5-turbo",
    ]),
    max_tokens: PropTypes.number.isRequired,
    chatbot_prompt: PropTypes.string.isRequired,
    headerText: PropTypes.string.isRequired,
    placeholderText: PropTypes.string.isRequired,
    buttonText: PropTypes.string.isRequired,
};

export default ChatBot;
