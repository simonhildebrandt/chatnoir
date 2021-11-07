import React, { useReducer, useState } from 'react';
import { Flex, Button } from "@chakra-ui/react"

import Chat from './chat';
import Chats from './chats';
import { sendSignInLink, handleSigninLink, withUser, processInvite } from './firebase';
import { useRouter } from './router';

import GuestLayout from './guest-layout';



function HostLayout({currentChat, user}) {
  return <>
    <Flex grow={1}><Chats currentChat={currentChat} user={user}/></Flex>
    <Flex grow={1} direction="column" p={4} height="100%">
      { currentChat && <Chat user={user} chatId={currentChat}/> }
    </Flex>
  </>
}


const routeDefaults = { page: null }

function App() {
  const [routerState, setRouterState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    routeDefaults
  )

  const [currentChat, setCurrentChat] = useState(null);

  const user = withUser();

  function signIn() {
    sendSignInLink("simonhildebrandt@gmail.com");
  }

  useRouter(router => {
    router.on("/login", () => {
      console.log("logging in!")
      handleSigninLink()
    })
    .on("/", () => {
      setRouterState({page: "main"})
    })
    .on("/chat/:id", ({data: {id}}) => {
      setCurrentChat(id)
    })
    .on("/invite/:id", ({data: {id}}) => {
      processInvite(id)
    })
    .resolve()
  })

  if (user === null) {
    return "Spinner"
  }

  if (user === false) {
    return <Button onClick={signIn}>Sign in</Button>
  }


  return <Flex width="100%" height="100%">
    { user.email === null ? (
      <GuestLayout user={user}/>
    ) : (
      <HostLayout currentChat={currentChat} user={user} />
    ) }
  </Flex>
}

App.displayName = "App";


export default App;
