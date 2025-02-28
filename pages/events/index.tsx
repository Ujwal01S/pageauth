import EventList from "@/components/events/eventList";
import { getAllFood } from "@/libs/api";
import { FoodType } from "@/types/foodType";
import Head from "next/head";
import React, { useState } from "react";
import { useQuery } from "react-query";

interface EventDetailPagePops {
  events: FoodType[];
}

function LoadingFallback() {
  return <p className="mt-20 text-2xl text-red-600">Loading...</p>;
}

export default function EventDetailPage({ events }: EventDetailPagePops) {
  // const [eventData, setEventData] = useState<FoodType[]>(events);
  const { data: eventData } = useQuery({
    queryFn: () => getAllFood(),
    queryKey: ["getFood"],
    initialData: events,
    staleTime: 0,
    // refetchOnWindowFocus: true,
    // refetchOnMount: true,
  });

  return (
    <React.Fragment>
      <Head>
        <title>All Foods</title>
        <meta name="description" content="Find all the food" />
      </Head>

      <div className="mt-10">
        <EventList items={eventData} listFor="modify" />
      </div>
    </React.Fragment>
  );
}

export async function getStaticProps() {
  try {
    const allEvents = await getAllFood();

    return {
      props: {
        events: allEvents,
      },
      revalidate: 1,
    };
  } catch (error) {
    return {
      // props: {
      //   events: [],
      // }, brings issue loads empty
      notFound: true,
    };
  }
}
