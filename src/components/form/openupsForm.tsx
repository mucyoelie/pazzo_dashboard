import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";

// Match the backend types
export interface OpenUps {
  _id?: string;
  name: string;
  price: number;
  description: string;
  image?: { data: string; contentType: string } | null;
}

interface OpenUpsFormProps {
  editingItem: OpenUps | null;
  onSuccess: () => void;
  onCancel: () => void;
}

 function OpenUpsForm({ editingItem, onSuccess, onCancel }: OpenUpsFormProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setPrice(editingItem.price);
      setDescription(editingItem.description);
      if (editingItem.image) {
        setImagePreview(`data:${editingItem.image.contentType};base64,${editingItem.image.data}`);
      }
    } else {
      setName("");
      setPrice(0);
      setDescription("");
      setImage(null);
      setImagePreview("");
    }
  }, [editingItem]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price.toString());
      formData.append("description", description);

      if (image) formData.append("image", image);

      if (editingItem?._id) {
        await axios.put(`http://localhost:5000/api/openups/${editingItem._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Product updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/openups", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Product added successfully!");
      }

      onSuccess();
    } catch (error) {
      console.error(error);
      setMessage("Failed to save product.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow p-6 rounded-xl space-y-4">
      <h2 className="text-xl font-semibold">{editingItem ? "Edit OpenUps" : "Add OpenUps"}</h2>

      {message && <p className={`text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Product Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded text-gray-900"
        />

        <input
          type="number"
          placeholder="Price"
          required
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full border p-2 rounded text-gray-900"
        />

        <textarea
          placeholder="Description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded text-gray-900"
        />

        <input type="file" accept="image/*" onChange={handleImageChange} />

        {imagePreview && <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded border" />}

        <div className="flex justify-end gap-2">
          {editingItem && (
            <button type="button" onClick={onCancel} className="px-4 py-1.5 bg-gray-200 rounded">Cancel</button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-1.5 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {isLoading ? "Saving..." : editingItem ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}
export default OpenUpsForm;