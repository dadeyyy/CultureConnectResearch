import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { registration } from "@/lib/validation";
import { z } from "zod";

const RegisterForm = () => {
  const isLoading = true;

  // 1. Define your form.
  const form = useForm<z.infer<typeof registration>>({
    resolver: zodResolver(registration),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof registration>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <div className="flex justify-center items-center">
          <img src="/assets/images/logo-2.svg" alt="logo" className="h-20 w-100" />
        </div>
        <div className="text-center sm:text-center sm:w-100 text-xl ">
          <p className="font-bold h-5 text-blue-800">Connecting different cultures</p>
          <p className="font-bold text-red-700">in the Philippines</p>
        </div>
        <h2 className="font-bold pt-5 sm:py-5">Sign in to CultureConnect</h2>
        <div className="flex flex-center flex-col">
          <Button
            variant="outline"
            className="group hover:bg-blue-500 hover:text-white active:border-blue-500 active:bg-white active:text-black"
          >
            <img src="/assets/icons/google-icon.svg" className="h-5 mr-5 " />
            Sign in with Google
          </Button>
          <div className="text-center sm:text-center sm:w-100 m-3">
            <p className="font-bold">or</p>
          </div>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-1 w-full mt-1">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email here"
                    className="shad-input h-10 border-r-2 mb-5 border-solid border-2 border-blue-500"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password here"
                    className="shad-input h-10 border-r-2 border-solid border-2 border-blue-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary mt-5">
            Login
          </Button>
          <p className="text-center text-small-regular mt-5">
            No account?
            <Link to="/register" className="text-blue-700 text-small-semibold ml-1 ">
              Create one
            </Link>
          </p>
        </form>

        {/* <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-1 w-full mt-1">
          <div className="flex gap-5">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input h-6 border-r-2" {...field} />
                  </FormControl>
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
                    <Input type="text" className="shad-input h-6 border-r-2" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input h-6 border-r-2" {...field} />
                </FormControl>
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
                  <Input type="password" className="shad-input h-6 border-r-2" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Re-enter Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input h-6 border-r-2" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex items-center space-x-2 mb-10">
            <Checkbox id="terms" />
            <label htmlFor="terms" className="text-sm font-medium">
              Accept terms and conditions
            </label>
          </div>
          <Button type="submit" className="shad-button_primary">
            {isLoading ? "Loading..." : "Sign Up"}
          </Button>
        </form> */}
      </div>
    </Form>
  );
};

export default RegisterForm;
