import { CircleCheck, Home } from "lucide-react";
import SettlementSectionLabel from "./SettlementSectionLabel";

const VerificationProtocols = ({
  buyerIdentity = "Authenticated Client",
  destinationCustody = "Geneva Freeport Vault Alpha",
}) => {
  return (
    <section className="mb-12">
      <SettlementSectionLabel title="Verification Protocols" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pt-2">
        <div>
          <p className="text-[12px] tracking-[0.2em] uppercase font-bold text-[#888888] mb-4">
            Buyer Identity
          </p>
          <div className="flex items-center gap-3">
            <CircleCheck
              size={17}
              strokeWidth={2.5}
              className="text-black shrink-0"
            />
            <span className="text-sm font-medium text-black">
              {buyerIdentity}
            </span>
          </div>
        </div>

        <div>
          <p className="text-[12px] tracking-[0.2em] uppercase font-bold text-[#888888] mb-4">
            Destination Custody
          </p>
          <div className="flex items-center gap-3">
            <Home size={17} strokeWidth={2} className="text-black shrink-0" />
            <span className="text-sm font-medium text-black">
              {destinationCustody}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerificationProtocols;
