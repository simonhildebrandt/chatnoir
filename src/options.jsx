import React from 'react';

import { Flex, Button, Link, Input } from '@chakra-ui/react';

import { useFirestoreCollection, createDocument } from './firebase';

import { navigate } from './router';


function Options({chatId, updateName}) {
  const { data: invites, loaded } = useFirestoreCollection('invites', ['chatId', '==', chatId]);

  function addParticipant() {
    createDocument('invites', {
      chatId,
      createdAt: new Date().valueOf()
    })
  }

  function inviteLink(id) {
    return `/invite/${id}`
  }

  function updateCreatorName(event) {
    const {target: {value}} = event;


  }

  function updateGuestName(event) {
    const {target: {value}} = event;


  }

  return <Flex>
    { Object.entries(invites).map(([id, invite]) => (
      <Link key={id} href={inviteLink(id)}>{JSON.stringify(invite)}</Link>
    )) }
    <Input onChange={updateCreatorName} placeholder="creator name"/>
    <Input onChange={updateGuestName} placeholder="guest name"/>
  </Flex>
}

Options.displayName = "Options";

export default Options;
