import { useEffect, useState } from "react";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/features/users/usersApi";
import { toast } from "react-toastify";
import { useConfirm } from "../../components/ConfirmDialogue";
import { Loader } from "../../components/Loader";
import { Message } from "../../components/Message";
import { FaCheck, FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import { AdminMenu } from "./AdminMenu";
import { handleCatchError } from "../../Utils/handleCatchError";
const UserList = () => {
  const { data: users, isLoading, refetch, error } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  const [editableUserId, setEditableUserId] = useState<string | null>(null);
  const [editableUsername, setEditableUsername] = useState<string>("");
  const [editableEmail, setEditableEmail] = useState<string>("");
  const { confirm, ConfirmDialog } = useConfirm();

  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id: string) => {
    const ok = await confirm({
      title: "Delete user",
      description: `Are you sure you want to delete this user.
        This action cannot be undone.`,
      confirmText: "Delete",
    });

    if (!ok) return;
    console.log("User deleted:", id);

    try {
      await deleteUser(id);
      refetch();
    } catch (err) {
      toast.error(handleCatchError(err, "Error deleting user"));
    }
  };

  const toggleEdit = (id: string, username: string, email: string) => {
    setEditableUserId(id);
    setEditableUsername(username);
    setEditableEmail(email);
  };

  const updateHandler = async (id: string) => {
    try {
      await updateUser({
        _id: id,
        username: editableUsername,
        email: editableEmail,
      });
      setEditableUserId(null);
      refetch();
    } catch (error) {
      console.log(error);

      toast.error(handleCatchError(error, "Error updating user"));
    }
  };
  if (isLoading) {
    return (
      <>
        <title>Mojahed Store - User List</title>
        <div className="p-4">
          <h1 className="text-2xl font-semibold mb-4">Users</h1>
          <Loader />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <title>Mojahed Store - User List</title>
        <div className="p-4">
          <h1 className="text-2xl font-semibold mb-4">Users</h1>
          <Message variant="error">
            {handleCatchError(error, "Error loading users")}
          </Message>
        </div>
      </>
    );
  }

  return (
    <>
      <title>Mojahed Store - Users List</title>
      <div className="p-4 ml-36">
        <h1 className="text-2xl font-semibold mb-4">Users</h1>
        {
          <div className="flex flex-col md:flex-row">
            <AdminMenu />
            <table className="w-full md:w-4/5 mx-auto ">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">USER NAME</th>
                  <th className="px-4 py-2 text-left">EMAIL</th>
                  <th className="px-4 py-2 text-left">ADMIN</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user) => (
                  <tr key={user._id}>
                    <td className="px-4 py-2">{user._id}</td>
                    <td className="px-4 py-2">
                      {editableUserId === user._id ? (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={editableUsername}
                            onChange={(e) =>
                              setEditableUsername(e.target.value)
                            }
                            className="w-full p-2 border rounded-lg"
                          />
                          <button
                            onClick={() => updateHandler(user._id)}
                            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
                          >
                            <FaCheck />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          {user.username}{" "}
                          <button
                            onClick={() =>
                              toggleEdit(user._id, user.username, user.email)
                            }
                          >
                            <FaEdit className="ml-4" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {editableUserId === user._id ? (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={editableEmail}
                            onChange={(e) => setEditableEmail(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                          />
                          <button
                            onClick={() => updateHandler(user._id)}
                            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg "
                          >
                            <FaCheck />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <a href={`mailto:${user.email}`}>{user.email}</a>{" "}
                          <button
                            onClick={() =>
                              toggleEdit(user._id, user.username, user.email)
                            }
                          >
                            <FaEdit className="ml-4" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {user.isAdmin ? (
                        <FaCheck style={{ color: "green" }} />
                      ) : (
                        <FaTimes style={{ color: "red" }} />
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {!user.isAdmin && (
                        <div className="flex">
                          <button
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => deleteHandler(user._id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
        {ConfirmDialog}
      </div>
    </>
  );
};

export { UserList };
