'use client';

import React, { useState } from 'react';
import { User, HeartHandshake } from 'lucide-react';
import { getInitials } from '@/lib/avatarPresets';

interface AvatarBadgeProps {
  name?: string;
  avatarUrl?: string;
  role?: 'patient' | 'caregiver';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBorder?: boolean;
}

const SIZE_MAP = {
  xs: { box: 'w-6 h-6', text: 'text-[10px]', icon: 'w-3 h-3' },
  sm: { box: 'w-8 h-8', text: 'text-xs', icon: 'w-4 h-4' },
  md: { box: 'w-10 h-10', text: 'text-sm', icon: 'w-5 h-5' },
  lg: { box: 'w-14 h-14', text: 'text-base font-bold', icon: 'w-6 h-6' },
  xl: { box: 'w-20 h-20', text: 'text-xl font-bold', icon: 'w-8 h-8' },
};

export const AvatarBadge: React.FC<AvatarBadgeProps> = ({
  name = '',
  avatarUrl,
  role = 'patient',
  size = 'md',
  className = '',
  showBorder = true,
}) => {
  const [imageError, setImageError] = useState(false);
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.md;

  const roleStyles = role === 'patient'
    ? 'bg-[#E3EBE4] text-[#1B4332] border-[#C2D6C6]'
    : 'bg-[#F2ECE0] text-[#78350F] border-[#E2D5C0]';

  const hasValidImage = Boolean(avatarUrl && avatarUrl.trim() !== '' && !imageError);
  const initials = getInitials(name, role === 'patient' ? 'P' : 'C');

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full shrink-0 select-none overflow-hidden ${
        sizeConfig.box
      } ${showBorder ? 'border' : ''} ${
        hasValidImage ? 'border-[#D5CDBC] bg-[#F7F4EE]' : roleStyles
      } ${className}`}
      title={name || (role === 'patient' ? 'Loved One' : 'Caregiver')}
      aria-label={name || (role === 'patient' ? 'Loved One' : 'Caregiver')}
    >
      {hasValidImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt={name ? `${name}'s avatar` : 'Avatar'}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover rounded-full"
          referrerPolicy="no-referrer"
        />
      ) : name.trim() ? (
        <span className={`font-semibold tracking-tight ${sizeConfig.text}`}>
          {initials}
        </span>
      ) : role === 'patient' ? (
        <User className={sizeConfig.icon} />
      ) : (
        <HeartHandshake className={sizeConfig.icon} />
      )}
    </div>
  );
};
