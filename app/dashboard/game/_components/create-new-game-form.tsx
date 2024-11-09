"use client";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { cn } from "@/lib/utils";
import { watch } from "fs";

import { useRouter } from "next/router";

const formSchema = z.object({
    blue_agent: z.string().min(1, 
        { message: "Blue agent name is required" }),
    upload_blue_agent_file: z.instanceof(File).optional(), // https://medium.com/@damien_16960/input-file-x-shadcn-x-zod-88f0472c2b81
    red_agent: z.string().min(1, 
        { message: "Red agent name is required" }),
    steps: z.number()
        .positive({ message: "Age must be positive" })
        .int({ message: "Age must be integer" })
        .or(z.string()),
    wrapper: z.string().min(1,
        { message: "Wrapper name is required" }) 
})
  
export function NewGameForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        blue_agent: "BlueReactRemove",
        red_agent: "B_lineAgent",
        steps: 10,
        wrapper: "simple"
    }
  });
  
  const blueAgentSelection: string = form.watch("blue_agent");

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    try {
        
      if (values.blue_agent === "upload" && values.upload_blue_agent_file) {
        // Upload the file to AWS
        const file = values.upload_blue_agent_file;

        // Example: Using a presigned URL from your backend
        const presignedUrlResponse = await fetch(
          "http://localhost:5555/api/get-presigned-url",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ fileName: file.name }),
          }
        );
        const { url: presignedUrl } = await presignedUrlResponse.json();

        // Upload the file directly to AWS S3
        const uploadResponse = await fetch(presignedUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload file to AWS");
        }

        const fileUrl = presignedUrl.split("?")[0]; // Get the file URL

        // Proceed with starting the game, including the uploaded file URL
        const response = await fetch("http://localhost:5555/api/games/start", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            blue_agent: fileUrl,
            red_agent: values.red_agent,
            steps: values.steps,
            wrapper: values.wrapper,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to start a new game");
        }

        const data = await response.json();
        console.log("Game ID is " + data.game_id);
        window.location.reload();
      } else {
        // it has to be localhost:5555 because the frontend is running on the client side
        const response = await fetch('http://localhost:5555/api/games/start',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "blue_agent": values.blue_agent,
                    "red_agent": values.red_agent,
                    "steps": values.steps,
                    "wrapper": values.wrapper
                })
            }
        )
        if (!response.ok) {
          throw new Error('Failed to start a new game')
        }
        const data = await response.json()
        console.log("Game ID is" + data.game_id)
        window.location.reload();
      }
      
    } catch (error) {
        console.error('Error:', error);
    }
  } 

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-2"
      >
        <FormField
            control={form.control}
            name="blue_agent"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Blue Agent</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select an agent" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Blue Agents</SelectLabel>
                            <SelectItem value="BlueReactRemove">Blue Remove Agent</SelectItem>
                            <SelectItem value="upload">Upload My Agent</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />

        {blueAgentSelection === "upload" && (
            <FormField
                control={form.control}
                name="upload_blue_agent_file"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Upload Agent</FormLabel>
                        <FormControl>
                        <Input
                          type="file"
                          placeholder=".pth file that will be used for PPO Agent"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        )}

        <FormField
            control={form.control}
            name="red_agent"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Red Agent</FormLabel>
                    <FormControl>
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select an agent" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Red Agents</SelectLabel>
                            <SelectItem value="B_lineAgent">B_line Agent</SelectItem>
                            <SelectItem value="MeanderAgent">Meander Agent</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />

        <FormField 
            control={form.control}
            name="steps"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Max Steps</FormLabel>
                    <FormControl>
                        <Input type="number" 
                            inputMode='numeric'
                            autoComplete='off'
                            placeholder="Enter the number of steps" {...field} 
                            value={field.value || ""} // avoid errors of uncontrolled vs controlled
                            pattern="[0-9]*" // to receive only numbers without showing does weird arrows in the input
                            onChange={(e) => {
                                field.onChange(Number(e.target.value));
                            }}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />

        <FormField 
            control={form.control}
            name="wrapper"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Wrapper</FormLabel>
                    <FormControl>
                    <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select an wrapper" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Wrappers</SelectLabel>
                            <SelectItem value="simple">simple</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />

        <Button
            className={cn(buttonVariants({ variant: 'default' }))}
            // type="submit"
        >
          Create
        </Button>
      </form>
    </Form>
  )
}