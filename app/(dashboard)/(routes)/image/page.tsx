"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Empty } from "@/components/empty";
import { AxiosError } from "axios";
import { Loader } from "@/components/loader";
import * as z from "zod";
import { Heading } from "@/components/heading";
import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { amountOptions, formSchema, resolutionOptions } from "./constants";
import { Form, FormField, FormItem, FormControl} from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
   
import axios from "axios";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Download, ImageIcon } from "lucide-react";
import { useProModal } from "@/hooks/use-pro-modal";


  

const ImagePage = () => {
    const router = useRouter();
    const [images, setImages] = useState<string[]>([]);
    const proModal = useProModal();

    const form = useForm < z.infer<typeof formSchema>>(
        {
            resolver : zodResolver(formSchema),
            defaultValues :{
                prompt:"",
                amount: "1",
                resolution: "512x512"
            }
        }
    );

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      

        console.log(values);
        try{
  setImages([]);

            const response = await axios.post("/api/image",values); {
              const url = window.URL.createObjectURL(new Blob([response.data]));
              window.open(url);
            }

            const imageUrls = response.data.map((image: { url: string }) => image.url);

            setImages(imageUrls);

            form.reset({
                prompt: "",
                amount: "1",
                resolution: "512x512"
            });

            form.reset();

           
        } catch (error: AxiosError | unknown) {
            if (axios.isAxiosError(error)) {
                console.error("AXIOS_ERROR:", error as AxiosError);
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
    }
    return (
        <div>
            <Heading
            title="Image Generation"
            description="Turn your thoughts into an image."
            icon = {ImageIcon}
            iconColor = "text-pink-700"
            bgColor = "bg-pink-700/10"/>
            <div className="px-4 lg:px-8">
               <div>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                    className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2">
                        <FormField
                        name="prompt"
                        render={({field}) => (<FormItem className="col-span-12 lg:col-span-6">
                            <FormControl className="m-0 p-0">
                                <Input
                                 className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                 disabled={isLoading}
                                 placeholder="A picture of a thunderstorm over a volcano."
                                 {...field}/>
                                 
                                 

                                </FormControl>


                        </FormItem>)}/>
                        <FormField
                        name="amount"
                        control={form.control}
                        render={({field}) => (
                            <FormItem className="col-span-12 lg:col-span-2">
                                <Select
                                disabled={isLoading}
                                onValueChange={field.onChange}
                                value={field.value}
                                defaultValue={field.value}
                                  >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value}/>
                                        </SelectTrigger>

                                         
                                       
                                    </FormControl>
                                    <SelectContent> 
                                        {amountOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>

                                </Select >
                                </FormItem>
                        )}/>
                    <FormField
                        name="resolution"
                        control={form.control}
                        render={({field}) => (
                            <FormItem className="col-span-12 lg:col-span-2">
                                <Select
                                disabled={isLoading}
                                onValueChange={field.onChange}
                                value={field.value}
                                defaultValue={field.value}
                                  >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value}/>
                                        </SelectTrigger>

                                         
                                       
                                    </FormControl>
                                    <SelectContent> 
                                        {resolutionOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>

                                </Select >
                                </FormItem>
                        )}/>
                                

                        
                        <Button className = "col-span-12 lg:col-span-2 w-full  " disabled={isLoading} >
                            Generate
                        </Button>
                    </form>
                       
                 </Form>
               </div>
            </div>
            <div className="space-y-4 mt-4 px-4 lg:px-8 text-body-foreground">
                {isLoading && (
                    <div className="p-20">
                       <Loader/>
                    </div>
                )}
                {images.length === 0 && !isLoading && (
                    <Empty label = "No images generated."/>
                )}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
                {images.map((src) => (
                    <Card key={src} className="rounded-lg overflow-hidden">
                        <div className="relative aspect-square">
                          <Image fill alt="Generated" src={src} />
                        </div>
                        <CardFooter className="p-2">
                            <Button 
                            onClick={() => window.open(src)}
                            variant="secondary"
                             className="w-full">
                                <Download className="h-4 w-4 mr-2"/>
                                Download

                            </Button>
                        </CardFooter>
                    </Card>
                ))}
               </div>
                   
            </div>
        </div>
        
    )
}

export default ImagePage;