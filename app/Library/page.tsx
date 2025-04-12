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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@radix-ui/react-select";

type Designer = {
  id: number;
  name: string;
};

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

  useEffect(() => {
    const loadDesigners = async () => {
      try {
        const supabase = await createClient();
        const { data, error } = await supabase
          .from("designers")
          .select("id, name");
        if (error) throw error;
        setDesigners(data);
        console.log("Designers loaded:", data);
      } catch (error) {
        console.error("Error loading designers:", error);
      }
    };

    loadDesigners();
  }, []);

  const handleCreateDesign = async () => {
    const titleInput = document.getElementById("newTitle") as HTMLInputElement;
    const descriptionInput = document.getElementById(
      "newDescription"
    ) as HTMLInputElement;

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

  const [selectedDesigner, setSelectedDesigner] = useState<string>("");
  const [selectedDesign, setSelectedDesign] = useState<string>("");

  const handleAssign = async (design_id: number) => {
    if (!selectedDesigner || !design_id) {
      console.error("Designer or design not selected");
      return;
    }
  
    try {
      const supabase = createClient();
  
      const { error: updateError } = await supabase
        .from("desings")
        .update({ assigned_to: selectedDesigner })
        .eq("id", design_id);
  
      if (updateError) throw updateError;
  
      const { data: existingAssignment, error: checkError } = await supabase
        .from("design_assignments")
        .select()
        .eq("design_id", design_id)
        .eq("designer_id", selectedDesigner)
        .single();
  
      if (checkError && checkError.code !== "PGRST116") throw checkError;
  
      if (!existingAssignment) {
        const { error: insertError } = await supabase
          .from("design_assignments")
          .insert({
            design_id,
            designer_id: selectedDesigner,
            assigned_at: new Date().toISOString(),
          });
  
        if (insertError) throw insertError;
      }
  
      console.log(`Design ${design_id} assigned to designer ${selectedDesigner}`);
  
      // ✅ Clear state & close dialog
      setSelectedDesign("");
      setSelectedDesigner("");
      setIsDialogOpen(false);
      onRefresh();
    } catch (error) {
      console.error("Error assigning design:", error instanceof Error ? error.message : JSON.stringify(error));
    }
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [designer, setDesigners] = useState<Designer[] | null>();
  const [desings, setDesings] = useState<Desing[] | null>();
  const [error, setError] = useState<PostgrestError>();

  return (
    <main>
      <div className="items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-green-500 text-white hover:bg-green-600"
            >
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
        <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-blue-500 text-white hover:bg-red-600"
            >
              Assign Design to a Designer
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Assign Design</DialogTitle>
              <DialogDescription>
                Select a designer and a design to assign.
              </DialogDescription>
            </DialogHeader>

            {/* Select Designer */}
            <div className="mb-4">
              <label className="block mb-2 text-sm">Designer</label>
              <Select
                onValueChange={setSelectedDesigner}
                value={selectedDesigner}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Designer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {designer?.map((d) => (
                      <SelectItem
                        key={`designer-list-item-${d.id}`}
                        value={String(d.id)}
                      >
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Select Design */}
            <div className="mb-4">
              <label className="block mb-2 text-sm">Design</label>
              <Select onValueChange={setSelectedDesign} value={selectedDesign}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Design" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {desings?.map((d) => (
                      <SelectItem
                        key={`design-list-item-${d.id}`}
                        value={String(d.id)}
                      >
                        {d.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button
                type="button"
                disabled={!selectedDesigner || !selectedDesign}
                onClick={async () => {
                  await handleAssign(parseInt(selectedDesign));
                }}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      </div>
      <div className="grid grid-cols-2 gap-4 ">
        {desings?.map((desing) => (
          <ProjectsLibrary
            URLImg={""}
            {...desing}
            key={`desing-list-item-${desing.id}`}
          />
        ))}
      </div>

      
    </main>
  );
}

function onRefresh() {
  window.location.reload();
}
