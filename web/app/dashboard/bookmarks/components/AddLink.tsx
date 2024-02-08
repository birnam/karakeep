"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import APIClient from "@/lib/api";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, SubmitErrorHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  url: z.string().url({ message: "The link must be a valid URL" }),
});

export default function AddLink() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(value: z.infer<typeof formSchema>) {
    const [_resp, error] = await APIClient.bookmarkLink(value.url);
    if (error) {
      toast({ description: error.message, variant: "destructive" });
      return;
    }
    router.refresh();
  }

  const onError: SubmitErrorHandler<z.infer<typeof formSchema>> = (errors) => {
    toast({
      description: Object.values(errors)
        .map((v) => v.message)
        .join("\n"),
      variant: "destructive",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <div className="py-4 container flex w-full items-center space-x-2">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => {
              return (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input type="text" placeholder="Link" {...field} />
                  </FormControl>
                </FormItem>
              );
            }}
          />
          <Button type="submit">
            <Plus />
          </Button>
        </div>
      </form>
    </Form>
  );
}
