"use client";

interface NftPreviewProps {
  file: File | null;
  metadata: {
    name: string;
    description: string;
    attributes: Array<{ trait_type: string; value: string }>;
  } | null;
}

export default function NftPreview({ file, metadata }: NftPreviewProps) {
  if (!file && !metadata) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="mt-2 text-sm text-gray-600">NFT Preview</p>
        <p className="text-xs text-gray-500">
          Upload a file and fill in metadata to see preview
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      {/* Image Preview */}
      {file && (
        <div className="aspect-square bg-gray-100">
          <img
            src={URL.createObjectURL(file)}
            alt="NFT Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Metadata Preview */}
      {metadata && (
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {metadata.name || "Untitled NFT"}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              {metadata.description || "No description provided"}
            </p>
          </div>

          {metadata.attributes && metadata.attributes.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Attributes
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {metadata.attributes.map((attr, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                  >
                    <p className="text-xs text-gray-500 uppercase">
                      {attr.trait_type}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {attr.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
