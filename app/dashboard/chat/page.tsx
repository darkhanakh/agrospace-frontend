"use client";

import React, { useEffect, useState } from "react";
import { useChat, Message } from "ai/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Stars, Trash2 } from "lucide-react"; // Import Trash2 icon
import { Skeleton } from "@/components/ui/skeleton";
import { TableRenderer } from "@/components/shared/table-renderer"; // Import Skeleton component

export default function AIChat() {
  // State to manage initial messages loaded from local storage
  const [initialMessages, setInitialMessages] = useState<Message[] | null>(
    null
  );

  // Load messages from local storage when the component mounts
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setInitialMessages(JSON.parse(savedMessages));
    } else {
      // If no messages are saved, start with the default assistant message
      setInitialMessages([
        {
          id: "1",
          role: "assistant",
          content:
            "Здравствуйте! Как я могу вам помочь с вашими сельскохозяйственными вопросами сегодня?",
        },
      ]);
    }
  }, []);

  // Initialize useChat with the loaded messages
  const { messages, input, handleInputChange, handleSubmit, setMessages } =
    useChat({
      initialMessages: initialMessages || [],
    });

  // Save messages to local storage whenever they change
  useEffect(() => {
    if (initialMessages !== null) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    }
  }, [messages, initialMessages]);

  // Function to clear chat history
  const clearChatHistory = () => {
    // Remove messages from local storage
    localStorage.removeItem("chatMessages");

    // Reset messages to initial state
    const defaultMessage = {
      id: "1",
      role: "assistant",
      content:
        "Здравствуйте! Как я могу вам помочь с вашими сельскохозяйственными вопросами сегодня?",
    };
    setMessages([defaultMessage]);
    setInitialMessages([defaultMessage]);
  };

  // Show a skeleton loading state until messages are loaded
  if (initialMessages === null) {
    return (
      <Card className="w-full h-[90vh] mx-auto flex flex-col">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center">
            Персональный помощник <Stars className="ml-2" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
          <ScrollArea className="h-full pr-4">
            {/* Skeleton for messages */}
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="flex items-start space-x-2 mb-4 justify-start"
              >
                <Skeleton className="w-10 h-10 rounded-full bg-secondary" />
                <div className="rounded-lg p-3 max-w-[80%] bg-secondary text-secondary-foreground">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form className="flex w-full space-x-2">
            <Input
              type="text"
              placeholder="Загрузка..."
              disabled
              className="flex-grow"
            />
            <Button type="submit" disabled>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[90vh] mx-auto flex flex-col">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-2xl font-bold flex items-center">
          Персональный помощник <Stars className="ml-2" />
        </CardTitle>
        <Button variant="ghost" onClick={clearChatHistory}>
          <Trash2 className="h-5 w-5 mr-1" />
          Очистить историю
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-2 mb-4 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <Avatar
                className={
                  message.role === "user" ? "bg-primary" : "bg-secondary"
                }
              >
                <AvatarFallback>
                  {message.role === "user" ? <User /> : <Bot />}
                </AvatarFallback>
              </Avatar>
              <div
                className={`rounded-lg p-3 max-w-[80%] ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <TableRenderer content={message.content} />
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full space-x-2">
          <Input
            type="text"
            placeholder="Задайте любой вопрос о сельском хозяйстве..."
            value={input}
            onChange={handleInputChange}
            className="flex-grow"
          />
          <Button type="submit">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
