import { 
  InfrastructureNode, 
  ProbableIncident, 
  Ticket, 
  Category, 
  IncidentStatus,
  IncidentConfidenceFactors 
} from '../types';
import { CAMPUS_INFRASTRUCTURE_GRAPH, INITIAL_PROBABLE_INCIDENTS } from '../data/infrastructure-graph';

// Operational memory store for incidents
let incidentStore: ProbableIncident[] = [...INITIAL_PROBABLE_INCIDENTS];

export function getIncidents(): ProbableIncident[] {
  return [...incidentStore];
}

export function getIncidentById(id: string): ProbableIncident | undefined {
  return incidentStore.find(inc => inc.id === id || inc.incidentNumber === id);
}

/**
 * Deterministically maps a ticket location to the most specific leaf node in the graph.
 */
export function mapTicketToInfrastructureNode(
  ticket: Pick<Ticket, 'building' | 'floor' | 'room' | 'category'>,
  graph: InfrastructureNode[] = CAMPUS_INFRASTRUCTURE_GRAPH
): InfrastructureNode | undefined {
  const categoryNodes = graph.filter(n => n.category === ticket.category && n.isActive);
  
  // 1. Try matching building and floor
  if (ticket.floor !== undefined) {
    const floorNum = typeof ticket.floor === 'number' ? ticket.floor : parseInt(String(ticket.floor), 10);
    const floorMatch = categoryNodes.find(n => 
      n.building.toLowerCase() === ticket.building.toLowerCase() && 
      n.floor === floorNum
    );
    if (floorMatch) return floorMatch;
  }

  // 2. Fall back to building-level node
  const buildingMatch = categoryNodes.find(n => 
    n.building.toLowerCase() === ticket.building.toLowerCase()
  );
  if (buildingMatch) return buildingMatch;

  // 3. Fall back to root category node
  return categoryNodes.find(n => n.parentIds.length === 0);
}

/**
 * Traverses upwards through parent nodes to find full ancestry path to root.
 */
export function getNodeAncestors(
  nodeId: string, 
  graph: InfrastructureNode[] = CAMPUS_INFRASTRUCTURE_GRAPH
): string[] {
  const ancestors: string[] = [nodeId];
  let current = graph.find(n => n.id === nodeId);

  while (current && current.parentIds.length > 0) {
    const parentId = current.parentIds[0];
    ancestors.push(parentId);
    current = graph.find(n => n.id === parentId);
  }

  return ancestors;
}

/**
 * Computes the Lowest Common Ancestor (shared upstream node) for a set of nodes.
 */
export function findLowestCommonAncestor(
  nodeIds: string[],
  graph: InfrastructureNode[] = CAMPUS_INFRASTRUCTURE_GRAPH
): InfrastructureNode | undefined {
  if (nodeIds.length === 0) return undefined;
  if (nodeIds.length === 1) return graph.find(n => n.id === nodeIds[0]);

  // Get ancestor paths for all nodes
  const paths = nodeIds.map(id => getNodeAncestors(id, graph));

  // The first path is our reference. Check which node appears in all paths from leaf-to-root.
  const referencePath = paths[0];

  for (const candidateId of referencePath) {
    const isSharedByAll = paths.every(path => path.includes(candidateId));
    if (isSharedByAll) {
      return graph.find(n => n.id === candidateId);
    }
  }

  return undefined;
}

/**
 * Computes transparent, deterministic confidence factors for an incident candidate.
 */
export function calculateIncidentConfidence(
  tickets: Ticket[],
  sharedNode: InfrastructureNode
): IncidentConfidenceFactors {
  const distinctRooms = new Set(tickets.map(t => t.room).filter(Boolean));
  const distinctFloors = new Set(tickets.map(t => t.floor).filter(f => f !== undefined));
  
  const timestamps = tickets.map(t => new Date(t.createdAt).getTime()).sort();
  const timeSpanMinutes = timestamps.length > 1 
    ? Math.round((timestamps[timestamps.length - 1] - timestamps[0]) / (60 * 1000))
    : 15;

  let score = 50;
  const factors: string[] = [];

  // Ticket count boost
  const countBoost = Math.min(tickets.length * 8, 25);
  score += countBoost;
  factors.push(`${tickets.length} incident reports clustered in ${tickets[0].category}`);

  // Geographic spread boost
  if (distinctRooms.size >= 2) {
    score += 10;
    factors.push(`Spread across ${distinctRooms.size} distinct rooms/locations`);
  }
  if (distinctFloors.size >= 2) {
    score += 10;
    factors.push(`Spans ${distinctFloors.size} separate building floors`);
  }

  // Time proximity boost
  if (timeSpanMinutes <= 180) {
    score += 8;
    factors.push(`High temporal concentration (within ${timeSpanMinutes} minutes)`);
  }

  // Topological parent specificity
  if (sharedNode.type === 'building_switch' || sharedNode.type === 'distribution_board' || sharedNode.type === 'riser') {
    score += 5;
    factors.push(`Direct shared upstream parent: ${sharedNode.name}`);
  }

  const finalScore = Math.min(Math.max(score, 50), 98);

  return {
    ticketCount: tickets.length,
    distinctRoomsCount: distinctRooms.size,
    distinctFloorsCount: distinctFloors.size,
    timeWindowMinutes: Math.max(timeSpanMinutes, 15),
    confidenceScore: finalScore,
    factors,
  };
}

/**
 * Evaluates ticket clusters and generates proposed incidents when thresholds are met.
 * Thresholds: >= 3 tickets, >= 2 distinct rooms/floors, <= 24h window.
 */
export function evaluateTicketClusterForIncidents(
  category: Category,
  allTickets: Ticket[],
  graph: InfrastructureNode[] = CAMPUS_INFRASTRUCTURE_GRAPH
): ProbableIncident | null {
  const now = Date.now();
  const windowMs = 24 * 3600 * 1000; // 24 hours

  // 1. Filter open or recently created tickets in same category
  const candidateTickets = allTickets.filter(t => 
    t.category === category &&
    t.status !== 'closed' &&
    (now - new Date(t.createdAt).getTime()) <= windowMs
  );

  if (candidateTickets.length < 3) {
    return null; // Minimum threshold not met
  }

  // 2. Group by building
  const byBuilding: Record<string, Ticket[]> = {};
  for (const t of candidateTickets) {
    byBuilding[t.building] = byBuilding[t.building] || [];
    byBuilding[t.building].push(t);
  }

  for (const [building, bTickets] of Object.entries(byBuilding)) {
    if (bTickets.length < 3) continue;

    // Check distinct rooms or floors
    const distinctRooms = new Set(bTickets.map(t => t.room).filter(Boolean));
    const distinctFloors = new Set(bTickets.map(t => t.floor).filter(f => f !== undefined));

    if (distinctRooms.size < 2 && distinctFloors.size < 2) {
      continue; // Isolated to a single room
    }

    // Map each ticket to leaf node
    const leafNodes = bTickets.map(t => mapTicketToInfrastructureNode(t, graph)).filter(Boolean) as InfrastructureNode[];
    if (leafNodes.length === 0) continue;

    // Find Lowest Common Ancestor
    const sharedNode = findLowestCommonAncestor(leafNodes.map(n => n.id), graph);
    if (!sharedNode) continue;

    const confidence = calculateIncidentConfidence(bTickets, sharedNode);

    const incident: ProbableIncident = {
      id: `inc-${Date.now()}`,
      incidentNumber: `INC-2026-${String(incidentStore.length + 1).padStart(3, '0')}`,
      category,
      title: `Probable ${category.toUpperCase()} Outage affecting ${building} (${sharedNode.name})`,
      sharedNodeId: sharedNode.id,
      sharedNodeName: sharedNode.name,
      sharedNodeType: sharedNode.type,
      building,
      status: 'proposed',
      confidence,
      memberTicketIds: bTickets.map(t => t.id),
      aiExplanation: `Deterministic graph clustering mapped ${bTickets.length} reports in ${building} to shared parent node ${sharedNode.name}. The geographic spread across ${confidence.distinctRoomsCount} rooms suggests an upstream component fault rather than individual user endpoints.`,
      technicianWorkOrderDraft: `1. Inspect upstream node: ${sharedNode.name}.\n2. Check primary feed and diagnostic status LEDs.\n3. Measure throughput/pressure at secondary manifolds.\n4. Verify restoration across member rooms: ${Array.from(distinctRooms).join(', ')}.`,
      studentNotice: `Campus Operations has detected a suspected ${category} outage affecting ${building}. Technical personnel are actively troubleshooting the upstream distribution.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return incident;
  }

  return null;
}

/**
 * Confirm an incident: sets status to confirmed, creates unified work order,
 * links member tickets, and returns the updated incident.
 */
export function confirmIncident(
  incidentId: string,
  staffName: string,
  workOrderNotes?: string
): ProbableIncident | undefined {
  const incident = incidentStore.find(i => i.id === incidentId);
  if (!incident) return undefined;

  incident.status = 'confirmed';
  incident.assignedStaffName = staffName;
  incident.updatedAt = new Date().toISOString();
  if (workOrderNotes) {
    incident.technicianWorkOrderDraft = workOrderNotes;
  }

  return incident;
}

/**
 * Dismiss an incident with a recorded reason.
 */
export function dismissIncident(
  incidentId: string,
  reason: string
): ProbableIncident | undefined {
  const incident = incidentStore.find(i => i.id === incidentId);
  if (!incident) return undefined;

  incident.status = 'dismissed';
  incident.dismissalReason = reason;
  incident.updatedAt = new Date().toISOString();

  return incident;
}

/**
 * Resolve an incident.
 */
export function resolveIncident(
  incidentId: string
): ProbableIncident | undefined {
  const incident = incidentStore.find(i => i.id === incidentId);
  if (!incident) return undefined;

  incident.status = 'resolved';
  incident.resolvedAt = new Date().toISOString();
  incident.updatedAt = new Date().toISOString();

  return incident;
}
