import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  MarkerType,
  useReactFlow,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import React from 'react';

import { ORG_UNITS, type OrgUnit } from '@/data/orgChart';
import { getLayoutedElements } from '@/lib/layoutDagre';
import { GroupNode } from './nodes/GroupNode';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Search, Download, Eye, EyeOff, X, ZoomIn, ZoomOut, RotateCcw, Maximize2, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import OrgTabs from './OrgTabs';
import { toPng } from 'html-to-image';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const nodeTypes = {
  group: GroupNode,
};

// Helper functions for localStorage
const getStoredGraphExpandState = (): Set<string> => {
  if (typeof window === 'undefined') return new Set();
  const stored = localStorage.getItem('org-graph-expanded-departments');
  if (stored === null) {
    // First time - expand all departments
    const allDepartmentIds = ORG_UNITS
      .filter(unit => unit.type === 'department')
      .map(unit => unit.id);
    return new Set(allDepartmentIds);
  }
  try {
    return new Set(JSON.parse(stored));
  } catch {
    return new Set();
  }
};

const setStoredGraphExpandState = (expanded: Set<string>): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('org-graph-expanded-departments', JSON.stringify([...expanded]));
  }
};

const getStoredZoomState = (): any => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('org.zoom.v1');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const setStoredZoomState = (viewport: any): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('org.zoom.v1', JSON.stringify(viewport));
  }
};

interface GraphContentProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  clearSearchTrigger?: boolean;
}

function GraphContent({ searchQuery = "", onSearchChange, clearSearchTrigger = false }: GraphContentProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState(searchQuery);
  const [selectedNode, setSelectedNode] = useState<OrgUnit | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(getStoredGraphExpandState);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { fitView, zoomIn, zoomOut, setViewport, getViewport } = useReactFlow();

  // Handle external search clearing
  React.useEffect(() => {
    if (clearSearchTrigger) {
      setInternalSearchQuery("");
    }
  }, [clearSearchTrigger]);

  // Sync with external search
  React.useEffect(() => {
    setInternalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Restore zoom state and fit view on mount
  useEffect(() => {
    const storedViewport = getStoredZoomState();
    if (storedViewport) {
      setViewport(storedViewport);
    } else {
      // First visit - fit to view with padding
      setTimeout(() => {
        fitView({ padding: 0.2, includeHiddenNodes: false });
      }, 100);
    }
  }, [fitView, setViewport]);

  // Auto-fit when departments expand/collapse
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fitView({ padding: 0.2, includeHiddenNodes: false });
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [expandedDepartments, fitView]);

  // Get all departments for tabs
  const departments = useMemo(() => 
    ORG_UNITS.filter(unit => unit.type === 'department'), 
    []
  );

  // Get visible units based on active tab and expansion state
  const visibleUnits = useMemo(() => {
    let units = ORG_UNITS;
    
    if (activeTab !== 'all') {
      // Show only the selected department and its teams
      const selectedDepartment = ORG_UNITS.find(unit => unit.id === activeTab);
      if (selectedDepartment) {
        units = [
          ...ORG_UNITS.filter(unit => unit.type === 'founder' || unit.type === 'executive-director'),
          selectedDepartment,
          ...ORG_UNITS.filter(unit => unit.parentId === activeTab)
        ];
      }
    } else {
      // Show founders, executive director, departments, and expanded teams
      units = ORG_UNITS.filter(unit => {
        if (unit.type === 'founder' || unit.type === 'executive-director' || unit.type === 'department') return true;
        if (unit.type === 'team' && unit.parentId && expandedDepartments.has(unit.parentId)) return true;
        return false;
      });
    }
    
    return units;
  }, [activeTab, expandedDepartments]);

  // Handle tab change
  const handleTabChange = useCallback((newTab: string) => {
    setActiveTab(newTab);
    setInternalSearchQuery(""); // Clear search on tab change
    onSearchChange?.("");
    
    // Fit view after tab change with longer delay for better UX
    setTimeout(() => {
      fitView({ padding: 0.2, includeHiddenNodes: false });
    }, 500);
  }, [fitView, onSearchChange]);
  // Toggle expansion handler (defined before use in nodes memo)
  const handleToggleExpansion = useCallback((departmentId: string) => {
    console.log('handleToggleExpansion called with:', departmentId);
    setExpandedDepartments((prev) => {
      const newSet: Set<string> = new Set<string>();
      if (prev.has(departmentId)) {
        // Close all if clicking the currently open department
        console.log('Closing department:', departmentId);
        return newSet;
      } else {
        // Accordion behavior: open only this department
        console.log('Opening department:', departmentId);
        newSet.add(departmentId);
        return newSet;
      }
    });
  }, []);

  const toggleExpandAll = useCallback(() => {
    const allDepartmentIds = ORG_UNITS
      .filter(unit => unit.type === 'department')
      .map(unit => unit.id);
    
    setExpandedDepartments(prev => {
      const isAllExpanded = allDepartmentIds.every(id => prev.has(id));
      const newSet = isAllExpanded ? new Set<string>() : new Set(allDepartmentIds);
      setStoredGraphExpandState(newSet);
      return newSet;
    });
  }, []);

  // Create nodes and edges
  const { initialNodes, initialEdges } = useMemo(() => {
    console.log('Creating nodes and edges, handleToggleExpansion:', typeof handleToggleExpansion);
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    visibleUnits.forEach((unit, index) => {
      const memberCount = unit.members?.length || 0;
      const teamCount = ORG_UNITS.filter(u => u.parentId === unit.id).length;
      
      nodes.push({
        id: unit.id,
        type: 'group',
        position: { x: 0, y: 0 },
        data: {
          ...unit,
          memberCount,
          teamCount,
          onToggleExpansion: handleToggleExpansion,
          isExpanded: expandedDepartments.has(unit.id),
          searchQuery: internalSearchQuery
        }
      });

      // Add edges for parent-child relationships including founder->rodrigo
      if (unit.id === 'executive-director') {
        // Connect both founders to Rodrigo
        edges.push({
          id: 'edge-founder-1-executive-director',
          source: 'founder-1',
          target: 'executive-director',
          type: 'smoothstep',
          style: { 
            stroke: 'hsl(var(--border))', 
            strokeWidth: 2
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: 'hsl(var(--border))',
          },
        });
        edges.push({
          id: 'edge-founder-2-executive-director',
          source: 'founder-2',
          target: 'executive-director',
          type: 'smoothstep',
          style: { 
            stroke: 'hsl(var(--border))', 
            strokeWidth: 2
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: 'hsl(var(--border))',
          },
        });
      } else if (unit.parentId) {
        const parentExists = visibleUnits.some(u => u.id === unit.parentId);
        if (parentExists) {
          edges.push({
            id: `edge-${unit.parentId}-${unit.id}`,
            source: unit.parentId,
            target: unit.id,
            type: 'smoothstep',
            style: { 
              stroke: 'hsl(var(--border))', 
              strokeWidth: 2,
              strokeDasharray: unit.type === 'team' ? '5,5' : undefined
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: 'hsl(var(--border))',
            },
          });
        }
      }
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [visibleUnits, expandedDepartments, internalSearchQuery, handleToggleExpansion]);

  // Apply layout
  const { nodes: layoutNodes, edges: layoutEdges } = useMemo(() => {
    return getLayoutedElements(initialNodes, initialEdges, {
      rankdir: 'TB',
      nodesep: 40,
      ranksep: 160,
    });
  }, [initialNodes, initialEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutEdges);


  const onNodeClick = useCallback((_: any, node: Node) => {
    const unit = ORG_UNITS.find(u => u.id === node.id);
    if (unit && unit.members && unit.members.length > 0) {
      setSelectedNode(unit);
      setIsSheetOpen(true);
    }
  }, []);

  const handleSearch = useCallback((query: string) => {
    setInternalSearchQuery(query);
    onSearchChange?.(query);
    
    if (query.trim()) {
      // Find units or members that match the search
      const matchingUnits = ORG_UNITS.filter(unit => 
        unit.name.toLowerCase().includes(query.toLowerCase()) ||
        unit.members?.some(member => 
          member.name.toLowerCase().includes(query.toLowerCase()) ||
          member.role?.toLowerCase().includes(query.toLowerCase())
        )
      );

      // Expand departments that contain matching teams
      const departmentsToExpand = new Set<string>();
      matchingUnits.forEach(unit => {
        if (unit.parentId && unit.type === 'team') {
          departmentsToExpand.add(unit.parentId);
        }
      });
      
      setExpandedDepartments(departmentsToExpand);
      setStoredGraphExpandState(departmentsToExpand);
    }
  }, [onSearchChange]);

  const clearSearchHandler = useCallback(() => {
    setInternalSearchQuery("");
    onSearchChange?.("");
  }, [onSearchChange]);

  const handleExportPNG = useCallback(async () => {
    const element = document.querySelector('.react-flow') as HTMLElement;
    if (element) {
      try {
        const dataUrl = await toPng(element, {
          backgroundColor: '#ffffff',
          style: {
            fontFamily: '"Product Sans", "Google Sans", "Inter", system-ui, sans-serif',
          }
        });
        
        const link = document.createElement('a');
        link.download = `org-chart-${new Date().toISOString().split('T')[0]}.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error exporting PNG:', error);
      }
    }
  }, []);

  const handleZoomIn = useCallback(() => {
    zoomIn();
  }, [zoomIn]);

  const handleZoomOut = useCallback(() => {
    zoomOut();
  }, [zoomOut]);

  const handleFitView = useCallback(() => {
    fitView({ padding: 0.2, includeHiddenNodes: false });
  }, [fitView]);

  const handleReset = useCallback(() => {
    setViewport({ x: 0, y: 0, zoom: 1 });
    localStorage.removeItem('org.zoom.v1');
    setTimeout(() => {
      fitView({ padding: 0.2, includeHiddenNodes: false });
    }, 100);
  }, [setViewport, fitView]);

  const handleMoveEnd = useCallback((event: any, viewport: any) => {
    setStoredZoomState(viewport);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey)) {
        switch (event.key) {
          case '+':
          case '=':
            event.preventDefault();
            zoomIn();
            break;
          case '-':
            event.preventDefault();
            zoomOut();
            break;
          case '0':
            event.preventDefault();
            handleReset();
            break;
        }
      } else if (event.key === 'f') {
        event.preventDefault();
        handleFitView();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomIn, zoomOut, handleReset, handleFitView]);

  return (
    <div className="h-full w-full bg-gradient-to-br from-white/5 to-white/0 with-nav-safe-area" 
         style={{ 
           fontFamily: '"Product Sans", "Google Sans", "Inter", system-ui, sans-serif'
         }}>
      {/* Header Controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-col gap-4 lg:flex-row lg:flex-wrap">
        {/* Search and Export - Line 1 */}
        <div className="flex gap-4 items-center w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search members, teams, or roles..."
              value={internalSearchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-10 bg-white/80 backdrop-blur-sm border-white/20 rounded-2xl"
            />
            {internalSearchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 rounded-xl p-0 hover:bg-white/60"
                onClick={clearSearchHandler}
                aria-label="Clear search"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <Button
            onClick={toggleExpandAll}
            variant="outline"
            size="sm"
            className="bg-white/80 backdrop-blur-sm border-white/20 rounded-2xl hover:bg-white/90"
          >
            {ORG_UNITS.filter(unit => unit.type === 'department').every(unit => expandedDepartments.has(unit.id)) ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Collapse All
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Expand All
              </>
            )}
          </Button>
          <Button
            onClick={handleExportPNG}
            variant="outline"
            size="sm"
            className="bg-white/80 backdrop-blur-sm border-white/20 rounded-2xl hover:bg-white/90"
          >
            <Download className="h-4 w-4 mr-2" />
            Export PNG
          </Button>
        </div>

        {/* Tabs - Line 2 */}
        <div className="w-full sticky top-[var(--nav-h)] z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <OrgTabs
            pillars={departments}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onSearchClear={clearSearchHandler}
          />
        </div>
      </div>

      {/* React Flow */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onMoveEnd={handleMoveEnd}
        minZoom={0.2}
        maxZoom={2.0}
        zoomOnScroll={true}
        panOnDrag={true}
        className="bg-transparent"
        style={{
          backgroundColor: 'transparent',
        }}
      >
        {/* Zoom Controls Panel */}
        <Panel position="top-right" className="flex flex-col gap-2 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-2 z-30" style={{ top: 'calc(var(--tabs-bottom) + 8px)' }}>
          <Button
            onClick={handleZoomIn}
            variant="outline"
            size="sm"
            className="w-10 h-10 p-0 bg-white/80 hover:bg-white/90"
            title="Zoom In (Ctrl/Cmd +)"
            aria-label="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleZoomOut}
            variant="outline"
            size="sm"
            className="w-10 h-10 p-0 bg-white/80 hover:bg-white/90"
            title="Zoom Out (Ctrl/Cmd -)"
            aria-label="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleFitView}
            variant="outline"
            size="sm"
            className="w-10 h-10 p-0 bg-white/80 hover:bg-white/90"
            title="Fit to Screen (F)"
            aria-label="Fit to Screen"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="w-10 h-10 p-0 bg-white/80 hover:bg-white/90"
            title="Reset View (Ctrl/Cmd 0)"
            aria-label="Reset View"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-10 h-10 p-0 bg-white/80 hover:bg-white/90"
                title="Help"
                aria-label="Help"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 text-sm">
              <div className="space-y-2">
                <p><strong>Navigation:</strong></p>
                <p>• Use +/− or trackpad to zoom</p>
                <p>• Press <kbd className="bg-gray-100 px-1 rounded">F</kbd> to fit view</p>
                <p>• <kbd className="bg-gray-100 px-1 rounded">Ctrl/Cmd 0</kbd> to reset</p>
                <p>• Click nodes to view details</p>
              </div>
            </PopoverContent>
          </Popover>
        </Panel>
        <MiniMap 
          nodeStrokeColor="#64748b"
          nodeColor="#e2e8f0"
          nodeBorderRadius={16}
          maskColor="rgba(0, 0, 0, 0.1)"
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/10 shadow-lg"
        />
        <Controls 
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/10 shadow-lg"
          showInteractive={false}
        />
        <Background 
          color="#e2e8f0" 
          size={2} 
          className="opacity-30"
        />
      </ReactFlow>

      {/* Details Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] bg-white/95 backdrop-blur-sm border-white/10 rounded-2xl shadow-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2" 
                        style={{ fontFamily: '"Product Sans", "Google Sans", "Inter", system-ui, sans-serif' }}>
              {selectedNode && (
                <>
                  <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-blue-500/80 to-purple-600/80 flex items-center justify-center shadow-lg">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                  {selectedNode.name}
                </>
              )}
            </SheetTitle>
            <SheetDescription>
              {selectedNode?.description}
            </SheetDescription>
          </SheetHeader>
          
          {selectedNode?.members && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold" 
                  style={{ fontFamily: '"Product Sans", "Google Sans", "Inter", system-ui, sans-serif' }}>
                Team Members
              </h3>
              <div className="grid gap-3">
                {selectedNode.members
                  .sort((a, b) => {
                    // Leaders first, then alphabetical
                    const aIsLead = a.role?.toLowerCase().includes('lead') || 
                                   a.role?.toLowerCase().includes('director') || 
                                   a.role?.toLowerCase().includes('head');
                    const bIsLead = b.role?.toLowerCase().includes('lead') || 
                                   b.role?.toLowerCase().includes('director') || 
                                   b.role?.toLowerCase().includes('head');
                    
                    if (aIsLead && !bIsLead) return -1;
                    if (!aIsLead && bIsLead) return 1;
                    return a.name.localeCompare(b.name);
                  })
                  .map((member, index) => (
                  <div 
                    key={index}
                    className="p-3 rounded-2xl bg-white/60 border border-white/10 backdrop-blur-sm shadow-sm"
                  >
                    <div className="font-medium text-foreground">{member.name}</div>
                    {member.role && (
                      <div className="text-sm text-muted-foreground mt-1">{member.role}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

interface NeonOrgGraphProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  clearSearchTrigger?: boolean;
}

const NeonOrgGraph: React.FC<NeonOrgGraphProps> = (props) => {
  return (
    <ReactFlowProvider>
      <GraphContent {...props} />
    </ReactFlowProvider>
  );
};

export default NeonOrgGraph;