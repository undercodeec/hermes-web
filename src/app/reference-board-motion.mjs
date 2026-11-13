// All moves operate on the same immutable illustrative board state.
export function createBoard(columns) {
  return columns.map(column => ({ ...column, cards: column.cards.map(card => [...card]) }));
}

export function chooseRandomMove(board, lastId = null, rng = Math.random) {
  if (board.length < 2) return null;
  const total = board.reduce((sum, column) => sum + column.cards.length, 0);
  const cap = Math.max(2, Math.ceil(total / board.length) + 2);
  // Keep at least one card per nonempty stage when there is a choice.
  let eligible = board.flatMap((column, source) => column.cards.length > 1 ? column.cards.map(card => ({ id: card[0], source })) : []);
  if (!eligible.length) eligible = board.flatMap((column, source) => column.cards.map(card => ({ id: card[0], source })));
  if (!eligible.length) return null;
  const alternatives = eligible.filter(item => item.id !== lastId);
  if (alternatives.length) eligible = alternatives;
  const pick = items => items[Math.min(items.length - 1, Math.max(0, Math.floor(rng() * items.length)))];
  const lead = pick(eligible);
  let destinations = board.map((column, index) => ({ index, size: column.cards.length })).filter(item => item.index !== lead.source && item.size < cap);
  if (!destinations.length) {
    const others = board.map((column, index) => ({ index, size: column.cards.length })).filter(item => item.index !== lead.source);
    const smallest = Math.min(...others.map(item => item.size));
    destinations = others.filter(item => item.size === smallest);
  }
  return { ...lead, target: pick(destinations).index };
}

export function moveLead(board, id, target) {
  const source = board.findIndex(column => column.cards.some(card => card[0] === id));
  if (source < 0 || !Number.isInteger(target) || target < 0 || target >= board.length || source === target) return board;
  const next = board.map(column => ({ ...column, cards: [...column.cards] }));
  const index = next[source].cards.findIndex(card => card[0] === id);
  const [card] = next[source].cards.splice(index, 1);
  next[target].cards.unshift(card);
  return next;
}

export function nominalTotal(cards) {
  return cards.reduce((sum, card) => sum + Number(card[1].match(/\$([\d,]+)/)?.[1].replaceAll(",", "") || 0), 0);
}

export function canAdvance({ visible, hidden, reduced, paused }) {
  return visible && !hidden && reduced === false && !paused;
}

// Anchor clipped cards at the nearest edge without scrolling the user's view.
export function anchorInRegion(rect, region, width, height) {
  const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
  return {
    left: clamp(rect.left, region.left, Math.max(region.left, region.right - width)),
    top: clamp(rect.top, region.top, Math.max(region.top, region.bottom - height)),
  };
}

export function separateCoincident(start, end, region, width, height) {
  if (Math.abs(start.left - end.left) + Math.abs(start.top - end.top) >= 4) return start;
  const maxLeft = region.right - width, maxTop = region.bottom - height;
  if (maxLeft - region.left >= 18) return { ...start, left: start.left + 18 <= maxLeft ? start.left + 18 : Math.max(region.left, start.left - 18) };
  if (maxTop - region.top >= 18) return { ...start, top: start.top + 18 <= maxTop ? start.top + 18 : Math.max(region.top, start.top - 18) };
  return start;
}
