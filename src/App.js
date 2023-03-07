import logo from './logo.svg';
import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {MainContainer,ChatContainer,MessageList,Message,MessageInput,TypingIndicator} from '@chatscope/chat-ui-kit-react';
import {useState} from 'react';

function App() {
  const [messages, setMessages] = useState([
    {
      message: "Hello I am ChatGPT!",
      sender:"ChatGPT"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false)

  const handleSend = async(message) =>{
    const newMessage = {
      message:message,
      sender:"user",
      direction:"outgoing"
    }

    const newMessages = [...messages,newMessage];//all the oldd messages+ the new message

    //update our messages state
    setMessages([...newMessages]);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);

    //process message to chatGPT (send it over and see the response)
    await processMessageToChatGPT(newMessages);
  }

  async function processMessageToChatGPT(chatMessages){
    //chatMessages {sender:"user"or "ChatGPT", message:"The message content here"}
    //apiMessages {role:"user" or "assistant",content:"The message content here" }

    let apiMessages = chatMessages.map((messageObj) =>{
      let role ="";
      if(messageObj.sender==="ChatGPT"){
        role="assistant"
      }else{
        role="user"
      }
      return {role:role,content:messageObj.message}

    })

    //role:"user" => a message from the user,"assistant" => a response from chatGPT
    // "system"-> generally one initial message defining HOW we want chatgpt to talk

    const systemMessage = {
      role:"system",
      content:"Speak like Mustafa Kemal Ataturk"//Speak like a pirate,Explain line I am a 10 years of experience software engineer
    }

    const apiRequestBody = {
      "model":"gpt-3.5-turbo",
      "messages":[
        systemMessage,
        ...apiMessages
      ]
    }     

    await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",
      headers:{
        "Authorization": `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json"
      },
      body:JSON.stringify(apiRequestBody)
    }).then((data) =>{
      return data.json();
    }).then((data) =>{
      console.log('data',data);
      setMessages([
        ...chatMessages,{
          message:data.choices[0].message.content,
          sender:"ChatGPT"
        }
      ]);
      setIsTyping(false);
    })
  }

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
