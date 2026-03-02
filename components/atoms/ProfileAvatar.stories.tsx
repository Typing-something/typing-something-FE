import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ProfileAvatar } from './ProfileAvatar'

const meta: Meta<typeof ProfileAvatar> = {
  title: 'Atoms/ProfileAvatar',
  component: ProfileAvatar,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ProfileAvatar>

export const WithImage: Story = {
  args: {
    src: '/hachiware.webp',
    alt: '프로필 이미지',
    size: 'h-10 w-10',
  },
}

export const NoImage: Story = {
  args: {
    src: null,
    alt: '프로필 이미지 없음',
    size: 'h-10 w-10',
  },
}

export const Large: Story = {
  args: {
    src: '/hachiware.webp',
    alt: '큰 프로필 이미지',
    size: 'h-16 w-16',
  },
}
