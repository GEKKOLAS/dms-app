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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  useEffect(() => {
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
        console.log("Designs loaded:", desings); // Verifica los datos aquí
      } catch (error) {
        console.error("Error loading designs:", error);
      }
    };

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

  const handleAssign = async (designId: number) => {
    if (!selectedDesigner || !designId) {
      console.error("Designer or design not selected");
      return;
    }

    try {
      const supabase = createClient();

      // Inserta la asignación en la tabla `design_assignments`
      const { error: insertError } = await supabase
        .from("design_assignments")
        .insert({
          design_id: designId,
          designer_id: selectedDesigner,
          assigned_at: new Date().toISOString(),
        });

      if (insertError) {
        throw insertError;
      }

      console.log(`Design ${designId} assigned to designer ${selectedDesigner}`);
    } catch (error) {
      console.error(
        "Error assigning design:",
        error instanceof Error ? error.message : JSON.stringify(error)
      );
    }
  };

  const handleSelectItem = (type: "designer" | "design", value: string) => {
    if (type === "designer") {
      console.log("Selected Designer:", value);
      setSelectedDesigner(value);
    } else if (type === "design") {
      console.log("Selected Design:", value);
      setSelectedDesign(value);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDesigner || !selectedDesign) {
      console.error("Designer or design not selected");
      return;
    }

    console.log("Selected Designer:", selectedDesigner);
    console.log("Selected Design:", selectedDesign);

    await handleAssign(parseInt(selectedDesign));
    onRefresh();
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [designer, setDesigners] = useState<Designer[] | null>();
  const [desings, setDesings] = useState<Desing[] | null>();
  const [error, setError] = useState<PostgrestError>();

  return (
    <main>
      <div className="flex items-center justify-between mb-4">
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
      </div>
      <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-blue-500 text-white hover:bg-red-600"
            >
              Assign Design to a Designer
            </Button>
          </DialogTrigger>
          <DialogContent className="lg:max-w-[800px] sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Assign Design</DialogTitle>
              <DialogDescription>
                Select a designer and a design to assign.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={onSubmit}>
              {/* Select Designer */}
              <Select
                onValueChange={(value) => handleSelectItem("designer", value)}
                value={selectedDesigner}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Designer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {designer?.length ? (
                      designer.map((d) => (
                        <SelectItem
                          key={`designer-list-item-${d.id}`}
                          value={String(d.id)}
                        >
                          {d.name}
                        </SelectItem>
                      ))
                    ) : (
                      <p>No designers available</p>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* Select Design */}
              <Select
                onValueChange={(value) => handleSelectItem("design", value)}
                value={selectedDesign}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Design" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {desings?.length ? (
                      desings.map((d) => (
                        <SelectItem
                          key={`design-list-item-${d.id}`}
                          value={String(d.id)}
                        >
                          {d.title}
                        </SelectItem>
                      ))
                    ) : (
                      <p>No designs available</p>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* Botón de guardar */}
              <DialogFooter>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <section>
      <div className="grid grid-cols-2 gap-4  ">
        {desings?.map((desing) => (
          <ProjectsLibrary
            URLImg={""}
            {...desing}
            key={`desing-list-item-${desing.id}`}
          />
        ))}
      </div>
      </section>

      
    </main>
  );
}

function onRefresh() {
  window.location.reload();
}
