import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { backend_url, server } from "../../server";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import styles from "../../style/style";
import socketIO from "socket.io-client";
import { format } from "timeago.js";

const ENDPOINT = "https://socket-server-k8wd.onrender.com/";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const DashboardMessages = () => {
  const { seller } = useSelector((state) => state.seller);
  const { user } = useSelector((state) => state.user);

  const [conversations, setConversations] = useState([]);
  const [open, setOpen] = useState(false);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [userData, setUserData] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeNow, setActiveNow] = useState(false);

  const scrollRef = useRef(null);

  // Listen for incoming messages
  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });

    return () => {
      socketId.off("getMessage");
    };
  }, []);

  // Add the seller to the online users list
  useEffect(() => {
    if (seller) {
      const sellerId = seller._id;
      socketId.emit("addUser", sellerId);
      socketId.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [seller]);

  // Handle new arrival messages
  useEffect(() => {
    if (
      arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender)
    ) {
      setMessages((prevMessages) => [...prevMessages, arrivalMessage]);
    }
  }, [arrivalMessage, currentChat]);

  // Fetch conversations
  useEffect(() => {
    if (seller) {
      axios
        .get(`${server}/conversation/get-all-conversation-seller/${seller._id}`, {
          withCredentials: true,
        })
        .then((res) => {
          setConversations(res.data.conversations);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [seller]);

  // Fetch messages for the current chat
  useEffect(() => {
    if (currentChat) {
      const getMessage = async () => {
        try {
          const response = await axios.get(
            `${server}/message/get-all-messages/${currentChat._id}`
          );
          setMessages(response.data.messages);
        } catch (error) {
          console.error(error);
        }
      };
      getMessage();
    }
  }, [currentChat]);

  // Send a new message
  const sendMessageHandler = async (e) => {
    e.preventDefault();

    if (newMessage.trim() === "") return;

    const message = {
      sender: seller._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== seller._id
    );

    socketId.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post(`${server}/message/create-new-message`, message);

      setMessages((prevMessages) => [...prevMessages, res.data.message]);
      setNewMessage(""); // Clear the input field
      updateLastMessage();
    } catch (err) {
      console.error(err);
    }
  };

  // Update the last message in the conversation
  const updateLastMessage = async () => {
    try {
      await axios.put(
        `${server}/conversation/update-last-message/${currentChat._id}`,
        {
          lastMessage: newMessage,
          lastMessagesId: seller._id,
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Scroll to the latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find((member) => member !== seller._id);
    return onlineUsers.some((user) => user.userId === chatMembers);
  };

  return (
    <div className="w-[90%] bg-white m-5 h-[85vh] overflow-y-scroll rounded">
      {!open && (
        <>
          <h1 className="text-center text-[30px] py-3 font-Poppins">
            All Messages
          </h1>
          {conversations.map((conversation, index) => (
            <MessageList
              key={index}
              conversation={conversation}
              open={open}
              setOpen={setOpen}
              setCurrentChat={setCurrentChat}
              sellerId={seller._id}
              userData={userData}
              setUserData={setUserData}
              online={onlineCheck(conversation)}
              setActiveNow={setActiveNow}
            />
          ))}
        </>
      )}
      {open && (
        <SellerInbox
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          sellerId={seller._id}
          userData={userData}
          scrollRef={scrollRef}
          activeNow={activeNow}
        />
      )}
    </div>
  );
};

const MessageList = ({
  conversation,
  setOpen,
  setCurrentChat,
  sellerId,
  setUserData,
  online,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = conversation.members.find((user) => user !== sellerId);

    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/user/user-info/${userId}`);
        setUserData(res.data.user);
      } catch (err) {
        console.error(err);
      }
    };
    getUser();
  }, [sellerId, conversation]);

  return (
    <div
      className="flex w-full p-3 px-3 cursor-pointer"
      onClick={() => {
        setOpen(true);
        setCurrentChat(conversation);
        navigate(`?${conversation._id}`);
      }}
    >
      <div className="relative">
        <img
          src={`${backend_url}${conversation.avatar}`}
          alt=""
          className="w-[50px] h-[50px] rounded-full"
        />
        {online && (
          <div className="w-[12px] h-[12px] bg-green-400 rounded-full absolute top-[2px] right-[2px]" />
        )}
      </div>
      <div className="pl-3">
        <h1 className="text-[18px]">{conversation.name}</h1>
        <p className="text-[16px] text-[#000c]">
          {conversation.lastMessage}
        </p>
      </div>
    </div>
  );
};

const SellerInbox = ({
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  scrollRef,
}) => {
  return (
    <div className="w-full min-h-full flex flex-col justify-between">
      <div className="w-full flex p-3 items-center justify-between bg-orange-300">
        <AiOutlineArrowRight size={20} onClick={() => setOpen(false)} />
      </div>
      <div className="px-3 h-[65vh] py-3 overflow-y-scroll">
        {messages.map((message, index) => (
          <div
            key={index}
            ref={scrollRef}
            className={`flex w-full my-2 ${
              message.sender === sellerId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded ${
                message.sender === sellerId ? "bg-orange-300" : "bg-gray-200"
              }`}
            >
              <p>{message.text}</p>
            </div>
            <p className="text-[12px] pt-1">{format(message.createdAt)}</p>
          </div>
        ))}
      </div>
      <form
        className="p-3 w-full flex justify-between items-center"
        onSubmit={sendMessageHandler}
      >
        <TfiGallery className="cursor-pointer" size={20} />
        <input
          type="text"
          value={newMessage}
          placeholder="Type a message"
          className={`${styles.input}`}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">
          <AiOutlineSend size={25} />
        </button>
      </form>
    </div>
  );
};

export default DashboardMessages;
