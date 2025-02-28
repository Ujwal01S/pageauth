import React from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { ErrorMessage } from "@hookform/error-message";

interface CustomControllerProps {
  name: string;
  control: Control<any>;
  type: string;
  className?: string;
  label: string;
  errors: FieldErrors;
}

const foodTypeArray = ["Select a value", "Casual", "Street", "Luxuary"];
const timeToCook = [0, 10, 20, 30];
const isFeatured = ["Select a value", "true", "false"];

export default function CustomController({
  control,
  className,
  label,
  type,
  name,
  errors,
}: CustomControllerProps) {
  const selectedOptionValue: (string | number)[] =
    name === "foodType"
      ? foodTypeArray
      : name === "isFeatured"
      ? isFeatured
      : timeToCook;

  return (
    <div className={twMerge("flex flex-col w-[40%]", className)}>
      <label className="mt-3 font-semibold">{label}:</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) =>
          type === "selector" ? (
            <select
              className="border-[1px] border-black py-2"
              value={field.value}
              onChange={(e) =>
                field.onChange(
                  name === "cookTime"
                    ? Number(e.target.value)
                    : name === "isFeatured"
                    ? e.target.value === "true"
                    : e.target.value
                )
              }
            >
              {selectedOptionValue.map((option, index) => (
                <option key={index} value={String(option)}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              className="border-[1px] py-2 border-black"
              onChange={field.onChange}
              value={field.value}
            />
          )
        }
      />
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => <p className="text-red-500">{message}</p>}
      />
    </div>
  );
}
