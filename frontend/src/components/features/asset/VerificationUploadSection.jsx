import { useState } from 'react';
import { Trash2, Loader2, FileText } from 'lucide-react';
import FileUpload from '../../ui/FileUpload';

const SectionHeading = ({ title }) => (
  <div className="flex items-center gap-3 mb-4">
    <span className="w-1 h-6 bg-black shrink-0" aria-hidden="true" />
    <h2 className="text-xl font-black tracking-tight text-black">{title}</h2>
  </div>
);

const subtitleMap = {
  sell: 'Cryptographic certificates, appraisals, purchase records (PDF, JPG, PNG)',
  auction: 'Cryptographic certificates, appraisals, chain of ownership records (PDF, JPG, PNG)',
};

const VerificationUploadSection = ({ listingType = 'sell', onFilesChange }) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const isJpgOrPng = (url) => {
    const lowercase = url.toLowerCase();
    return lowercase.endsWith('.png') || lowercase.endsWith('.jpg') || lowercase.endsWith('.jpeg');
  };

  const CLOUDINARY_UPLOAD_URL = import.meta.env.VITE_CLOUDINARY_URL;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const uploadFileToCloudinary = async (file) => {
    if (!CLOUDINARY_UPLOAD_URL || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error('Cloudinary configuration missing. Set VITE_CLOUDINARY_URL and VITE_CLOUDINARY_UPLOAD_PRESET in your .env');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Upload failed for ${file.name}: ${response.status} ${text}`);
    }

    const data = await response.json();
    return data.secure_url;
  };

  const notifyParent = (currentUrls) => {
    const imageUrls = currentUrls.filter(url => isJpgOrPng(url));
    const verificationDocument = currentUrls.find(url => !isJpgOrPng(url)) || '';
    onFilesChange?.({ imageUrls, verificationDocument });
  };

  const handleFilesChange = async (files) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setError(null);

    try {
      const fileList = Array.from(files);
      const uploadPromises = fileList.map(file => uploadFileToCloudinary(file));
      const urls = await Promise.all(uploadPromises);
      
      const updatedImages = [...images, ...urls];
      setImages(updatedImages);
      notifyParent(updatedImages);
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      setError('Failed to upload one or more files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove) => {
    const updatedImages = images.filter((_, idx) => idx !== indexToRemove);
    setImages(updatedImages);
    notifyParent(updatedImages);
  };

  return (
    <section className="w-full">
      <SectionHeading title="Verification Documents" />
      <p className="text-[10px] tracking-[0.2em] uppercase font-bold font-mono text-gray-400 mb-6">
        {subtitleMap[listingType]}
      </p>

      {error && (
        <div className="mb-4 text-xs font-medium text-red-600 font-mono uppercase tracking-wider">
          Error: {error}
        </div>
      )}

      <FileUpload
        onFilesChange={handleFilesChange}
        accept=".pdf,.jpg,.jpeg,.png,.webp"
        iconClassName="text-gray-400"
        labelClassName="text-gray-500"
        helperClassName="text-gray-400"
      />

      {/* Grid Previews */}
      {(images.length > 0 || uploading) && (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((url, idx) => {
            const isPdf = !isJpgOrPng(url);
            return (
              <div key={idx} className="group relative aspect-square bg-[#eceae1] border border-[#dcd9ce] overflow-hidden flex items-center justify-center">
                {isPdf ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#eceae1] text-gray-500 font-mono text-[9px] uppercase tracking-wider px-2 text-center select-none">
                    <FileText size={26} strokeWidth={1.5} className="text-black mb-1.5" />
                    <span className="truncate max-w-full">PDF Document</span>
                  </div>
                ) : (
                  <img
                    src={url}
                    alt={`Uploaded verification doc ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 p-1.5 bg-black/80 hover:bg-red-600 text-white rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  title="Remove document"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}

          {uploading && (
            <div className="aspect-square bg-[#eceae1]/50 border border-dashed border-[#c8c4b8] flex flex-col items-center justify-center text-gray-400 gap-2 font-mono text-[10px] uppercase tracking-wider">
              <Loader2 size={20} className="animate-spin text-black" />
              <span>Uploading...</span>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default VerificationUploadSection;
