import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Domain } from '../types/content';
import { domainLabels, domainOrder } from '../content/sponsors';
import { asset } from '../lib/asset';

export interface FieldItem {
  id: string;
  name: string;
  logoUrl: string;
  domain: Domain;
  impact: number; // 0-100. Decides diameter, and therefore height in the column.
  to?: string; // Real partners link through. Filler does not.
  isFiller: boolean;
}

// Where a pending bubble was dropped, and the size range that position allows.
export interface Placement {
  domain: Domain;
  minImpact: number;
  maxImpact: number;
  impact: number;
}

interface SponsorFieldProps {
  items: FieldItem[];
  isPlacing?: boolean;
  onPlace?: (placement: Placement) => void;
  onCancelPlacing?: () => void;
  previewImpact?: number | null;
  previewDomain?: Domain | null;
}

const HEADING_SPACE = 54;
const GAP = 12;
const PAD = 12;
const ROW_GAP = 40;
// Nine names across the top is the target. Below this column width the
// heading type would fall under ~6.5px, so the domains wrap instead.
const MIN_COLUMN = 82;
// Preferred column counts, widest first. Nine across, then a clean 3x3.
const LAYOUTS = [9, 3, 2, 1];
// The average advance of a sans letter plus a safety margin, so the longest
// domain name never reaches the edge of its column.
const CHAR_EM = 0.62;
const LONGEST_LABEL = Math.max(...Object.values(domainLabels).map((label) => label.length));
const MIN_D = 40;
const MAX_D = 132;
const SPRING = 0.05;
const DAMPING = 0.9;
const POINTER_REACH = 120;
const POINTER_FORCE = 2.4;
const REST_SPEED = 0.06;

interface Body {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  homeX: number;
  homeY: number;
}

function diameterFor(impact: number, columnWidth: number): number {
  const scale = Math.min(1, columnWidth / 128);
  const max = Math.max(MIN_D + 10, MAX_D * scale);
  const min = Math.max(24, MIN_D * scale);
  return min + (Math.max(0, Math.min(100, impact)) / 100) * (max - min);
}

// A stable sideways offset per bubble, so a column reads as a drift of
// circles rather than a ruler-straight stack. Deterministic, so the field
// looks the same on every render.
function jitterFor(id: string, columnWidth: number): number {
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) {
    hash = (hash * 31 + id.charCodeAt(index)) | 0;
  }
  const unit = ((hash >>> 0) % 1000) / 1000 - 0.5;
  return unit * columnWidth * 0.34;
}

export function SponsorField({
  items,
  isPlacing = false,
  onPlace,
  onCancelPlacing,
  previewImpact = null,
  previewDomain = null,
}: SponsorFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bodiesRef = useRef<Body[]>([]);
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const frameRef = useRef<number | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [fillerOpacity, setFillerOpacity] = useState(1);
  const [ghost, setGhost] = useState<{ x: number; y: number } | null>(null);

  const reduceMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Nine columns only fit a wide screen. On anything narrower the domains
  // wrap into a grid of cells, each still a heading with its own partners
  // beneath it, so nothing ever scrolls sideways.
  const perRow =
    width > 0 ? (LAYOUTS.find((count) => width / count >= MIN_COLUMN) ?? 1) : domainOrder.length;
  const columnWidth = width > 0 ? width / perRow : 0;

  // The heading is sized to its column so that the longest domain name fits on
  // one line. A narrower window simply compresses the whole field.
  const headingFont =
    columnWidth > 0 ? Math.max(6.5, Math.min(12.5, (columnWidth - 6) / (LONGEST_LABEL * CHAR_EM))) : 10;

  // Each domain owns one cell. Within it, bubbles are stacked strictly by
  // impact, so a bubble higher than another is always the larger of the two.
  const columns = useMemo(() => {
    return domainOrder.map((domain, index) => ({
      domain,
      index,
      row: Math.floor(index / perRow),
      col: index % perRow,
      items: items.filter((item) => item.domain === domain).sort((a, b) => b.impact - a.impact),
    }));
  }, [items, perRow]);

  const ordered = useMemo(() => columns.flatMap((column) => column.items), [columns]);

  const { homes, rowTops, totalHeight } = useMemo(() => {
    if (columnWidth <= 0) {
      return { homes: [] as { x: number; y: number; r: number }[], rowTops: [] as number[], totalHeight: 0 };
    }

    const cellHeights = columns.map((column) => {
      let height = HEADING_SPACE + PAD;
      column.items.forEach((item) => {
        height += diameterFor(item.impact, columnWidth) + GAP;
      });
      return height + PAD;
    });

    // A row is as tall as its tallest cell.
    const rowCount = Math.ceil(domainOrder.length / perRow);
    const rowHeights = Array.from({ length: rowCount }, () => 0);
    columns.forEach((column, index) => {
      rowHeights[column.row] = Math.max(rowHeights[column.row], cellHeights[index]);
    });

    const tops: number[] = [];
    let cursor = 0;
    rowHeights.forEach((rowHeight) => {
      tops.push(cursor);
      cursor += rowHeight + ROW_GAP;
    });

    const result: { x: number; y: number; r: number }[] = [];
    columns.forEach((column) => {
      const centre = column.col * columnWidth + columnWidth / 2;
      let y = tops[column.row] + HEADING_SPACE + PAD;
      column.items.forEach((item) => {
        const d = diameterFor(item.impact, columnWidth);
        result.push({ x: centre + jitterFor(item.id, columnWidth), y: y + d / 2, r: d / 2 });
        y += d + GAP;
      });
    });

    return { homes: result, rowTops: tops, totalHeight: Math.max(0, cursor - ROW_GAP) };
  }, [columns, columnWidth, perRow]);

  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) => setWidth(entries[0]?.contentRect.width ?? 0));
    observer.observe(node);
    setWidth(node.clientWidth);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const previous = bodiesRef.current;
    const bodies: Body[] = homes.map((home, index) => {
      const prior = previous[index];
      return {
        x: prior ? prior.x : home.x,
        y: prior ? prior.y : home.y,
        vx: prior ? prior.vx : 0,
        vy: prior ? prior.vy : 0,
        r: home.r,
        homeX: home.x,
        homeY: home.y,
      };
    });
    bodiesRef.current = bodies;

    setHeight(totalHeight);

    bodies.forEach((body, index) => {
      const node = nodeRefs.current[index];
      if (node) {
        node.style.width = `${body.r * 2}px`;
        node.style.height = `${body.r * 2}px`;
        node.style.transform = `translate3d(${body.x - body.r}px, ${body.y - body.r}px, 0)`;
      }
    });
  }, [homes, totalHeight]);

  const step = useCallback(() => {
    const bodies = bodiesRef.current;
    const container = containerRef.current;
    if (!container || bodies.length === 0) {
      frameRef.current = null;
      return;
    }

    const pointer = pointerRef.current;
    const fieldWidth = container.clientWidth;
    const fieldHeight = container.clientHeight;

    for (const body of bodies) {
      body.vx += (body.homeX - body.x) * SPRING;
      body.vy += (body.homeY - body.y) * SPRING;

      if (pointer.active) {
        const dx = body.x - pointer.x;
        const dy = body.y - pointer.y;
        const distance = Math.hypot(dx, dy) || 0.001;
        const reach = POINTER_REACH + body.r;
        if (distance < reach) {
          const push = ((reach - distance) / reach) * POINTER_FORCE;
          body.vx += (dx / distance) * push;
          body.vy += (dy / distance) * push;
        }
      }
    }

    for (let i = 0; i < bodies.length; i += 1) {
      for (let j = i + 1; j < bodies.length; j += 1) {
        const a = bodies[i];
        const b = bodies[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const distance = Math.hypot(dx, dy) || 0.001;
        const overlap = a.r + b.r + 2 - distance;
        if (overlap > 0) {
          const nx = (dx / distance) * overlap * 0.5;
          const ny = (dy / distance) * overlap * 0.5;
          a.x -= nx;
          a.y -= ny;
          b.x += nx;
          b.y += ny;
        }
      }
    }

    let moving = false;
    bodies.forEach((body, index) => {
      body.vx *= DAMPING;
      body.vy *= DAMPING;
      body.x += body.vx;
      body.y += body.vy;
      body.x = Math.min(Math.max(body.x, body.r), Math.max(body.r, fieldWidth - body.r));
      body.y = Math.min(Math.max(body.y, body.r), Math.max(body.r, fieldHeight - body.r));

      const node = nodeRefs.current[index];
      if (node) {
        node.style.transform = `translate3d(${body.x - body.r}px, ${body.y - body.r}px, 0)`;
      }
      if (Math.hypot(body.vx, body.vy) > REST_SPEED) moving = true;
    });

    if (moving || pointer.active) {
      frameRef.current = requestAnimationFrame(step);
    } else {
      frameRef.current = null;
    }
  }, []);

  const wake = useCallback(() => {
    if (reduceMotion) return;
    if (frameRef.current === null) frameRef.current = requestAnimationFrame(step);
  }, [reduceMotion, step]);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  // Escape leaves placement mode without adding anything.
  useEffect(() => {
    if (!isPlacing) return;
    function onKey(keyEvent: KeyboardEvent) {
      if (keyEvent.key === 'Escape') onCancelPlacing?.();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isPlacing, onCancelPlacing]);

  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const node = containerRef.current;
        if (!node) return;
        const travelled = Math.max(0, 120 - node.getBoundingClientRect().top);
        setFillerOpacity(Math.max(0, 1 - travelled / 460));
      });
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Translates a drop point into a domain and the impact range that the
  // position allows: strictly below the bubble above it, strictly above the
  // bubble below it. That is what keeps the "higher means larger" rule true.
  const resolvePlacement = useCallback(
    (x: number, y: number): Placement => {
      const col = Math.max(0, Math.min(perRow - 1, Math.floor(x / columnWidth)));
      // The last row top at or above the drop decides which band was hit.
      let row = 0;
      rowTops.forEach((top, index) => {
        if (y >= top) row = index;
      });
      const domainIndex = Math.min(domainOrder.length - 1, row * perRow + col);
      const domain = domainOrder[domainIndex];
      const column = items
        .filter((item) => item.domain === domain && !item.isFiller)
        .sort((a, b) => b.impact - a.impact);

      let cursor = (rowTops[row] ?? 0) + HEADING_SPACE + PAD;
      let rank = column.length;
      for (let index = 0; index < column.length; index += 1) {
        const d = diameterFor(column[index].impact, columnWidth);
        if (y < cursor + d / 2) {
          rank = index;
          break;
        }
        cursor += d + GAP;
      }

      const above = rank > 0 ? column[rank - 1].impact : 100;
      const below = rank < column.length ? column[rank].impact : 0;
      const minImpact = Math.min(above - 1, below + 1);
      const maxImpact = Math.max(above - 1, below + 1);

      return {
        domain,
        minImpact,
        maxImpact,
        impact: Math.round((minImpact + maxImpact) / 2),
      };
    },
    [columnWidth, items, perRow, rowTops],
  );

  function pointFrom(clientX: number, clientY: number) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function handlePointerMove(pointerEvent: React.PointerEvent<HTMLDivElement>) {
    const point = pointFrom(pointerEvent.clientX, pointerEvent.clientY);
    if (!point) return;
    if (isPlacing) {
      setGhost(point);
      return;
    }
    pointerRef.current = { ...point, active: true };
    wake();
  }

  function handlePointerLeave() {
    pointerRef.current.active = false;
    setGhost(null);
    wake();
  }

  function handleClick(mouseEvent: React.MouseEvent<HTMLDivElement>) {
    if (!isPlacing) return;
    const point = pointFrom(mouseEvent.clientX, mouseEvent.clientY);
    if (!point) return;
    onPlace?.(resolvePlacement(point.x, point.y));
    setGhost(null);
  }

  const ghostDiameter =
    previewImpact !== null && columnWidth > 0 ? diameterFor(previewImpact, columnWidth) : 0;

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        style={{ height: height || undefined }}
        className={`relative w-full touch-pan-y ${isPlacing ? 'cursor-crosshair' : ''}`}
      >
        {/* Domain headings. The columns they label are computed, never drawn. */}
        {columnWidth > 0
          ? columns.map((column) => (
              <div
                key={column.domain}
                style={{ left: column.col * columnWidth, top: rowTops[column.row] ?? 0, width: columnWidth }}
                className="absolute px-0.5"
              >
                <p
                  style={{ fontSize: `${headingFont}px` }}
                  className="whitespace-nowrap border-b border-line pb-2 text-center font-medium leading-[1.4] text-ink-500"
                >
                  {domainLabels[column.domain]}
                </p>
              </div>
            ))
          : null}

        {/* Guidelines are only ever shown to an organizer who is placing. */}
        {isPlacing && columnWidth > 0
          ? Array.from({ length: Math.max(0, perRow - 1) }, (_, index) => (
              <div
                key={`guide-${index}`}
                style={{ left: (index + 1) * columnWidth }}
                className="pointer-events-none absolute bottom-0 top-0 w-px bg-blue-500/25"
              />
            ))
          : null}

        {ordered.map((item, index) => {
          const inner = (
            <img
              src={asset(item.logoUrl)}
              alt={item.isFiller ? '' : item.name}
              aria-hidden={item.isFiller || undefined}
              className="h-1/2 w-1/2 object-contain"
            />
          );

          return (
            <div
              key={item.id}
              ref={(node) => {
                nodeRefs.current[index] = node;
              }}
              style={{ opacity: item.isFiller ? fillerOpacity : 1 }}
              className="absolute left-0 top-0 will-change-transform"
            >
              {item.to && !isPlacing ? (
                <Link
                  to={item.to}
                  title={item.name}
                  className="flex h-full w-full items-center justify-center rounded-full border-2 border-bar bg-white transition-colors duration-300 ease-out hover:border-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  {inner}
                  <span className="sr-only">{item.name}</span>
                </Link>
              ) : (
                <div
                  aria-hidden="true"
                  className={`flex h-full w-full items-center justify-center rounded-full ${
                    item.isFiller ? 'border border-dashed border-line-strong' : 'border-2 border-bar bg-white'
                  }`}
                >
                  {inner}
                </div>
              )}
            </div>
          );
        })}

        {/* The bubble being dragged into place. */}
        {isPlacing && ghost && ghostDiameter > 0 ? (
          <div
            aria-hidden="true"
            style={{
              width: ghostDiameter,
              height: ghostDiameter,
              transform: `translate3d(${ghost.x - ghostDiameter / 2}px, ${ghost.y - ghostDiameter / 2}px, 0)`,
            }}
            className="pointer-events-none absolute left-0 top-0 rounded-full border-2 border-blue-500 bg-blue-100/70"
          />
        ) : null}
      </div>

      {previewDomain ? <span className="sr-only">Placing in {domainLabels[previewDomain]}</span> : null}
    </div>
  );
}
