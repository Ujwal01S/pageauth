import { Clock10Icon, LocateIcon, TypeIcon } from "lucide-react";
import Image from "next/image";
import Button from "../button/button";

import { FoodType } from "@/types/foodType";
import DeleteButton from "../button/deleteButton";

export default function EventItem({
  item,
  listFor,
}: {
  item: FoodType;
  listFor: "show" | "modify";
}) {
  return (
    <li className=" w-[40dvw] flex gap-2 pr-4 bg-slate-100 shadow-md border-[1px] rounded-sm ">
      <div className="w-[300px] h-full relative">
        <Image
          src={item.image}
          alt={item._id}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 30vw, 33vw"
          priority
        />
      </div>
      <div className="flex flex-col gap-3 w-full py-3">
        <div>
          <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
          <div className="flex gap-2 font-semibold items-center">
            <Clock10Icon size={16} />
            <time>Cook Time:{item.cookTime}</time>
          </div>
          <div className="flex gap-2 font-semibold items-center mt-2">
            <LocateIcon size={16} />
            <address>Native From:{item.native}</address>
          </div>
        </div>
        <div className="flex gap-2 font-semibold items-center">
          <TypeIcon size={16} />
          <p>Food Type:{item.foodType}</p>
        </div>
        <div className="w-full flex gap-2 justify-between">
          {listFor === "modify" && <DeleteButton id={item._id} />}
          <div className="">
            <Button href={`/events/${item._id}`}>Explore More</Button>
          </div>
        </div>
      </div>
    </li>
  );
}
