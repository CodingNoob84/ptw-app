import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Permit
} from "@/dbqueries/project";
import { format } from "date-fns";
import {
  Calendar,
  FileText,
  MapPin,
  Tag,
  User
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export const PermitCard = ({ permit }: { permit: Permit }) => {
  const getStatusColor = (status: string) => {
    if (status.includes("requested")) return "bg-blue-500";
    if (status.includes("pending")) return "bg-yellow-500";
    if (status.includes("approved")) return "bg-green-500";
    if (status.includes("rejected")) return "bg-red-500";
    return "bg-gray-500";
  };

  // const getStatusIcon = (status: string) => {
  //   if (status.includes("requested"))
  //     return <SendHorizontal className="h-5 w-5 text-blue-500" />;
  //   if (status.includes("pending"))
  //     return <Clock className="h-5 w-5 text-amber-500" />;
  //   if (status.includes("approved"))
  //     return <CheckCircle className="h-5 w-5 text-green-500" />;
  //   if (status.includes("rejected"))
  //     return <XCircle className="h-5 w-5 text-red-500" />;
  //   return <Clock className="h-5 w-5 text-gray-500" />;
  // };

  const getBorderColor = (status: string) => {
    if (status.includes("pending")) return "border-l-amber-500";
    if (status.includes("requested")) return "border-l-blue-400";
    if (status.includes("approved")) return "border-l-green-500";
    if (status.includes("rejected")) return "border-l-red-500";
    return "border-l-gray-500";
  };

  return (
    <Card
      className={`overflow-hidden max-w-2xl mx-auto shadow-sm hover:shadow-md transition-shadow border-l-6 ${getBorderColor(
        permit.current_status
      )}`}
    >
      <CardHeader className="pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="space-y-1">
          <CardTitle className="text-xl flex items-center">
            <FileText className={`mr-2 h-5 w-5 `} />
            {permit.project_name}
          </CardTitle>
          <p className="text-sm text-muted-foreground font-medium">
            {permit.permit_id}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {permit.status_history.map((s) => (
            <Badge key={s.stage} className={`${getStatusColor(s.status_msg)}`}>
              {s.comments}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">
                Tower {permit.tower_name}, Floor {permit.floor_name}, Unit{" "}
                {permit.unit_name}
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <Tag className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">
                {permit.category_name} - {permit.subcategory_name}
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <User className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Created by</p>
              <p className="font-medium">{permit.created_by_fullname}</p>
            </div>
          </div>
          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Created On</p>
              <p className="font-medium">{format(permit.created_at, "PPpp")}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/30 p-2">
        <div className="w-full flex flex-col gap-4 sm:flex-row">
          <div className="flex flex-row justify-end items-center sm:flex-1">
            <Link href={`/dashboard/${permit.permit_id}`}>
              <Button variant="outline" size="sm">
                <FileText className="mr-1 h-4 w-4" /> View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
