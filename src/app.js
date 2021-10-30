import React from 'react';
import { Flex, Button } from "@chakra-ui/react"

import Chat from './chat';
import { sendSignInLinkToEmail } from './firebase';


function App() {
  function signIn() {
    sendSignInLinkToEmail("simonhildebrandt@gmail.com");
  }

  return <Flex width="100%" height="100%">
    <Button onClick={signIn}>Sign in</Button>
    <Flex grow={1}>Chats</Flex>
    <Flex grow={1} direction="column" p={4}>
      <Chat/>
    </Flex>
  </Flex>

}

App.displayName = "App";


export default App;
