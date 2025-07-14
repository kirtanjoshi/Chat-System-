import { useEffect, useState } from "react";

const LinkPreviewComponent = ({ url }) => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!url) {
      setPreview(null);
      return;
    }

    const fetchPreview = async () => {
      setLoading(true);
      setError(false);

      try {
        const response = await fetch(
          `http://localhost:3002/metadata?url=${encodeURIComponent(url)}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json(); 
        setPreview(data);
      } catch (err) {
        console.error("Preview fetch failed:", err);
        setPreview(null);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [url]);


  if (!url) return null;
  if (loading)
    return <div className="text-sm text-gray-500">Loading preview...</div>;
  if (error)
    return <div className="text-sm text-red-500">Failed to load preview.</div>;
  if (!preview) return null;

  const imageUrl =
    preview.image;
  
  console.log(preview.title);
  console.log(preview.image)

  return (
    <a
      href={preview.url || url}
      target="_blank"
      rel="noopener noreferrer"
      className="block mt-2 p-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition"
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={preview.title || "Link preview"}
          className="w-full h-32 object-cover rounded"
        />
      )}
      <div className="mt-2">
        <h4 className="text-md font-semibold text-gray-800">
          {preview.title || "No title available"}
        </h4>
        <p className="text-sm text-gray-500">
          {preview.description || "No description available"}
        </p>
        <p className="text-xs text-blue-600 truncate">{preview.url || url}</p>
      </div>
    </a>
  );
};

export default LinkPreviewComponent;
