import { useState, useEffect } from "react";
import axios from "axios";
import OpenUpsForm, { type OpenUps } from "../form/openupsForm";

function OpenUpsList() {
  const [openups, setOpenUps] = useState<OpenUps[]>([]);
  const [editingItem, setEditingItem] = useState<OpenUps | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  const fetchOpenUps = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/openups");
      setOpenUps(res.data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to fetch products.");
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/openups");
        console.log("=== FULL RESPONSE ===");
        console.log("Response data:", res.data);
        
        if (res.data.length > 0) {
          console.log("=== FIRST ITEM ===");
          console.log("Full item:", res.data[0]);
          console.log("Image object:", res.data[0].image);
          
          if (res.data[0].image) {
            console.log("Image data type:", typeof res.data[0].image.data);
            console.log("Image data length:", res.data[0].image.data?.length);
            console.log("ContentType:", res.data[0].image.contentType);
            console.log("First 100 chars of data:", res.data[0].image.data?.substring(0, 100));
          }
        }
        
        if (mounted) {
          setOpenUps(res.data);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        if (mounted) {
          setMessage("Failed to fetch products.");
        }
      }
    };
    
    loadData();
    
    return () => {
      mounted = false;
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/openups/${id}`);
      setMessage("Item deleted successfully.");
      fetchOpenUps();
      if (editingItem?._id === id) setEditingItem(null);
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete item.");
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">
          {showForm ? (editingItem ? "Edit OpenUps" : "Add OpenUps") : "OpenUps Management"}
        </h1>
        <button
          onClick={() => { 
            setEditingItem(null); 
            setShowForm(!showForm); 
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? "Close Form" : "Add OpenUps"}
        </button>
      </div>

      {message && (
        <p className={`mb-4 text-sm ${message.includes("successful") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}

      {showForm ? (
        <OpenUpsForm editingItem={editingItem} onSuccess={handleSuccess} onCancel={handleCancelEdit} />
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
              {openups.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No items found. Click "Add OpenUps" to create one.
                  </td>
                </tr>
              ) : (
                openups.map((item) => {
                  // Debug each item
                  console.log(`Rendering ${item.name}:`, {
                    hasImage: !!item.image,
                    hasData: !!item.image?.data,
                    hasContentType: !!item.image?.contentType,
                    dataType: typeof item.image?.data,
                  });
                  
                  return (
                    <tr key={item._id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">
                        {item.image && item.image.data && item.image.contentType ? (
                          <img
                            src={`data:${item.image.contentType};base64,${item.image.data}`}
                            alt={item.name}
                            className="w-32 h-20 object-cover rounded border"
                            onLoad={() => console.log(`✓ Image loaded for: ${item.name}`)}
                            onError={(e) => {
                              console.error(`✗ Image failed to load for: ${item.name}`);
                              console.error("Image src:", (e.target as HTMLImageElement).src.substring(0, 100));
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-32 h-20 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-400">
                            {!item.image ? "No image object" : !item.image.data ? "No data" : "No contentType"}
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OpenUpsList;