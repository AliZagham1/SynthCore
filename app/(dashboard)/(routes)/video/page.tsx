"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/heading";
import { Loader } from "@/components/loader";
import { Video } from "lucide-react";
import { Empty } from "@/components/empty";
import axios from "axios";
import { useProModal } from "@/hooks/use-pro-modal";

const formSchema = z.object({
  prompt: z.string().min(1, "Prompt is required."), // Validates that the prompt is not empty
});

const VideoPage = () => {
  const [video, setVideo] = useState<string | null>(null); // State to store the video URL
  const [isLoading, setIsLoading] = useState(false); // Loading state management
  const proModal = useProModal();

  // Cleanup useEffect to revoke Blob URL
  useEffect(() => {
    return () => {
      if (video) {
        URL.revokeObjectURL(video); // Revoke the Blob URL to free memory
        console.log("Blob URL revoked.");
      }
    };
  }, [video]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true); // Set loading state
    setVideo(null); // Reset video state before making a new request

    try {
      // Send the POST request to your backend
      const response = await axios.post("/api/video", values);

      // Extract file paths from the backend response
      const { files } = response.data;

      if (files && files.length > 0) {
        setVideo(files[0]); // Use the first video URL
      } else {
        console.error("No files were generated.");
      }
    } catch (error:any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      }else {
        toast.error(" Oops!Something went wrong");
   }
     
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div>
      <Heading
        title="Video Generation"
        description="Turn your imagination into videos with AI."
        icon={Video}
        iconColor="text-blue-500"
        bgColor="bg-blue-500/10"
      />
      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
          >
            {/* Prompt Input */}
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-8">
                  <FormControl>
                    <Input
                      placeholder="Describe your video"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Submit Button */}
            <Button className="col-span-12 lg:col-span-4 w-full" disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate"}
            </Button>
          </form>
        </Form>
      </div>
      <div className="space-y-4 mt-4">
        {/* Loading State */}
        {isLoading && (
          <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
            <Loader />
          </div>
        )}
        {/* No Video */}
        {!video && !isLoading && <Empty label="No video has been generated." />}
        {/* Render Video */}
        {video && (
          <video
            controls
            className="w-full aspect-video mt-8 rounded-lg border bg-black"
          >
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
};

export default VideoPage;
