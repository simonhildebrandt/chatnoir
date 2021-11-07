import React, { useState } from 'react';

import { Box, Flex, IconButton } from "@chakra-ui/react"
import { ArrowForwardIcon, ArrowDownIcon, SettingsIcon } from "@chakra-ui/icons";

import ReactMarkdown from 'react-markdown';

import AutoResizeTextarea from './autosize-textarea';

import {
  useFirestoreDocument,
  useFirestoreCollection,
  createDocument
} from './firebase';

import Options from './options';

import useBottomScroll from './use-bottom-scroll';


function Message({me, message}) {
  // cyan.900 blue.700 purple.600 pink.800 green.900
  const color = me ? "gray.700" : "cyan.900"
  const { content, author, createdAt } = message;

  return <Flex
    bgColor={color}
    borderTopRightRadius={me ? "xl" : ""}
    borderTopLeftRadius={me ? "" : "xl"}
    borderBottomRightRadius="xl"
    borderBottomLeftRadius="xl"
    px={6}
    py={4}
    mb={4}
    ml={me ? 0 : 8}
    mr={me ? 8 : 0}
    direction="column"
  >
    <Flex color="gray.400" mb={2} fontSize="sm" grow={1} justify="space-between">
      <Flex>{ me ? "Me" : "You"}</Flex>
      <Flex>{ new Date(createdAt).toUTCString() }</Flex>
    </Flex>
    <ReactMarkdown>{content}</ReactMarkdown>
  </Flex>
}

function Chat({user, chatId}) {
  const { data: chat, loaded: chatLoaded } = useFirestoreDocument(`chats/${chatId}`);
  const { data: messageData, loaded: messagesLoaded } = useFirestoreCollection(`chats/${chatId}/messages`);

  const guest = user.email == null;

  const [showOptions, setShowOptions] = useState(true);
  function toggleOptions() {
    setShowOptions(s => !s);
  }

  const [newMessage, setNewMessage] = useState("");
  const messageHasContent = newMessage.trim() !== "";

  function updateNewMessage(e) {
    setNewMessage(e.target.value);
  }

  function keyPressed(e) {
    if (e.key == "Enter" && !e.shiftKey && messageHasContent) {
      e.preventDefault();
      addMessage();
    }
  }

  function addMessage() {
    const content = newMessage;
    setNewMessage("");

    createDocument(`chats/${chatId}/messages`, {
      createdAt: new Date().valueOf(),
      author: user.uid,
      content
    });
  }

  const {
    scrollEndRef,
    scrollableRef,
    scrolledToBottom,
    scrollToBottom
  } = useBottomScroll();


  if (!chatLoaded) return 'loading';

  const { name } = chat;

  const messages = Object.entries(messageData).map(([id, m]) => ({...m, id}))
  messages.sort((m1, m2) => m1.createdAt - m2.createdAt)

  console.log({messagesLoaded, messageData})

  return <Flex direction="column" height="100%" width="100%">
    <Flex>{name} { !guest && <IconButton onClick={toggleOptions} icon={<SettingsIcon/>}/> }</Flex>
    { showOptions && !guest && <Flex><Options chatId={chatId}/></Flex> }

    <Flex direction="column" grow={1} overflow="auto" ref={scrollableRef}>
      <Flex direction="column">
        { messages.map((message, i) => (
          <Message key={i} message={message}/>
        ))}
         <div ref={scrollEndRef} />
      </Flex>
      <Box position="absolute" left={0} bottom={16}>
        <IconButton
          disabled={scrolledToBottom}
          bgColor="cyan.900"
          ml={2}
          icon={<ArrowDownIcon/>}
          onClick={scrollToBottom}
        />
      </Box>
    </Flex>
    <Flex align="flex-end" mb={2}>
      <AutoResizeTextarea
        value={newMessage}
        onKeyPress={keyPressed}
        onChange={updateNewMessage}
      />
      <IconButton
        disabled={!messageHasContent}
        bgColor="cyan.900"
        ml={2}
        icon={<ArrowForwardIcon/>}
        onClick={addMessage}
      />
    </Flex>
  </Flex>
}

Chat.displayName = "Chat";

export default Chat;
