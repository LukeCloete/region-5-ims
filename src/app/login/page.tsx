"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/lib/utils";
import COMPANY_LOGO from "../../../public/logo.jpg";
import { toast } from "sonner";
import { useState } from "react";

const formSchema = z.object({
  emailAddress: z.string().email({ message: "Email address is not valid." }),
  password: z.string().min(3, "Please enter a password."),
});

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  let user = null;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailAddress: "",
      password: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isLoading) return;
    toast.info("Logging in...");

    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.emailAddress,
        values.password
      );

      user = userCredential.user;
      if (user) {
        toast.success("Login successful!");
        router.push("/dashboard");
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (e) {
      toast.error(getErrorMessage(e));
      console.error("error ", e);
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    router.push("/dashboard");
  }

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="absolute top-4 left-4 flex gap-2 items-center justify-center">
        <Image
          src={COMPANY_LOGO}
          alt="Company Logo"
          className="w-12 h-12 object-contain"
        />
        <p className="font-bold text-foreground text-xl ">Region 5 IMS</p>
      </div>
      <div className="flex items-center justify-center rounded-r-2xl w-full h-full">
        <div className="w-full h-full flex flex-col bg-white gap-8 items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-2 w-full">
            <h1 className=" text-2xl text-foreground font-bold">
              Login to your account
            </h1>
            <p className="text-slate-400">
              Enter your email below to login to the system
            </p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-8 w-1/3"
            >
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="emailAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full text-foreground disabled:bg-gray-300"
                disabled={isLoading}
              >
                Log In
              </Button>
            </form>
          </Form>
        </div>
        <div className="w-full bg-gradient-to-tr from-green-950 to-green-500 -z-[1] h-full flex items-center justify-center"></div>
      </div>
    </div>
  );
}
