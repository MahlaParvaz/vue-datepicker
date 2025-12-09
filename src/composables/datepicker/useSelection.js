import { useSingleSelection } from './strategies/useSingleSelection.js';
import { useRangeSelection } from './strategies/useRangeSelection.js';
import { useMultipleSelection } from './strategies/useMultipleSelection.js';
import { SELECTION_MODES } from '../../constants/datepicker.js';


const SELECTION_STRATEGIES = {
  [SELECTION_MODES.SINGLE]: useSingleSelection,
  [SELECTION_MODES.RANGE]: useRangeSelection,
  [SELECTION_MODES.MULTIPLE]: useMultipleSelection,
};

/**
 * Factory to create a selection strategy based on mode.
 *
 * @param {string} mode - Selection mode ('single', 'range', 'multiple').
 * @param {*} initialValue - Initial selection value.
 * @returns {*} Selection strategy instance.
 * @throws {Error} If the mode is invalid.
 */
export function createSelection(mode, initialValue = null) {
  const strategy = SELECTION_STRATEGIES[mode];

  if (!strategy) {
    const validModes = Object.keys(SELECTION_STRATEGIES).join(', ');
    throw new Error(
      `[createSelection] Unknown selection mode: "${mode}". Valid modes: ${validModes}`,
    );
  }

  return strategy(initialValue);
}

/**
 * Checks if a given mode is a valid selection mode.
 *
 * @param {string} mode - Selection mode to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
export function isValidSelectionMode(mode) {
  return Object.values(SELECTION_MODES).includes(mode);
}
