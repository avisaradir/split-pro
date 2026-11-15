// One filled icon family for every navigation item (tab-bars.md › "Prefer filled symbols").
import {
  BanknotesIcon as SolidBanknotesIcon,
  ClockIcon as SolidClockIcon,
  PlusCircleIcon as SolidPlusCircleIcon,
  UserCircleIcon as SolidUserCircleIcon,
  UserGroupIcon as SolidUserGroupIcon,
} from '@heroicons/react/24/solid';
import { clsx } from 'clsx';
import { type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { LoadingSpinner } from '../ui/spinner';

interface MainLayoutProps {
  title?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  header?: React.ReactNode;
  loading?: boolean;
  hideAppBar?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  actions,
  hideAppBar,
  title,
  loading,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <div className="bg-background h-full w-full">
      <div
        vaul-drawer-wrapper=""
        className={clsx(
          'bg-background mx-auto flex h-full w-full flex-col lg:ml-[max(200px,calc((100%_-_48rem)/2))] lg:max-w-3xl lg:flex-row',
          hideAppBar ? '' : '',
        )}
      >
        <nav className="-ml-[200px] hidden w-[200px] shrink-0 px-3 py-4 lg:flex lg:flex-col lg:gap-1">
          <Link href="/balances" className="mb-6 flex min-h-11 items-center gap-2 px-3">
            <span className="text-xl font-bold">{t?.('meta.application_name') ?? 'SplitPro'}</span>
          </Link>
          <NavItemDesktop
            title={t?.('navigation.balances') ?? 'Balances'}
            Icon={SolidBanknotesIcon}
            link="/balances"
            currentPath={currentPath}
          />
          <NavItemDesktop
            title={t?.('navigation.groups') ?? 'Groups'}
            Icon={SolidUserGroupIcon}
            link="/groups"
            currentPath={currentPath}
          />
          <NavItemDesktop
            title={t?.('navigation.add_expense') ?? 'Add Expense'}
            Icon={SolidPlusCircleIcon}
            link="/add"
            currentPath={currentPath}
          />
          <NavItemDesktop
            title={t?.('navigation.activity') ?? 'Activity'}
            Icon={SolidClockIcon}
            link="/activity"
            currentPath={currentPath}
          />
          <NavItemDesktop
            title={t?.('navigation.account') ?? 'Account'}
            Icon={SolidUserCircleIcon}
            link="/account"
            currentPath={currentPath}
          />
        </nav>
        <div className="w-full overflow-auto pt-[env(safe-area-inset-top)] lg:px-6" id="mainlayout">
          {title ? (
            <div className="flex min-h-11 items-center justify-between gap-2 px-4 pt-3 pb-2">
              <h1 className="text-foreground min-w-0 truncate text-3xl font-bold tracking-tight">
                {title}
              </h1>
              {actions}
            </div>
          ) : null}
          <div className="px-4">
            {loading ? (
              <div className="mt-10 flex justify-center">
                <LoadingSpinner className="text-primary" />
              </div>
            ) : (
              children
            )}
          </div>
          <div className="h-28 lg:h-0" />
        </div>
      </div>

      <nav className="bg-card/80 border-separator fixed bottom-0 z-40 flex w-full justify-between border-t px-2 pb-[max(env(safe-area-inset-bottom),0.25rem)] backdrop-blur-xl backdrop-saturate-150 lg:hidden">
        <NavItem
          title={t?.('navigation.balances') ?? 'Balances'}
          Icon={SolidBanknotesIcon}
          link="/balances"
          currentPath={currentPath}
        />
        <NavItem
          title={t?.('navigation.groups') ?? 'Groups'}
          Icon={SolidUserGroupIcon}
          link="/groups"
          currentPath={currentPath}
        />
        <NavItem
          title={t?.('navigation.add') ?? 'Add'}
          Icon={SolidPlusCircleIcon}
          link="/add"
          currentPath={currentPath}
        />
        <NavItem
          title={t?.('navigation.activity') ?? 'Activity'}
          Icon={SolidClockIcon}
          link="/activity"
          currentPath={currentPath}
        />
        <NavItem
          title={t?.('navigation.account') ?? 'Account'}
          Icon={SolidUserCircleIcon}
          link="/account"
          currentPath={currentPath}
        />
      </nav>
    </div>
  );
};

interface NavItemProps {
  title: string;
  Icon: LucideIcon;
  link: string;
  currentPath?: string;
}

const NavItem: React.FC<NavItemProps> = ({ title, Icon, link, currentPath }) => {
  const isActive = currentPath?.startsWith(link);

  return (
    <Link
      href={link}
      aria-current={isActive ? 'page' : undefined}
      className={clsx(
        'flex min-h-[49px] flex-1 flex-col items-center justify-center gap-0.5 pt-1.5 active:opacity-70',
        isActive ? 'text-primary' : 'text-muted-foreground',
      )}
    >
      <Icon className="size-7" aria-hidden="true" />
      <span className="text-[0.6875rem] leading-[0.8125rem] font-medium">{title}</span>
    </Link>
  );
};

const NavItemDesktop: React.FC<NavItemProps> = ({ title, Icon, link, currentPath }) => {
  const isActive = currentPath?.startsWith(link);

  return (
    <Link
      href={link}
      aria-current={isActive ? 'page' : undefined}
      className={clsx(
        'flex min-h-11 items-center gap-3 rounded-lg px-3 transition-colors active:opacity-70',
        isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground hover:bg-muted',
      )}
    >
      <Icon className={clsx('size-6', !isActive && 'text-muted-foreground')} aria-hidden="true" />
      <span className="capitalize">{title}</span>
    </Link>
  );
};
export default MainLayout;
