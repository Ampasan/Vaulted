import { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import Button from '../../ui/Button';

const cx = (...classes) => classes.filter(Boolean).join(' ');

const IdentityContact = ({ fields = [], onSave, className = '' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [loading, setLoading] = useState(false);

  const handleEdit = () => {
    const initialValues = {};
    fields.forEach((field) => {
      initialValues[field.key || field.label] = field.value || '';
    });
    setEditValues(initialValues);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!onSave) return;
    setLoading(true);
    await onSave(editValues);
    setLoading(false);
    setIsEditing(false);
  };

  const handleChange = (key, value) => {
    setEditValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <section className={cx('min-w-0', className)}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-[28px] font-black tracking-tight text-black mb-2">
            Identity &amp; Contact
          </h2>
          <p className="text-[13px] font-mono text-gray-500 tracking-[0.04em]">
            Your registered collector identity on the Vaulted network.
          </p>
        </div>
        {!isEditing ? (
          <Button
            variant="secondary"
            size="sm"
            className="shrink-0 self-start"
            onClick={handleEdit}
          >
            <Pencil size={12} strokeWidth={2.5} />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2 shrink-0 self-start">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={loading}
            >
              <X size={12} strokeWidth={2.5} />
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={loading}
            >
              <Check size={12} strokeWidth={2.5} />
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
        {fields.map((field) => (
          <div
            key={field.label}
            className="py-3 border-b border-[#dcd9ce]"
          >
            <p className="text-[13px] text-gray-400 tracking-[0.2em] uppercase font-bold font-mono mb-2">
              {field.label}
            </p>
            {isEditing && !field.readOnly ? (
              <input
                type="text"
                className="w-full bg-transparent border-b border-black text-[14px] font-mono text-black tracking-[0.02em] py-1 focus:outline-none placeholder:text-gray-400"
                value={editValues[field.key || field.label] || ''}
                onChange={(e) => handleChange(field.key || field.label, e.target.value)}
                placeholder={field.label === 'Phone Number' ? '+XX...' : `Enter ${field.label.toLowerCase()}`}
              />
            ) : (
              <p className="text-[14px] md:text-[14px] font-mono text-black tracking-[0.02em]">
                {field.value || '-'}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default IdentityContact;
