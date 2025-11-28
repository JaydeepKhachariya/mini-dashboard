import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  IconPlus,
  IconPencil,
  IconTrash,
  IconCheck,
  IconX,
} from "@tabler/icons-react";

export const Route = createFileRoute("/dashboard/projects")({
  component: ProjectsPage,
});

const STATUS_OPTIONS = [
  { value: "active", label: "Active", color: "bg-green-100 text-green-800" },
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "completed",
    label: "Completed",
    color: "bg-blue-100 text-blue-800",
  },
  { value: "on-hold", label: "On Hold", color: "bg-gray-100 text-gray-800" },
];

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [nextId, setNextId] = useState(1);

  // Create dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Form state for creating new project
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "active",
  });

  // Side drawer editing state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    status: "",
  });

  // Inline editing state
  const [inlineEditId, setInlineEditId] = useState(null);
  const [inlineEditData, setInlineEditData] = useState({});

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Handle creating new project
  const handleCreateProject = (e) => {
    e.preventDefault();
    if (newProject.name.trim()) {
      setProjects([
        ...projects,
        {
          id: nextId,
          ...newProject,
          createdAt: new Date().toISOString(),
        },
      ]);
      setNextId(nextId + 1);
      setNewProject({ name: "", description: "", status: "active" });
      setCreateDialogOpen(false);
    }
  };

  // Side Drawer Edit Functions
  const openEditDrawer = (project) => {
    setEditingProject(project);
    setEditForm({
      name: project.name,
      description: project.description,
      status: project.status,
    });
    setDrawerOpen(true);
  };

  const handleDrawerEdit = () => {
    if (editingProject) {
      setProjects(
        projects.map((project) =>
          project.id === editingProject.id
            ? {
                ...project,
                name: editForm.name,
                description: editForm.description,
                status: editForm.status,
              }
            : project,
        ),
      );
      setDrawerOpen(false);
      setEditingProject(null);
    }
  };

  // Inline Edit Functions
  const startInlineEdit = (project) => {
    setInlineEditId(project.id);
    setInlineEditData({
      name: project.name,
      description: project.description,
      status: project.status,
    });
  };

  const saveInlineEdit = () => {
    if (inlineEditId !== null) {
      setProjects(
        projects.map((project) =>
          project.id === inlineEditId
            ? {
                ...project,
                ...inlineEditData,
              }
            : project,
        ),
      );
      setInlineEditId(null);
      setInlineEditData({});
    }
  };

  const cancelInlineEdit = () => {
    setInlineEditId(null);
    setInlineEditData({});
  };

  // Delete Functions
  const confirmDelete = (project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (projectToDelete) {
      setProjects(
        projects.filter((project) => project.id !== projectToDelete.id),
      );
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    return (
      STATUS_OPTIONS.find((s) => s.value === status)?.color ||
      "bg-gray-100 text-gray-800"
    );
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">
              Projects Management
            </h1>
            <p className="text-slate-600">
              Create and manage your projects efficiently
            </p>
          </div>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
          >
            <IconPlus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        </div>

        {/* Projects List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">
              Projects List
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {projects.length} {projects.length === 1 ? "project" : "projects"}{" "}
              total
            </p>
          </div>

          {projects.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <IconPlus className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-500 text-lg">No projects yet</p>
              <p className="text-slate-400 text-sm mt-1">
                Create your first project using the form above
              </p>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
              <Table>
                <TableHeader className="sticky top-0 bg-gradient-to-r from-slate-50 to-blue-50 z-10">
                  <TableRow className="border-b-2 border-slate-200 hover:bg-slate-50">
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Description</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow
                      key={project.id}
                      className="hover:bg-blue-50/50 transition-colors border-b border-slate-100"
                    >
                      {/* Name Cell */}
                      <TableCell className="font-medium">
                        {inlineEditId === project.id ? (
                          <Input
                            value={inlineEditData.name || ""}
                            onChange={(e) =>
                              setInlineEditData({
                                ...inlineEditData,
                                name: e.target.value,
                              })
                            }
                            className="h-8"
                            autoFocus
                          />
                        ) : (
                          <span className="text-slate-900">{project.name}</span>
                        )}
                      </TableCell>

                      {/* Description Cell */}
                      <TableCell className="max-w-md">
                        {inlineEditId === project.id ? (
                          <Textarea
                            value={inlineEditData.description || ""}
                            onChange={(e) =>
                              setInlineEditData({
                                ...inlineEditData,
                                description: e.target.value,
                              })
                            }
                            className="h-20 resize-none"
                            rows={2}
                          />
                        ) : (
                          <span className="text-slate-600 line-clamp-2">
                            {project.description || "No description"}
                          </span>
                        )}
                      </TableCell>

                      {/* Status Cell */}
                      <TableCell>
                        {inlineEditId === project.id ? (
                          <Select
                            value={inlineEditData.status}
                            onValueChange={(value) =>
                              setInlineEditData({
                                ...inlineEditData,
                                status: value,
                              })
                            }
                          >
                            <SelectTrigger className="h-8 w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_OPTIONS.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}
                          >
                            {
                              STATUS_OPTIONS.find(
                                (s) => s.value === project.status,
                              )?.label
                            }
                          </span>
                        )}
                      </TableCell>

                      {/* Actions Cell */}
                      <TableCell className="text-right">
                        {inlineEditId === project.id ? (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={saveInlineEdit}
                              className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0"
                            >
                              <IconCheck className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelInlineEdit}
                              className="h-8 w-8 p-0"
                            >
                              <IconX className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startInlineEdit(project)}
                              className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors"
                              title="Inline Edit"
                            >
                              <IconPencil className="h-4 w-4 mr-1" />
                              Quick Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditDrawer(project)}
                              className="hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-colors"
                              title="Edit in Drawer"
                            >
                              <IconPencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => confirmDelete(project)}
                              className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
                            >
                              <IconTrash className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Create Project Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent">
              Create New Project
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new project.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateProject} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-name">Project Name *</Label>
              <Input
                id="create-name"
                placeholder="Enter project name"
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({ ...newProject, name: e.target.value })
                }
                required
                className="bg-white border-slate-200 focus:border-indigo-400 focus:ring-indigo-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-description">Description</Label>
              <Textarea
                id="create-description"
                placeholder="Enter project description"
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
                rows={3}
                className="bg-white border-slate-200 focus:border-indigo-400 focus:ring-indigo-400 resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-status">Status</Label>
              <Select
                value={newProject.status}
                onValueChange={(value) =>
                  setNewProject({ ...newProject, status: value })
                }
              >
                <SelectTrigger className="bg-white border-slate-200 focus:border-indigo-400 focus:ring-indigo-400">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
              >
                <IconPlus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent">
              Edit Project
            </SheetTitle>
            <SheetDescription>
              Make changes to the project information below.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Project Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                placeholder="Enter project name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                placeholder="Enter project description"
                rows={4}
                className="resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(value) =>
                  setEditForm({ ...editForm, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDrawerEdit}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
            >
              Save Changes
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              project{" "}
              <span className="font-semibold text-slate-900">
                {projectToDelete?.name}
              </span>{" "}
              and remove all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
