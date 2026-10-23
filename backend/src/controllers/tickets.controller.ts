import { Request, Response } from 'express';
import { 
  getTickets, 
  getTicketById, 
  createTicket, 
  updateTicketStatus, 
  assignTicket, 
  verifyTicketProofOfFix, 
  rateTicket, 
  getDuplicates, 
  linkDuplicateTickets, 
  dismissDuplicate, 
  getRecurrenceInsights, 
  getNotifications, 
  markNotificationRead,
  resetStoreToDemo 
} from '../data/store';

export const listTickets = (req: Request, res: Response): void => {
  const tickets = getTickets();
  res.status(200).json({ tickets });
};

export const getTicket = (req: Request, res: Response): void => {
  const { id } = req.params;
  const ticket = getTicketById(id);
  if (!ticket) {
    res.status(404).json({ error: 'Ticket not found' });
    return;
  }
  res.status(200).json({ ticket });
};

export const create = (req: Request, res: Response): void => {
  try {
    const payload = req.body;
    if (!payload.title || !payload.category || !payload.building) {
      res.status(400).json({ error: 'title, category, and building are required' });
      return;
    }

    const ticket = createTicket(payload);
    res.status(201).json({ ticket });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to create ticket' });
  }
};

export const updateStatus = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { status, actorName, actorRole, notes } = req.body;

  const updated = updateTicketStatus(id, status, actorName || 'Operations Staff', actorRole || 'staff', notes);
  if (!updated) {
    res.status(404).json({ error: 'Ticket not found' });
    return;
  }

  res.status(200).json({ ticket: updated });
};

export const assign = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { staffId, staffName, assignedBy } = req.body;

  const updated = assignTicket(id, staffId, staffName, assignedBy || 'Lead Dispatcher');
  if (!updated) {
    res.status(404).json({ error: 'Ticket not found' });
    return;
  }

  res.status(200).json({ ticket: updated });
};

export const verifyFix = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { assessment, technicianNotes, postRepairImageUrl } = req.body;

  const updated = verifyTicketProofOfFix(id, assessment, technicianNotes || '', postRepairImageUrl);
  if (!updated) {
    res.status(404).json({ error: 'Ticket not found' });
    return;
  }

  res.status(200).json({ ticket: updated });
};

export const rate = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { rating, feedback, confirmed } = req.body;

  const updated = rateTicket(id, rating, feedback, confirmed ?? true);
  if (!updated) {
    res.status(404).json({ error: 'Ticket not found' });
    return;
  }

  res.status(200).json({ ticket: updated });
};

export const duplicates = (req: Request, res: Response): void => {
  res.status(200).json({ duplicates: getDuplicates() });
};

export const linkDuplicate = (req: Request, res: Response): void => {
  const { duplicateId, primaryTicketId, staffName } = req.body;
  const success = linkDuplicateTickets(duplicateId, primaryTicketId, staffName || 'Supervisor');
  res.status(200).json({ success });
};

export const recurrence = (req: Request, res: Response): void => {
  res.status(200).json({ recurrenceInsights: getRecurrenceInsights() });
};

export const notifications = (req: Request, res: Response): void => {
  res.status(200).json({ notifications: getNotifications() });
};

export const reset = (req: Request, res: Response): void => {
  resetStoreToDemo();
  res.status(200).json({ message: 'Store reset to initial demo state' });
};
