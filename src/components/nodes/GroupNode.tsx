import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { CATEGORY_ICON } from '@/data/orgChart';
import { cn } from '@/lib/utils';

interface GroupNodeProps {
  data: {
    id: string;
    name: string;
    type: 'founder' | 'executive-director' | 'department' | 'team';
    icon: keyof typeof CATEGORY_ICON;
    memberCount: number;
    teamCount?: number;
    isExpanded?: boolean;
    onToggleExpansion?: (id: string) => void;
    description?: string;
  };
  selected?: boolean;
}

export const GroupNode = memo(({ data, selected }: GroupNodeProps) => {
  const IconComponent = CATEGORY_ICON[data.icon];
  const isExpandable = data.type === 'department' && (data.teamCount || 0) > 0;
  
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onToggleExpansion && isExpandable) {
      data.onToggleExpansion(data.id);
    }
  };

  const getNodeStyles = () => {
    switch (data.type) {
      case 'founder':
        return 'border-2 border-amber-400 bg-gradient-to-br from-amber-50/80 to-amber-100/60 shadow-xl shadow-amber-400/20';
      case 'executive-director':
        return 'border-2 border-blue-500 bg-gradient-to-br from-blue-50/80 to-blue-100/60 shadow-xl shadow-blue-500/20';
      case 'department':
        return 'border-2 border-purple-400 bg-gradient-to-br from-purple-50/80 to-purple-100/60 shadow-lg shadow-purple-400/15';
      case 'team':
        return 'border border-slate-300 bg-gradient-to-br from-white/80 to-slate-50/60 shadow-md';
      default:
        return 'border border-slate-300 bg-gradient-to-br from-white/80 to-slate-50/60';
    }
  };

  const getTextStyles = () => {
    switch (data.type) {
      case 'founder':
        return 'text-amber-800 font-bold text-base';
      case 'executive-director':
        return 'text-blue-800 font-bold text-base';
      case 'department':
        return 'text-purple-800 font-semibold';
      case 'team':
        return 'text-slate-700 font-medium';
      default:
        return 'text-slate-700';
    }
  };

  const getIconStyles = () => {
    switch (data.type) {
      case 'founder':
        return 'text-amber-600 bg-amber-100/80';
      case 'executive-director':
        return 'text-blue-600 bg-blue-100/80';
      case 'department':
        return 'text-purple-600 bg-purple-100/80';
      case 'team':
        return 'text-slate-600 bg-slate-100/80';
      default:
        return 'text-slate-600 bg-slate-100/80';
    }
  };

  return (
    <div className={cn(
      'relative min-w-[240px] max-w-[240px] p-4 rounded-2xl transition-all duration-300 backdrop-blur-sm',
      getNodeStyles(),
      selected && 'ring-2 ring-primary ring-offset-2',
      'hover:scale-105 hover:shadow-2xl'
    )} style={{ fontFamily: '"Product Sans", "Google Sans", "Inter", system-ui, sans-serif' }}>
      {/* Input Handle for non-founder nodes */}
      {data.type !== 'founder' && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-white border-2 border-slate-400 shadow-sm rounded-full"
        />
      )}
      
      <div className="flex items-start gap-3">
        <div className={cn(
          "flex-shrink-0 p-2 rounded-xl shadow-sm",
          getIconStyles()
        )}>
          <IconComponent size={20} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className={cn(
              'leading-tight',
              getTextStyles()
            )}>
              {data.name.length > 32 ? `${data.name.substring(0, 29)}...` : data.name}
            </h3>
            
            {isExpandable && (
              <button
                onClick={handleToggle}
                className="flex-shrink-0 p-1 hover:bg-white/60 rounded-lg transition-colors ml-2"
                aria-label={data.isExpanded ? 'Collapse' : 'Expand'}
              >
                {data.isExpanded ? (
                  <ChevronDown size={16} className="text-slate-600" />
                ) : (
                  <ChevronRight size={16} className="text-slate-600" />
                )}
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-sm text-slate-600 mb-2">
            {data.teamCount && data.teamCount > 0 && (
              <span className="px-2 py-1 bg-white/60 rounded-lg text-xs font-medium">
                {data.teamCount} teams
              </span>
            )}
            {(
              <span className="px-2 py-1 bg-white/60 rounded-lg text-xs font-medium" title="Counts reflect orgChart.ts">
                {data.memberCount} member{data.memberCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          {data.description && (
            <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
              {data.description}
            </p>
          )}
        </div>
      </div>
      
      {/* Output Handle for non-team nodes */}
      {data.type !== 'team' && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-white border-2 border-slate-400 shadow-sm rounded-full"
        />
      )}
    </div>
  );
});

GroupNode.displayName = 'GroupNode';