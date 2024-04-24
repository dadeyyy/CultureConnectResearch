import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { registration } from '@/lib/validation';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://thtnjmmhcbvokonvsfsr.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRodG5qbW1oY2J2b2tvbnZzZnNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ4OTUxMDAsImV4cCI6MjAyMDQ3MTEwMH0.GON_tySFWBpm6MZtN-_XnzC6vbb9E2SuMwbxcHfBip4';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const RegisterForm = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof registration>>({
    resolver: zodResolver(registration),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  const [page, setPage] = useState(1);

  const [checkedInterests, setCheckedInterests] = useState<string[]>([]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id } = event.target;
    if (event.target.checked) {
      setCheckedInterests((prevInterests) => [...prevInterests, id]);
    } else {
      setCheckedInterests((prevInterests) =>
        prevInterests.filter((interest) => interest !== id)
      );
    }
  };

  const sendOTP = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: 'https://example.com/welcome',
        },
      });
      console.log(data);
      if (error) {
        console.error('Error sending OTP:', error.message);
      } else {
        console.log('OTP sent successfully');
      }
    } catch (error) {
      console.error('Error sending OTP:');
    }
  };

  // BACKEND SERVER SUBMISSION
  const onSubmit = async (values: z.infer<typeof registration>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    if (page === 1) {
      sendOTP(values.email, values.password);
      setPage(2);
    } else if (page === 2) {
      const { confirmPassword, ...signUpValues } = values;
      const updatedValues = {
        ...signUpValues,
        interest: checkedInterests,
      };

      try {
        const response = await fetch('http://localhost:8000/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedValues),
        });
        const data = await response.json();
        if (response.ok) {
          toast.success('Successfully created user!');
          setPage(1);
          return navigate('/signin');
        } else {
          toast.error(`${data.error}`);
        }
      } catch (error) {
        toast.error('Failed to sign-up');
        return navigate('/signup');
      }
    }
  };

  return (
    <div className="sm:w-420 items-center flex-col">
      <div className="flex justify-center items-center">
        <img
          src="/assets/images/logo-2.svg"
          alt="logo"
          className="h-20 w-100"
        />
      </div>
      <div className="text-center sm:text-center sm:w-100 text-xl ">
        <p className="font-bold h-5 text-blue-800">
          Connecting different cultures
        </p>
        <p className="font-bold text-red-700">in the Philippines</p>
      </div>
      <h2 className="font-bold pt-5 sm:py-5">Sign up to CultureConnect</h2>
      <div className="flex flex-center flex-col">
        {/* <Button
          variant="outline"
          className="group hover:bg-blue-500 hover:text-white active:border-blue-500 active:bg-white active:text-black"
        >
          <img src="/assets/icons/google-icon.svg" className="h-5 mr-5" />
          Sign up with Google
        </Button>
        <div className="text-center sm:text-center sm:w-100 m-3">
          <p className="font-bold">or</p>
        </div> */}

        {/* DIALOG BOX FOR CREATING AN ACCOUNT */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="shad-button_primary">Create Account</Button>
          </DialogTrigger>
          <Form {...form}>
            <div>
              <DialogContent className="w-1/2 bg-white">
                <DialogHeader>
                  <DialogTitle>Sign up to CultureConnect.</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  {page === 1 && (
                    <>
                      <div className="grid grid-cols-2 items-center gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="Juan"
                                  {...field}
                                />
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
                                <Input
                                  type="text"
                                  placeholder="Dela Cruz"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="shad-form_message" />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="juandelacruz1"
                                {...field}
                              />
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
                              <Input
                                type="email"
                                placeholder="example@test.com"
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
                              <Input
                                type="password"
                                placeholder="Re-enter your password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {page === 2 && (
                    <>
                      <div className="mb-3">Select at least 3 interests</div>
                      <div className="flex flex-wrap gap-2 w-full">
                        {interests.map((interest) => (
                          <div
                            key={interest.value}
                            className={`flex gap-2 py-1 px-5 rounded-xl border ${
                              checkedInterests.includes(interest.value)
                                ? 'border-blue-500'
                                : 'border-gray-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              id={interest.value}
                              onChange={handleCheckboxChange}
                            />
                            <label
                              htmlFor={interest.value}
                              className="text-base font-medium"
                            >
                              {interest.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  <DialogFooter>
                    <Button
                      type="button"
                      className={`my-5 ${page === 1 ? 'hidden' : 'block'}`}
                      onClick={() => {
                        setPage(page - 1);
                      }}
                    >
                      Back
                    </Button>
                    <Button type="submit" className="my-5">
                      {page === 1 ? 'Next' : 'Submit'}
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
            By creating an account, you agree to the Terms of Service and <br />{' '}
            Privacy Policy, including Cookie Use.
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

const interests = [
  { label: 'Culture', value: 'culture' },
  { label: 'Festivals', value: 'festivals' },
  { label: 'Fiesta', value: 'fiesta' },
  { label: 'Art', value: 'art' },
  { label: 'Music', value: 'music' },
  { label: 'Food', value: 'food' },
  { label: 'History', value: 'history' },
  { label: 'People', value: 'People' },
  { label: 'Language', value: 'language' },
  { label: 'Traditions', value: 'traditions' },
  { label: 'Religion', value: 'religion' },
  { label: 'Dance', value: 'dance' },
  { label: 'Architecture', value: 'architecture' },
];

export default RegisterForm;
