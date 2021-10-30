import React, { useState } from 'react';

import { Flex, IconButton } from "@chakra-ui/react"
import { ArrowForwardIcon } from "@chakra-ui/icons";

import { Remarkable } from 'remarkable';

import AutoResizeTextarea from './autosize-textarea';


const renderer = new Remarkable({breaks: true});

function Message({me, message}) {
  // cyan.900 blue.700 purple.600 pink.800 green.900
  const color = me ? "gray.700" : "cyan.900"

  const content = renderer.render(message);

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
      <Flex>{ new Date().toDateString() }</Flex>
    </Flex>
    <Flex dangerouslySetInnerHTML={{ __html: content }}/>
  </Flex>
}


const defaultMessages = [
  { message: "[Message!](http://slashdot.org)", me: true },
  { message: "__Message?__", me: false },
  { message: "*More Message!*", me: true },
  { message: " - Message...", me: false },
];

function Chat() {
  const [messages, setMessages] = useState(defaultMessages);
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
    const message = newMessage;
    setNewMessage("");

    setMessages(oldMessages => {
      return [
        ...oldMessages,
        { message, me: true }
      ]
    });
  }

  return <>
    { messages.map(({message, me}, i) => (
      <Message key={i} me={me} message={message}/>
    ))}
    <Flex align="flex-end">
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
  </>
}

Chat.displayName = "Chat";

export default Chat;
