/**
 * @module @xmcl/task
 */
export declare class CancelledError extends Error {
    constructor();
}
export declare enum TaskState {
    Idle = 0,
    Running = 1,
    Cancelled = 2,
    Paused = 3,
    Succeed = 4,
    Failed = 5
}
export interface Task<T = any> {
    readonly id: number;
    readonly name: string;
    readonly param: Record<string, any>;
    readonly progress: number;
    readonly total: number;
    readonly from: string | undefined;
    readonly to: string | undefined;
    readonly path: string;
    readonly isCancelled: boolean;
    readonly isPaused: boolean;
    readonly isDone: boolean;
    readonly isRunning: boolean;
    readonly state: TaskState;
    readonly context: TaskContext | undefined;
    readonly parent: Task<any> | undefined;
    pause(): Promise<void>;
    resume(): Promise<void>;
    cancel(timeout?: number): Promise<void>;
    start(context?: TaskContext, parent?: Task<any>): void;
    wait(): Promise<T>;
    startAndWait(context?: TaskContext, parent?: Task<any>): Promise<T>;
    onChildUpdate(chunkSize: number): void;
    map<N>(transform: Transform<this, N>): Task<N extends Promise<infer R> ? R : N>;
    setName(name: string, param?: Record<string, any>): this;
}
export interface Transform<T, N> {
    (this: T, value: T): N;
}
export interface TaskContext {
    fork?(task: Task<any>): number;
    onStart?(task: Task<any>): void;
    onUpdate?(task: Task<any>, chunkSize: number): void;
    onFailed?(task: Task<any>, error: any): void;
    onSucceed?(task: Task<any>, result: any): void;
    onPaused?(task: Task<any>): void;
    onResumed?(task: Task<any>): void;
    onCancelled?(task: Task<any>): void;
}
export declare function createFork(): TaskContext['fork'];
export declare abstract class BaseTask<T> implements Task<T> {
    protected _state: TaskState;
    protected _promise: Promise<T>;
    protected resolve: (value: T) => void;
    protected reject: (err: any) => void;
    protected _from: string | undefined;
    protected _to: string | undefined;
    protected _progress: number;
    protected _total: number;
    protected _path: string;
    protected _id: number;
    parent: Task<any> | undefined;
    context: TaskContext;
    name: string;
    param: object;
    protected resultOrError: T | any;
    constructor();
    setName(name: string, param?: object): this;
    get(): T | void;
    get id(): number;
    get path(): string;
    get progress(): number;
    get total(): number;
    get to(): string | undefined;
    get from(): string | undefined;
    get state(): TaskState;
    get isCancelled(): boolean;
    get isPaused(): boolean;
    get isDone(): boolean;
    get isRunning(): boolean;
    pause(): Promise<void>;
    resume(): Promise<void>;
    cancel(timeout?: number): Promise<void>;
    wait(): Promise<T>;
    start(context?: TaskContext, parent?: Task<any>): void;
    startAndWait(context?: TaskContext, parent?: Task<any>): Promise<T>;
    protected update(chunkSize: number): void;
    onChildUpdate(chunkSize: number): void;
    protected abstract runTask(): Promise<T>;
    protected abstract cancelTask(): Promise<void>;
    protected abstract pauseTask(): Promise<void>;
    protected abstract resumeTask(): Promise<void>;
    map<N>(transform: Transform<this, N>): Task<N extends Promise<infer R> ? R : N>;
}
export declare abstract class AbortableTask<T> extends BaseTask<T> {
    protected _pausing: Promise<void>;
    protected _unpause: () => void;
    protected _onAborted: () => void;
    protected _onResume: () => void;
    protected abstract process(): Promise<T>;
    protected abstract abort(isCancelled: boolean): void;
    protected abstract isAbortedError(e: any): boolean;
    protected cancelTask(): Promise<void>;
    protected pauseTask(): Promise<void>;
    protected resumeTask(): Promise<void>;
    protected runTask(): Promise<T>;
}
export declare abstract class TaskGroup<T> extends BaseTask<T> {
    protected children: Task<any>[];
    onChildUpdate(chunkSize: number): void;
    protected cancelTask(): Promise<void>;
    protected pauseTask(): Promise<void>;
    protected resumeTask(): Promise<void>;
    all<T extends Task<any>>(tasks: Iterable<T>, { throwErrorImmediately, getErrorMessage }?: {
        throwErrorImmediately?: boolean;
        getErrorMessage?: (errors: any[]) => string;
    }): Promise<(T extends Task<infer R> ? R : never)[]>;
}
export type TaskExecutor<T> = (this: TaskRoutine<any>) => Promise<T> | T;
export declare class TaskRoutine<T> extends TaskGroup<T> {
    readonly executor: TaskExecutor<T>;
    constructor(name: string, executor: TaskExecutor<T>, param?: object);
    concat<T>(task: TaskRoutine<T>): Promise<T>;
    /**
       * Yield a new child task to this routine
       */
    yield<T>(task: Task<T>): Promise<T>;
    protected runTask(): Promise<T>;
}
export declare function task<T>(name: string, executor: TaskExecutor<T>, param?: object): TaskRoutine<T>;
//# sourceMappingURL=index.d.ts.map