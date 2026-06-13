import { Pencil } from 'lucide-react';
import Button from '../../ui/Button';

const cx = (...classes) => classes.filter(Boolean).join(' ');

const IdentityContact = ({ fields = [], onEdit, className = '' }) => {
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
        <Button
          variant="secondary"
          size="sm"
          className="shrink-0 self-start"
          onClick={onEdit}
        >
          <Pencil size={12} strokeWidth={2.5} />
          Edit
        </Button>
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
            <p className="text-[14px] md:text-[14px] font-mono text-black tracking-[0.02em]">
              {field.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default IdentityContact;
