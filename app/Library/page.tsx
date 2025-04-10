"use client";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import PostgrestError from "@supabase/postgrest-js/dist/cjs/PostgrestError";
import { ProjectsLibrary } from "@/app/Library/components/projectsLibrary";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Desing = {
  id: number;
  title: string;
  description: string;
};
const initialState = {
  id: -1,
  first_name: "",
  last_name: "",
  age: 0,
};

export default function Home() {
  
  const loadDesings = async () => {
    try {
      const supabase = createClient();
      const { data: desings, error: desingsError } = await supabase
        .from("desings")
        .select()
        .order("id");

      if (desingsError) {
        setError(desingsError);
      }

      setDesings(desings);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadDesings();
  }, []);

  

  const handleCreateDesign = async () => {


    const titleInput = document.getElementById("newTitle") as HTMLInputElement;
    const descriptionInput = document.getElementById("newDescription") as HTMLInputElement;
  
    if (titleInput && descriptionInput) {
      const newTitle = titleInput.value;
      const newDescription = descriptionInput.value;
  
      if (!newTitle || !newDescription) {
        console.error("Title and description are required");
        return;
      }
  
      try {
        const supabase = await createClient();
        const { error } = await supabase
          .from("desings")
          .insert([{ title: newTitle, description: newDescription }]);
  
        if (error) throw error;
  
        console.log("New design created successfully");
        onRefresh();
      } catch (error) {
        console.error("Error creating design:", error);
      }
    } else {
      console.error("Title or description input not found");
    }
  };

  const [desings, setDesings] = useState<Desing[] | null>();
  const [error, setError] = useState<PostgrestError>();
  return (
    <main>
      <div className="items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="bg-green-500 text-white hover:bg-green-600">
              Add Design
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Design</DialogTitle>
              <DialogDescription>Create your own projects</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="newTitle" className="text-right">
            Title
          </label>
          <Input
            id="newTitle"
            placeholder="Enter title"
            className="col-span-3"
          />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="newDescription" className="text-right">
            Description
          </label>
          <Input
            id="newDescription"
            placeholder="Enter description"
            className="col-span-3"
          />
              </div>
            </div>
            <DialogFooter>
          <Button
          type="button"
          onClick={async () => {
            await handleCreateDesign();
          }}
          >
          Save Design
          </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-2 gap-4 ">
        {desings?.map((desing) => (
          <ProjectsLibrary {...desing} key={`desing-list-item-${desing.id}`} />
        ))}
      </div>
    </main>
  );
}

function onRefresh() {
  window.location.reload();
}

