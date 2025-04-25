"use server";

import { createClient } from "@/supabase/server";

export type SignUpType = {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
};

export type SignInType = {
  email: string;
  password: string;
};

export const signUp = async ({ InputData }: { InputData: SignUpType }) => {
  const supabase = await createClient();
  try {
    console.log("input", InputData);
    // Step 1: Check if the user already exists by email
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("*")
      .eq("email", InputData.email)
      .single();

    console.log("existinguser", existingUser, checkError);

    if (existingUser) {
      return {
        success: false,
        message: "User with this email already exists.",
      };
    }

    // Step 2: Sign up the user via Supabase auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email: InputData.email,
        password: InputData.password,
        options: {
          data: {
            display_name: `${InputData.firstName} ${InputData.lastName}`,
          },
        },
      }
    );
    console.log("signUpError", signUpError);

    if (signUpError) {
      return {
        success: false,
        message: "Try again, error occurs while creating user",
      };
    }
    console.log("signUpData", signUpData);
    if (signUpData.user) {
      // Step 3: Insert new user into the "users" table after successful sign-up
      const { data, error } = await supabase.from("users").insert({
        firstname: InputData.firstName,
        lastname: InputData.lastName,
        email: InputData.email,
        password: InputData.password,
        authid: signUpData.user.id,
      });

      console.log("insert-users", data, error);

      if (error) {
        return {
          success: false,
          message: "Try again, error occurs while creating user",
        };
      }
    }

    return { success: true, message: "User signed up successfully" };
  } catch (error) {
    console.log("error",error)
    return { success: false, message: "An unknown error occurred." };
  }
};

export const signIn = async ({ InputData }: { InputData: SignInType }) => {
  console.log("input", InputData);
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: InputData.email,
      password: InputData.password,
    });
    console.log("data", data);
    console.log("error", error);
    if (error) {
      console.log("error", error);
      return { success: false, message: "Error while login, Try again!" };
    }

    return { success: true, message: "User has been logged in successfully" };
  } catch (error) {
    console.log("error", error);
    return { success: false, message: "An unknown error occurred." };
  }
};

export const logout = async () => {
  const supabase = await createClient();
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log("error", error);
      return { success: false, message: error.message };
    }

    return { success: true, message: "User logged out successfully" };
  } catch (error) {
    console.log("error", error);
    return { success: false, message: error || "An unknown error occurred." };
  }
};
