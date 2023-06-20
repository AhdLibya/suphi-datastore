type Constructor = {
	new (): TaskManager;
};

type TaskManager = {
	Enabled: boolean;
	Tasks: number;
	Running: SynchronousTask;
	InsertFront(func: (RunningTask: RunningTask, ...args: unknown[]) => void, ...any: unknown[]): SynchronousTask;
	InsertBack(func: (RunningTask: RunningTask, ...args: unknown[]) => void, ...any: unknown[]): SynchronousTask;
	FindFirst(func: (RunningTask: RunningTask, ...args: unknown[]) => void): LuaTuple<[SynchronousTask?, number?]>;
	FindLast(func: (RunningTask: RunningTask, ...args: unknown[]) => void): LuaTuple<[SynchronousTask?, number?]>;
	CancelAll(self: TaskManager, func: (RunningTask: RunningTask, ...args: unknown[]) => void): void;
};

type SynchronousTask = {
	TaskManager: TaskManager;
	Running: boolean;
	Wait(...any: unknown[]): LuaTuple<[...unknown[]]>;
	Cancel(): void;
};

type RunningTask = {
	Next(): LuaTuple<[thread, ...unknown[]]>;
	Iterate(): LuaTuple<[(self: RunningTask) => LuaTuple<[thread, ...unknown[]]>, RunningTask]>;
	End(): void;
};
declare const TaskManager: Constructor;
export = TaskManager;
