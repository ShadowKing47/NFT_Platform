"use client";

import { useState } from "react";

interface Attribute {
  trait_type: string;
  value: string;
}

interface MetadataFormProps {
  onChange: (metadata: {
    name: string;
    description: string;
    attributes: Attribute[];
  }) => void;
}

export default function MetadataForm({ onChange }: MetadataFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [newTrait, setNewTrait] = useState({ trait_type: "", value: "" });

  const handleUpdate = (
    updatedName?: string,
    updatedDescription?: string,
    updatedAttributes?: Attribute[]
  ) => {
    onChange({
      name: updatedName ?? name,
      description: updatedDescription ?? description,
      attributes: updatedAttributes ?? attributes,
    });
  };

  const handleNameChange = (value: string) => {
    setName(value);
    handleUpdate(value, undefined, undefined);
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    handleUpdate(undefined, value, undefined);
  };

  const addAttribute = () => {
    if (newTrait.trait_type && newTrait.value) {
      const updated = [...attributes, newTrait];
      setAttributes(updated);
      setNewTrait({ trait_type: "", value: "" });
      handleUpdate(undefined, undefined, updated);
    }
  };

  const removeAttribute = (index: number) => {
    const updated = attributes.filter((_, i) => i !== index);
    setAttributes(updated);
    handleUpdate(undefined, undefined, updated);
  };

  return (
    <div className="space-y-6">
      {/* Name Field */}
      <div>
        <label
          htmlFor="nft-name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Name * <span className="text-gray-500">(max 100 characters)</span>
        </label>
        <input
          type="text"
          id="nft-name"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          maxLength={100}
          placeholder="My Awesome NFT"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="mt-1 text-xs text-gray-500 text-right">
          {name.length}/100
        </p>
      </div>

      {/* Description Field */}
      <div>
        <label
          htmlFor="nft-description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description * <span className="text-gray-500">(max 1000 characters)</span>
        </label>
        <textarea
          id="nft-description"
          value={description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          maxLength={1000}
          rows={4}
          placeholder="Describe your NFT..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <p className="mt-1 text-xs text-gray-500 text-right">
          {description.length}/1000
        </p>
      </div>

      {/* Attributes Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Attributes (Optional)
        </label>

        {/* Existing Attributes */}
        {attributes.length > 0 && (
          <div className="space-y-2 mb-4">
            {attributes.map((attr, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <span className="text-xs text-gray-500 uppercase">
                    {attr.trait_type}
                  </span>
                  <p className="text-sm font-semibold text-gray-900">
                    {attr.value}
                  </p>
                </div>
                <button
                  onClick={() => removeAttribute(index)}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Attribute */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newTrait.trait_type}
            onChange={(e) =>
              setNewTrait({ ...newTrait, trait_type: e.target.value })
            }
            placeholder="Trait (e.g., Color)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <input
            type="text"
            value={newTrait.value}
            onChange={(e) =>
              setNewTrait({ ...newTrait, value: e.target.value })
            }
            placeholder="Value (e.g., Blue)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <button
            onClick={addAttribute}
            disabled={!newTrait.trait_type || !newTrait.value}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
