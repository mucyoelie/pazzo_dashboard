import { useState, useEffect } from "react";
import axios from "axios";
import CcsForm, { type CcsItem } from "../form/ccsForm";

function CcsList() {
  const [items, setItems] = useState<CcsItem[]>([]);
  const [editingItem, setEditingItem] = useState<CcsItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch items with mounted flag to avoid cascading renders
  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/ccs");
      setItems(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch CCS items.");
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadItems = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/ccs");
        if (isMounted) setItems(res.data); // SAFE setState
      } catch (err) {
        console.error(err);
        if (isMounted) setMessage("Failed to fetch CCS items.");
      }
    };

    // Call async function
    loadItems();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/ccs/${id}`);
      setMessage("Item deleted successfully.");
      fetchItems();
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete item.");
    }
  };

  const handleEdit = (item: CcsItem) => {
    setEditingItem(item);
    setShowForm(true);
    setMessage("");
  };

  const handleCancel = () => {
    setEditingItem(null);
    setShowForm(false);
    setMessage("");
  };

  const handleSuccess = () => {
    setEditingItem(null);
    setShowForm(false);
    setMessage("Operation successful!");
    fetchItems();
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">
          {showForm ? (editingItem ? "Edit CCS" : "Add CCS") : "CCS Management"}
        </h1>
        <button
          onClick={() => { setEditingItem(null); setShowForm(!showForm); }}
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
        <CcsForm editingItem={editingItem} onSuccess={handleSuccess} onCancel={handleCancel} />
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="w-full border text-left text-sm text-gray-700 rounded">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No items found. Click "Add CCS" to create one.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">
                      {item.image ? (
                        <img
                          src={`data:image/jpeg;base64,${item.image}`}
                          alt={item.name}
                          className="w-32 h-20 object-cover rounded border"
                        />
                      ) : (
                        <div className="w-32 h-20 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-900 dark:text-gray-100">{item.name}</td>
                    <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{item.description}</td>
                    <td className="px-4 py-2 font-semibold text-gray-900 dark:text-gray-100">{item.price}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => item._id && handleDelete(item._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
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
