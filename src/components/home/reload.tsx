"use client";
import { Button } from "../ui/button";

export const ReLoadButton = () => {
  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() => window.location.reload()}
    >
      Check Status
    </Button>
  );
};
