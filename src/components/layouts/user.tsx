"use client";
import { getInitials } from "@/lib/utils";
import { createClient } from "@/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { LogOut, Settings, Shield, User } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { logout } from "@/app/(auth)/_actions";
import { getUserWithReporting } from "@/dbqueries/user";
import { useRouter } from "next/navigation";

export const UserComponent = () => {
  const router = useRouter();
  const supabase = createClient();

  const { data } = useQuery({
    queryKey: ["userinfo"],
    queryFn: () => getUserWithReporting(supabase),
  });

  const user = data?.user;

  const handleLogOut = () => {
    logout();
    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src="/images/noavatar.jpg"
              alt={user?.firstname || ""}
            />
            <AvatarFallback>
              {getInitials(user?.firstname || "")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.firstname ?? "Loading..."}
            </p>
            <p className="text-xs leading-none text-muted-foreground capitalize">
              {user?.role ?? "User"}
              {user?.role === "admin" && (
                <span className="inline-flex items-center ml-1">
                  <Shield className="h-3 w-3 text-blue-500" />
                </span>
              )}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={"/"}>
            <User className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Button variant={"ghost"} onClick={handleLogOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
