import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";

// Match CCS backend
export interface CCS {
  _id?: string;
  name: string;
  price: number;
  description: string;
  image?: { data: string; contentType: string } | null;
}
interface CcsFormProps {
  editingItem: CCS | null;
  onSuccess: () => void;
  onCancel: () => void;
}
function CcsForm({ editingItem, onSuccess, onCancel }: CcsFormProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  // Load item when editing
  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setPrice(editingItem.price);
      setDescription(editingItem.description);

      if (editingItem.image) {
        setImagePreview(
          `data:${editingItem.image.contentType};base64,${editingItem.image.data}`
        );
      }
    } else {
      setName("");
      setPrice(0);
      setDescription("");
      setImage(null);
      setImagePreview("");
    }
  }, [editingItem]);

  // Handle Image Selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  // Submit Form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price.toString());
      formData.append("description", description);
      if (image) formData.append("image", image);

      if (editingItem?._id) {
        await axios.put(
          `http://localhost:5000/api/ccs/${editingItem._id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setMessage("CCS item updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/ccs", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("CCS item added successfully!");
      }

      onSuccess();
    } catch (error) {
      console.error(error);
      setMessage("Failed to save CCS item.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-xl mx-auto bg-white shadow p-6 rounded-lg space-y-4">
      <h2 className="text-xl font-semibold">
        {editingItem ? "Edit CCS Item" : "Add CCS Item"}
      </h2>
      {message && (
        <p
          className={`text-sm ${
            message.includes("success") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <input
          type="text"
          placeholder="Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded text-gray-900"
        />

        {/* Price */}
        <input
          type="number"
          placeholder="Price"
          required
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full border p-2 rounded text-gray-900"
        />

        {/* Description */}
        <textarea
          placeholder="Description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded text-gray-900"
        />

        {/* File Input */}
       <input type="file" accept="image/*" onChange={handleImageChange} />
        {/* Preview */}
        {imagePreview && <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded border" />}

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          {editingItem && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-1.5 bg-gray-200 rounded"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-1.5 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {loading ? "Saving..." : editingItem ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CcsForm;
