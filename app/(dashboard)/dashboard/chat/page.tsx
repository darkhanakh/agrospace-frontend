"use client";

import React, { useEffect, useState, useRef } from "react";
import { Message } from "ai";
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
import { Send, Bot, User, Stars, Trash2, Camera, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TableRenderer } from "@/components/shared/table-renderer";

interface CustomMessage extends Message {
  responseMessages?: {
    role: string;
    content: { type: string; text: string }[];
  }[];
  imageUrl?: string; // Added field for image URL
}

export default function AIChat() {
  const [messages, setMessages] = useState<CustomMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([
        {
          id: "1",
          role: "assistant",
          content:
            "Здравствуйте! Как я могу вам помочь с вашими сельскохозяйственными вопросами сегодня?",
        },
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !imageUrl) return;

    const userMessage: CustomMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      imageUrl: imageUrl || undefined, // Include imageUrl if present
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          imageUrl,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch response");

      const data = await response.json();
      const assistantMessage: CustomMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.text,
        responseMessages: data.responseMessages,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error in chat:", error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsLoading(false);
      setImageUrl(null);
    }
  };

  const clearChatHistory = () => {
    localStorage.removeItem("chatMessages");
    setMessages([
      {
        id: "1",
        role: "assistant",
        content:
          "Здравствуйте! Как я могу вам помочь с вашими сельскохозяйственными вопросами сегодня?",
      },
    ]);
    setImageUrl(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageUrl(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
      <CardContent className="flex-grow overflow-hidden" ref={scrollAreaRef}>
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
                {message.imageUrl && (
                  <img
                    src={message.imageUrl}
                    alt="User uploaded"
                    className="mt-2 max-w-full h-auto rounded-lg"
                  />
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center space-x-2">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        {imageUrl && (
          <div className="relative w-full">
            <img
              src={imageUrl}
              alt="Preview"
              className="max-w-full h-auto max-h-64 rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex w-full space-x-2">
          <Input
            type="text"
            placeholder="Задайте любой вопрос о сельском хозяйстве..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
            className="hidden"
          />
          <Button type="button" onClick={() => fileInputRef.current?.click()}>
            <Camera className="h-4 w-4" />
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
