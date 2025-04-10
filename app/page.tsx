"use client";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import PostgrestError from "@supabase/postgrest-js/dist/cjs/PostgrestError";
import { ProjectsLibrary } from "./components/projectsLibrary";

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

  const [desings, setDesings] = useState<Desing[] | null>();
  const [error, setError] = useState<PostgrestError>();
  return (
    <main>
      <div className="grid grid-cols-2 gap-4 ">
        {desings?.map((desing) => (
          <ProjectsLibrary {...desing} key={`desing-list-item-${desing.id}`} />
        ))}
      </div>
    </main>
  );
}
