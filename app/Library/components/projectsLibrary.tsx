"use client";
import React, { FC, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input"; 

type Desing = {
  id: number;
  title: string;
  description: string;
  URLImg: string;
};



type DesingItemsProps = Desing & {};

export const ProjectsLibrary: FC<DesingItemsProps> = ({
  id,
  title,
  description,
  URLImg,
}) => {

  
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };
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


  //refactorizar luego
  const handleEdit = () => {
    const titleInput = document.getElementById("title") as HTMLInputElement;
    const descriptionInput = document.getElementById("description") as HTMLInputElement;
  
    const updatedTitle = titleInput?.value;
    const updatedDescription = descriptionInput?.value;
    const imageFile = files[0];
  
    if (!titleInput || !descriptionInput) {
      console.error("Title or description input not found");
      return;
    }
  
    if (imageFile && !imageFile.type.startsWith("image/")) {
      console.error("Invalid file type. Only images are allowed.");
      return;
    }
  
    console.log("File to upload:", imageFile);
  
    const updateDesign = async () => {
      try {
        const supabase = await createClient();
        let imageUrl = URLImg; // Use the existing URL as default
  
        // Step 1: Delete the old image if a new one is provided
        if (imageFile && URLImg) {
          const filePath = URLImg.split("/").slice(-1)[0]; // Extract the file path from the URL
          const { error: deleteError } = await supabase.storage
            .from("design-images")
            .remove([filePath]);
  
          if (deleteError) {
            console.error("Error deleting old image:", deleteError);
          } else {
            console.log("Old image deleted successfully");
          }
        }
  
        // Step 2: Upload the new image
        if (imageFile) {
          const sanitizedFileName = imageFile.name.replace(/[^a-zA-Z0-9.]/g, "_");
          const filePath = `designs/${Date.now()}_${sanitizedFileName}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("design-images")
            .upload(filePath, imageFile);
  
          if (uploadError) {
            console.error("Error uploading new image:", uploadError);
            throw uploadError;
          }
  
          const { data: publicUrlData } = supabase.storage
            .from("design-images")
            .getPublicUrl(uploadData.path);
  
          imageUrl = publicUrlData.publicUrl;
          console.log("New image uploaded successfully:", imageUrl);
        }
  
        // Step 3: Update the database
        const { error } = await supabase
          .from("desings")
          .update({
            title: updatedTitle,
            description: updatedDescription,
            URLImg: imageUrl,
          })
          .eq("id", id);
  
        if (error) {
          console.error("Error updating design:", error);
          throw error;
        }
  
        console.log(`Design with ID ${id} updated successfully`);
        onRefresh();
      } catch (error) {
        console.error("Error updating design:", error);
        if (error instanceof Error) {
          console.error("Error message:", error.message);
        }
      }
    };
    console.log("ID to update:", id);

  
    updateDesign().catch(console.error);
  };
  

  return (
    <section>
      <div className=" container justify-center ">
        <div className="grid-flow-col justify-items-center content-start">
          <CardContainer className="inter-var">
            <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
              <CardItem translateZ={50} className="place-items-center">
                <img src={URLImg} alt="Design Image" />
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
                        <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
                          <FileUpload onChange={handleFileUpload} />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" onClick={handleEdit}>
                          Save changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                </div>
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>
      </div>
    </section>
  );
};
