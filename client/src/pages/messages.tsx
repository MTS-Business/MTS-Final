import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState } from "react";

const messages = [
  {
    id: 1,
    sender: "Sophie Martin",
    senderAvatar: "/avatar-sophie.png",
    content: "Bonjour, pouvez-vous me confirmer la réception du dernier rapport ?",
    timestamp: "2024-03-04T09:30:00",
    isMe: false
  },
  {
    id: 2,
    sender: "John Cena",
    senderAvatar: "/avatar.png",
    content: "Oui, je l'ai bien reçu. Je le révise et vous fais un retour dans l'après-midi.",
    timestamp: "2024-03-04T09:35:00",
    isMe: true
  },
  {
    id: 3,
    sender: "Marc Dubois",
    senderAvatar: "/avatar-marc.png",
    content: "Les nouvelles mises à jour du système sont disponibles. Quand pouvons-nous planifier l'installation ?",
    timestamp: "2024-03-04T10:15:00",
    isMe: false
  },
  {
    id: 4,
    sender: "John Cena",
    senderAvatar: "/avatar.png",
    content: "On peut prévoir ça pour demain matin vers 9h, ça vous convient ?",
    timestamp: "2024-03-04T10:20:00",
    isMe: true
  }
];

export default function Messages() {
  const [newMessage, setNewMessage] = useState("");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Messages</h1>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.isMe ? 'flex-row-reverse' : ''}`}
              >
                <Avatar>
                  <AvatarImage src={message.senderAvatar} />
                  <AvatarFallback>
                    {message.sender.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className={`flex flex-col ${message.isMe ? 'items-end' : ''}`}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{message.sender}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className={`mt-1 p-3 rounded-lg ${
                    message.isMe 
                      ? 'bg-[#0077B6] text-white' 
                      : 'bg-muted'
                  }`}>
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Écrivez votre message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
            />
            <Button className="bg-[#0077B6] text-white hover:bg-[#0077B6]/90">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
