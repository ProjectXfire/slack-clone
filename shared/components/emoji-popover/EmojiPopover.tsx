"use client";

import { useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import styles from "./Styles.module.css";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/Popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/Tooltip";

interface Props {
  children: React.ReactNode;
  hint?: string;
  onEmojiSelect: (emoji: string) => void;
}

function EmojiPopover({ children, hint = "Emoji", onEmojiSelect }: Props): JSX.Element {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const onSelect = (emoji: string) => {
    onEmojiSelect(emoji);
    setPopoverOpen(false);
    setTimeout(() => {
      setTooltipOpen(false);
    }, 500);
  };

  return (
    <TooltipProvider>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <Tooltip open={tooltipOpen} delayDuration={50} onOpenChange={setTooltipOpen}>
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent>{hint}</TooltipContent>
        </Tooltip>
        <PopoverContent className={styles["emoji-popover-content"]}>
          <Picker
            data={data}
            onEmojiSelect={(value: { native: string }) => onSelect(value.native)}
          />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
}
export default EmojiPopover;
