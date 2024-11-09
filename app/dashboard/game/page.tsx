import React from 'react'
import { GameMetadata } from '@/constants/data'
import { GameMetaTable } from '@/components/tables/game-table/game-table'
import { columns } from '@/components/tables/game-table/columns';
import PageContainer from '@/components/layout/page-container';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Heading } from '@/components/ui/heading';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import NewGameDialogComponent from '@/components/simulation/create-new-game-dialog';
const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Simulation', link: '/dashboard/simulation' }
];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

async function page ({ searchParams }: paramsProps) {
try {

    const response = await fetch('http://cyborg-api-container:5555/api/games/',
      {
        cache: 'no-store'
      }) // no overlay network betwween networks as of now
    
    if (!response.ok) {
      throw new Error('Failed to fetch games')
    }
    const data = await response.json()
    const games: GameMetadata[] = data.games
    const totalUsers = games.length;
    const page = Number(searchParams.page) || 1;
    const pageLimit = Number(searchParams.limit) || 10;
    const pageCount = Math.ceil(totalUsers / pageLimit);
    console.log(data)
    return (
        <PageContainer>
          <div className="space-y-4">
            <Breadcrumbs items={breadcrumbItems} />

            <div className="flex items-start justify-between">
              <Heading
                title={`Simulation (${totalUsers})`}
                description="Manage your simulation (Server side table functionalities.)"
              />
              <NewGameDialogComponent />
            </div>

            <Separator />

            <GameMetaTable 
                searchKey="game_id"
                pageNo={page}
                columns={columns}
                totalUsers={totalUsers}
                pageCount={pageCount}
                data={games} 
              />
          </div>
        </PageContainer>
      )
} catch (e) {
    console.error(e)
    return (
      <div>error</div>
    )
}
}
export default page