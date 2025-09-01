import { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  MarkerType,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import React from 'react';

import { ORG_UNITS, type OrgUnit } from '@/data/orgChart';
import { getLayoutedElements } from '@/lib/layoutDagre';
import { GroupNode } from './nodes/GroupNode';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toPng } from 'html-to-image';

const nodeTypes = {
  group: GroupNode,
};

function GraphContent() {
  const { getNodes } = useReactFlow();

  // Show entire organization - no filtering
  const visibleUnits = useMemo(() => {
    // Show all units - founders, executive director, departments, and all teams
    return ORG_UNITS;
  }, []);

  // Create nodes and edges for full organization
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    visibleUnits.forEach((unit) => {
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
          isExpanded: true, // Always expanded
          searchQuery: ""
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
  }, [visibleUnits]);

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

  const handleExportPNG = useCallback(async () => {
    const nodes = getNodes();
    if (nodes.length === 0) {
      console.warn('Nothing to export');
      return;
    }

    const xs = nodes.map(n => n.position.x);
    const ys = nodes.map(n => n.position.y);
    const ws = nodes.map(n => n.width ?? 0);
    const hs = nodes.map(n => n.height ?? 0);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs.map((x, i) => x + ws[i]));
    const maxY = Math.max(...ys.map((y, i) => y + hs[i]));
    const width = Math.ceil(maxX - minX + 64);
    const height = Math.ceil(maxY - minY + 64);
    
    const element = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (!element) {
      console.error('React Flow viewport not found');
      return;
    }

    const previousTransform = element.style.transform;
    element.style.transform = `translate(${-minX + 32}px, ${-minY + 32}px) scale(1)`;
    
    try {
      const dataUrl = await toPng(element, {
        pixelRatio: 2,
        backgroundColor: undefined,
        style: {
          width: `${width}px`,
          height: `${height}px`,
          fontFamily: '"Product Sans", "Google Sans", "Inter", system-ui, sans-serif',
        }
      });
      
      const ts = new Date();
      const filename = `org-chart-${ts.getFullYear()}${String(ts.getMonth() + 1).padStart(2, '0')}${String(ts.getDate()).padStart(2, '0')}-${String(ts.getHours()).padStart(2, '0')}${String(ts.getMinutes()).padStart(2, '0')}.png`;
      
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error exporting PNG:', error);
    } finally {
      element.style.transform = previousTransform;
    }
  }, [getNodes]);


  return (
    <div 
      className="h-full w-full with-nav-safe-area nav-safe bg-org-gradient" 
      style={{ 
        fontFamily: '"Product Sans", "Google Sans", "Inter", system-ui, sans-serif',
        backgroundImage: 'linear-gradient(135deg, #000000 0%, #120017 40%, #2a0054 68%, #6b21a8 100%)'
      }}>
      {/* Export Button */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-overlay pointer-events-auto">
        <Button
          onClick={handleExportPNG}
          variant="outline"
          size="sm"
          className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border-white/30 rounded-2xl hover:from-purple-500/30 hover:to-blue-500/30 shadow-lg"
          aria-label="Export org chart as PNG"
        >
          <Download className="h-4 w-4 mr-2" />
          Export PNG
        </Button>
      </div>

      {/* React Flow */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        minZoom={0.2}
        maxZoom={2.0}
        zoomOnScroll={true}
        panOnDrag={true}
        className="bg-transparent"
        style={{
          backgroundColor: 'transparent',
        }}
      />
    </div>
  );
}

const NeonOrgGraph: React.FC = () => {
  return (
    <ReactFlowProvider>
      <GraphContent />
    </ReactFlowProvider>
  );
};

export default NeonOrgGraph;