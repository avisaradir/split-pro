import React, { useCallback } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../../ui/command';
import { AppDrawer } from '../../ui/drawer';
import { Check, Landmark } from 'lucide-react';
import { cn } from '~/lib/utils';
import { api } from '~/utils/api';
import Image from 'next/image';
import { AccountButton, AccountIcon } from '../AccountButton';
import { useTranslation } from 'next-i18next';

export const BankAccountSelect = ({
  bankConnectionEnabled,
}: {
  bankConnectionEnabled: boolean;
}) => {
  const { t } = useTranslation();

  const userQuery = api.user.me.useQuery();
  const updateProfile = api.user.updateUserDetail.useMutation();
  const institutions = api.bankTransactions.getInstitutions.useQuery();

  if (!bankConnectionEnabled) {
    return null;
  }

  const onSelect = useCallback(
    async (currentValue: string) => {
      await updateProfile.mutateAsync({ bankingId: currentValue.toUpperCase() });
      userQuery.refetch().catch((err) => console.error(err));
    },
    [updateProfile, userQuery],
  );

  return (
    <AppDrawer
      trigger={
        <AccountButton>
          <AccountIcon className="bg-blue-600">
            <Landmark />
          </AccountIcon>
          <p>{t('bank_transactions.choose_bank_provider')}</p>
        </AccountButton>
      }
      title={t('bank_transactions.select_bank_provider')}
      className="h-[70vh]"
    >
      <Command className="h-[50vh]">
        <CommandInput className="text-lg" placeholder={t('bank_transactions.search_bank')} />
        <CommandEmpty>{t('bank_transactions.no_bank_providers_found')}</CommandEmpty>
        <CommandGroup className="h-full overflow-auto">
          {institutions?.data?.map((framework) => (
            <CommandItem key={framework.id} value={framework.id} onSelect={onSelect}>
              <Check
                className={cn(
                  'mr-2 h-4 w-4',
                  framework.id === userQuery.data?.bankingId ? 'opacity-100' : 'opacity-0',
                )}
              />
              <div className="flex gap-2">
                {framework.logo && (
                  <Image
                    alt={framework.name}
                    src={framework.logo}
                    width={20}
                    height={20}
                    objectFit="contain"
                    className="rounded-sm"
                  />
                )}
                <p>{framework.name}</p>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </Command>
    </AppDrawer>
  );
};
