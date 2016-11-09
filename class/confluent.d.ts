/// <reference path="utils/three.d.ts" />
/// <reference path="utils/d3.d.ts" />
/// <reference path="utils/jquery.d.ts" />
/// <reference path="utils/networkcube.d.ts" />
/// <reference path="colasrc/rbtree.d.ts" />
declare class Main {
    graph: networkcube.DynamicGraph;
    nodes: networkcube.Node[];
    links: networkcube.Link[];
    interface_: any;
    confluentGraph: any;
    _UI: any;
    frame: number;
    refreshIntervalId: any;
    constructor(div: any, graph: any, width: any, height: any);
    launch_animation(frame_rating: any): void;
    render(): void;
    animate(): void;
}
declare class Visualisation {
    camera: THREE.OrthographicCamera;
    scene: THREE.Scene;
    light: THREE.Light;
    renderer: THREE.WebGLRenderer;
    raycaster: THREE.Raycaster;
    WIDTH: any;
    HEIGHT: any;
    div_element: any;
    constructor(div_element: any, width: any, height: any);
    init(): void;
}
declare class Drop_Down {
    ConfluentGraph: any;
    link_id: any;
    container: any;
    id: any;
    gate: any;
    min: any;
    max: any;
    data: any;
    constructor(ConfluentGraph: any, container: any, link_id: any, name: any);
    make_options(): void;
    make_UI(): void;
    make_slider(): void;
    update_values(value: any): void;
    get_values(): number;
}
declare class UIInformations_general {
    ConfluentGraph: any;
    link_id: any;
    container: any;
    gate: any;
    constructor(ConfluentGraph: any, container: any);
    change_color(): void;
    make_header(): void;
    make_color_picker(): void;
    make_slider_frame(): void;
}
declare class Slider_Button {
    ConfluentGraph: any;
    link_id: any;
    container: any;
    id: any;
    gate: any;
    min: any;
    max: any;
    step: any;
    constructor(ConfluentGraph: any, container: any, link_id: any, gate: any, name: any);
    make_options(): void;
    make_UI(): void;
    make_slider(): void;
    update_values(value: any): void;
    get_values(): number;
}
declare class LinkAppearance {
    ConfluentGraph: any;
    link_id: any;
    container: any;
    constructor(ConfluentGraph: any, container: any, link_id: any);
    change_color(): void;
    make_alpha_gates(): void;
    make_alpha_tube_picker(): void;
    make_alpha_links_picker(): void;
    make_color_picker(): void;
    change_tube_width(): void;
    make_header(): void;
    make_UI(): void;
}
declare class UIInformations {
    ConfluentGraph: any;
    link_id: any;
    container: any;
    gate: any;
    constructor(ConfluentGraph: any, container: any, link_id: any);
    make_infos(): void;
}
declare class ColorPicker {
    ConfluentGraph: any;
    link_id: any;
    container: any;
    gate: any;
    constructor(ConfluentGraph: any, container: any, link_id: any, gate: any);
    retrieve_color_gate(): string;
    make_color_picker(): void;
    listen_events(): void;
}
declare class UI {
    UI_Canvas: any;
    width_UI: any;
    height_UI: any;
    sceneHUD: any;
    ConfluentGraph: any;
    mouse: {
        x: any;
        y: any;
    };
    slider1: any;
    slider2: any;
    gate: any;
    mouse_raycaster: any;
    scene: any;
    renderer: any;
    raycaster: any;
    camera: any;
    state_machine: any;
    selected_object: any[];
    constructor(ConfluentGraph: any, scene: any, camera: any, renderer: any, raycaster: any);
    update_graph(link_id: any): void;
    delete_graph(): void;
    onclick_reduce_side_bar(): void;
    get_top_bar_actions(): void;
    mouse_event(): void;
    get_intersections(): void;
    coloriate_tube(id: any): void;
    get_segments(x: any, y: any, x1: any, y1: any, x2: any, y2: any): number;
    get_normal_position(x: any, y: any, x1: any, y1: any, x2: any, y2: any, distance: any): any[];
    draw_circle(x: any, y: any): void;
}
declare class UIGate {
    container: any;
    link_id: any;
    confluent_graph: any;
    slider1: any;
    slider2: any;
    colorpicker: any;
    informations: any;
    link_appearance: any;
    velocity: any;
    opacity: any;
    size: any;
    wiggling: any;
    informations_general: any;
    link_width: any;
    texture: any;
    constructor(confluent_graph: any, container: any, link_id: any);
    update_UI(): void;
    make_array(length: any): any[];
    delete_UI(): void;
    make_UI(): void;
    make_graphs(value: any): void;
    change_appearanceLink(): void;
    make_UI_general(): void;
}
declare class SliderButton {
    private static ID;
    SLIDER_WIDTH: any;
    SLIDER_HIGHT: any;
    SIZE: any;
    confluent_graph: any;
    my_link: number;
    particle: number;
    values: any;
    svg: any;
    slider: any;
    id: any;
    type: any;
    title: any;
    container: any;
    number_values_temporal: number;
    gate_id: any;
    constructor(confluent_graph: any, container: any, link_id: any, particle: any, values: any, gate_id: any, number_values: any, type: any);
    update_graph(value: any): void;
    makeSliderVertical(width: any, height: any, values: any, f: Function): void;
}
declare module cola {
    function applyPacking(graphs: Array<any>, w: any, h: any, node_size: any, desired_ratio?: number): void;
    function separateGraphs(nodes: any, links: any): any[];
}
declare module cola.vpsc {
    class PositionStats {
        scale: number;
        AB: number;
        AD: number;
        A2: number;
        constructor(scale: number);
        addVariable(v: Variable): void;
        getPosn(): number;
    }
    class Constraint {
        left: Variable;
        right: Variable;
        gap: number;
        equality: boolean;
        lm: number;
        active: boolean;
        unsatisfiable: boolean;
        constructor(left: Variable, right: Variable, gap: number, equality?: boolean);
        slack(): number;
    }
    class Variable {
        desiredPosition: number;
        weight: number;
        scale: number;
        offset: number;
        block: Block;
        cIn: Constraint[];
        cOut: Constraint[];
        constructor(desiredPosition: number, weight?: number, scale?: number);
        dfdv(): number;
        position(): number;
        visitNeighbours(prev: Variable, f: (c: Constraint, next: Variable) => void): void;
    }
    class Block {
        vars: Variable[];
        posn: number;
        ps: PositionStats;
        blockInd: number;
        constructor(v: Variable);
        private addVariable(v);
        updateWeightedPosition(): void;
        private compute_lm(v, u, postAction);
        private populateSplitBlock(v, prev);
        traverse(visit: (c: Constraint) => any, acc: any[], v?: Variable, prev?: Variable): void;
        findMinLM(): Constraint;
        private findMinLMBetween(lv, rv);
        private findPath(v, prev, to, visit);
        isActiveDirectedPathBetween(u: Variable, v: Variable): boolean;
        static split(c: Constraint): Block[];
        private static createSplitBlock(startVar);
        splitBetween(vl: Variable, vr: Variable): {
            constraint: Constraint;
            lb: Block;
            rb: Block;
        };
        mergeAcross(b: Block, c: Constraint, dist: number): void;
        cost(): number;
    }
    class Blocks {
        vs: Variable[];
        private list;
        constructor(vs: Variable[]);
        cost(): number;
        insert(b: Block): void;
        remove(b: Block): void;
        merge(c: Constraint): void;
        forEach(f: (b: Block, i: number) => void): void;
        updateBlockPositions(): void;
        split(inactive: Constraint[]): void;
    }
    class Solver {
        vs: Variable[];
        cs: Constraint[];
        bs: Blocks;
        inactive: Constraint[];
        static LAGRANGIAN_TOLERANCE: number;
        static ZERO_UPPERBOUND: number;
        constructor(vs: Variable[], cs: Constraint[]);
        cost(): number;
        setStartingPositions(ps: number[]): void;
        setDesiredPositions(ps: number[]): void;
        private mostViolated();
        satisfy(): void;
        solve(): number;
    }
}
declare module cola.vpsc {
    interface Leaf {
        bounds: Rectangle;
        variable: Variable;
    }
    interface Group {
        bounds: Rectangle;
        padding: number;
        stiffness: number;
        leaves: Leaf[];
        groups: Group[];
        minVar: Variable;
        maxVar: Variable;
    }
    function computeGroupBounds(g: Group): Rectangle;
    class Rectangle {
        x: number;
        X: number;
        y: number;
        Y: number;
        constructor(x: number, X: number, y: number, Y: number);
        static empty(): Rectangle;
        cx(): number;
        cy(): number;
        overlapX(r: Rectangle): number;
        overlapY(r: Rectangle): number;
        setXCentre(cx: number): void;
        setYCentre(cy: number): void;
        width(): number;
        height(): number;
        union(r: Rectangle): Rectangle;
        lineIntersections(x1: number, y1: number, x2: number, y2: number): Array<{
            x: number;
            y: number;
        }>;
        rayIntersection(x2: number, y2: number): {
            x: number;
            y: number;
        };
        vertices(): {
            x: number;
            y: number;
        }[];
        static lineIntersection(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number): {
            x: number;
            y: number;
        };
        inflate(pad: number): Rectangle;
    }
    function makeEdgeBetween(link: any, source: Rectangle, target: Rectangle, ah: number): void;
    function makeEdgeTo(s: {
        x: number;
        y: number;
    }, target: Rectangle, ah: number): {
        x: number;
        y: number;
    };
    function generateXConstraints(rs: Rectangle[], vars: Variable[]): Constraint[];
    function generateYConstraints(rs: Rectangle[], vars: Variable[]): Constraint[];
    function generateXGroupConstraints(root: Group): Constraint[];
    function generateYGroupConstraints(root: Group): Constraint[];
    function removeOverlaps(rs: Rectangle[]): void;
    interface GraphNode extends Leaf {
        fixed: boolean;
        width: number;
        height: number;
        x: number;
        y: number;
        px: number;
        py: number;
    }
    class IndexedVariable extends Variable {
        index: number;
        constructor(index: number, w: number);
    }
    class Projection {
        private nodes;
        private groups;
        private rootGroup;
        private avoidOverlaps;
        private xConstraints;
        private yConstraints;
        private variables;
        constructor(nodes: GraphNode[], groups: Group[], rootGroup?: Group, constraints?: any[], avoidOverlaps?: boolean);
        private createSeparation(c);
        private makeFeasible(c);
        private createAlignment(c);
        private createConstraints(constraints);
        private setupVariablesAndBounds(x0, y0, desired, getDesired);
        xProject(x0: number[], y0: number[], x: number[]): void;
        yProject(x0: number[], y0: number[], y: number[]): void;
        projectFunctions(): {
            (x0: number[], y0: number[], r: number[]): void;
        }[];
        private project(x0, y0, start, desired, getDesired, cs, generateConstraints, updateNodeBounds, updateGroupBounds);
        private solve(vs, cs, starting, desired);
    }
}
declare module cola.geom {
    class Point {
        x: number;
        y: number;
    }
    class LineSegment {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        constructor(x1: number, y1: number, x2: number, y2: number);
    }
    class PolyPoint extends Point {
        polyIndex: number;
    }
    function isLeft(P0: Point, P1: Point, P2: Point): number;
    function ConvexHull(S: Point[]): Point[];
    function clockwiseRadialSweep(p: Point, P: Point[], f: (Point) => void): void;
    function tangent_PolyPolyC(V: Point[], W: Point[], t1: (a, b) => number, t2: (a, b) => number, cmp1: (a, b, c) => boolean, cmp2: (a, b, c) => boolean): {
        t1: number;
        t2: number;
    };
    function LRtangent_PolyPolyC(V: Point[], W: Point[]): {
        t1: number;
        t2: number;
    };
    function RLtangent_PolyPolyC(V: Point[], W: Point[]): {
        t1: number;
        t2: number;
    };
    function LLtangent_PolyPolyC(V: Point[], W: Point[]): {
        t1: number;
        t2: number;
    };
    function RRtangent_PolyPolyC(V: Point[], W: Point[]): {
        t1: number;
        t2: number;
    };
    class BiTangent {
        t1: number;
        t2: number;
        constructor(t1: number, t2: number);
    }
    class BiTangents {
        rl: BiTangent;
        lr: BiTangent;
        ll: BiTangent;
        rr: BiTangent;
    }
    class TVGPoint extends Point {
        vv: VisibilityVertex;
    }
    class VisibilityVertex {
        id: number;
        polyid: number;
        polyvertid: number;
        p: TVGPoint;
        constructor(id: number, polyid: number, polyvertid: number, p: TVGPoint);
    }
    class VisibilityEdge {
        source: VisibilityVertex;
        target: VisibilityVertex;
        constructor(source: VisibilityVertex, target: VisibilityVertex);
        length(): number;
    }
    class TangentVisibilityGraph {
        P: TVGPoint[][];
        V: VisibilityVertex[];
        E: VisibilityEdge[];
        constructor(P: TVGPoint[][], g0?: {
            V: VisibilityVertex[];
            E: VisibilityEdge[];
        });
        addEdgeIfVisible(u: TVGPoint, v: TVGPoint, i1: number, i2: number): void;
        addPoint(p: TVGPoint, i1: number): VisibilityVertex;
        private intersectsPolys(l, i1, i2);
    }
    function tangents(V: Point[], W: Point[]): BiTangents;
    function polysOverlap(p: Point[], q: Point[]): boolean;
}
declare module cola {
    class Locks {
        locks: any;
        add(id: number, x: number[]): void;
        clear(): void;
        isEmpty(): boolean;
        apply(f: (id: number, x: number[]) => void): void;
    }
    class Descent {
        D: number[][];
        G: number[][];
        threshold: number;
        H: number[][][];
        g: number[][];
        x: number[][];
        k: number;
        n: number;
        locks: Locks;
        private static zeroDistance;
        private minD;
        private Hd;
        private a;
        private b;
        private c;
        private d;
        private e;
        private ia;
        private ib;
        private xtmp;
        numGridSnapNodes: number;
        snapGridSize: number;
        snapStrength: number;
        scaleSnapByMaxH: boolean;
        private random;
        project: {
            (x0: number[], y0: number[], r: number[]): void;
        }[];
        constructor(x: number[][], D: number[][], G?: number[][]);
        static createSquareMatrix(n: number, f: (i: number, j: number) => number): number[][];
        private offsetDir();
        computeDerivatives(x: number[][]): void;
        private static dotProd(a, b);
        private static rightMultiply(m, v, r);
        computeStepSize(d: number[][]): number;
        reduceStress(): number;
        private static copy(a, b);
        private stepAndProject(x0, r, d, stepSize);
        private static mApply(m, n, f);
        private matrixApply(f);
        private computeNextPosition(x0, r);
        run(iterations: number): number;
        rungeKutta(): number;
        private static mid(a, b, m);
        takeDescentStep(x: number[], d: number[], stepSize: number): void;
        computeStress(): number;
    }
    class PseudoRandom {
        seed: number;
        private a;
        private c;
        private m;
        private range;
        constructor(seed?: number);
        getNext(): number;
        getNextBetween(min: number, max: number): number;
    }
}
declare module cola.powergraph {
    interface LinkAccessor<Link> {
        getSourceIndex(l: Link): number;
        getTargetIndex(l: Link): number;
        getType(l: Link): number;
    }
    class PowerEdge {
        source: any;
        target: any;
        type: number;
        constructor(source: any, target: any, type: number);
    }
    class Configuration<Link> {
        private linkAccessor;
        modules: Module[];
        roots: ModuleSet[];
        R: number;
        constructor(n: number, edges: Link[], linkAccessor: LinkAccessor<Link>, rootGroup?: any[]);
        private initModulesFromGroup(group);
        merge(a: Module, b: Module, k?: number): Module;
        private rootMerges(k?);
        greedyMerge(): boolean;
        private nEdges(a, b);
        getGroupHierarchy(retargetedEdges: PowerEdge[]): any[];
        allEdges(): PowerEdge[];
        static getEdges(modules: ModuleSet, es: PowerEdge[]): void;
    }
    class Module {
        id: number;
        outgoing: LinkSets;
        incoming: LinkSets;
        children: ModuleSet;
        definition: any;
        gid: number;
        constructor(id: number, outgoing?: LinkSets, incoming?: LinkSets, children?: ModuleSet, definition?: any);
        getEdges(es: PowerEdge[]): void;
        isLeaf(): boolean;
        isIsland(): boolean;
        isPredefined(): boolean;
    }
    class ModuleSet {
        table: any;
        count(): number;
        intersection(other: ModuleSet): ModuleSet;
        intersectionCount(other: ModuleSet): number;
        contains(id: number): boolean;
        add(m: Module): void;
        remove(m: Module): void;
        forAll(f: (m: Module) => void): void;
        modules(): Module[];
    }
    class LinkSets {
        sets: any;
        n: number;
        count(): number;
        contains(id: number): boolean;
        add(linktype: number, m: Module): void;
        remove(linktype: number, m: Module): void;
        forAll(f: (ms: ModuleSet, linktype: number) => void): void;
        forAllModules(f: (m: Module) => void): void;
        intersection(other: LinkSets): LinkSets;
    }
    function getGroups<Link>(nodes: any[], links: Link[], la: LinkAccessor<Link>, rootGroup?: any[]): {
        groups: any[];
        powerEdges: PowerEdge[];
    };
}
declare module cola {
    interface LinkAccessor<Link> {
        getSourceIndex(l: Link): number;
        getTargetIndex(l: Link): number;
    }
    interface LinkLengthAccessor<Link> extends LinkAccessor<Link> {
        setLength(l: Link, value: number): void;
    }
    function symmetricDiffLinkLengths<Link>(links: Link[], la: LinkLengthAccessor<Link>, w?: number): void;
    function jaccardLinkLengths<Link>(links: Link[], la: LinkLengthAccessor<Link>, w?: number): void;
    interface IConstraint {
        left: number;
        right: number;
        gap: number;
    }
    interface DirectedEdgeConstraints {
        axis: string;
        gap: number;
    }
    interface LinkSepAccessor<Link> extends LinkAccessor<Link> {
        getMinSeparation(l: Link): number;
    }
    function generateDirectedEdgeConstraints<Link>(n: number, links: Link[], axis: string, la: LinkSepAccessor<Link>): IConstraint[];
}
declare class PairingHeap<T> {
    elem: T;
    private subheaps;
    constructor(elem: T);
    toString(selector: any): string;
    forEach(f: any): void;
    count(): number;
    min(): T;
    empty(): boolean;
    contains(h: PairingHeap<T>): boolean;
    isHeap(lessThan: (a: T, b: T) => boolean): boolean;
    insert(obj: T, lessThan: any): PairingHeap<T>;
    merge(heap2: PairingHeap<T>, lessThan: any): PairingHeap<T>;
    removeMin(lessThan: (a: T, b: T) => boolean): PairingHeap<T>;
    mergePairs(lessThan: (a: T, b: T) => boolean): PairingHeap<T>;
    decreaseKey(subheap: PairingHeap<T>, newValue: T, setHeapNode: (e: T, h: PairingHeap<T>) => void, lessThan: (a: T, b: T) => boolean): PairingHeap<T>;
}
declare class PriorityQueue<T> {
    private lessThan;
    private root;
    constructor(lessThan: (a: T, b: T) => boolean);
    top(): T;
    push(...args: T[]): PairingHeap<T>;
    empty(): boolean;
    isHeap(): boolean;
    forEach(f: any): void;
    pop(): T;
    reduceKey(heapNode: PairingHeap<T>, newKey: T, setHeapNode?: (e: T, h: PairingHeap<T>) => void): void;
    toString(selector: any): string;
    count(): number;
}
declare module cola.shortestpaths {
    class Calculator<Link> {
        n: number;
        es: Link[];
        private neighbours;
        constructor(n: number, es: Link[], getSourceIndex: (Link) => number, getTargetIndex: (Link) => number, getLength: (Link) => number);
        DistanceMatrix(): number[][];
        DistancesFromNode(start: number): number[];
        PathFromNodeToNode(start: number, end: number): number[];
        PathFromNodeToNodeWithPrevCost(start: number, end: number, prevCost: (u: number, v: number, w: number) => number): number[];
        private dijkstraNeighbours(start, dest?);
    }
}
declare module cola {
    enum EventType {
        start = 0,
        tick = 1,
        end = 2,
    }
    interface Event {
        type: EventType;
        alpha: number;
        stress?: number;
        listener?: () => void;
    }
    interface Node {
        x: number;
        y: number;
    }
    interface Link<NodeType> {
        source: NodeType;
        target: NodeType;
        length?: number;
    }
    class Layout {
        private _canvasSize;
        private _linkDistance;
        private _defaultNodeSize;
        private _linkLengthCalculator;
        private _linkType;
        private _avoidOverlaps;
        private _handleDisconnected;
        private _alpha;
        private _lastStress;
        private _running;
        private _nodes;
        private _groups;
        private _variables;
        private _rootGroup;
        private _links;
        private _constraints;
        private _distanceMatrix;
        private _descent;
        private _directedLinkConstraints;
        private _threshold;
        private _visibilityGraph;
        private _groupCompactness;
        protected event: any;
        on(e: EventType | string, listener: (Event) => void): Layout;
        protected trigger(e: Event): void;
        protected kick(): void;
        protected tick(): boolean;
        nodes(): Array<Node>;
        nodes(v: Array<Node>): Layout;
        groups(): Array<any>;
        groups(x: Array<any>): Layout;
        powerGraphGroups(f: Function): Layout;
        avoidOverlaps(): boolean;
        avoidOverlaps(v: boolean): Layout;
        handleDisconnected(): boolean;
        handleDisconnected(v: boolean): Layout;
        flowLayout(axis: string, minSeparation: number | ((any) => number)): Layout;
        links(): Array<Link<Node | number>>;
        links(x: Array<Link<Node | number>>): Layout;
        constraints(): Array<any>;
        constraints(c: Array<any>): Layout;
        distanceMatrix(): Array<Array<number>>;
        distanceMatrix(d: Array<Array<number>>): Layout;
        size(): Array<number>;
        size(x: Array<number>): Layout;
        defaultNodeSize(): number;
        defaultNodeSize(x: number): Layout;
        groupCompactness(): number;
        groupCompactness(x: number): Layout;
        linkDistance(): number;
        linkDistance(): (any) => number;
        linkDistance(x: number): Layout;
        linkDistance(x: (any) => number): Layout;
        linkType(f: Function | number): Layout;
        convergenceThreshold(): number;
        convergenceThreshold(x: number): Layout;
        alpha(): number;
        alpha(x: number): Layout;
        getLinkLength(link: any): number;
        static setLinkLength(link: any, length: number): void;
        getLinkType(link: any): number;
        linkAccessor: {
            getSourceIndex: (e: any) => any;
            getTargetIndex: (e: any) => any;
            setLength: (link: any, length: number) => void;
            getType: (link: any) => number;
        };
        symmetricDiffLinkLengths(idealLength: number, w: number): Layout;
        jaccardLinkLengths(idealLength: number, w: number): Layout;
        start(initialUnconstrainedIterations?: number, initialUserConstraintIterations?: number, initialAllConstraintsIterations?: number, gridSnapIterations?: number): Layout;
        resume(): Layout;
        stop(): Layout;
        prepareEdgeRouting(nodeMargin: any): void;
        routeEdge(d: any, draw: any): any[];
        static getSourceIndex(e: any): any;
        static getTargetIndex(e: any): any;
        static linkId(e: any): string;
        static dragStart(d: any): void;
        static dragEnd(d: any): void;
        static mouseOver(d: any): void;
        static mouseOut(d: any): void;
    }
}
declare module cola {
    class D3StyleLayoutAdaptor extends Layout {
        event: d3.Dispatch;
        trigger(e: Event): void;
        kick(): void;
        drag: () => any;
        constructor();
        on(eventType: EventType | string, listener: () => void): D3StyleLayoutAdaptor;
    }
    function d3adaptor(): D3StyleLayoutAdaptor;
}
declare class ConfluentGraph {
    links: any;
    nodes: any;
    vertex_shader: any;
    fragment_shader: any;
    labelNodes: any[];
    labelLinks: any[];
    webGL_nodes: any[];
    webGL_label: any[];
    d3cola: cola.Layout;
    tube: any[];
    curveSplines: any[];
    particleSystems: any;
    scene: any;
    number_particles: number;
    max_number_paths_particule: number;
    number_paths_particule: number;
    number_max_gates: number;
    links_opacity: number;
    tube_width: number;
    needUpdate: boolean;
    constructor(nodes: any, links: any, scene: any);
    draw_map(projection: any): void;
    create(): void;
    create_gates(id: any, segment: any, x1: any, y1: any, x2: any, y2: any): void;
    createLabel(): void;
    createNodes(): void;
    updateNode_color(i: any, color: THREE.Color, scale: any): void;
    update_values(): void;
    update(): void;
    createParticle(): void;
    updateNodes(): void;
    updateLabel(): void;
    updateTube(): void;
    createTube(): void;
    createLinks(): void;
    updateTube_width_gate(link_id: any, gate: any, value: any): void;
    updateLinks_width_gate(link_id: any, gate: any, value: any): void;
    updateLinks(): void;
    updateParticles_Paths(link_id: any): void;
    updateParticles_Texture(link_id: any, value: any): void;
    updateParticles_Velocity(link_id: any, gate: any, value: any): void;
    updateParticles_Wiggling(link_id: any, gate: any, value: any): void;
    updateParticles_Opacity(link_id: any, gate: any, value: any): void;
    updateParticles_Size(link_id: any, gate: any, value: any): void;
    updateParticles_SpatialDistribution(spatial_distribution: any, link: any): void;
    updateParticles_TemporalDistribution(temporal_distribution: any, link: any, number_values: any): void;
    updateParticles_TemporalDistribution2(temporal_distribution: any, link: any, number_values: any): void;
    updateParticles_Color(id_link: any, color: any, gate: any): void;
    updateParticles_Gates(id_link: any, gate: any): void;
    updateParticle(): void;
    createParticles_webgl(particles: any, link_id: any): any;
    delete_entity_by_type(tag_data: any): void;
    get_normal_position(x1: any, y1: any, x2: any, y2: any, gate: any, distance: any, _number: any): any[];
    get_normal_position_border(x1: any, y1: any, x2: any, y2: any, distance: any, _number: any): any[];
    draw_circle(x: any, y: any): void;
    hslToRgb(h: any, s: any, l: any): number[];
    getColor(percent: any): THREE.Vector3;
    load_vertex_shaders(): void;
    load_fragment_shaders(): void;
}
