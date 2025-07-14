import { useEffect, useState } from "react";

const LinkPreviewComponent = ({ url }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!url) return;

    // ✅ Correct fetch usage
    fetch(`http://localhost:3002/chat/preview?url=${encodeURIComponent(url)}`)
      .then((res) => res.json())
      .then((data) => setPreview(data))
      .catch(() => setPreview(null));
  }, [url]);

  if (!preview) return null;

  return (
    <a
      href={preview.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block mt-2 p-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition"
    >
      {preview.images?.[0] && (
        <img
          src={preview.images[0]}
          alt="preview"
          className="w-full h-32 object-cover rounded"
        />
      )}
      <div className="mt-2">
        <h4 className="text-md font-semibold text-gray-800">{preview.title}</h4>
        <p className="text-sm text-gray-500">{preview.description}</p>
        <p className="text-xs text-blue-600 truncate">{preview.url}</p>
      </div>
    </a>
  );
};

export default LinkPreviewComponent;
