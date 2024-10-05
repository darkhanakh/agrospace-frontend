// Файл: components/AIChat.tsx

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
import { Send, Bot, User, Stars, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const TableRenderer = ({ content }: { content: string }) => {
  const tryParseJSON = (jsonString: string) => {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      return null;
    }
  };

  const extractJSONFromString = (str: string) => {
    const regex = /\[\s*\{[\s\S]*?\}\s*\]/gm;
    const matches = str.match(regex);
    return matches ? tryParseJSON(matches[0]) : null;
  };

  const tableData = extractJSONFromString(content);

  if (Array.isArray(tableData) && tableData.length > 0) {
    const headers = Object.keys(tableData[0]);

    // Разделение текста до и после JSON-массива
    const [beforeJSON, afterJSON] = content.split(
      content.match(/\[\s*\{[\s\S]*?\}\s*\]/gm)[0]
    );

    return (
      <>
        <div className="whitespace-pre-wrap mb-2">{beforeJSON.trim()}</div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={index}>
                  {headers.map((header) => (
                    <TableCell key={`${index}-${header}`}>
                      {row[header]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {afterJSON && (
          <div className="whitespace-pre-wrap mt-2">{afterJSON.trim()}</div>
        )}
      </>
    );
  }

  return <div className="whitespace-pre-wrap">{content}</div>;
};

export default function AIChat() {
  // Состояние для управления начальными сообщениями из localStorage
  const [initialMessages, setInitialMessages] = useState<Message[] | null>(
    null
  );

  // Загрузка сообщений из localStorage при монтировании компонента
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setInitialMessages(JSON.parse(savedMessages));
    } else {
      // Если сообщений нет, начать с приветственного сообщения
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

  // Инициализация useChat с загруженными сообщениями
  const { messages, input, handleInputChange, handleSubmit, setMessages } =
    useChat({
      initialMessages: initialMessages || [],
    });

  // Сохранение сообщений в localStorage при каждом изменении
  useEffect(() => {
    if (initialMessages !== null) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    }
  }, [messages, initialMessages]);

  // Функция для очистки истории чата
  const clearChatHistory = () => {
    // Удаление сообщений из localStorage
    localStorage.removeItem("chatMessages");

    // Сброс сообщений к начальному состоянию
    const defaultMessage = {
      id: "1",
      role: "assistant",
      content:
        "Здравствуйте! Как я могу вам помочь с вашими сельскохозяйственными вопросами сегодня?",
    };
    setMessages([defaultMessage]);
    setInitialMessages([defaultMessage]);
  };

  // Отображение скелетной загрузки до загрузки сообщений
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
            {/* Скелетные загрузки для сообщений */}
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
