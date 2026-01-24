import { useState, useEffect } from "react";
import axios from "axios";

export interface CcsItem {
  _id?: string;
  name: string;
  price: number;
  description: string;
  image?: string | null;
}

interface CcsFormProps {
  editingItem: CcsItem | null;
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

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setPrice(editingItem.price);
      setDescription(editingItem.description);
      setImagePreview(editingItem.image ? `data:image/jpeg;base64,${editingItem.image}` : "");
    } else {
      setName("");
      setPrice(0);
      setDescription("");
      setImage(null);
      setImagePreview("");
    }
  }, [editingItem]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price.toString());
      formData.append("description", description);
      if (image) formData.append("image", image);

      if (editingItem?._id) {
        await axios.put(`http://localhost:5000/api/ccs/${editingItem._id}`, formData);
      } else {
        await axios.post("http://localhost:5000/api/ccs", formData);
      }

      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">{editingItem ? "Edit CCS" : "Add CCS"}</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Name"
          required
          className="w-full border rounded p-2 text-gray-900"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          required
          className="w-full border rounded p-2 text-gray-900"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <textarea
          placeholder="Description"
          required
          className="w-full border rounded p-2 text-gray-900"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded border"
          />
        )}

        <div className="flex justify-end gap-2">
          {editingItem && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Saving..." : editingItem ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CcsForm;
