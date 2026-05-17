import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AppFooter } from "./AppFooter";

const meta: Meta<typeof AppFooter> = {
  title: "Organisms/AppFooter",
  component: AppFooter,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof AppFooter>;

export const Default: Story = {
  args: {
    fixed: false,
  },
};

export const Fixed: Story = {
  args: {
    fixed: true,
  },
  decorators: [
    (Story) => (
      <div className="relative min-h-[200px] bg-neutral-100">
        <Story />
      </div>
    ),
  ],
};
