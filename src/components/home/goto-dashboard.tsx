import Link from "next/link";
import { Button } from "../ui/button";

export const GoToDashboard = () => {
  return (
    <Button className="w-full" asChild>
      <Link href="/dashboard">Go to Dashboard</Link>
    </Button>
  );
};
