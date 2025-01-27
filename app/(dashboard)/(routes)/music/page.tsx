"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Empty } from "@/components/empty";
import { AxiosError } from "axios";
import { Loader } from "@/components/loader";
import * as z from "zod";
import { Heading } from "@/components/heading";
import { Music } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./constants";
import { Form, FormField, FormItem, FormControl} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useProModal } from "@/hooks/use-pro-modal";

const MusicPage = () => {
  const router = useRouter();
  const [music, setMusic] = useState<string | undefined>();
  const proModal = useProModal();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: "" },
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Form Values:", values);
    try {
      setMusic(undefined); // Clear previous music
      const response = await axios.post("/api/music", values);
      console.log("Response Data:", response.data);

      if (response.data.audio) {
        setMusic(response.data.audio);
      } else {
        console.error("Audio not found in response:", response.data);
      }
      form.reset();
    } catch (error: AxiosError | unknown) {
      if (axios.isAxiosError(error)) {
        console.error("AXIOS_ERROR:", error as AxiosError); // Explicit reference to AxiosError
        if (error.response?.status === 403) {
          proModal.onOpen();
        } else {
          toast.error("Oops! Something went wrong");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    }finally {
      router.refresh();
    }
  };

  // Cleanup: Reset music when the component unmounts
  useEffect(() => {
    return () => {
      setMusic(undefined);
    };
  }, []);

  return (
    <div>
      <Heading
        title="Music Generation"
        description="Turn your work into music with our AI music generator."
        icon={Music}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
      />
      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
          >
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      disabled={isLoading}
                      placeholder="Guide me to the perfect song."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
              Generate
            </Button>
          </form>
        </Form>
      </div>
      <div className="space-y-4 mt-4">
        {isLoading && (
          <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
            <Loader />
          </div>
        )}
        {!isLoading && !music && <Empty label="No music has been generated." />}
        {music && (
          <audio controls className="w-full mt-8">
            <source src={music} type="audio/mpeg" />
          </audio>
        )}
      </div>
    </div>
  );
};

export default MusicPage;
