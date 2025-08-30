import dagre from 'dagre';
import { Node, Edge, Position } from '@xyflow/react';
import { ORG_UNITS } from '@/data/orgChart';

export interface LayoutOptions {
  rankdir?: 'TB' | 'BT' | 'LR' | 'RL';
  nodesep?: number;
  ranksep?: number;
  marginx?: number;
  marginy?: number;
}

const defaultOptions: LayoutOptions = {
  rankdir: 'TB',
  nodesep: 40,
  ranksep: 160,
  marginx: 20,
  marginy: 20,
};

// Calculate depth/hierarchy level for proper node positioning
const calculateNodeDepth = (nodeId: string): number => {
  // Founders are at depth 0
  if (nodeId.startsWith('founder-')) return 0;
  
  // Executive Director (Rodrigo) is at depth 1
  if (nodeId === 'executive-director') return 1;
  
  // Find the node
  const node = ORG_UNITS.find(unit => unit.id === nodeId);
  if (!node) return 0;
  
  // Departments are at depth 2
  if (node.type === 'department') return 2;
  
  // Teams are at depth 3+
  if (node.type === 'team' && node.parentId) {
    const parentDepth = calculateNodeDepth(node.parentId);
    return parentDepth + 1;
  }
  
  return 0;
};

export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  options: LayoutOptions = {}
): { nodes: Node[]; edges: Edge[] } => {
  const opts = { ...defaultOptions, ...options };
  
  const g = new dagre.graphlib.Graph();
  g.setGraph({ ...opts, ranker: 'tight-tree' });
  g.setDefaultEdgeLabel(() => ({}));

  // Group nodes by depth to ensure proper hierarchy
  const nodesByDepth = new Map<number, Node[]>();
  nodes.forEach((node) => {
    const depth = calculateNodeDepth(node.id);
    if (!nodesByDepth.has(depth)) {
      nodesByDepth.set(depth, []);
    }
    nodesByDepth.get(depth)!.push(node);
  });

  // Add nodes to dagre graph with hierarchy constraints
  nodes.forEach((node) => {
    const depth = calculateNodeDepth(node.id);
    g.setNode(node.id, { 
      width: node.measured?.width || 220, 
      height: node.measured?.height || 80,
      rank: depth // Ensure proper ranking by depth
    });
  });

  // Add a dummy invisible node to help center founders above executive
  if (nodes.some(n => n.id.startsWith('founder-')) && nodes.some(n => n.id === 'executive-director')) {
    g.setNode('founder-center-dummy', { 
      width: 1, 
      height: 1,
      rank: 0 // Same rank as founders
    });
  }

  // Add edges to dagre graph
  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  // Calculate layout
  dagre.layout(g);

  // Apply layout to nodes with depth-based Y positioning
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = g.node(node.id);
    const depth = calculateNodeDepth(node.id);
    
    // Center founders above executive if dummy node exists
    let adjustedX = nodeWithPosition.x - (node.measured?.width || 220) / 2;
    if (node.id.startsWith('founder-') && g.hasNode('founder-center-dummy')) {
      const dummyPosition = g.node('founder-center-dummy');
      const executivePosition = g.node('executive-director');
      if (dummyPosition && executivePosition) {
        // Center founders around the executive's X position
        const foundersCount = nodes.filter(n => n.id.startsWith('founder-')).length;
        const founderIndex = parseInt(node.id.split('-')[1]) - 1;
        const spacing = 280; // Space between founders
        const totalWidth = (foundersCount - 1) * spacing;
        adjustedX = executivePosition.x - totalWidth / 2 + founderIndex * spacing - (node.measured?.width || 220) / 2;
      }
    }
    
    return {
      ...node,
      targetPosition: Position.Top,
      sourcePosition: Position.Bottom,
      position: {
        x: adjustedX,
        // Use depth-based Y positioning to enforce hierarchy
        y: depth * (opts.ranksep || 160) + (nodeWithPosition.y - (node.measured?.height || 80) / 2) * 0.3,
      },
    };
  }).filter(node => node.id !== 'founder-center-dummy'); // Remove the dummy node

  return { nodes: layoutedNodes, edges };
};