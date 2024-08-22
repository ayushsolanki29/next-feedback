"use client";
import Footer from "@/components/footer";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Stats {
  users: number;
  messages: number;
}

const HomePage = () => {
  const [stats, setStats] = useState<Stats>({ users: 0, messages: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [count, setCount] = useState<number>(0);

  const handleStats = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<{ success: boolean; stats: Stats }>(
        "/api/get-stats"
      );

      if (response.data && response.data.stats) {
        setStats(response.data.stats);
      } else {
        console.error("No stats data found in response:", response.data);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setIsLoading(false);
    }
  };
  const checkAndUpdateSettings = async () => {
    if (document.cookie.indexOf("page-viewed=true") === -1) {
      try {
        await axios.get("/api/page-view-count");
      } catch (error) {
        console.error("Failed to update settings:", error);
      }
    } else {
    }
  };
  const fetchCount = async () => {
    const response: any = await axios.post("/api/page-view-count");
    setCount(response.data.count);
  };

  useEffect(() => {
    handleStats();
    checkAndUpdateSettings();
    fetchCount();
  }, []);

  return (
    <>
     <section className="relative overflow-hidden bg-gray-900 text-white">
  <div className="absolute inset-0">
 
    <div className="absolute inset-0 bg-black opacity-50"></div>
  </div>
  <div className="relative container mx-auto px-4 py-32 lg:flex lg:h-screen lg:items-center">
    <div className="mx-auto max-w-3xl text-center">
      <h1 className="text-4xl font-extrabold sm:text-5xl">
        <span className="bg-gradient-to-r from-teal-400 via-green-500 to-blue-600 bg-clip-text text-transparent">
          Understand User Flow.
        </span>
        <span className="block mt-2 sm:inline">
          <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 bg-clip-text text-transparent">
            Increase Conversion.
          </span>
        </span>
      </h1>

      <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed">
        Unlock the full potential of your platform with insights and strategies designed to enhance user experience and boost conversions.
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <Link
          className="block rounded-lg border border-blue-600 bg-blue-600 px-6 py-3 text-lg font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 active:bg-blue-800"
          href="/signup"
        >
          Get Started
        </Link>
      </div>
    </div>
  </div>
</section>

      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
  <div className="mx-auto max-w-3xl text-center">
    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
      Our Impact
    </h2>

    <p className="mt-4 text-gray-500 sm:text-xl">
      Discover how we’re making a difference and earning trust.
    </p>
  </div>

  <dl className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">
    <div className="flex flex-col rounded-lg bg-blue-50 px-4 py-8 text-center">
      <dt className="order-last text-lg font-medium text-gray-500">
        Total Users
      </dt>
      <dd className="text-4xl flex justify-center font-extrabold text-blue-600 md:text-5xl">
        {isLoading ? (
          <LoaderCircle className="size-8 animate-spin" />
        ) : (
          stats.users
        )}
      </dd>
    </div>

    <div className="flex flex-col rounded-lg bg-blue-50 px-4 py-8 text-center">
      <dt className="order-last text-lg font-medium text-gray-500">
        Total Feedbacks
      </dt>
      <dd className="text-4xl flex justify-center font-extrabold text-blue-600 md:text-5xl">
        {isLoading ? (
          <LoaderCircle className="size-8 animate-spin" />
        ) : (
          stats.messages
        )}
      </dd>
    </div>

    <div className="flex flex-col rounded-lg bg-blue-50 px-4 py-8 text-center">
      <dt className="order-last text-lg font-medium text-gray-500">
        Anonymous Visitors
      </dt>

      <dd className="text-4xl flex justify-center font-extrabold text-blue-600 md:text-5xl">
        {isLoading ? (
          <LoaderCircle className="size-8 animate-spin" />
        ) : (
          count
        )}
      </dd>
    </div>
  </dl>
</div>

      <Footer />
    </>
  );
};

export default HomePage;
