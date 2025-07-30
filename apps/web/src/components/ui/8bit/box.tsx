import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

import { Box as NormalBox } from "@/components/ui/box";

export const cardVariants = cva("", {
  variants: {
    font: {
      normal: "",
      retro: "retro",
    },
  },
  defaultVariants: {
    font: "retro",
  },
});


export interface BitCardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {
  asChild?: boolean;
}


function Box({ ...props }: BitCardProps) {
  const { className, font } = props;

  return (
    <div
      className={cn(
        "relative border-y-6 border-foreground dark:border-ring !p-0",
        className
      )}
    >
      <NormalBox
        {...props}
        className={cn(
          "rounded-none border-0",
          font !== "normal" && "retro",
          className
        )}
      />

      <div
        className="absolute inset-0 border-x-6 -mx-1.5 border-foreground dark:border-ring pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}

export {Box}