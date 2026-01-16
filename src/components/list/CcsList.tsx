import { useState, useEffect } from "react";
import axios from "axios";
import CcsForm, { type CCS } from "../form/ccsForm";
function CcsList() {
  const [ccsItems, setCcsItems] = useState<CCS[]>([]);
  const [editingItem, setEditingItem] = useState<CCS | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  const fetchCcs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/ccs");
      setCcsItems(res.data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to fetch CCS items.");
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/ccs");

        if (mounted) setCcsItems(res.data);
      } catch (error) {
        console.error("Error loading data:", error);
        if (mounted) setMessage("Failed to fetch CCS items.");
      }
    };

    loadData();
    return () => { mounted = false };
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/ccs/${id}`);
      setMessage("Item deleted successfully.");
      fetchCcs();
      if (editingItem?._id === id) setEditingItem(null);
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete item.");
    }
  };

  const handleEdit = (item: CCS) => {
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
    fetchCcs();
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">
          {showForm ? (editingItem ? "Edit CCS" : "Add CCS") : "CCS Management"}
        </h1>

        <button
          onClick={() => {
            setEditingItem(null);
            setShowForm(!showForm);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? "Close Form" : "Add CCS"}
        </button>
      </div>

      {message && (
        <p className={`mb-4 text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}

      {showForm ? (
        <CcsForm
          editingItem={editingItem}
          onSuccess={handleSuccess}
          onCancel={handleCancelEdit}
        />
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="w-full border text-left text-sm text-gray-700 rounded">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Price (Frw)</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {ccsItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No CCS items found. Click "Add CCS" to create one.
                  </td>
                </tr>
              ) : (
                ccsItems.map((item) => (
                  <tr key={item._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">
                       {item.image && item.image.data && item.image.contentType ? (
                     <img
                     src={`data:${item.image.contentType};base64,${item.image.data}`}
                      alt={item.name}
                     className="w-32 h-20 object-cover rounded border"
                     />
                      ) : (
                        <div className="w-32 h-20 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-2 font-medium">{item.name}</td>
                    <td className="px-4 py-2">{item.description}</td>
                    <td className="px-4 py-2 font-semibold">{item.price}</td>

                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => item._id && handleDelete(item._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CcsList;
