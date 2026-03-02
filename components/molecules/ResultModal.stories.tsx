import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SessionProvider } from 'next-auth/react'
import { ResultModal } from './ResultModal'

const mockSession = {
  expires: '2099-01-01',
  user: { name: '하치와레', email: 'hachi@example.com', image: '/hachiware.webp' },
}

const mockResult = {
  wpm: 82,
  cpm: 410,
  acc: 97,
  snapshots: [
    { second: 1, wpm: 60, acc: 95 },
    { second: 2, wpm: 70, acc: 96 },
    { second: 3, wpm: 82, acc: 97 },
  ],
}

const mockSong = {
  songId: 1,
  imageUrl: '/supernova.jpg',
  title: 'Supernova',
  artist: 'aespa',
  lyric: '사건은 다가와 Ah Oh Ay\n거세게 커져가 Ah Oh Ay',
  isFavorite: false,
}

const meta: Meta<typeof ResultModal> = {
  title: 'Molecules/ResultModal',
  component: ResultModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: { height: '700px' },
    },
  },
  decorators: [
    (Story) => (
      <SessionProvider session={mockSession}>
        <Story />
      </SessionProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ResultModal>

export const LoggedIn: Story = {
  args: {
    open: true,
    result: mockResult,
    song: mockSong,
    onClose: () => {},
    onToggleFavorite: () => {},
  },
}

export const Favorited: Story = {
  args: {
    open: true,
    result: mockResult,
    song: { ...mockSong, isFavorite: true },
    onClose: () => {},
    onToggleFavorite: () => {},
  },
}

export const Guest: Story = {
  decorators: [
    (Story) => (
      <SessionProvider session={null}>
        <Story />
      </SessionProvider>
    ),
  ],
  args: {
    open: true,
    result: mockResult,
    song: mockSong,
    onClose: () => {},
  },
}
