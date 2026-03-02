import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TypingResultChart } from './TypingResultChart'

const meta: Meta<typeof TypingResultChart> = {
  title: 'Molecules/TypingResultChart',
  component: TypingResultChart,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TypingResultChart>

export const Steady: Story = {
  args: {
    snapshots: [
      { second: 1, wpm: 70, acc: 95 },
      { second: 2, wpm: 72, acc: 96 },
      { second: 3, wpm: 71, acc: 96 },
      { second: 4, wpm: 73, acc: 97 },
      { second: 5, wpm: 74, acc: 97 },
      { second: 6, wpm: 73, acc: 96 },
      { second: 7, wpm: 75, acc: 97 },
      { second: 8, wpm: 74, acc: 97 },
      { second: 9, wpm: 76, acc: 98 },
      { second: 10, wpm: 75, acc: 97 },
    ],
  },
}

export const Improving: Story = {
  args: {
    snapshots: [
      { second: 1, wpm: 35, acc: 78 },
      { second: 2, wpm: 44, acc: 82 },
      { second: 3, wpm: 52, acc: 85 },
      { second: 4, wpm: 60, acc: 88 },
      { second: 5, wpm: 67, acc: 91 },
      { second: 6, wpm: 73, acc: 93 },
      { second: 7, wpm: 78, acc: 94 },
      { second: 8, wpm: 83, acc: 96 },
      { second: 9, wpm: 87, acc: 97 },
      { second: 10, wpm: 91, acc: 98 },
    ],
  },
}

export const Struggling: Story = {
  args: {
    snapshots: [
      { second: 1, wpm: 82, acc: 98 },
      { second: 2, wpm: 70, acc: 92 },
      { second: 3, wpm: 55, acc: 82 },
      { second: 4, wpm: 42, acc: 73 },
      { second: 5, wpm: 38, acc: 70 },
      { second: 6, wpm: 45, acc: 75 },
      { second: 7, wpm: 52, acc: 79 },
      { second: 8, wpm: 58, acc: 83 },
      { second: 9, wpm: 54, acc: 80 },
      { second: 10, wpm: 50, acc: 78 },
    ],
  },
}
