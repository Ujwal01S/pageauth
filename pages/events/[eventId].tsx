import { getAllFood, getSingleFood } from "@/libs/api";
import { FoodType } from "@/types/foodType";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FoodForm from "@/components/foodForm/foodForm";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

export interface SingleFoodType {
  event: FoodType;
  id: string;
}

function GetFallBackLoading() {
  return <h1 className="text-2xl text-red-500 mt-20">Loading........</h1>;
}

export default function EventDetailPage({ event, id }: SingleFoodType) {
  const [eventData, setEventData] = useState<FoodType>(event);
  const [open, setOpen] = useState<boolean>(false);

  const { data, refetch, isLoading } = useQuery({
    queryFn: () => getSingleFood(id),
    queryKey: ["singleFood", id],
    enabled: !!id,
    onSuccess: (data) => {
      setEventData(data);
    },
  });

  useEffect(() => {
    if (eventData) {
      refetch();
    }
  }, [eventData, refetch]);

  // console.log(eventData);

  if (isLoading || !eventData || !event) {
    return <GetFallBackLoading />;
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full flex flex-col items-center">
        <div className="w-full h-[400px] relative">
          <Image
            src={event.image}
            alt={event.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 30vw, 33vw"
          />
        </div>
        <div className="px-16 w-[70%]">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-semibold text-gray-700">
              {eventData?.name}
            </h1>
            <div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className="text-lg font-semibold bg-blue-700 px-5 rounded-sm text-white">
                  Edit
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="sr-only">
                      Are you absolutely sure?
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </DialogDescription>
                    <FoodForm
                      componentFor="put"
                      item={eventData}
                      setOpen={setOpen}
                    />
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <h2 className="text-gray-700 font-medium">
            Food Type :{event.foodType}
          </h2>
          <h2 className="text-gray-700 font-medium">
            Native From :{event.native}
          </h2>
          <h4 className="text-gray-700 font-medium">
            Cooking Time : {event.cookTime} min
          </h4>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps(context: { params: { eventId: string } }) {
  try {
    const eventId = context.params.eventId;
    const item = await getSingleFood(eventId);

    if (!item) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        event: item,
        id: eventId,
      },
      revalidate: 30,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

export async function getStaticPaths() {
  try {
    const allItems = await getAllFood();

    const paths = allItems.map((item: FoodType) => ({
      params: { eventId: item._id },
    }));

    return {
      paths,
      fallback: true,
    };
  } catch (error) {
    return {
      paths: [],
      fallback: true,
    };
  }
}
