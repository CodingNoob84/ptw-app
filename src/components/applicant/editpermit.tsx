"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  getAllProjects,
  getPermitDetails,
  getProjectbyId
} from "@/dbqueries/project";
import { getAllUsers, UserWithReporting } from "@/dbqueries/user";
import { createClient } from "@/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Building,
  Eye,
  Home,
  Layers,
  Loader2,
  MessageSquare,
  Paperclip,
  Tag,
  Upload,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AdditionalAssigneeComponent } from "./add-assignee";

export const EditPermit = ({
  userId,
  permitId,
}: {
  userId: string;
  permitId: string;
}) => {
  console.log("userId", userId, permitId);
  const supabase = createClient();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("details");
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userdata: UserWithReporting | undefined = queryClient.getQueryData([
    "userinfo",
  ]);

  // Data fetching
  const { data: allUsers, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["allusers"],
    queryFn: () => getAllUsers(supabase),
  });

  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getAllProjects(supabase),
  });

  const { data: permitData, isLoading: isLoadingPermit } = useQuery({
    queryKey: ["permit", permitId],
    queryFn: () => getPermitDetails(permitId, supabase),
  });

  const { data: projectData, isLoading: isLoadingProjectDetails } = useQuery({
    queryKey: ["projectDetails", selectedProjectId],
    queryFn: () => getProjectbyId(selectedProjectId, supabase),
    enabled: !!selectedProjectId,
  });

  const [formData, setFormData] = useState({
    projectId: "",
    towerId: "",
    floorId: "",
    unitId: "",
    categoryId: "",
    subcategoryId: "",
    comments: "",
    sa_id: "",
    manager_id: "",
  });

  // Set initial form data when permit data is loaded
  useEffect(() => {
    if (permitData?.permit) {
      const { permit } = permitData;
      setSelectedProjectId(permit.project_id || "");
      setFormData({
        projectId: permit.project_id || "",
        towerId: permit.tower_id || "",
        floorId: permit.floor_id || "",
        unitId: permit.unit_id || "",
        categoryId: permit.category_id || "",
        subcategoryId: permit.subcategory_id || "",
        comments: permit.comments || "",
        sa_id: permit.sa_id || "",
        manager_id: permit.manager_id || "",
      });
    }
  }, [permitData]);

  // Memoized derived data
  const selectedSubcategories = useMemo(() => {
    if (!formData.categoryId || !projectData) return [];
    const category = projectData.categories.find(
      (c) => c.category.id === formData.categoryId
    );
    return category?.subcategories || [];
  }, [formData.categoryId, projectData]);

  const selectedFloors = useMemo(() => {
    if (!formData.towerId || !projectData) return [];
    return projectData.floors.filter(
      (f) => f.floor.tower_id === formData.towerId
    );
  }, [formData.towerId, projectData]);

  const selectedUnits = useMemo(() => {
    if (!formData.floorId || !projectData) return [];
    const floor = projectData.floors.find(
      (f) => f.floor.id === formData.floorId
    );
    return floor?.units || [];
  }, [formData.floorId, projectData]);

  // Set safety accessor and manager IDs when users data loads
  useEffect(() => {
    if (allUsers) {
      const sa = allUsers.find((user) => user.role === "safetyaccessor");
      const manager = allUsers.find((user) => user.role === "manager");

      setFormData((prev) => ({
        ...prev,
        sa_id: sa?.id ?? "",
        manager_id: manager?.id ?? "",
      }));
    }
  }, [allUsers]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };

      // Reset dependent fields when parent field changes
      if (name === "projectId") {
        setSelectedProjectId(value);
        return {
          ...newState,
          towerId: "",
          floorId: "",
          unitId: "",
          categoryId: "",
          subcategoryId: "",
        };
      } else if (name === "towerId") {
        return {
          ...newState,
          floorId: "",
          unitId: "",
        };
      } else if (name === "floorId") {
        return {
          ...newState,
          unitId: "",
        };
      } else if (name === "categoryId") {
        return {
          ...newState,
          subcategoryId: "",
        };
      }
      return newState;
    });
  }, []);

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const newImages = Array.from(e.target.files).map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        }));
        setImages((prev) => [...prev, ...newImages]);
      }
    },
    []
  );

  const removeImage = useCallback((index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        // Update permit
        const { error: updateError } = await supabase
          .from("permits")
          .update({
            project_id: formData.projectId,
            tower_id: formData.towerId,
            floor_id: formData.floorId,
            unit_id: formData.unitId,
            category_id: formData.categoryId,
            subcategory_id: formData.subcategoryId,
            comments: formData.comments,
            sa_id: formData.sa_id,
            manager_id: formData.manager_id,
          })
          .eq("id", permitId);

        if (updateError) {
          throw updateError;
        }

        // Upload new images if any
        if (images.length > 0) {
          const uploadPromises = images.map(async (image) => {
            const fileExt = image.file.name.split(".").pop();
            const fileName = `${permitId}/${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
              .from("permit-attachments")
              .upload(fileName, image.file);

            if (uploadError) {
              throw uploadError;
            }

            // Create attachment record
            const { error: attachmentError } = await supabase
              .from("permit_attachments")
              .insert({
                permit_id: permitId,
                file_name: image.file.name,
                file_path: fileName,
                file_type: image.file.type,
                file_size: image.file.size,
              });

            if (attachmentError) {
              throw attachmentError;
            }
          });

          await Promise.all(uploadPromises);
        }

        queryClient.invalidateQueries({
          queryKey: ["permit", permitId],
        });
        queryClient.invalidateQueries({
          queryKey: ["allpermits", userId],
        });

        toast.success("Permit updated successfully");
        router.push("/dashboard");
      } catch (error) {
        console.error("Error updating permit:", error);
        toast.error("Failed to update permit");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, images, permitId, queryClient, router, supabase, userId]
  );

  // Clean up image previews when component unmounts
  useEffect(() => {
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, [images]);

  const safetyAccessor = useMemo(
    () => allUsers?.find((user) => user.role === "safetyaccessor"),
    [allUsers]
  );

  const manager = useMemo(
    () => allUsers?.find((user) => user.role === "manager"),
    [allUsers]
  );

  const selectedProject = useMemo(
    () => projects?.find((p) => p.id === formData.projectId),
    [formData.projectId, projects]
  );

  const selectedTower = useMemo(
    () => projectData?.towers.find((t) => t.id === formData.towerId),
    [formData.towerId, projectData]
  );

  const selectedFloor = useMemo(
    () => projectData?.floors.find((f) => f.floor.id === formData.floorId),
    [formData.floorId, projectData]
  );

  const selectedUnit = useMemo(
    () => selectedFloor?.units.find((u) => u.id === formData.unitId),
    [formData.unitId, selectedFloor]
  );

  const selectedCategory = useMemo(
    () =>
      projectData?.categories.find(
        (c) => c.category.id === formData.categoryId
      ),
    [formData.categoryId, projectData]
  );

  const selectedSubcategory = useMemo(
    () =>
      selectedCategory?.subcategories.find(
        (s) => s.id === formData.subcategoryId
      ),
    [formData.subcategoryId, selectedCategory]
  );

  if (isLoadingProjects || isLoadingUsers || isLoadingPermit) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.push("/dashboard")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <Card className="max-w-4xl mx-auto">
        <CardHeader className="px-6 py-5">
          <CardTitle className="text-2xl">Edit Permit to Work</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="details">Project Details</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              <TabsContent value="details" className="space-y-6">
                <div className="space-y-5">
                  <div>
                    <Label
                      htmlFor="projectId"
                      className="flex items-center mb-2"
                    >
                      <Building className="mr-2 h-4 w-4" /> Project Name
                    </Label>
                    <Select
                      value={formData.projectId}
                      onValueChange={(value) =>
                        handleSelectChange("projectId", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects?.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {isLoadingProjectDetails ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : projectData ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                          <Label
                            htmlFor="towerId"
                            className="flex items-center mb-2"
                          >
                            <Layers className="mr-2 h-4 w-4" /> Tower
                          </Label>
                          <Select
                            value={formData.towerId}
                            onValueChange={(value) =>
                              handleSelectChange("towerId", value)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select tower" />
                            </SelectTrigger>
                            <SelectContent>
                              {projectData.towers.map((tower) => (
                                <SelectItem key={tower.id} value={tower.id}>
                                  {tower.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label
                            htmlFor="floorId"
                            className="flex items-center mb-2"
                          >
                            <Layers className="mr-2 h-4 w-4" /> Floor
                          </Label>
                          <Select
                            value={formData.floorId}
                            onValueChange={(value) =>
                              handleSelectChange("floorId", value)
                            }
                            disabled={!formData.towerId}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select floor" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedFloors.map((floor) => (
                                <SelectItem
                                  key={floor.floor.id}
                                  value={floor.floor.id}
                                >
                                  Floor {floor.floor.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label
                            htmlFor="unitId"
                            className="flex items-center mb-2"
                          >
                            <Home className="mr-2 h-4 w-4" /> Unit
                          </Label>
                          <Select
                            value={formData.unitId}
                            onValueChange={(value) =>
                              handleSelectChange("unitId", value)
                            }
                            disabled={!formData.floorId}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedUnits.map((unit) => (
                                <SelectItem key={unit.id} value={unit.id}>
                                  Unit {unit.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                          <Label
                            htmlFor="categoryId"
                            className="flex items-center mb-2"
                          >
                            <Tag className="mr-2 h-4 w-4" /> Category
                          </Label>
                          <Select
                            value={formData.categoryId}
                            onValueChange={(value) =>
                              handleSelectChange("categoryId", value)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {projectData.categories.map((cat) => (
                                <SelectItem
                                  key={cat.category.id}
                                  value={cat.category.id}
                                >
                                  {cat.category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label
                            htmlFor="subcategoryId"
                            className="flex items-center mb-2"
                          >
                            <Tag className="mr-2 h-4 w-4" /> Subcategory
                          </Label>
                          <Select
                            value={formData.subcategoryId}
                            onValueChange={(value) =>
                              handleSelectChange("subcategoryId", value)
                            }
                            disabled={!formData.categoryId}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={
                                  formData.categoryId
                                    ? "Select subcategory"
                                    : "Select category first"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedSubcategories.map((subcat) => (
                                <SelectItem key={subcat.id} value={subcat.id}>
                                  {subcat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="comments"
                          className="flex items-center mb-2"
                        >
                          <MessageSquare className="mr-2 h-4 w-4" /> Comments
                        </Label>
                        <Textarea
                          id="comments"
                          name="comments"
                          value={formData.comments}
                          onChange={handleInputChange}
                          placeholder="Add any additional details or requirements"
                          rows={4}
                          className="resize-none"
                        />
                      </div>

                      <div>
                        <Label className="flex items-center mb-2">
                          <User className="mr-2 h-4 w-4" /> Safety Accessor
                          Person
                        </Label>
                        <div>
                          {safetyAccessor?.firstname} {safetyAccessor?.lastname}
                        </div>
                        <input
                          type="hidden"
                          name="sa_id"
                          value={safetyAccessor?.id || ""}
                        />
                      </div>

                      <div>
                        <Label className="flex items-center mb-2">
                          <User className="mr-2 h-4 w-4" /> Manager
                        </Label>
                        <div>
                          {manager?.firstname} {manager?.lastname}
                        </div>
                        <input
                          type="hidden"
                          name="manager_id"
                          value={manager?.id || ""}
                        />
                      </div>

                      <AdditionalAssigneeComponent />
                    </>
                  ) : null}
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="button"
                    onClick={() => setActiveTab("attachments")}
                    className="bg-amber-600 hover:bg-amber-700"
                    disabled={!formData.projectId}
                  >
                    Next: Attachments
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="attachments" className="space-y-6">
                <div className="space-y-5">
                  <Label className="flex items-center mb-2">
                    <Paperclip className="mr-2 h-4 w-4" /> Attachments
                  </Label>

                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Input
                      type="file"
                      id="images"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                    />
                    <Label
                      htmlFor="images"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="h-12 w-12 text-muted-foreground mb-3" />
                      <span className="text-lg font-medium">Upload Images</span>
                      <span className="text-sm text-muted-foreground mt-2">
                        Drag and drop or click to browse
                      </span>
                    </Label>
                  </div>

                  {images.length > 0 && (
                    <div className="space-y-3 mt-6">
                      <h3 className="text-sm font-medium">
                        Uploaded Images ({images.length})
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-md overflow-hidden border bg-muted">
                              <Image
                                src={image.preview}
                                alt={`Attachment ${index + 1}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("details")}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className="bg-amber-600 hover:bg-amber-700"
                    //disabled={images.length === 0}
                  >
                    Next: Preview
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium flex items-center">
                      <Eye className="mr-2 h-5 w-5" /> Preview Permit Request
                    </h3>
                  </div>

                  <div className="border rounded-lg p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Project Name
                        </h4>
                        <p className="font-medium">
                          {selectedProject?.name || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Location
                        </h4>
                        <p className="font-medium">
                          {selectedTower?.name || ""}
                          {selectedFloor
                            ? `, Floor ${selectedFloor.floor.name}`
                            : ""}
                          {selectedUnit ? `, Unit ${selectedUnit.name}` : ""}
                          {!formData.towerId &&
                            !formData.floorId &&
                            !formData.unitId &&
                            "Not specified"}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Category
                        </h4>
                        <p className="font-medium">
                          {selectedCategory?.category.name || "Not specified"}
                          {selectedSubcategory
                            ? ` - ${selectedSubcategory.name}`
                            : ""}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Assigned To
                        </h4>
                        <p className="font-medium">
                          {userdata?.reporting_to.map((user) => (
                            <span key={user.id}>
                              {user.firstname} {user.lastname}{" "}
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>

                    {formData.comments && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Comments
                        </h4>
                        <p className="whitespace-pre-line">
                          {formData.comments}
                        </p>
                      </div>
                    )}

                    {images.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Attachments ({images.length})
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-3">
                          {images.map((image, index) => (
                            <div
                              key={index}
                              className="aspect-square rounded-md overflow-hidden border bg-muted"
                            >
                              <Image
                                src={image.preview}
                                alt={`Attachment ${index + 1}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("attachments")}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />{" "}
                        {`Updating...`}
                      </>
                    ) : (
                      "Update Permit Request"
                    )}
                  </Button>
                </div>
              </TabsContent>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
