import { useState, useMemo, useCallback } from 'react';
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ORG_UNITS, type OrgUnit } from '@/data/orgChart';
import { getLayoutedElements } from '@/lib/layoutDagre';
import { GroupNode } from './nodes/GroupNode';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Search, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import OrgTabs from './OrgTabs';
import { toPng } from 'html-to-image';

const nodeTypes = {
  group: GroupNode,
};

function GraphContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<OrgUnit | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set());
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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
          searchQuery
        }
      });

      // Add edges for parent-child relationships
      if (unit.parentId) {
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
  }, [visibleUnits, expandedDepartments, searchQuery, handleToggleExpansion]);

  // Apply layout
  const { nodes: layoutNodes, edges: layoutEdges } = useMemo(() => {
    return getLayoutedElements(initialNodes, initialEdges, {
      rankdir: 'TB',
      nodesep: 80,
      ranksep: 120,
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
    setSearchQuery(query);
    
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
    }
  }, []);

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

  return (
    <div className="h-full w-full bg-gradient-to-br from-white/5 to-white/0" 
         style={{ fontFamily: '"Product Sans", "Google Sans", "Inter", system-ui, sans-serif' }}>
      {/* Header Controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-col gap-4">
        {/* Search and Export */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search members, teams, or roles..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border-white/20 rounded-2xl"
            />
          </div>
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

        {/* Tabs */}
        <OrgTabs
          pillars={departments}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* React Flow */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{
          padding: 0.1,
          maxZoom: 1.2,
        }}
        className="bg-transparent"
        style={{
          backgroundColor: 'transparent',
        }}
      >
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

const NeonOrgGraph = () => {
  return (
    <ReactFlowProvider>
      <GraphContent />
    </ReactFlowProvider>
  );
};

export default NeonOrgGraph;