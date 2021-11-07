import React from 'react';

import { Flex } from '@chakra-ui/react';

import { useFirestoreDocument } from './firebase';
import Chat from './chat';


function GuestLayout({user}) {
  const { data: invite, loaded: inviteLoaded } = useFirestoreDocument(`invites/${user.uid}`);


  if (!inviteLoaded) return 'loading';

  return <Flex width="100%">
    <Chat user={user} chatId={invite.chatId} />
  </Flex>
}

GuestLayout.displayName = "GuestLayout";

export default GuestLayout;
