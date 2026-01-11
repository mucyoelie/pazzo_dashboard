import { useState, useEffect } from "react";
import axios from "axios";
import OpenUpsForm from "../form/openupsForm";

export interface OpenUps {
  _id: string;
  name: string;
  price: string;
  description: string;
  image?: string;
}

export default function OpenUpsList() {
  const [openups, setOpenUps] = useState<OpenUps[]>([]);
  const [editingItem, setEditingItem] = useState<OpenUps | null>(null);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchOpenUps = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/openups"
      );
      setOpenUps(res.data);
    } catch (error) {
      console.error("Failed to fetch OpenUps", error);
      setMessage("Failed to load OpenUps products.");
    }
  };

  // -------------------------------
  // FIX: async function INSIDE the effect
  // -------------------------------
  useEffect(() => {
    (async () => {
      await fetchOpenUps();
    })();
  }, []);
  // -------------------------------

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/openups/${id}`
      );

      setMessage("Item deleted successfully.");
      fetchOpenUps();

      if (editingItem && editingItem._id === id) {
        setEditingItem(null);
      }
    } catch (error) {
      console.error("Delete error", error);
      setMessage("Failed to delete this item.");
    }
  };

  const handleEdit = (item: OpenUps) => {
    setEditingItem(item);
    setShowForm(true);
    setMessage("");
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setShowForm(false);
    setMessage("");
  };

  const handleSuccess = () => {
    setEditingItem(null);
    setShowForm(false);
    setMessage("Operation successful!");
    fetchOpenUps();
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">
          {showForm
            ? editingItem
              ? "Edit OpenUps Product"
              : "Create New OpenUps"
            : "OpenUps Products Management"}
        </h1>

        <button
          onClick={() => {
            setEditingItem(null);
            setShowForm(!showForm);
          }}
          className="bg-blue-600 text-white rounded 
            px-3 py-2 sm:px-6 sm:py-3
            text-sm sm:text-base
            hover:bg-blue-700
            transition-colors duration-200
            w-full sm:w-auto"
        >
          {showForm ? "Close Form" : "Create New OpenUps"}
        </button>
      </div>

      {message && (
        <p
          className={`mb-4 text-sm ${
            message.includes("successful") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      {showForm ? (
        <OpenUpsForm
          editingItem={editingItem}
          onSuccess={handleSuccess}
          onCancel={handleCancelEdit}
        />
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700 border rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Price (Frw)</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {openups.map((item) => (
                <tr key={item._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {item.image && (
                      <img
                        src={`data:image/jpeg;base64,${item.image}`}
                        alt={item.name}
                        className="w-40 h-20 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="px-4 py-2 font-medium">{item.name}</td>
                  <td className="px-4 py-2">{item.description}</td>
                  <td className="px-4 py-2 font-semibold">{item.price}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
