import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Dashboard from "./components/local/dashboard";
import Employees from "./components/local/employees";
import Items from "./components/local/items";
import Tables from "./components/local/tables";
import { Toaster } from "./components/ui/toaster";
import Header from "./components/local/header";
import { Button } from "./components/ui/button";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./components/ui/form";
import { Input } from "./components/ui/input";
import { env } from "./config";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginPage, setLoginPage] = useState(true);

  const router = createBrowserRouter([
    {
      path: "/",
      Component: Dashboard,
    },
    {
      path: "/employees",
      Component: Employees,
    },
    {
      path: "/items",
      Component: Items,
    },
    {
      path: "/tables",
      Component: Tables,
    },
  ]);

  const setAuthenticated = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const toggleLoginPage = useCallback(() => {
    setLoginPage(!isLoginPage);
  }, [isLoginPage]);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") ?? "{}");
      if (user && user.email) {
        setAuthenticated();
      }
    } catch (error) {
      console.log(error);
    }
  }, [setAuthenticated]);

  return (
    <>
      {!isAuthenticated ? (
        isLoginPage ? (
          <LoginComponent
            setAuthenticated={setAuthenticated}
            toggleLoginPage={toggleLoginPage}
          ></LoginComponent>
        ) : (
          <SignupComponent toggleLoginPage={toggleLoginPage}></SignupComponent>
        )
      ) : (
        <>
          <Header></Header>

          <div className="ml-64 p-2">
            <RouterProvider router={router}></RouterProvider>
          </div>
          <Toaster></Toaster>
        </>
      )}
    </>
  );
}

interface AddLoginComponentProps {
  setAuthenticated: () => void;
  toggleLoginPage: () => void;
}

function LoginComponent(props: AddLoginComponentProps) {
  const form = useForm();

  const onLogin = useCallback(async () => {
    const email = form.getValues().email;
    const password = form.getValues().password;
    const res = await axios.post(`${env.SERVER_URL}/api/Employees/Login`, {
      email,
      password,
    });

    console.log(JSON.stringify(res.data));

    localStorage.setItem("user", JSON.stringify(res.data));
    props.setAuthenticated();
  }, [form, props]);

  return (
    <>
      <Card className="w-[350px] mx-auto mt-52">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Email" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit" onClick={onLogin}>
            Submit
          </Button>
          <Button type="button" variant="link" onClick={props.toggleLoginPage}>
            signup
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

interface AddSignupComponentProps {
  toggleLoginPage: () => void;
}

function SignupComponent(props: AddSignupComponentProps) {
  const form = useForm();

  const onLogin = useCallback(async () => {
    const email = form.getValues().email;
    const password = form.getValues().password;
    const name = form.getValues().name;
    const contact = form.getValues().contact;
    await axios.post(`${env.SERVER_URL}/api/Employees/signup`, {
      email,
      password,
      name,
      contact,
    });
    props.toggleLoginPage();
  }, [form, props]);

  return (
    <>
      <Card className="w-[350px] mx-auto mt-52">
        <CardHeader>
          <CardTitle>Signup</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Name" {...field} />
                  </FormControl>
                  <FormMessage />
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
                    <Input placeholder="Enter Email" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Contact" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit" onClick={onLogin}>
            Submit
          </Button>
          <Button type="button" variant="link" onClick={props.toggleLoginPage}>
            login
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

export default App;
