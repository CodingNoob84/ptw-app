"use client";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
    getPermitDetails
} from "@/dbqueries/project";
import { createClient } from "@/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import { Attachments } from "./attachments";
import { BottomContent } from "./bottom-content";
import { PermitTimeline } from "./permit-timeline";



export const PermitDetailsPage = ({
  userId,
  permitId,
}: {
  userId: string;
  permitId: string;
}) => {
  const supabase = createClient();

  const { data } = useQuery({
    queryKey: ["permit", permitId],
    queryFn: () => getPermitDetails(permitId, supabase),
  });
  console.log("permit", data);
  const [activeTab, setActiveTab] = useState("details");

  const getUserById = (userId: string) => {
    return data?.users.find((user) => user.id == userId);
  };


  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <CardTitle className="text-2xl">
            {data?.permit.project_name}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Permit ID: {data?.permit.id}
          </p>
        </div>
        <Badge className="bg-amber-500">Pending Review</Badge>
      </CardHeader>
      <CardContent>
        {data?.statushistory && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Permit Timeline</h3>
            <PermitTimeline statushistory={data?.statushistory} />
          </div>
        )}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Location
                </h3>
                <p className="font-medium">
                  Tower {data?.permit.tower_name}, Floor{" "}
                  {data?.permit.floor_name}, Unit {data?.permit?.unit_name}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Category
                </h3>
                <p className="font-medium">
                  {data?.permit?.category_name} -{" "}
                  {data?.permit?.subcategory_name}
                </p>
              </div>
              {/* Add the additional assignees section to the details tab */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Created By
                </h3>
                <p className="font-medium">
                  {getUserById(data?.permit?.created_by ?? "")?.fullname}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Created On
                </h3>
                <p className="font-medium">
                  {format(data?.permit?.updated_at ?? "", "PPpp")}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Applicant Comments
              </h3>
              <div className="mt-2 p-4 bg-muted rounded-md">
                <p className="whitespace-pre-line">{data?.permit?.comments}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="attachments" className="space-y-6">
            <Attachments />
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-end">
        <BottomContent
          permitId={data?.permit.id}
          userId={userId}
          statusHistory={data?.statushistory}
          allusers={data?.users}
        />
      </CardFooter>
    </Card>
  );
};
