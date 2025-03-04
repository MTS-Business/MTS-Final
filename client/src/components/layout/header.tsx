import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";

interface HeaderProps {
  userName?: string;
}

export default function Header({ userName = "John Cena" }: HeaderProps) {
  return (
    <div className="flex items-center justify-between px-8 py-4 border-b">
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold text-foreground">
          Hello, {userName} 👋
        </h2>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-accent/10">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
        </button>
        <Avatar>
          <AvatarImage src="/avatar.png" />
          <AvatarFallback>JC</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
