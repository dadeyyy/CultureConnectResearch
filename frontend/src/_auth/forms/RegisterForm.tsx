import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const RegisterForm = () => {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const handleFormSubmit = async () => {
    // Prepare the form data
    const formData = {
      firstName,
      lastName,
      username,
      birthdate,
      email,
      password,
      confirmPassword,
      verificationCode,
    };

    console.log("Form Data:", formData);
    // try {
    //   // Make a POST request to your backend API endpoint
    //   const response = await fetch("YOUR_BACKEND_API_ENDPOINT", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(formData),
    //   });

    //   // Handle the response from the backend
    //   if (response.ok) {
    //     console.log("Registration successful!");
    //     console.log(formData);
    //   } else {
    //     console.error("Registration failed. Please try again.");
    //   }
    // } catch (error) {
    //   console.error("An error occurred:", error);
    // }
  };

  const stepOne = () => {
    return (
      <>
        <DialogContent className="w-1/2">
          <DialogHeader>
            <DialogTitle>Create your account.</DialogTitle>
            <DialogDescription>Step 1 out of 3.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 items-center gap-4">
            <div>
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Input
                id="firstName"
                onChange={(e) => setFirstName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-right">
                Last Name
              </Label>
              <Input
                id="lastName"
                onChange={(e) => setLastName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="username" className="text-left">
                Username
              </Label>
              <Input
                id="username"
                onChange={(e) => setUsername(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div>
              <Label htmlFor="bday" className="text-left">
                Date of Birth
              </Label>
              <Input
                id="bday"
                type="date"
                onChange={(e) => setBirthdate(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setStep(step + 1)}>
              Next
            </Button>
          </DialogFooter>
        </DialogContent>
      </>
    );
  };

  const stepTwo = () => {
    return (
      <>
        <DialogContent className="w-1/2">
          <DialogHeader>
            <DialogTitle>Create your account.</DialogTitle>
            <DialogDescription>Step 2 out of 3.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="email" className="text-left">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-left">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-left">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setStep(step - 1)}>
              Back
            </Button>
            <Button type="button" onClick={() => setStep(step + 1)}>
              Next
            </Button>
          </DialogFooter>
        </DialogContent>
      </>
    );
  };

  const stepThree = () => {
    return (
      <>
        <DialogContent className="w-1/2">
          <DialogHeader>
            <DialogTitle>Create your account.</DialogTitle>
            <DialogDescription>Step 3 out of 3.</DialogDescription>
          </DialogHeader>
          <h1>We sent you a code.</h1>
          <p>Enter it below to verify {email}</p>
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="code" className="text-left">
                Verification Code
              </Label>
              <Input id="text" type="email" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setStep(step - 1)}>
              Back
            </Button>
            <Button type="button" onClick={handleFormSubmit}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return stepOne();
      case 2:
        return stepTwo();
      case 3:
        return stepThree();
      default:
        return null;
    }
  };

  return (
    <div className="sm:w-420 flex-center flex-col">
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
            <Button className="shad-button_primary bg-blue-500 hover:bg-blue-700">
              Create Account
            </Button>
          </DialogTrigger>
          {renderStep()}
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
          <Link to="/login" className="text-blue-700 text-small-semibold ml-1">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
