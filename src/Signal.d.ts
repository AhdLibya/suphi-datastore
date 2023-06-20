/**
 *
 *
 *
 */
interface Signal<argments extends (...args: never) => unknown = () => void, Generic extends boolean = false> {
	/**
	 *
	 *
	 *
	 */
	Connections: number;
	/**
	 *
	 *
	 *
	 */
	Connected(connected: boolean, signal: Signal): void;
	/**
	 *
	 *
	 *
	 */
	Connect<T extends Array<unknown> = Parameters<argments>>(
		func: Generic extends true
			? Parameters<argments> extends Array<unknown>
				? (...args: T) => void
				: argments
			: argments,
	): Connection;
	/**
	 *
	 *
	 *
	 */
	Once<T extends Array<unknown> = Parameters<argments>>(
		func: Generic extends true
			? Parameters<argments> extends Array<unknown>
				? (...args: T) => void
				: argments
			: argments,
	): Connection;
	/**
	 *
	 *
	 *
	 */
	Wait(...args: unknown[]): Parameters<argments>;
	/**
	 *
	 *
	 *
	 */
	Fire(...args: Parameters<argments>): void;
	/**
	 *
	 *
	 *
	 */
	FastFire(...args: Parameters<argments>): void;
	/**
	 *
	 *
	 *
	 */
	DisconnectAll(): void;
}

type Connection = {
	/**
	 *
	 *
	 *
	 */
	Signal?: Signal;
	/**
	 *
	 *
	 *
	 */
	Disconnect(): void;
};

declare const SuphiSignal: new <
	argments extends (...args: never) => unknown = () => void,
	Generic extends boolean = false,
>() => Signal<argments, Generic>;

export = SuphiSignal;
