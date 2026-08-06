import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FooterCopyright } from "./FooterCopyright";

const meta: Meta<typeof FooterCopyright> = {
  title: "Atoms/FooterCopyright",
  component: FooterCopyright,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FooterCopyright>;

export const Default: Story = {};

export const CustomYear: Story = {
  args: {
    year: 2025,
    siteName: "TypeSomething",
  },
};
