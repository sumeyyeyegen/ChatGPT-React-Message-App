import logo from './logo.svg';
import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {MainContainer,ChatContainer,MessageList,Message,MessageInput,TypingIndicator} from '@chatscope/chat-ui-kit-react';
import {useState} from 'react';

function App() {
  return (
    <div className="App">
      <div style={{position:"relative",height:"600px", width:"700px"}}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth" 
              typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
            >
              {
                messages.map((item,i) => {
                  return <Message key={i} model={item}/>
                })
              }
            </MessageList>
            <MessageInput placeholder='Type message here' onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default App;
