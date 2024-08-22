"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/User.model";
import { useToast } from "./ui/use-toast";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};
const MessageCards = ({  message, onMessageDelete }: MessageCardProps) => {
  const { toast } = useToast();
  const handleDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponse>(
      `/api/delete-message/${message._id}`
    );
    toast({
      title: response.data.message,
    });
    onMessageDelete(message._id as string);
  };
  return (
    <Card className="shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-gray-100 flex flex-row justify-between dark:bg-gray-800">
        <div className="items-center space-x-2 flex">
          <CardDescription>
            {message?.createdAt &&
              new Date(message.createdAt).toLocaleString("en-US", {
                weekday: "short", // e.g., "Mon"
                day: "2-digit", // e.g., "01"
                month: "short", // e.g., "Jan"
                year: "numeric", // e.g., "2024"
                hour: "numeric", // e.g., "12"
                minute: "2-digit", // e.g., "30"
                hour12: true, // e.g., "PM" or "AM"
              })}
          </CardDescription>
        </div>
        <div className="justify-end">
          <Button
            size={"sm"}
            onClick={handleDeleteConfirm}
            className=""
            variant={"destructive"}
          >
            <X size="16" className="mr-2" /> Delete
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {message?.content}
        </p>
      </CardContent>
    </Card>
  );
};

export default MessageCards;
