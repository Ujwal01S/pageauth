import FoodForm from "@/components/foodForm/foodForm";
import React from "react";

export default function CreateNewsPage() {
  return (
    <div className="w-full flex justify-center mt-10">
      <div className="w-[40%] border-2 shadow-md">
        <h1 className="text-2xl text-slate-900 font-semibold w-full text-center">
          Share Your Food
        </h1>
        <FoodForm componentFor="post" />
      </div>
    </div>
  );
}
