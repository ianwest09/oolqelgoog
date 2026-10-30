'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Heart, Bookmark, Sparkles, Shield, Compass, Users, Menu, X, ChevronRight } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  currentTab: 'welcome' | 'create' | 'saved' | 'how-it-works' | 'privacy';
  onSelectTab: (tab: 'welcome' | 'create' | 'saved' | 'how-it-works' | 'privacy') => void;
  savedCount: number;
  isDemonstration: boolean;
  activePersonName?: string;
  onOpenProfileManager?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  savedCount,
  isDemonstration,
  activePersonName,
  onOpenProfileManager,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (tab: 'welcome' | 'create' | 'saved' | 'how-it-works' | 'privacy') => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E6E1D8]">
      <div className="max-w-5xl mx-auto px-3.5 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Zone */}
        <button
          onClick={() => handleNavClick('welcome')}
          className="flex items-center gap-2 sm:gap-2.5 text-left group focus-visible:outline-2 focus-visible:outline-[#1B4332] rounded-lg p-1 -ml-1 transition-opacity shrink-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1B4332] flex items-center justify-center text-[#FAF8F5] shadow-xs">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-[#FAF8F5]/20 text-[#FAF8F5]" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold tracking-tight text-[#14261C] leading-none">
              Kinship
            </div>
            <div className="text-[11px] sm:text-[12px] text-[#55695E] font-medium leading-tight hidden xs:block">
              Moments of Connection
            </div>
          </div>
        </button>

        {/* Desktop / Tablet Nav (> md) */}
        <div className="hidden md:flex items-center gap-2">
          {onOpenProfileManager && (
            <button
              onClick={onOpenProfileManager}
              className="min-h-[38px] px-3 py-1.5 rounded-xl border border-[#D5CDBC] bg-white text-[#2D4537] hover:bg-[#FAF8F5] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              title="Manage loved ones and resident cultural profiles"
            >
              <Users className="w-3.5 h-3.5 text-[#1B4332]" />
              <span>Loved Ones</span>
              {activePersonName && (
                <span className="max-w-[80px] truncate text-[11px] bg-[#EAE4D9] px-1.5 py-0.5 rounded text-[#1B4332] font-bold">
                  {activePersonName}
                </span>
              )}
            </button>
          )}

          <PWAInstallButton />

          <nav className="flex items-center gap-1 ml-1">
            <button
              onClick={() => handleNavClick('create')}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-[#1B4332] ${
                currentTab === 'create'
                  ? 'bg-[#1B4332] text-white shadow-xs'
                  : 'text-[#2D4537] hover:bg-[#EAE4D9]/80'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Create moment</span>
            </button>

            <button
              onClick={() => handleNavClick('saved')}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-[#1B4332] relative ${
                currentTab === 'saved'
                  ? 'bg-[#1B4332] text-white shadow-xs'
                  : 'text-[#2D4537] hover:bg-[#EAE4D9]/80'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved</span>
              {savedCount > 0 && (
                <span
                  className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                    currentTab === 'saved'
                      ? 'bg-white/20 text-white'
                      : 'bg-[#1B4332] text-white'
                  }`}
                >
                  {savedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavClick('how-it-works')}
              className={`min-h-[38px] px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-[#1B4332] ${
                currentTab === 'how-it-works'
                  ? 'bg-[#1B4332] text-white'
                  : 'text-[#44584C] hover:bg-[#EAE4D9]/80'
              }`}
              title="How Kinship works"
            >
              <Compass className="w-4 h-4" />
              <span className="hidden lg:inline">How it works</span>
            </button>

            <button
              onClick={() => handleNavClick('privacy')}
              className={`min-h-[38px] px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-[#1B4332] ${
                currentTab === 'privacy'
                  ? 'bg-[#1B4332] text-white'
                  : 'text-[#44584C] hover:bg-[#EAE4D9]/80'
              }`}
              title="Privacy and care settings"
            >
              <Shield className="w-4 h-4" />
              <span className="hidden lg:inline">Privacy</span>
            </button>
          </nav>
        </div>

        {/* Mobile Quick Cluster (< md) */}
        <div className="flex md:hidden items-center gap-1.5">
          {/* Quick Loved Ones Button */}
          {onOpenProfileManager && (
            <button
              onClick={onOpenProfileManager}
              className="min-h-[38px] px-2 py-1 rounded-xl border border-[#D5CDBC] bg-white text-[#2D4537] text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Manage loved ones"
            >
              <Users className="w-3.5 h-3.5 text-[#1B4332]" />
              <span className="max-w-[65px] truncate text-[11px] font-bold text-[#1B4332]">
                {activePersonName || 'Loved Ones'}
              </span>
            </button>
          )}

          {/* Quick Saved Button */}
          <button
            onClick={() => handleNavClick('saved')}
            className={`min-h-[38px] px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors relative ${
              currentTab === 'saved'
                ? 'bg-[#1B4332] text-white'
                : 'border border-[#D5CDBC] bg-white text-[#2D4537]'
            }`}
            title="Saved connection moments"
          >
            <Bookmark className="w-3.5 h-3.5" />
            {savedCount > 0 && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  currentTab === 'saved' ? 'bg-white/30 text-white' : 'bg-[#1B4332] text-white'
                }`}
              >
                {savedCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="w-10 h-10 rounded-xl border border-[#D5CDBC] bg-white text-[#14261C] hover:bg-[#FAF8F5] flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-[#1B4332]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#1B4332]" /> : <Menu className="w-5 h-5 text-[#1B4332]" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown Drawer */}
      {mobileMenuOpen && (
        <div
          ref={menuRef}
          className="md:hidden border-t border-[#E6E1D8] bg-[#FAF8F5] px-4 py-4 space-y-2 shadow-lg animate-fade-in"
        >
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('create')}
              className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                currentTab === 'create'
                  ? 'bg-[#1B4332] text-white shadow-xs'
                  : 'bg-white text-[#14261C] border border-[#E2DDD0] hover:bg-[#FAF8F5]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#D4A373]" />
                <span>Create connection moment</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-60" />
            </button>

            <button
              onClick={() => handleNavClick('saved')}
              className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                currentTab === 'saved'
                  ? 'bg-[#1B4332] text-white shadow-xs'
                  : 'bg-white text-[#14261C] border border-[#E2DDD0] hover:bg-[#FAF8F5]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-4 h-4" />
                <span>Saved moments & sentiment</span>
              </div>
              {savedCount > 0 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#EAE4D9] text-[#1B4332]">
                  {savedCount}
                </span>
              )}
            </button>

            {onOpenProfileManager && (
              <button
                onClick={() => {
                  onOpenProfileManager();
                  setMobileMenuOpen(false);
                }}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-white text-[#14261C] border border-[#E2DDD0] hover:bg-[#FAF8F5] flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-[#1B4332]" />
                  <span>Loved Ones & Resident Profiles</span>
                </div>
                {activePersonName && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#EAE4D9] text-[#1B4332]">
                    {activePersonName}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => handleNavClick('how-it-works')}
              className={`w-full min-h-[42px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between transition-colors ${
                currentTab === 'how-it-works'
                  ? 'bg-[#1B4332] text-white'
                  : 'text-[#44584C] hover:bg-[#EAE4D9]/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Compass className="w-4 h-4" />
                <span>How Kinship works & guidance</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>

            <button
              onClick={() => handleNavClick('privacy')}
              className={`w-full min-h-[42px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between transition-colors ${
                currentTab === 'privacy'
                  ? 'bg-[#1B4332] text-white'
                  : 'text-[#44584C] hover:bg-[#EAE4D9]/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4" />
                <span>Privacy & Disclaimers</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
          </div>

          <div className="pt-2 border-t border-[#EAE4D9] flex items-center justify-between">
            <span className="text-xs text-[#6F8276]">Install Kinship app</span>
            <PWAInstallButton />
          </div>
        </div>
      )}

      {/* Demonstration Mode Banner (if live Qloo is not active) */}
      {isDemonstration && (
        <div className="bg-[#FFF8E7] border-t border-b border-[#F0DFB7] px-3 sm:px-4 py-1 text-center text-[11px] sm:text-xs text-[#7A5610] font-medium flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <span className="font-semibold uppercase tracking-wider text-[10px] bg-[#E8C574]/40 px-1.5 py-0.5 rounded text-[#593E07]">
            Demonstration Mode
          </span>
          <span>Sample results; live Qloo integration is not active.</span>
        </div>
      )}
    </header>
  );
};
