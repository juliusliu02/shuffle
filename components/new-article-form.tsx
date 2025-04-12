"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { createArticleSchema } from "@/lib/schemas/articles";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { honoClient } from "@/lib/rpc/hono-client";
import { InferRequestType } from "hono";
import useSWRMutation from "swr/mutation";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const $post = honoClient.articles.$post;
type CreateArticleResponse = Awaited<ReturnType<typeof createArticle>>;

const createArticle = async (
  _key: string,
  { arg }: { arg: InferRequestType<typeof $post> },
) => {
  const response = await $post(arg);
  return await response.json();
};

const NewArticleForm = () => {
  const form = useForm<z.input<typeof createArticleSchema>>({
    resolver: zodResolver(createArticleSchema),
    defaultValues: {
      title: "",
      source: "",
      body: "",
    },
  });

  const { trigger, isMutating } = useSWRMutation(
    "createArticle",
    createArticle,
  );
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof createArticleSchema>) => {
    try {
      const response: CreateArticleResponse = await trigger({
        json: values,
      });
      router.push(`/articles/${response.id}`);
    } catch (error) {
      let errorMsg = "Please try again later.";
      if (error instanceof Error) {
        errorMsg = error.message;
      }
      toast.error("Error creating article", { description: errorMsg });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source / Publication</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body</FormLabel>
              <FormControl>
                <Textarea className="resize-none h-64" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isMutating}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default NewArticleForm;
