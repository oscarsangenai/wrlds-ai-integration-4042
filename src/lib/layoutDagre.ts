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
  nodesep: 80,
  ranksep: 140,
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
    
    return {
      ...node,
      targetPosition: Position.Top,
      sourcePosition: Position.Bottom,
      position: {
        x: nodeWithPosition.x - (node.measured?.width || 220) / 2,
        // Use depth-based Y positioning to enforce hierarchy
        y: depth * (opts.ranksep || 140) + (nodeWithPosition.y - (node.measured?.height || 80) / 2) * 0.3,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};