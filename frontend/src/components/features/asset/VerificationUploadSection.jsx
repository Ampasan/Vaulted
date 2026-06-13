import FileUpload from '../../ui/FileUpload';

const SectionHeading = ({ title }) => (
  <div className="flex items-center gap-3 mb-4">
    <span className="w-1 h-6 bg-black shrink-0" aria-hidden="true" />
    <h2 className="text-xl font-black tracking-tight text-black">{title}</h2>
  </div>
);

const subtitleMap = {
  sell: 'Cryptographic certificates, appraisals, purchase records',
  auction: 'Cryptographic certificates, appraisals, chain of ownership records',
};

const VerificationUploadSection = ({ listingType = 'sell', onFilesChange }) => {
  return (
    <section>
      <SectionHeading title="Verification Documents" />
      <p className="text-[10px] tracking-[0.2em] uppercase font-bold font-mono text-gray-400 mb-8">
        {subtitleMap[listingType]}
      </p>
      <FileUpload
        onFilesChange={onFilesChange}
        iconClassName="text-gray-400"
        labelClassName="text-gray-500"
        helperClassName="text-gray-400"
      />
    </section>
  );
};

export default VerificationUploadSection;
