'use client';

import type { Dispatch, RefObject, SetStateAction } from 'react';
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import { Link } from '@/i18n/routing';

type BottomNavProps = {
  t: (key: string) => string;
  saved: boolean;
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  menuRef: RefObject<HTMLDivElement | null>;
  exportingPdf: boolean;
  onOpenSidebar: () => void;
  onDownloadJson: () => void;
  onDownloadMd: () => void;
  onDownloadPdf: () => void;
  onSave: () => void;
};

const iconButtonClass =
  'cursor-pointer flex items-center justify-center p-3 rounded-full text-accent hover:bg-accent-muted/10 transition-colors';

const BottomNav = ({
  t,
  saved,
  menuOpen,
  setMenuOpen,
  menuRef,
  exportingPdf,
  onOpenSidebar,
  onDownloadJson,
  onDownloadMd,
  onDownloadPdf,
  onSave,
}: BottomNavProps) => {
  return (
    <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
      {saved && (
        <span className="px-3 py-1.5 rounded-md bg-surface border border-accent-muted text-accent text-sm shadow-sm">
          {t('savedConfirmation')}
        </span>
      )}
      <div ref={menuRef} className="relative">
        {menuOpen && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex flex-col gap-2 bg-surface border border-accent-muted rounded-lg p-2 shadow-lg w-max">
            <button
              type="button"
              onClick={() => {
                onDownloadJson();
                setMenuOpen(false);
              }}
              className="cursor-pointer px-4 py-2 rounded-md text-foreground font-medium hover:bg-accent-muted/20 transition-colors text-left"
            >
              {t('downloadJsonButton')}
            </button>
            <button
              type="button"
              onClick={() => {
                onDownloadMd();
                setMenuOpen(false);
              }}
              className="cursor-pointer px-4 py-2 rounded-md text-foreground font-medium hover:bg-accent-muted/20 transition-colors text-left"
            >
              {t('downloadMdButton')}
            </button>
            <button
              type="button"
              onClick={() => {
                onDownloadPdf();
                setMenuOpen(false);
              }}
              disabled={exportingPdf}
              className="cursor-pointer px-4 py-2 rounded-md text-foreground font-medium hover:bg-accent-muted/20 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('downloadPdfButton')}
            </button>
            <button
              type="button"
              onClick={() => {
                onSave();
                setMenuOpen(false);
              }}
              className="cursor-pointer px-4 py-2 rounded-md text-foreground font-medium hover:bg-accent-muted/20 transition-colors text-left"
            >
              {t('saveButton')}
            </button>
          </div>
        )}

        <nav
          aria-label={t('bottomNav.label')}
          className="flex items-center gap-1 bg-surface border border-accent-muted rounded-full px-2 py-1 shadow-lg"
        >
          <button
            type="button"
            onClick={onOpenSidebar}
            aria-label={t('sidebar.toggleLabel')}
            className={iconButtonClass}
          >
            <ViewSidebarIcon fontSize="small" />
          </button>
          <Link href="/load" aria-label={t('bottomNav.myIdeasLabel')} className={iconButtonClass}>
            <NoteAltIcon fontSize="small" />
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-label={t('exportMenuButton')}
            className={iconButtonClass}
          >
            <DownloadIcon fontSize="small" />
          </button>
          <Link href="/" aria-label={t('bottomNav.newIdeaLabel')} className={iconButtonClass}>
            <AddIcon fontSize="small" />
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default BottomNav;
