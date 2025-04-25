"use client";

import { useState } from "react";
import { Users, X } from "lucide-react";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Assignee = {
  value: string;
  label: string;
};

const allAssignees: Assignee[] = [
  { value: "john.smith@example.com", label: "John Smith" },
  { value: "sarah.johnson@example.com", label: "Sarah Johnson" },
  { value: "mike.brown@example.com", label: "Mike Brown" },
  { value: "emma.davis@example.com", label: "Emma Davis" },
  { value: "robert.chen@example.com", label: "Robert Chen" },
];

export const AdditionalAssigneeComponent = () => {
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);

  const toggleAdditionalAssignee = (email: string) => {
    setSelectedAssignees((prev) =>
      prev.includes(email) ? prev.filter((a) => a !== email) : [...prev, email]
    );
  };

  return (
    <div>
      <Label htmlFor="additionalAssignees" className="flex items-center mb-2">
        <Users className="mr-2 h-4 w-4" /> Additional Assignees
      </Label>
      <div className="border rounded-md p-2">
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedAssignees.length > 0 ? (
            selectedAssignees.map((assigneeEmail) => {
              const assignee = allAssignees.find(
                (eng) => eng.value === assigneeEmail
              );
              return (
                <Badge
                  key={assigneeEmail}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {assignee?.label || assigneeEmail}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => toggleAdditionalAssignee(assigneeEmail)}
                  />
                </Badge>
              );
            })
          ) : (
            <div className="text-sm text-muted-foreground">
              No additional assignees selected
            </div>
          )}
        </div>
        <Select onValueChange={toggleAdditionalAssignee}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Add assignee" />
          </SelectTrigger>
          <SelectContent>
            {allAssignees
              .filter((eng) => !selectedAssignees.includes(eng.value))
              .map((engineer) => (
                <SelectItem key={engineer.value} value={engineer.value}>
                  {engineer.label}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
