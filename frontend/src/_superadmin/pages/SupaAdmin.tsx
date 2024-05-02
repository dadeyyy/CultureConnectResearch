import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { adminCreation } from "@/lib/validation";
import { z } from "zod";
import toast from "react-hot-toast";
import { provincesTest } from "@/lib/provinces";
import { useState } from "react";
import { Box, LinearProgress } from "@mui/material";
const server = process.env.REACT_APP_BACKEND_PORT || 'http://localhost:8000'
const SupaAdmin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof adminCreation>>({
    resolver: zodResolver(adminCreation),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      role: "ADMIN",
      province: "",
      password: "",
      confirmPassword: "",
    },
  });

  // BACKEND SERVER SUBMISSION
  const onSubmit = async (values: z.infer<typeof adminCreation>) => {
    setIsLoading(true);
    const { confirmPassword, ...signUpValues } = values;
    const updatedValues = {
      ...signUpValues,
      interest: ["culture", "art", "People", "culture", "art", "People"],
    };
    try {
      const response = await fetch(`${server}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedValues),
      });
      const data = await response.json();
      if (response.ok) {
        setIsLoading(false);
        toast.success("Successfully created user!");
        return navigate(0);
      } else {
        setIsLoading(false);
        toast.error(`${data.error}`);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to sign-up");
      return navigate(0);
    }
  };

  return (
    <Form {...form}>
      <div className="px-5 w-full">
        {isLoading && (
          <div className="w-full ">
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
            </Box>
          </div>
        )}
        <span className="flex py-5 font-bold text-lg">Add information for new admin</span>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <>
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Juan" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Dela Cruz" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="juandelacruz1" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="example@test.com" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" readOnly />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Province</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="province">
                        <SelectValue placeholder={`Select Province`} />
                      </SelectTrigger>
                      <SelectContent position="popper" className="bg-white">
                        {provincesTest.map((municipality) => (
                          <SelectItem key={municipality.value} value={municipality.value}>
                            {municipality.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your desired password." {...field} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Re-enter your password" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
          </>
          <div className="w-full flex justify-end">
            <Button type="submit" className="my-5">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </Form>
  );
};

export default SupaAdmin;
