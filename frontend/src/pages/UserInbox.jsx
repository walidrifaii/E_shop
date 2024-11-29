import React, { useEffect, useState, useRef } from "react";
import Header from "../components/layouts/Header";
import { useSelector } from "react-redux";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
import { backend_url, server } from "../server";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";

const ENDPOINT = "https://socket-server-k8wd.onrender.com/";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const UserInbox = () => {
    const { user } = useSelector((state) => state.user);
    const [conversations, setConversations] = useState([]);
    const [open, setOpen] = useState(false);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [messages, setMessages] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [userData, setUserData] = useState({});
    const [onlineUser, setOnlineUser] = useState([]);
    const [checkActiveStatus, setCheckActiveStatus] = useState(false);
    const messagesEndRef = useRef(null); // Reference for auto-scroll

    // Scroll to the latest message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const getConversation = async () => {
            try {
                const response = await axios.get(
                    `${server}/conversation/get-all-conversation-user/${user?._id}`,
                    { withCredentials: true }
                );
                setConversations(response.data.conversations);
            } catch (error) {
                console.error("Error fetching conversations:", error);
            }
        };
        getConversation();
    }, [user]);

    useEffect(() => {
        if (user) {
            socketId.emit("addUser", user?._id);
            socketId.on("getUser", (users) => {
                setOnlineUser(users);
            });
        }
    }, [user]);

    const checkOnlineUser = (chat) => {
        const chatMembers = chat.members.find((member) => member !== user?._id);
        return onlineUser.some((online) => online.userId === chatMembers);
    };

    useEffect(() => {
        socketId.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            });
        });
    }, []);

    useEffect(() => {
        if (arrivalMessage && currentChat?.members.includes(arrivalMessage.sender)) {
            setMessages((prev) => [...prev, arrivalMessage]);
        }
    }, [arrivalMessage, currentChat]);

    useEffect(() => {
        const getMessages = async () => {
            try {
                if (currentChat) {
                    const response = await axios.get(
                        `${server}/message/get-all-messages/${currentChat._id}`
                    );
                    setMessages(response.data.messages);
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };
        getMessages();
    }, [currentChat]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessageHandler = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === "") return; // Prevent sending empty messages

        const message = {
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id,
        };

        const receiverId = currentChat.members.find(
            (member) => member !== user._id
        );

        socketId.emit("sendMessage", {
            senderId: user._id,
            receiverId,
            text: newMessage,
        });

        try {
            const res = await axios.post(`${server}/message/create-new-message`, message);
            setMessages((prev) => [...prev, res.data.message]);
            setNewMessage(""); // Clear the input field after sending
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="w-full">
            <Header />
            <h1 className="text-center text-[30px] py-3 font-Poppins">All Messages</h1>
            {open ? (
                <SellerInbox
                    setOpen={setOpen}
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                    sendMessageHandler={sendMessageHandler}
                    messages={messages}
                    userData={userData}
                    sellerID={user._id}
                    checkActiveStatus={checkActiveStatus}
                    messagesEndRef={messagesEndRef}
                />
            ) : (
                conversations.map((conversation, index) => (
                    <MessageList
                        key={index}
                        data={conversation}
                        setOpen={setOpen}
                        setCurrentChat={setCurrentChat}
                        me={user?._id}
                        setUserData={setUserData}
                        online={checkOnlineUser(conversation)}
                        setCheckActiveStatus={setCheckActiveStatus}
                    />
                ))
            )}
        </div>
    );
};

const SellerInbox = ({
    setOpen,
    newMessage,
    setNewMessage,
    sendMessageHandler,
    messages,
    userData,
    sellerID,
    checkActiveStatus,
    messagesEndRef,
}) => (
    <div className="w-full h-full flex flex-col justify-between">
        <div className="w-full flex p-3 items-center justify-between bg-orange-300">
            <div className="flex">
                <img
                    src={`${backend_url}${userData?.avatar}`}
                    alt="User Avatar"
                    className="w-[60px] h-[60px] rounded-full"
                />
                <div className="pl-3">
                    <h1 className="text-[18px] font-[600]">{userData?.name}</h1>
                    <h1>{checkActiveStatus ? "Active Now" : "Not Active"}</h1>
                </div>
            </div>
            <AiOutlineArrowRight size={20} onClick={() => setOpen(false)} />
        </div>
        <div className="flex-grow px-3 py-3 overflow-y-scroll">
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={`flex w-full my-2 ${
                        message.sender === sellerID ? "justify-end" : "justify-start"
                    }`}
                >
                    {message.sender !== sellerID && (
                        <img
                            src="http://localhost:8000/default-avatar.png"
                            alt="Avatar"
                            className="w-[40px] h-[40px] mr-3 rounded-full"
                        />
                    )}
                    <div>
                        <div
                            className={`w-max h-min rounded p-2 ${
                                message.sender === sellerID ? "bg-orange-200" : "bg-gray-200"
                            }`}
                        >
                            <p>{message.text}</p>
                        </div>
                        <p className="text-[12px] text-[#000c]">
                            {format(message.createdAt)}
                        </p>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
        <form
            className="p-3 w-full flex justify-between items-center bg-white"
            onSubmit={sendMessageHandler}
        >
            <input
                type="text"
                required
                placeholder="Enter your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-400"
            />
            <button type="submit">
                <AiOutlineSend size={25} />
            </button>
        </form>
    </div>
);

const MessageList = ({
    data,
    setOpen,
    setCurrentChat,
    me,
    setUserData,
    online,
    setCheckActiveStatus,
}) => {
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const userId = data.members.find((id) => id !== me);
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${server}/shop/get-shop-info/${userId}`);
                setUser(res.data.Shop);
            } catch (err) {
                console.error("Error fetching user info:", err);
            }
        };
        fetchUser();
        setCheckActiveStatus(online);
    }, [data, me, online]);

    const handleClick = () => {
        setOpen(true);
        setCurrentChat(data);
        setUserData(user);
        navigate(`?${data._id}`);
    };

    return (
        <div className="flex items-center p-3 cursor-pointer" onClick={handleClick}>
            <img
                src={`${backend_url}${user.avatar}`}
                alt="User Avatar"
                className="w-[50px] h-[50px] rounded-full"
            />
            <div className="pl-3">
                <h1>{user.name}</h1>
            </div>
        </div>
    );
};

export default UserInbox;
