"use client";
import React, { FC, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { cn } from "@/lib/utils";
import { Dialog, DialogDescription, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input"; // Replace with the correct path to your Input component

type Desing = {
  id: number;
  title: string;
  description: string;
};

type DesingItemsProps = Desing & {};

export const ProjectsLibrary: FC<DesingItemsProps> = ({
  id,
  title,
  description,
}) => {
  const onRefresh = () => {
    window.location.reload();
  };

  useEffect(() => {
    const loadDesings = async () => {
      try {
        const supabase = await createClient();
        const { data, error } = await supabase.from("desings").select();
        console.log(data, error);
      } catch (error) {
        console.error(error);
      }
    };
    loadDesings().catch(console.error);
  }, []);

  const handleDelete = async () => {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from("desings").delete().eq("id", id);
      if (error) throw error;
      console.log(`Design with ID ${id} deleted successfully`);
      onRefresh();
    } catch (error) {
      console.error("Error deleting design:", error);
    }
  };

  const handleEdit = () => {
    const titleInput = document.getElementById("title") as HTMLInputElement;
    const descriptionInput = document.getElementById("description") as HTMLInputElement;

    if (titleInput && descriptionInput) {
      const updatedTitle = titleInput.value;
      const updatedDescription = descriptionInput.value;

      const updateDesign = async () => {
      try {
        const supabase = await createClient();
        const { error } = await supabase
        .from("desings")
        .update({ title: updatedTitle, description: updatedDescription })
        .eq("id", id);

        if (error) throw error;

        console.log(`Design with ID ${id} updated successfully`);
        onRefresh();
      } catch (error) {
        console.error("Error updating design:", error);
      }
      };

      updateDesign().catch(console.error);
    } else {
      console.error("Title or description input not found");
    }
  };

  const handleAssign = () => {
    console.log(`Assign design with ID ${id}`);
    // Aquí puedes implementar la lógica para asignar el diseño
  };

  return (
    <section>
      <div className=" container justify-center ">
        <div className="grid-flow-col justify-items-center content-start">
          <CardContainer className="inter-var">
            <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
              <CardItem translateZ={50} className="place-items-center">
                <div
                  className={cn(
                    "group w-full cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl mx-auto flex flex-col justify-end p-4 border border-transparent dark:border-neutral-800",
                    "bg-[url(https://images.unsplash.com/photo-1476842634003-7dcca8f832de?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80)] bg-cover",
                    // Preload hover image by setting it in a pseudo-element
                    "before:bg-[url(https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWlodTF3MjJ3NnJiY3Rlc2J0ZmE0c28yeWoxc3gxY2VtZzA5ejF1NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/syEfLvksYQnmM/giphy.gif)] before:fixed before:inset-0 before:opacity-0 before:z-[-1]",
                    "hover:bg-[url(https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExb3VsYWZtd2drdG84aHI4aGFmOWFncjM5Y2J0dmtrdDQ5NWw2ZXV1dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/IdlAdwdaFPquVNF0iD/giphy.gif)]",
                    "hover:after:content-[''] hover:after:absolute hover:after:inset-0 hover:after:bg-black hover:after:opacity-50",
                    "transition-all duration-500"
                  )}
                />
                <div>
                  <h3>{`${title}`}</h3>
                  <p>{`${description}`}</p>
                </div>
                <div className="flex space-x-2 mt-4">
                  <button
                    className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                    onClick={handleDelete}
                  >
                    Eliminar
                  </button>
                    <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Edit Desing</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                      <DialogTitle>Edit Desing</DialogTitle>
                      <DialogDescription>
                        Make changes to your profile here. Click save when
                        you're done.
                      </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="name" className="text-right">
                        Title
                        </label>
                        <Input
                        id="title"
                        defaultValue={title}
                        className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="description" className="text-right">
                        Description
                        </label>
                        <Input
                        id="description"
                        defaultValue={description}
                        className="col-span-3"
                        />
                      </div>
                      </div>
                      <DialogFooter>
                        <Button
                        type="button"
                        onClick={handleEdit}
                        
                        >
                        Save changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                    </Dialog>
                  <button
                    className="px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                    onClick={handleAssign}
                  >
                    Asignar
                  </button>
                </div>
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>
      </div>
    </section>
  );
};
