
"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

function AnimatedTabs({
  className,
  children,
  ...props
}) {
  return (
    <TabsPrimitive.Root
      data-slot="animated-tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      {children}
    </TabsPrimitive.Root>
  );
}

function AnimatedTabsList({
  className,
  children,
  ...props
}) {
  const [activeTab, setActiveTab] = React.useState(null);
  const [tabsInfo, setTabsInfo] = React.useState({});
  const listRef = React.useRef(null);

  React.useEffect(() => {
    if (!listRef.current) return;

    const updateTabsInfo = () => {
      const triggers = listRef.current.querySelectorAll('[data-slot="animated-tabs-trigger"]');
      const newTabsInfo = {};
      
      triggers.forEach((trigger, index) => {
        const rect = trigger.getBoundingClientRect();
        const listRect = listRef.current.getBoundingClientRect();
        
        newTabsInfo[trigger.getAttribute('data-value')] = {
          left: rect.left - listRect.left,
          width: rect.width,
          index
        };
      });
      
      setTabsInfo(newTabsInfo);
    };

    updateTabsInfo();
    window.addEventListener('resize', updateTabsInfo);
    
    return () => window.removeEventListener('resize', updateTabsInfo);
  }, [children]);

  React.useEffect(() => {
    if (!listRef.current) return;

    const observer = new MutationObserver(() => {
      const activeTrigger = listRef.current.querySelector('[data-state="active"]');
      if (activeTrigger) {
        setActiveTab(activeTrigger.getAttribute('data-value'));
      }
    });

    observer.observe(listRef.current, {
      attributes: true,
      subtree: true,
      attributeFilter: ['data-state']
    });

    // Set initial active tab
    const activeTrigger = listRef.current.querySelector('[data-state="active"]');
    if (activeTrigger) {
      setActiveTab(activeTrigger.getAttribute('data-value'));
    }

    return () => observer.disconnect();
  }, []);

  const activeTabInfo = activeTab ? tabsInfo[activeTab] : null;

  return (
    <TabsPrimitive.List
      ref={listRef}
      data-slot="animated-tabs-list"
      className={cn(
        "bg-muted text-muted-foreground relative inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      )}
      {...props}
    >
      {/* Sliding indicator */}
      {activeTabInfo && (
        <div
          className="absolute bg-background rounded-md shadow-sm transition-all duration-200 ease-out z-0"
          style={{
            left: activeTabInfo.left,
            width: activeTabInfo.width,
            height: 'calc(100% - 6px)',
            top: '3px',
            transform: 'translateZ(0)', // Force hardware acceleration
          }}
        />
      )}
      {children}
    </TabsPrimitive.List>
  );
}

function AnimatedTabsTrigger({
  className,
  value,
  ...props
}) {
  return (
    <TabsPrimitive.Trigger
      data-slot="animated-tabs-trigger"
      data-value={value}
      value={value}
      className={cn(
        "relative z-10 inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
        "data-[state=active]:text-foreground text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    />
  );
}

function AnimatedTabsContent({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.Content
      data-slot="animated-tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { AnimatedTabs, AnimatedTabsList, AnimatedTabsTrigger, AnimatedTabsContent }
