import React from "react";
import EventItem from "./eventItem";
import { FoodType } from "@/types/foodType";

export default function EventList({
  items,
  listFor,
}: {
  items: FoodType[];
  listFor: "show" | "modify";
}) {
  return (
    <div className="w-full flex justify-center">
      <ul className="flex flex-col gap-2">
        {items?.map((item) => (
          <EventItem key={item._id} item={item} listFor={listFor} />
        ))}
      </ul>
    </div>
  );
}
