import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Paperclip,
  Image,
  Link,
  Send,
  MoreVertical,
  Circle
} from "lucide-react"

interface Message {
  id: string
  content: string
  timestamp: string
  sender: string
  senderId: string
  attachment?: {
    type: 'image' | 'file' | 'link'
    url: string
    name: string
  }
}

interface Contact {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread: number
  online: boolean
  type: 'creator' | 'brand'
}

export default function Messages() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [messageInput, setMessageInput] = useState("")

  // Mock data - replace with actual data
  const contacts: Contact[] = [
    {
      id: "1",
      name: "Sarah Wilson",
      avatar: "/avatars/creator1.jpg",
      lastMessage: "Let's discuss the campaign details",
      timestamp: "2:30 PM",
      unread: 2,
      online: true,
      type: 'creator'
    },
    // Add more contacts...
  ]

  const messages: Message[] = [
    {
      id: "1",
      content: "Hi! I saw your campaign and I'm interested in collaborating",
      timestamp: "2:30 PM",
      sender: "Sarah Wilson",
      senderId: "1"
    },
    // Add more messages...
  ]

  return (
    <div className="flex h-[calc(100vh-4rem)] p-4 gap-4">
      {/* Contacts Sidebar */}
      <Card className="w-80 flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search messages" 
              className="pl-10"
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors
                  ${selectedContact?.id === contact.id ? 'bg-primary/10' : 'hover:bg-gray-100'}`}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback>{contact.name[0]}</AvatarFallback>
                  </Avatar>
                  {contact.online && (
                    <Circle className="h-3 w-3 text-green-500 absolute -right-0.5 -bottom-0.5 fill-green-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="font-medium truncate">{contact.name}</p>
                    <span className="text-xs text-gray-500">{contact.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                </div>
                {contact.unread > 0 && (
                  <div className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {contact.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Chat Area */}
      {selectedContact ? (
        <Card className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar>
                  <AvatarImage src={selectedContact.avatar} />
                  <AvatarFallback>{selectedContact.name[0]}</AvatarFallback>
                </Avatar>
                {selectedContact.online && (
                  <Circle className="h-3 w-3 text-green-500 absolute -right-0.5 -bottom-0.5 fill-green-500" />
                )}
              </div>
              <div>
                <h3 className="font-semibold">{selectedContact.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{selectedContact.type}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === selectedContact.id ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[70%] ${
                    message.senderId === selectedContact.id 
                      ? 'bg-gray-100 rounded-tr-2xl' 
                      : 'bg-primary text-white rounded-tl-2xl'
                  } p-3 rounded-b-2xl`}>
                    {message.content}
                    {message.attachment && (
                      <div className="mt-2">
                        {message.attachment.type === 'image' && (
                          <img 
                            src={message.attachment.url} 
                            alt={message.attachment.name}
                            className="rounded-lg max-h-48 object-cover"
                          />
                        )}
                        {message.attachment.type === 'file' && (
                          <div className="flex items-center gap-2 bg-white/10 p-2 rounded">
                            <Paperclip className="h-4 w-4" />
                            <span className="text-sm">{message.attachment.name}</span>
                          </div>
                        )}
                      </div>
                    )}
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Image className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Link className="h-5 w-5" />
              </Button>
              <Input
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1"
              />
              <Button size="icon" className="text-white">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="flex-1 flex items-center justify-center text-gray-500">
          Select a conversation to start messaging
        </Card>
      )}
    </div>
  )
} 