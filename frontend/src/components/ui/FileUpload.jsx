import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

const cx = (...classes) => classes.filter(Boolean).join(' ');

const FileUpload = ({
  onFilesChange,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSizeMB = 50,
  className = '',
  iconClassName = 'text-gray-500',
  labelClassName = 'text-gray-600',
  helperClassName = 'text-gray-500',
}) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (fileList) => {
    if (!fileList?.length) return;
    onFilesChange?.(Array.from(fileList));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cx(
        'flex flex-col items-center justify-center gap-3 border border-dashed border-[#c8c4b8] bg-cream-light px-6 py-16 cursor-pointer transition-colors',
        isDragging && 'border-black bg-white',
        className
      )}
    >
      <Upload size={20} strokeWidth={1.75} className={iconClassName} />
      <p className={cx('text-[13px] font-medium text-center', labelClassName)}>
        Drag and drop verified documents here
      </p>
      <p className={cx('text-[11px] font-mono tracking-[0.04em]', helperClassName)}>
        PDF, JPG, PNG — up to {maxSizeMB}MB
      </p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="sr-only"
        onChange={(event) => handleFiles(event.target.files)}
      />
    </div>
  );
};

export default FileUpload;
