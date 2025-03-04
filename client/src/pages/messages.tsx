import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState } from "react";

const users = [
  {
    id: 1,
    name: "Sophie Martin",
    avatar: "/avatar-sophie.png",
    role: "Comptable",
    status: "online"
  },
  {
    id: 2,
    name: "Marc Dubois",
    avatar: "/avatar-marc.png",
    role: "Technicien",
    status: "offline"
  },
  {
    id: 3,
    name: "Julie Bernard",
    avatar: "/avatar-julie.png",
    role: "Commerciale",
    status: "online"
  },
  {
    id: 4,
    name: "Thomas Laurent",
    avatar: "/avatar-thomas.png",
    role: "Support client",
    status: "away"
  }
];

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
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Messages</h1>

      <div className="grid grid-cols-4 gap-6">
        <Card className="col-span-3 p-6">
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

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Utilisateurs</h2>
          <div className="space-y-4">
            {users.map((user) => (
              <button
                key={user.id}
                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  selectedUser === user.id 
                    ? 'bg-[#0077B6] text-white' 
                    : 'hover:bg-accent/10'
                }`}
                onClick={() => setSelectedUser(user.id)}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                    user.status === 'online' ? 'bg-green-500' :
                    user.status === 'away' ? 'bg-yellow-500' :
                    'bg-gray-500'
                  }`}></span>
                </div>
                <div className={`text-left ${selectedUser === user.id ? 'text-white' : ''}`}>
                  <div className="font-medium">{user.name}</div>
                  <div className={`text-sm ${
                    selectedUser === user.id ? 'text-white/80' : 'text-muted-foreground'
                  }`}>
                    {user.role}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}