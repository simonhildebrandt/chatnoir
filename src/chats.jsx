import React from 'react';

import { Button, Flex } from '@chakra-ui/react';

import { useFirestoreCollection, createDocument } from './firebase';

import { navigate } from './router';



function Chats({user, currentChat}) {
  const {data, loaded} = useFirestoreCollection("chats", ["creator", "==", user.uid]);

  function createChat() {
    createDocument(
      "chats", {
        creator: user.uid,
        name: `chat ${new Date().valueOf()}`,
        creatorName: 'Person 1',
        guestName: 'Person 2'
      }
    )
  }

  function onSelect(id) {
    navigate(`/chat/${id}`);
  }

  if (!loaded) return 'loading'

  return <Flex direction="column">
    { Object.entries(data).map(([id, chat]) => (
      <Flex color={currentChat == id ? 'green.500' : 'red.500'} key={id} onClick={() => onSelect(id)}>{chat.name}</Flex>
    ))}
    <Button onClick={createChat}>New</Button>
  </Flex>
}

Chats.displayName = "Chats"

export default Chats
