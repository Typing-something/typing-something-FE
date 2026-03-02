import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { IconButton } from './IconButton'

const meta: Meta<typeof IconButton> = {
  title: 'Atoms/IconButton',
  component: IconButton,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof IconButton>

export const Default: Story = {
  args: {
    ariaLabel: '닫기',
    variant: 'default',
    children: '✕',
  },
}

export const Ghost: Story = {
  args: {
    ariaLabel: '닫기',
    variant: 'ghost',
    children: '✕',
  },
}

export const Disabled: Story = {
  args: {
    ariaLabel: '비활성화된 버튼',
    variant: 'default',
    disabled: true,
    children: '✕',
  },
}
