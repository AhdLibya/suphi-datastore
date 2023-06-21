/** 
	Spui
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
/**
 *
 *
 */
declare namespace DataStore {
	export interface property<template> {
		/**
		 *	Value of datastore
		 */
		Value: template;
		/**
		 *	Metadata associated with the key
		 */
		Metadata: Map<string, unknown>;
		/**
		 *	An array of UserIds associated with the key
		 */
		UserIds: number[];
		/**
		 *	Interval in seconds the datastore will automatically save (set to 0 to disable automatic saving)
		 */
		SaveInterval: number;
		/**
		 *	Delay between saves (set to 6 to stop warnings)
		 */
		SaveDelay: number;
		/**
		 *	Interval in seconds the memorystore will update the session lock
		 */
		LockInterval: number;
		/**
		 *	How many times the memorystore needs to fail before the session closes
		 */
		LockAttempts: number;
		/**
		 *	Automatically save the data when the session is closed or destroyed
		 */
		SaveOnClose: boolean;
		/**
		 *	Identifying string
		 */
		readonly Id: string;
		/**
		 *	Unique identifying string
		 */
		readonly UniqueId: string;
		/**
		 *	Key used for the datastore
		 */
		readonly Key: string;
		/**
		 *	Current state of the session [nil = Destroyed] [false = Closed] [true = Open]
		 */
		readonly State: boolean | undefined;
		/**
		 *	Set to true if this session was created by the hidden constructor
		 */
		readonly Hidden: boolean;
		/**
		 *	How many memorystore attempts remaining before the session closes
		 */
		readonly AttemptsRemaining: number;
		/**
		 *	Number of milliseconds from epoch to when the datastore was created
		 */
		readonly CreatedTime: number;
		/**
		 *	Number of milliseconds from epoch to when the datastore was updated (not updated while session is open)
		 */
		readonly UpdatedTime: number;
		/**
		 *	Unique identifying string of the current datastore save
		 */
		readonly Version: string;
		/**
		 *	Compressed string that is updated before every save if compression is enabled by setting dataStore.Metadata.Compress = {["Level"] = 2, ["Decimals"] = 3, ["Safety"] = true}
		 *
		 *	Level = 1 (allows mixed tables), Level = 2 (does not allow mixed tables but compresses arrays better), Decimals = amount of decimal places saved, Safety = replace delete character from strings
		 */
		readonly CompressedValue: string;
		/**
		 *	Fires when the State property has changed
		 */
		StateChanged: Signal<(state: boolean, dataStore: property<template>) => void>;
		/**
		 *	Fires just before the value is about to save
		 */
		Saving: Signal<(value: template, dataStore: property<template>) => void>;
		/**
		 *	Fires after a save attempt
		 */
		Saved: Signal<(response: string, responseData: unknown, dataStore: property<template>) => void>;
		/**
		 *	Fires when the AttemptsRemaining property has changed
		 */
		AttemptsChanged: Signal<(attemptsRemaining: number, dataStore: property<template>) => void>;
		/**
		 * Fires when state = true and values detected inside the MemoryStoreQueue
		 */
		ProcessQueue: Signal<(id: string, values: unknown[], dataStore: property<template>) => void>;
		/**
		 * Tries to open the session, optional template parameter will be reconciled onto the value
		 * @param template
		 */
		Open(template?: template): LuaTuple<[string, unknown]>;
		/**
		 * Force save the current value to the datastore
		 * @param template
		 */
		Read(template?: unknown): LuaTuple<[string, unknown]>;
		/**
		 *	Closes the session
		 */
		Save(): LuaTuple<[string, unknown]>;
		/**
		 *
		 */
		Close(): LuaTuple<[string, unknown]>;
		/**
		 *	Closes and destroys the session, destroyed sessions will be locked
		 */
		Destroy(): LuaTuple<[string, unknown]>;
		/**
		 * Adds a value to the MemoryStoreQueue expiration default (604800 seconds / 7 days), max (3888000 seconds / 45 days)
		 * @param value
		 * @param expiration
		 * @param priority
		 */
		Queue(value: unknown, expiration?: number, priority?: number): LuaTuple<[string, unknown]>;
		/**
		 * Remove values from the MemoryStoreQueue
		 * @param id
		 */
		Remove(id: string): LuaTuple<[string, unknown]>;
		/**
		 *	Clones the value property
		 */
		Clone(): template;
		/**
		 * Fills in missing values from the template into the value property
		 * @param template
		 */
		Reconcile(template: unknown): void;
		/**
		 * How much datastore has been used, returns the character count and the second number is a number scaled from 0 to 1 [0 = 0% , 0.5 = 50%, 1 = 100%, 1.5 = 150%]
		 */
		Usage(): LuaTuple<[number, number]>;
	}
}
interface DataStoreConstructor {
	/**
	 *	Returns previously created datastore session else a new session
	 * @param name
	 * @param scope
	 * @param key
	 */
	new <template>(name: string, scope: string, key: string): DataStore.property<template>;
	/**
	 *	Returns previously created datastore session else a new session
	 * @param name
	 * @param key
	 */
	new <template>(name: string, key: string): DataStore.property<template>;
	/**
	 *	Returns previously created datastore session else a new session
	 * @param name
	 * @param scope
	 * @param key
	 */
	hidden: <template>(name: string, scope?: string, key?: string) => DataStore.property<template>;
	/**
	 *	Returns previously created datastore session else nil
	 * @param name
	 * @param scope
	 * @param key
	 */
	find: <template>(name: string, scope?: string, key?: string) => DataStore.property<template> | undefined;
	/**
	 * List of responses that acts like a enum
	 */
	Response: { Success: string; Saved: string; Locked: string; State: string; Error: string };
}

/**
 * `#Session locking`			 Prevents another object from opening the same datastore key while its opened by another object.
 *
 *
 * `#Cross Server Communication` Easily use MemoryStoreQueue to send data to the session owner.
 *
 *
 * `#Auto Save`                  Automatically saves cached data to the datastore based on the saveinterval property.
 *
 *
 * `#Bind To Close`              Automatically saves, closes and destroys all sessions when server starts to close.
 *
 *
 * `#Reconcile`                  Fills in missing values from the template into the value property.
 *
 *
 * `#Compression`                Compress data to reduce character count.
 *
 *
 * `#Safe Saving`                Impossible for save requests to be added to queue (you can ignore the warning).
 *
 *
 * `#Multiple Script Support`    Safe to interact with the same datastore object from multiple scripts.
 *
 *
 * `#Task Batching`              Tasks will be batched togever when possible.
 *
 *
 * `#Direct Value Access`        Access the datastore value directly, module will never tamper with your data and will never leave any data in your datastore or memorystore.
 *
 *
 * `#Easy To Use`                Simple and elegant.
 *
 *
 * `#Lightweight`                No ```RunService``` events and no `while true do` loops 100% event based.
 *
 *
 */
declare const DataStore: DataStoreConstructor;
export = DataStore;
