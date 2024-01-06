import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { registration } from "@/lib/validation";
import { z } from "zod";

const RegisterForm = () => {
  const form = useForm<z.infer<typeof registration>>({
    resolver: zodResolver(registration),
    defaultValues: {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // BACKEND SERVER SUBMISSION
  const onSubmit = async (values: z.infer<typeof registration>) => {
    console.log(values);
    try {
      const response = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        console.log("Registration successful!");
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Error submitting registration:", error);
    }
  };

  return (
    <div className="sm:w-420 items-center flex-col">
      <div className="flex justify-center items-center">
        <img src="/assets/images/logo-2.svg" alt="logo" className="h-20 w-100" />
      </div>
      <div className="text-center sm:text-center sm:w-100 text-xl ">
        <p className="font-bold h-5 text-blue-800">Connecting different cultures</p>
        <p className="font-bold text-red-700">in the Philippines</p>
      </div>
      <h2 className="font-bold pt-5 sm:py-5">Sign up to CultureConnect</h2>
      <div className="flex flex-center flex-col">
        <Button
          variant="outline"
          className="group hover:bg-blue-500 hover:text-white active:border-blue-500 active:bg-white active:text-black"
        >
          <img src="/assets/icons/google-icon.svg" className="h-5 mr-5" />
          Sign up with Google
        </Button>
        <div className="text-center sm:text-center sm:w-100 m-3">
          <p className="font-bold">or</p>
        </div>

        {/* DIALOG BOX FOR CREATING AN ACCOUNT */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="shad-button_primary">Create Account</Button>
          </DialogTrigger>
          <Form {...form}>
            <div>
              <DialogContent className="w-1/2">
                <DialogHeader>
                  <DialogTitle>Sign up to CultureConnect.</DialogTitle>
                  <DialogDescription>First, Create your account.</DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-2 items-center gap-4">
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
                  </div>
                  <FormField
                    control={form.control}
                    name="userName"
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
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your desired password."
                            {...field}
                          />
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
                  <DialogFooter>
                    <Button type="submit" className="my-5">
                      Submit
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </div>
          </Form>
        </Dialog>
        {/* DIALOG BOX FOR CREATING AN ACCOUNT */}
      </div>
      <div className="flex flex-col gap-1 w-full mt-1">
        <div className="flex items-center space-x-2 my-5">
          <p className="text-xs">
            By creating an account, you agree to the Terms of Service and <br /> Privacy Policy,
            including Cookie Use.
          </p>
        </div>
        <p className="text-center text-small-regular mt-5">
          Already have an account?
          <Link to="/signin" className="text-blue-700 text-small-semibold ml-1">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
