import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import CustomController from "./customController";
import { foodFormSchema } from "@/schema/formSchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUp } from "lucide-react";
import { FoodType } from "@/types/foodType";
import { postFood, updateFood } from "@/libs/api";
import { useMutation, useQueryClient } from "react-query";

const formContents: { title: string; type: string; label: string }[] = [
  { title: "name", type: "input", label: "Name of Food" },
  { title: "native", type: "input", label: "Food Navite From" },
  { title: "foodType", type: "selector", label: "Food Type" },
  { title: "cookTime", type: "selector", label: "Time To Cook" },
  {
    title: "isFeatured",
    type: "selector",
    label: "Do you want it to Feature?",
  },
];

interface FoodFormProps {
  item?: FoodType;
  componentFor: "post" | "put";
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const initialFormValue = {
  name: "",
  native: "",
  foodType: "",
  cookTime: 0,
  image: undefined,
  isFeatured: false,
};

export default function FoodForm({
  componentFor,
  item,
  setOpen,
}: FoodFormProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const deafaultFormValue = item ? item : initialFormValue;
  const queryClient = useQueryClient();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = useForm<z.infer<typeof foodFormSchema>>({
    resolver: zodResolver(foodFormSchema),
    defaultValues: deafaultFormValue,
  });

  function handleImageClick() {
    imageInputRef.current?.click();
  }

  const { mutate, isLoading: updateLoading } = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateFood(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["singleFood", item?._id] });
      queryClient.invalidateQueries({ queryKey: ["getFood"] });
      if (setOpen) {
        setOpen(false);
      }
      reset();
      setLoading(false);
    },
  });

  const {
    mutate: postMutate,
    isLoading,
    data,
  } = useMutation({
    mutationFn: (formData: FormData) => postFood(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getFood"] });
      reset();
      console.log(data);
    },
  });
  const onSubmit = (data: z.infer<typeof foodFormSchema>) => {
    // console.log(data);
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      const value = data[key as keyof typeof data];
      formData.append(key, value instanceof File ? value : String(value));
    });

    setLoading(true);
    if (componentFor === "post") {
      postMutate(formData);
    }

    if (componentFor === "put") {
      if (item?._id) {
        mutate({ id: item?._id, formData });
      }
    }
    setLoading(false);
  };

  const image = watch("image");
  return (
    <form
      className="w-full flex flex-col gap-2 py-4 px-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <>
        {formContents.map((content) => (
          <div key={content.title} className="">
            <CustomController
              control={control}
              name={content.title}
              type={content.type}
              label={content.label}
              errors={errors}
            />
          </div>
        ))}

        <label
          onClick={handleImageClick}
          className="px-4 text-green-500 flex gap-2 bg-slate-300 w-fit rounded-md"
        >
          Select an Image
          <ImageUp />
        </label>
        <Controller
          control={control}
          name="image"
          render={({ field }) => (
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  const file = e.target.files[0];
                  field.onChange(file);
                  setValue("image", file);
                }
              }}
            />
          )}
        />
      </>
      {image && image instanceof File ? (
        <p className="bg-slate-400 rounded-md px-4 w-fit">
          {image?.name?.slice(0, 10)}
        </p>
      ) : (
        <p className="bg-slate-400 rounded-md px-4 w-fit">
          {image?.slice(0, 10)}
        </p>
      )}
      {isLoading || updateLoading ? (
        <button
          type="button"
          className={`bg-slate-500 text-white font-semibold py-2 w-fit px-8 mt-4 rounded-md mx-auto `}
        >
          {componentFor === "put" ? "Updating..." : "Submiting..."}
        </button>
      ) : (
        <button
          type="submit"
          className={`bg-slate-900 text-white font-semibold py-2 w-fit px-8 mt-4 rounded-md mx-auto `}
        >
          {componentFor === "put" ? "Update" : "Submit"}
        </button>
      )}
    </form>
  );
}
