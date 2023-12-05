import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { login } from "@/lib/validation";
import { z } from "zod";

const LoginForm = () => {
  const form = useForm<z.infer<typeof login>>({
    resolver: zodResolver(login),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof login>) {
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
                <FormMessage />
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
            <Link to="/signup" className="text-blue-700 text-small-semibold ml-1 ">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default LoginForm;
