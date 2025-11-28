import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  IconSearch,
  IconPencil,
  IconTrash,
  IconCheck,
  IconX,
  IconArrowsSort,
} from "@tabler/icons-react";

export const Route = createFileRoute("/dashboard/users")({
  component: UsersPage,
});

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Modal editing state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    company: "",
  });

  // Inline editing state
  const [inlineEditId, setInlineEditId] = useState(null);
  const [inlineEditData, setInlineEditData] = useState({});

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users",
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtered and sorted users
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter((user) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.company.name.toLowerCase().includes(searchLower)
      );
    });

    filtered.sort((a, b) => {
      let aValue;
      let bValue;

      if (sortField === "company") {
        aValue = a.company.name.toLowerCase();
        bValue = b.company.name.toLowerCase();
      } else {
        aValue = a[sortField].toLowerCase();
        bValue = b[sortField].toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    return filtered;
  }, [users, searchQuery, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Modal Edit Functions
  const openEditModal = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      company: user.company.name,
    });
    setEditModalOpen(true);
  };

  const handleModalEdit = () => {
    if (editingUser) {
      setUsers(
        users.map((user) =>
          user.id === editingUser.id
            ? {
                ...user,
                name: editForm.name,
                email: editForm.email,
                company: { name: editForm.company },
              }
            : user,
        ),
      );
      setEditModalOpen(false);
      setEditingUser(null);
    }
  };

  // Inline Edit Functions
  const startInlineEdit = (user) => {
    setInlineEditId(user.id);
    setInlineEditData({
      name: user.name,
      email: user.email,
      company: { name: user.company.name },
    });
  };

  const saveInlineEdit = () => {
    if (inlineEditId !== null) {
      setUsers(
        users.map((user) =>
          user.id === inlineEditId
            ? {
                ...user,
                ...inlineEditData,
                company: {
                  name: inlineEditData.company?.name || user.company.name,
                },
              }
            : user,
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
  const confirmDelete = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (userToDelete) {
      setUsers(users.filter((user) => user.id !== userToDelete.id));
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">
            Users Management
          </h1>
          <p className="text-slate-600">
            Manage and organize your user database
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 z-10 pointer-events-none" />
          <Input
            placeholder="Search by name, email, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 bg-white/80 backdrop-blur-sm border-slate-200 focus:border-indigo-400 focus:ring-indigo-400 transition-all"
          />
        </div>

        {/* Table Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
              <p className="mt-4 text-slate-600">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
              <Table>
                <TableHeader className="sticky top-0 bg-gradient-to-r from-slate-50 to-blue-50 z-10">
                  <TableRow className="border-b-2 border-slate-200 hover:bg-slate-50">
                    <TableHead className="font-semibold">
                      <button
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-2 hover:text-indigo-600 transition-colors"
                      >
                        Name
                        <IconArrowsSort className="h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <button
                        onClick={() => handleSort("email")}
                        className="flex items-center gap-2 hover:text-indigo-600 transition-colors"
                      >
                        Email
                        <IconArrowsSort className="h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <button
                        onClick={() => handleSort("company")}
                        className="flex items-center gap-2 hover:text-indigo-600 transition-colors"
                      >
                        Company
                        <IconArrowsSort className="h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead className="text-right font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedUsers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-8 text-slate-500"
                      >
                        No users found matching your search.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAndSortedUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        className="hover:bg-blue-50/50 transition-colors border-b border-slate-100"
                      >
                        {/* Name Cell */}
                        <TableCell className="font-medium">
                          {inlineEditId === user.id ? (
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
                            <span className="text-slate-900">{user.name}</span>
                          )}
                        </TableCell>

                        {/* Email Cell */}
                        <TableCell>
                          {inlineEditId === user.id ? (
                            <Input
                              value={inlineEditData.email || ""}
                              onChange={(e) =>
                                setInlineEditData({
                                  ...inlineEditData,
                                  email: e.target.value,
                                })
                              }
                              className="h-8"
                            />
                          ) : (
                            <span className="text-slate-600">{user.email}</span>
                          )}
                        </TableCell>

                        {/* Company Cell */}
                        <TableCell>
                          {inlineEditId === user.id ? (
                            <Input
                              value={inlineEditData.company?.name || ""}
                              onChange={(e) =>
                                setInlineEditData({
                                  ...inlineEditData,
                                  company: { name: e.target.value },
                                })
                              }
                              className="h-8"
                            />
                          ) : (
                            <span className="text-slate-600">
                              {user.company.name}
                            </span>
                          )}
                        </TableCell>

                        {/* Actions Cell */}
                        <TableCell className="text-right">
                          {inlineEditId === user.id ? (
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
                                onClick={() => startInlineEdit(user)}
                                className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors"
                                title="Inline Edit"
                              >
                                <IconPencil className="h-4 w-4 mr-1" />
                                Quick Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openEditModal(user)}
                                className="hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-colors"
                                title="Modal Edit"
                              >
                                <IconPencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => confirmDelete(user)}
                                className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
                              >
                                <IconTrash className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Results Summary */}
        {!loading && (
          <div className="mt-4 text-sm text-slate-600 text-center">
            Showing {filteredAndSortedUsers.length} of {users.length} users
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent">
              Edit User
            </DialogTitle>
            <DialogDescription>
              Make changes to the user information below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                placeholder="Enter name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                placeholder="Enter email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-company">Company</Label>
              <Input
                id="edit-company"
                value={editForm.company}
                onChange={(e) =>
                  setEditForm({ ...editForm, company: e.target.value })
                }
                placeholder="Enter company name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleModalEdit}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-semibold text-slate-900">
                {userToDelete?.name}
              </span>
              's account and remove their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
