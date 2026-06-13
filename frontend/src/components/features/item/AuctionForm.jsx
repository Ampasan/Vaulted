import Button from '../../ui/Button';
import AssetDetailsSection from '../asset/AssetDetailsSection';
import AuctionParamsSection from '../asset/AuctionParamsSection';
import VerificationUploadSection from '../asset/VerificationUploadSection';

const AuctionForm = ({
  assetDetails,
  onAssetDetailsChange,
  auctionParams,
  onAuctionParamsChange,
  onDocumentsChange,
  onSaveDraft,
}) => {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex flex-col gap-14 md:gap-16">
        <AssetDetailsSection
          listingType="auction"
          values={assetDetails}
          onChange={onAssetDetailsChange}
        />

        <AuctionParamsSection
          values={auctionParams}
          onChange={onAuctionParamsChange}
        />

        <VerificationUploadSection
          listingType="auction"
          onFilesChange={onDocumentsChange}
        />
      </div>

      <div className="mt-14 md:mt-16 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
        <Button
          type="button"
          variant="secondary"
          onClick={onSaveDraft}
          className="shrink-0 py-5 text-[11px]"
        >
          Save Draft
        </Button>
        <Button type="submit" fullWidth className="flex-1 py-5 text-[11px]">
          Submit Lot for Appraisal &rarr;
        </Button>
      </div>
    </div>
  );
};

export default AuctionForm;
