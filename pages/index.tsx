import { Inter } from "next/font/google";
import Head from "next/head";
import EventList from "@/components/events/eventList";
import React from "react";

import { getAllFood } from "@/libs/api";
import { FoodType } from "@/types/foodType";
import { useQuery } from "react-query";
// import { useQuery } from "react-query";

const inter = Inter({ subsets: ["latin"] });

interface PropsType {
  events: FoodType[];
}

export default function Home({ events }: PropsType) {
  // console.log({ events });
  const { data: eventData } = useQuery({
    queryFn: () => getAllFood(),
    queryKey: ["getFood"],
    initialData: events,
    select: (data) => data.filter((item: FoodType) => item.isFeatured === true),
  });
  return (
    <React.Fragment>
      <Head>
        <title>Nextjs Events</title>
        <meta
          name="description"
          content="Find a lot of greate events that allow you to evolve"
        />
      </Head>
      <main className={`w-full flex justify-center pt-10`}>
        <EventList items={eventData} listFor="show" />
      </main>
    </React.Fragment>
  );
}

export async function getStaticProps() {
  try {
    const items = await getAllFood();
    const filteredItem = items.filter((item: FoodType) => {
      return item.isFeatured === true;
    });
    if (!items) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        events: filteredItem,
      },
      revalidate: 1,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
