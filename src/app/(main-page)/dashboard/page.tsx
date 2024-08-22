"use client";

import MessageCards from "@/components/MessageCars";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/model/User.model";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Copy, Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageCount, setMessageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setSwitchLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchMessage = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-message");
      setValue("acceptMessages", response.data.isAcceptionMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error fetching messages",
        description: axiosError.response?.data?.message ?? "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessageCount = useCallback(async () => {
    try {
      const response = await axios.get<ApiResponse>("/api/message-count");
      if (response.data.success) {
        setMessageCount(response.data.messageCount as number);
      } else {
        toast({
          title: "Error fetching message count",
          description: "An error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error fetching message count",
        description: axiosError.response?.data?.message ?? "An error occurred",
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Messages fetched successfully",
            description: "New messages fetched",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        if (!axiosError.response?.data.messages) {
          if (axiosError.response?.data?.message !== "User not found") {
            toast({
              title: "Error fetching messages",
              description:
                axiosError.response?.data?.message ?? "An error occurred",
              variant: "destructive",
            });
          }
        }
      } finally {
        setIsLoading(false);
        setSwitchLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (session && session.user) {
      fetchMessages();
      fetchMessage();
      fetchMessageCount();
    }
  }, [session, fetchMessage, fetchMessages, fetchMessageCount]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-message", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: "Switch status updated successfully",
        description: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error updating switch status",
        description: axiosError.response?.data?.message ?? "An error occurred",
        variant: "destructive",
      });
    }
  };

  if (!session || !session.user) {
    return (
      <div className="flex justify-center items-center h-10">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const { username } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.hostname}`;
  const profileUrl = `${baseUrl}/u/${username}`;
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Link Copied to Clipboard",
      description: "You can now share this link with your contacts",
    });
  };
  return (
    <>
      <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded-lg shadow-md w-full max-w-6xl">
        <div className="bg-gray-100 text-gray-900 p-8">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-4xl font-bold mb-6">Welcome, {username}</h1>

            <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Copy Your Unique Link
              </h2>
              <div className="flex items-center space-x-4">
                <Input
                  type="text"
                  value={profileUrl}
                  readOnly
                  className="bg-gray-200 border-gray-300 text-gray-800 w-full p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  onClick={copyToClipboard}
                  variant={"outline"}
                  className="bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                >
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="mt-6 bg-white p-6 rounded-lg shadow-md flex items-center">
              <Switch
                {...register("acceptMessages")}
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
                className="mr-4"
              />
              <span className="text-gray-800">
                Accept Messages: {acceptMessages ? "On" : "Off"}
              </span>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />
        <div className="flex">
          <Button
            className="mt-4 bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            <span className="ml-2">Refresh Messages</span>
          </Button>

          <Button
            className="mt-4 mx-2 bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200"
            variant="outline"
          >
            Total Messages: {messageCount}
          </Button>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <MessageCards
                key={index}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 text-center text-gray-500">
              No messages to display.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
