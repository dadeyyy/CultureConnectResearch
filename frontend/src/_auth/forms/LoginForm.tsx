import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { login } from "@/lib/validation";
import { z } from "zod";
import toast from "react-hot-toast";
import { useUserContext } from "@/context/AuthContext";

const LoginForm = () => {
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useUserContext();
  const form = useForm<z.infer<typeof login>>({
    resolver: zodResolver(login),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof login>) => {
    try {
      const response = await fetch("http://localhost:8000/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include",
      });

      if (response.ok) {
        const { user } = await response.json();
        toast.success("Successfully logged in");

        // Update the AuthContext with the user information from the login response
        setUser({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          imageUrl: user.imageUrl,
          bio: "Bio means life",
          role: user.role,
          province: user.province,
        });

        setIsAuthenticated(true);
        localStorage.setItem("currentUser", JSON.stringify(user));

        return navigate("/home");
      } else {
        console.error("Login failed");
        toast.error("Failed to sign in");
        return navigate("/signin");
      }
    } catch (error) {
      console.error("Error submitting login:", error);
    }
  };

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
        {/* <div className="flex flex-center flex-col">
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
        </div> */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-1 w-full mt-1">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your email here"
                    className="shad-input h-10 border-r-2"
                    {...field}
                  />
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
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password here"
                    className="shad-input h-10 border-r-2 mt-5"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <div className="flex flex-1 items-center m-auto mt-5">
            <Button type="submit" className="shad-button_primary w-20">
              Login
            </Button>
          </div>
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
