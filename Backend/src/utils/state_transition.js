const SERVICE_TRANSITIONS = {
  'scheduled':    ['in_progress', 'cancelled'],
  'in_progress':  ['completed', 'cancelled'],
  'completed':    [],
  'cancelled':    []
};

const BUS_TRANSITIONS = {
  'operational':    ['maintenance', 'out_of_service'],
  'maintenance':    ['operational', 'out_of_service'],
  'out_of_service': []
};

const INCIDENT_TRANSITIONS = {
  'open':        ['in_progress', 'resolved'],
  'in_progress': ['resolved'],
  'resolved':    []
};

function validateTransition(entity, currentStatus, newStatus) {
  const map = {
    service:  SERVICE_TRANSITIONS,
    bus:      BUS_TRANSITIONS,
    incident: INCIDENT_TRANSITIONS
  }[entity];

  if (!map) {
    const error = new Error('Entity not recognized');
    error.status = 400;
    error.code = 'INVALID_ENTITY';
    throw error;
  }

  const allowed = map[currentStatus] || [];
  if (!allowed.includes(newStatus)) {
    const error = new Error(
      `Invalid transition: cannot move from '${currentStatus}' to '${newStatus}'`
    );
    error.status = 400;
    error.code = 'INVALID_STATE_TRANSITION';
    error.details = [{ currentStatus, newStatus, allowed }];
    throw error;
  }
}

module.exports = { validateTransition };