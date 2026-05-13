ALTER TABLE leads
  ADD COLUMN cta_outcome TEXT
    CHECK (cta_outcome IN ('follow_up_booked', 'brochure_sent', 'declined', 'unclear'));
