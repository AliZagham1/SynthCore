"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import * as z from "zod";
import { Heading } from "@/components/heading";
import { Code } from "lucide-react";
import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./constants";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { useRouter } from "next/navigation";
import {  } from "openai";
import {cn } from "@/lib/utils";    
import axios from "axios";
import { BotAvatar } from "@/components/bot-avatar";
import  ReactMarkdown  from "react-markdown"
import { useProModal } from "@/hooks/use-pro-modal";

// This represents the structure of a message you send to OpenAI
interface ChatMessage {
    role: 'system' | 'user' | 'assistant'; // Defines the sender's role
    content: string; // The text of the message
  }
  

const CodePage = () => {
    const router = useRouter();
    const [messages, setMessages] = useState <ChatMessage[]>([]);
    const proModal = useProModal();

    const form = useForm < z.infer<typeof formSchema>>(
        {
            resolver : zodResolver(formSchema),
            defaultValues :{
                prompt:""
            }
        }
    );

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        try{

            const userMessage : ChatMessage = {
                role: 'user',
                content: values.prompt
            };

            const newMessages = [...messages, userMessage];


            const response = await axios.post("/api/code", {
                messages: newMessages
            });

            setMessages((current) => [...current, userMessage, response.data]);

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
            title="Code Generation"
            description="Generate code using descriptive text."
            icon = {Code}
            iconColor = "text-green-700"
            bgColor = "bg-green-700/10"/>
            <div className="px-4 lg:px-8">
               <div>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                    className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2">
                        <FormField
                        name="prompt"
                        render={({field}) => (<FormItem className="col-span-12 lg:col-span-10">
                            <FormControl className="m-0 p-0">
                                <Input
                                 className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                 disabled={isLoading}
                                 placeholder="Write your prompt here..."
                                 {...field}/>
                                 
                                 

                                </FormControl>


                        </FormItem>)}/>
                        <Button className = "col-span-12 lg:col-span-2 w-full" disabled={isLoading} >
                            Generate
                        </Button>
                    </form>
                       
                 </Form>
               </div>
            </div>
            <div className="space-y-4 mt-4 px-4 lg:px-8 text-body-foreground">
                {isLoading && (
                    <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                       <Loader/>
                    </div>
                )}
                {messages.length === 0 && !isLoading && (
                    <Empty label = "No conversation started."/>
                )}
            <div className="flex flex-col-reverse gap-y-4">
                {messages.map((message) => (
                        <div key={message.content}
                        className={cn("p-8 w-full flex items-start gap-x-8 rounded-lg", message.role === "user" ? "bg-white border border-black/10" : "bg-muted")}>
                            
                                {message.role === "user" ? <UserAvatar/> : <BotAvatar/>}
                                <ReactMarkdown components= {{
                                        pre: ({ ...props}) => (
                                            <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                                                <pre {...props}/>
                                            </div>
                                        ), code: ({...props}) => (
                                            <code className="bg-black/10 rounded-lg p-1" {...props}/>
                                        )

                                   }} className="text-sm overflow-hidden leading-7"> 
                                   {message.content || ""}
                                </ReactMarkdown>
                                
                            
                        </div>
                ))}

            </div>

            </div>
        </div>
        
    )
}

export default CodePage;