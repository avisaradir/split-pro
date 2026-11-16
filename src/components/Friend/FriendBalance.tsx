import { type User } from '@prisma/client';
import { clsx } from 'clsx';

import { useTranslationWithUtils } from '~/hooks/useTranslationWithUtils';
import type { MinimalBalance } from '~/types/balance.types';
import { EntityAvatar } from '../ui/avatar';

export const FriendBalance: React.FC<{
  user: User;
  balance: MinimalBalance;
  groupName?: string | null;
}> = ({ user, balance, groupName }) => {
  const { t, displayName, getCurrencyHelpersCached } = useTranslationWithUtils();
  const { toUIString } = getCurrencyHelpersCached(balance.currency);
  const isPositive = 0 < balance.amount;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <EntityAvatar entity={user} size={30} />
        <div>
          <div className="text-foreground">{displayName(user)}</div>
          {groupName ? <div className="text-muted-foreground text-xs">{groupName}</div> : null}
        </div>
      </div>
      <div>
        <div className={clsx('text-end text-xs', isPositive ? 'text-positive' : 'text-negative')}>
          {t(`ui.expense.statements.${isPositive ? 'you_lent' : 'you_owe'}`)}
        </div>
        <div className={`${isPositive ? 'text-positive' : 'text-negative'} flex text-end`}>
          {toUIString(balance.amount)}
        </div>
      </div>
    </div>
  );
};
