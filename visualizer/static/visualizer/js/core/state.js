/* =========================================================================
   CONSTANTS & STATE
   ========================================================================= */
const NS = 'http://www.w3.org/2000/svg';
const NODE_R = 24;

let canvasW = 900;
let canvasH = 620;
let zoom = 1;

const $ = id => document.getElementById(id);

let edgeSeq = 1;
const makeEdge = (source, target, directed = false) =>
  ({ id: 'e' + (edgeSeq++), source, target, directed });

const graph = { nodes: [], edges: [] };

let mode = 'select';
let directedMode = false;

let selectedNodeId = null;
let selectedEdgeId = null;
let pendingEdgeFrom = null;

let isDragging = false;
let draggingNode = null;
let dragOffset = { x: 0, y: 0 };
let didDrag = false;

let isDrawingEdge = false;
let edgeDrawSource = null;
let mousePos = null;
let suppressClick = false;

/* Panning */
let isPanning = false;
let panStart = { x: 0, y: 0, scrollLeft: 0, scrollTop: 0 };
let spaceDown = false;
let suppressNextSvgClick = false;
let panMoved = false;

/* Canvas resize */
let resizeState = null;

/* Touch */
let touchState = null;

const viz = {
  visited: new Set(),
  frontier: new Set(),
  current: null,
  treeEdges: new Set()
};

const player = { steps: [], index: -1, playing: false, timer: null, type: null };

const svg = $('graphCanvas');
const canvasScroll = $('canvasScroll');
