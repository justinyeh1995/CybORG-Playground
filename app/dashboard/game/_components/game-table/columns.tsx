'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from "@/components/ui/badge"
import { GameMetadata } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import Link from 'next/link';

export const columns: ColumnDef<GameMetadata>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'game_id',
    header: 'GAME ID',
    cell: ({ row }) => ( 
      <Link href={`/dashboard/simulation/${row.original.game_id}`}>
        <Badge>
          {row.original.game_id}
        </Badge>
      </Link>)
  },
  {
    accessorKey: 'completed',
    header: 'DONE',
    cell: ({ row }) => (row.original.completed ? 'Yes' : 'No')
  },
  {
    accessorKey: 'step',
    header: 'Current step number'
  },
  {
    accessorKey: 'config.steps',
    header: 'Maximum number of steps' 
  },
  {
    accessorKey: 'config.red_agent',
    header: 'Red Agent'
  },
  {
    accessorKey: 'config.blue_agent',
    header: 'Blue Agent'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
