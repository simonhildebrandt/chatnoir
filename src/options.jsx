import React from 'react';

import { Flex, Button } from '@chakra-ui/react';

import { useFirestoreCollection, createDocument } from './firebase';

import { navigate } from './router';


function Options({chatId}) {
  const { data: invites, loaded } = useFirestoreCollection('invites', ['chatId', '==', chatId]);

  function addParticipant() {
    createDocument('invites', {
      chatId,
      createdAt: new Date().valueOf()
    })
  }

  function inviteLink(id) {
    navigate(`/invite/${id}`)
  }

  return <Flex>
    { Object.entries(invites).map(([id, invite]) => (
      <Flex key={id} onClick={() => inviteLink(id)}>{JSON.stringify(invite)}</Flex>
    )) }
    <Button onClick={addParticipant}>Add</Button>
  </Flex>
}

Options.displayName = "Options";

export default Options;
