import { SplitType } from '@prisma/client';
import { type User } from 'next-auth';
import Head from 'next/head';
import Link from 'next/link';
import { InfiniteScroll } from '~/components/InfiniteScroll';
import { flattenPages, nextPageParam } from '~/utils/pagination';
import MainLayout from '~/components/Layout/MainLayout';
import { ListGroup } from '~/components/ui/list-group';
import { EntityAvatar } from '~/components/ui/avatar';
import { type NextPageWithUser } from '~/types';
import { api } from '~/utils/api';
import { getCurrencyHelpers } from '~/utils/numbers';
import { type TFunction } from 'next-i18next';
import { useTranslationWithUtils } from '~/hooks/useTranslationWithUtils';
import { withI18nStaticProps } from '~/utils/i18n/server';
import { RefreshCcwDot } from 'lucide-react';
import { RecurringExpenseIndicator } from '~/components/Expense/RecurringExpenseIndicator';
import { Button } from '~/components/ui/button';
import React from 'react';

function getPaymentString(
  user: User,
  amount: bigint,
  paidBy: number,
  expenseUserAmt: bigint,
  isSettlement: boolean,
  t: TFunction,
  toUIString: (value: bigint) => string,
  isDeleted?: boolean,
) {
  if (isDeleted) {
    return null;
  } else if (0n === expenseUserAmt) {
    return <div className="text-muted-foreground text-sm">{t('ui.not_involved')}</div>;
  } else if (isSettlement) {
    return (
      <div className={`${user.id === paidBy ? 'text-positive' : 'text-negative'} text-sm`}>
        {t(user.id === paidBy ? 'activity.you_paid_amount' : 'activity.you_received_amount', {
          amount: toUIString(amount),
        })}
      </div>
    );
  } else {
    return (
      <div
        className={`${(user.id === paidBy) !== amount < 0n ? 'text-positive' : 'text-negative'} text-sm`}
      >
        {t(
          (user.id === paidBy) !== amount < 0n
            ? 'ui.expense.statements.you_lent_amount'
            : 'ui.expense.statements.you_owe_amount',
          {
            amount: toUIString(expenseUserAmt),
          },
        )}
      </div>
    );
  }
}

const ActivityPage: NextPageWithUser = ({ user }) => {
  const { displayName, t, toUIDate, i18n } = useTranslationWithUtils();
  const expensesQuery = api.expense.getAllExpenses.useInfiniteQuery(
    {},
    { getNextPageParam: nextPageParam },
  );
  const expenseItems = flattenPages(expensesQuery.data);

  const actions = React.useMemo(
    () => (
      <Link href="/recurring">
        <Button variant="ghost" size="sm">
          <RefreshCcwDot className="size-6" />
        </Button>
      </Link>
    ),
    [],
  );

  return (
    <>
      <Head>
        <title>{t('navigation.activity')}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout
        title={t('navigation.activity')}
        actions={actions}
        loading={expensesQuery.isPending}
      >
        <div className="flex flex-col gap-4">
          {!expensesQuery.isError && !expenseItems.length ? (
            <div className="text-muted-foreground mt-[30vh] text-center">{t('ui.no_activity')}</div>
          ) : null}
          <ListGroup className={expenseItems.length ? undefined : 'hidden'}>
            {expenseItems.map((e) => {
              const { toUIString } = getCurrencyHelpers({
                locale: i18n.language,
                currency: e.expense.currency,
              });

              return (
                <Link
                  href={`/expenses/${e.expenseId}`}
                  key={e.expenseId}
                  className="group/expense hover:bg-muted active:bg-muted flex gap-3 px-4 py-3 transition-colors"
                >
                  <div className="mt-0.5 shrink-0">
                    <EntityAvatar entity={e.expense.paidByUser} size={36} />
                  </div>
                  <div className="min-w-0">
                    {e.expense.deletedByUser ? (
                      <p className="text-destructive opacity-70">
                        {t('activity.user_deleted_expense', {
                          actor: e.expense.deletedByUser.id === user.id ? 'you' : 'other',
                          user: displayName(e.expense.deletedByUser),
                          expense: e.expense.name,
                        })}
                      </p>
                    ) : (
                      <p className="text-foreground">
                        {t(
                          e.expense.paidByUser.id === user.id
                            ? e.expense.amount > 0n
                              ? 'activity.you_paid_for_expense'
                              : 'activity.you_received_for_expense'
                            : e.expense.amount > 0n
                              ? 'activity.user_paid_for_expense'
                              : 'activity.user_received_for_expense',
                          {
                            user: displayName(e.expense.paidByUser),
                            amount: toUIString(e.expense.amount),
                            expense: e.expense.name,
                          },
                        )}
                      </p>
                    )}

                    {getPaymentString(
                      user,
                      e.expense.amount,
                      e.expense.paidBy,
                      e.amount,
                      e.expense.splitType === SplitType.SETTLEMENT,
                      t,
                      toUIString,
                      !!e.expense.deletedBy,
                    )}
                    <p className="text-muted-foreground flex items-center gap-1 text-xs">
                      {toUIDate(e.expense.expenseDate)}
                      {null !== e.expense.recurrenceId && <RecurringExpenseIndicator />}
                    </p>
                  </div>
                </Link>
              );
            })}
          </ListGroup>
          <InfiniteScroll
            hasNextPage={expensesQuery.hasNextPage}
            isFetching={expensesQuery.isFetching}
            isError={expensesQuery.isError}
            onLoadMore={
              expensesQuery.isError && !expensesQuery.isFetchNextPageError
                ? expensesQuery.refetch
                : expensesQuery.fetchNextPage
            }
          />
        </div>
      </MainLayout>
    </>
  );
};

ActivityPage.auth = true;

export const getStaticProps = withI18nStaticProps(['common']);

export default ActivityPage;
