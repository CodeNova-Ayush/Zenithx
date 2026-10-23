import { Request, Response } from 'express';
import { analyzeStudentComplaint } from '../services/complaint-analysis.service';
import { queryCampusBrain } from '../services/campus-brain.service';
import { reviewResolutionEvidence } from '../services/resolution-review.service';
import { getTickets } from '../data/store';

export const analyzeComplaint = async (req: Request, res: Response): Promise<void> => {
  try {
    const { complaintText, locationHint, imageBase64, imageMimeType } = req.body;

    if (!complaintText || typeof complaintText !== 'string') {
      res.status(400).json({ error: 'complaintText is required' });
      return;
    }

    const result = await analyzeStudentComplaint({
      complaintText,
      locationHint,
      imageBase64,
      imageMimeType,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in analyzeComplaint controller:', error);
    res.status(500).json({ error: 'Internal AI Analysis Error' });
  }
};

export const campusBrain = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'query string is required' });
      return;
    }

    const currentTickets = getTickets();
    const result = await queryCampusBrain(query, currentTickets);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in campusBrain controller:', error);
    res.status(500).json({ error: 'Internal Campus Brain Query Error' });
  }
};

export const reviewResolution = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticket, resolutionPhotoBase64, technicianNotes } = req.body;

    if (!ticket) {
      res.status(400).json({ error: 'ticket payload is required' });
      return;
    }

    const result = await reviewResolutionEvidence({
      ticket,
      resolutionPhotoBase64,
      technicianNotes,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in reviewResolution controller:', error);
    res.status(500).json({ error: 'Internal Proof-of-Fix Review Error' });
  }
};
