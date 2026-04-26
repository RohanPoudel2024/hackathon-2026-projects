import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Send, User } from "lucide-react"

export function Chat() {
  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Messages</h1>
        <p className="text-muted-foreground">Stay connected with your healthcare providers.</p>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Chat List */}
        <Card className="w-80 flex flex-col border-none shadow-md shadow-slate-200/50 overflow-hidden">
          <CardHeader className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-9 rounded-xl bg-muted/50" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            {[
              { name: "Dr. Sarah Jenkins", lastMsg: "How are you feeling today?", time: "10:30 AM", unread: true },
              { name: "Dr. Michael Chen", lastMsg: "Your labs are ready.", time: "Yesterday", unread: false },
              { name: "Support Team", lastMsg: "Your appointment is confirmed.", time: "Oct 24", unread: false },
            ].map((chat, i) => (
              <div key={i} className="flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-50">
                <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold">
                  {chat.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <p className="font-semibold text-sm text-slate-900 truncate">{chat.name}</p>
                    <span className="text-[10px] text-muted-foreground">{chat.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{chat.lastMsg}</p>
                </div>
                {chat.unread && <div className="h-2 w-2 rounded-full bg-emerald-500"></div>}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Chat Window Placeholder */}
        <Card className="flex-1 flex flex-col border-none shadow-md shadow-slate-200/50 overflow-hidden bg-slate-50/30">
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-60">
            <div className="h-16 w-16 rounded-3xl bg-white flex items-center justify-center mb-4 shadow-sm">
              <MessageSquare className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Select a conversation</h3>
            <p className="text-sm max-w-xs text-muted-foreground">Choose a provider from the list to start or continue your healthcare journey.</p>
          </div>
          
          <div className="p-4 bg-white border-t">
            <div className="flex gap-2">
              <Input placeholder="Type a message..." className="rounded-xl bg-muted/50" disabled />
              <Button size="icon" className="rounded-xl bg-emerald-600 shrink-0" disabled>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

import { MessageSquare } from "lucide-react"
