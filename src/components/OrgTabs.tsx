import { memo } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface OrgTabsProps {
  pillars: Array<{ id: string; name: string }>;
  activeTab: string;
  onTabChange: (value: string) => void;
}

const OrgTabs = memo(({ pillars, activeTab, onTabChange }: OrgTabsProps) => {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="h-9 bg-white/50 backdrop-blur-sm border-white/20 p-1 w-fit min-w-full rounded-2xl">
          <TabsTrigger 
            value="all" 
            className="text-xs px-3 py-1 rounded-xl data-[state=active]:bg-white/80 data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            style={{ fontFamily: '"Product Sans", "Google Sans", "Inter", system-ui, sans-serif' }}
          >
            All Departments
          </TabsTrigger>
          {pillars.map((pillar) => (
            <TabsTrigger
              key={pillar.id}
              value={pillar.id}
              className="text-xs px-3 py-1 rounded-xl data-[state=active]:bg-white/80 data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              style={{ fontFamily: '"Product Sans", "Google Sans", "Inter", system-ui, sans-serif' }}
            >
              {pillar.name.length > 18 ? `${pillar.name.substring(0, 15)}...` : pillar.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
});

OrgTabs.displayName = 'OrgTabs';

export default OrgTabs;