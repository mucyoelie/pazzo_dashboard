import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface OpenUps {
  _id?: string;
  name: string;
  price: string;
  description: string;
  image?: {
    data: string; // base64 string for display
    contentType: string;
  };
}

interface OpenUpsFormProps {
  editingItem: OpenUps | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function OpenUpsForm({
  editingItem,
  onSuccess,
  onCancel,
}: OpenUpsFormProps) {
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load editing data into form
  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setPrice(editingItem.price);
      setDescription(editingItem.description);
      setImage(null);
      
      // Set preview from existing image
      if (editingItem.image) {
        setImagePreview(`data:${editingItem.image.contentType};base64,${editingItem.image.data}`);
      } else {
        setImagePreview("");
      }
      setMessage("");
    } else {
      setName("");
      setPrice("");
      setDescription("");
      setImage(null);
      setImagePreview("");
      setMessage("");
    }
  }, [editingItem]);

  // Handle Image Input
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage("File size too large (max 5MB).");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setMessage("Please upload a valid image.");
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setMessage("");
    }
  };

  // Convert File to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/png;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Submit Handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!editingItem && !image) {
      setMessage("Image is required when adding a new product.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      let imageData: { data: string; contentType: string } | undefined;

      // Convert image to base64 if a new one is selected
      if (image) {
        const base64 = await fileToBase64(image);
        imageData = {
          data: base64,
          contentType: image.type
        };
      }

      const payload = {
        name,
        price: Number(price),
        description,
        ...(imageData && { image: imageData })
      };

      if (editingItem?._id) {
        // Update existing OpenUps
        await axios.put(
          `http://localhost:5000/api/openups/${editingItem._id}`,
          payload,
          { headers: { "Content-Type": "application/json" } }
        );
        setMessage("Product updated successfully!");
      } else {
        // Create new OpenUps
        await axios.post(
          "http://localhost:5000/api/openups",
          payload,
          { headers: { "Content-Type": "application/json" } }
        );
        setMessage("Product added successfully!");
      }

      onSuccess(); // Trigger parent to refresh list
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response || error.message);
        setMessage(error.response?.data?.message || "Failed to save product.");
      } else {
        console.error(error);
        setMessage("Failed to save product.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 bg-white shadow border border-gray-200 rounded-xl space-y-4">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
        {editingItem ? "Edit OpenUps Product" : "Add OpenUps Product"}
      </h2>

      {message && (
        <div
          className={`px-3 py-1 rounded text-sm font-medium 
          ${message.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-0.5">
            Product Name
          </label>
          <input
            type="text"
            required
            disabled={isLoading}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-0.5">
            Price
          </label>
          <input
            type="number"
            required
            disabled={isLoading}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-0.5">
            Description
          </label>
          <textarea
            required
            disabled={isLoading}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-1.5 border border-gray-300 rounded h-20 resize-none text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-0.5">
            Product Image
          </label>
          <input
            type="file"
            accept="image/*"
            disabled={isLoading}
            onChange={handleImageChange}
            className="w-full text-sm px-3 py-1.5 border border-dashed border-gray-300 rounded bg-gray-50 file:mr-2 file:py-1 file:px-3 file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 text-gray-900"
          />
          {/* Show image preview */}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded border border-gray-300"
            />
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end flex-wrap gap-2">
          {editingItem && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`px-5 py-1.5 text-white rounded font-medium text-sm ${
              isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? (editingItem ? "Updating..." : "Adding...") : editingItem ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}