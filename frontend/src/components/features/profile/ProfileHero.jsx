import { Link } from 'react-router-dom';
import { Check, LogOut, Star } from 'lucide-react';
import Avatar from '../../ui/Avatar';
import Badge from '../../ui/Badge';

const cx = (...classes) => classes.filter(Boolean).join(' ');

const ProfileHero = ({
  name,
  initials,
  avatarSrc,
  memberId,
  memberSince,
  tier = 'Platinum Collector',
  identityVerified = true,
  className = '',
}) => {
  return (
    <section
      className={cx(
        'w-full bg-black text-white px-6 md:px-12 lg:px-16 xl:px-24 pt-8 pb-12 md:pb-14',
        className
      )}
    >
      <div className="flex justify-end mb-8 md:mb-10">
        <div className="flex items-center gap-6 text-[11px] tracking-[0.2em] font-bold uppercase">
          <Link
            to="/portfolio"
            className="text-[#888888] hover:text-white transition-colors"
          >
            Portfolio &rarr;
          </Link>
          <button
            type="button"
            className="inline-flex items-center gap-2 text-[#888888] hover:text-white transition-colors"
          >
            <LogOut size={14} strokeWidth={2} />
            Sign Out
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-10">
        <Avatar initials={initials} src={avatarSrc} alt={name} size="xl" editable />
        <div className="pb-1">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <Badge
              variant="outline"
              size="sm"
              className="inline-flex items-center gap-1.5 border-white/30 text-white"
            >
              <Star size={10} strokeWidth={2.5} fill="currentColor" />
              {tier}
            </Badge>
            {identityVerified && (
              <Badge
                variant="outline"
                size="sm"
                className="inline-flex items-center gap-1.5 border-white/30 text-white"
              >
                <Check size={10} strokeWidth={3} />
                Identity Verified
              </Badge>
            )}
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-[56px] lg:text-[60px] font-black tracking-tighter leading-[0.95] mb-4">
            {name}
          </h1>
          <p className="text-[12px] md:text-[16px] font-mono text-[#888888] tracking-[0.08em]">
            {memberId}
            <span className="mx-2 text-[#555555]">&middot;</span>
            Member since {memberSince}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProfileHero;
