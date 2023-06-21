# 🎊🎊 Out of Beta 🎊🎊

# SuphisDataStoreModule 

Before I start, this is not mine but Suphi#3388 module, I got permission to put this up in github. Here is the discord: https://discord.gg/B3zmjPVBce

# Features 

* Session locking            Prevents multiple servers from opening the same datastore key
* Cross Server Communication Easily use MemoryStoreQueue to send data to the session owner
* Auto save                  Automatically saves cached data to the datastore based on the saveinterval property
* Bind To Close              Automatically saves, closes and destroys all sessions when server starts to close
* Reconcile                  Fills in missing values from the template into the value property
* Compression                Compress data to reduce character count
* Safe Saveing               Impossible for save requests to be added to queue (you can ignore the warning)
* Multiple script support    Safe to interact with the same datastore object from multiple scripts
* Task batching              Tasks will be batched togever when possible
* Direct value access        Access the datastore value directly, module will never tamper with your data and will never leave any data in your datastore or memorystore
* Easy to use                Simple and elegant
* Lightweight                No RunService events and no while do loops 100% event based

# Suphi's DataStore Module vs ProfileService

**ProfileService** relies on `os.time()` to lock the session. The problem with this is that each servers `os.time()` may not be 100% in sync. So to combat this problem **ProfileService** has a session timeout of 30 minutes, but if the servers have a `os.time()` delta greater then 30 minutes, then the server will be able to bypass the session lock and you will lose data. Another problem is because sessions are locked for 30 minutes, if roblox servers go down and quickly come back up and the server was not able to unlock the sessions. Then players will not be able to enter your game for 30 minutes until the sessions timeout. but will be able to enter other games that dont use **ProfileService**.

So the way **Suphi's DataStore Module** works is that it uses the `MemoryStore` to save the session lock and because memorystores have a built in expiration time. The memorystore will get automatically removed for all servers at the exact same time and because of this it will be imposible for a server to bypass the session lock. This also allows us to have a very low session timeout of **[interval] + 30 seconds**. Another benefit of using the `MemoryStore` is that instead of using `UpdateAsync` on the `DataStore`. We only use ``UpdateAsync`` for the ``MemoryStore``. Which allows us to not waste any ``Get`` and ``Set`` requests for the ``DataStore``. The ``MemoryStore`` has a request limit of ``1000 + 100 ⨉ [number of player]`` **per minute** while the DataStore only has a request limit of ``60 + 10 ⨉ [number of player]`` **per minute**.

**ProfileService** relays on ``RunService.Heartbeat`` and has a few ``while true do task.wait()`` end. on the other hand **Suphi's DataStore Module** is 100% event driven making it super lightweight

**ProfileService** saves data along side your data and forces you to save your data as a table where **Suphi's DataStore Module** gives you full access to your datastores value and lets you set the datastore value directly with numbers, strings, booleans, tables or nil **Suphi's DataStore Module** will not save any data inside your datastore

# Download

Go to releases and download the version(latest stable version prefered), or copy the code(Both signal and datastoremodule, make signal the child of the main module.) in the repo. Alternatively without downloading you can do:

https://create.roblox.com/marketplace/asset/11671168253/
```ts
import DataStore from "@rbxts/suphi-datastore";
```
Current version: `1.0`

# Contructors

```ts
new<template extends {}>(name: string, scope: string, key: string): property<template>
```
Returns previously created session else a new session

```ts
new<template extends {}>(name: string, key: string): property<template>
```
Returns previously created session else a new session

```ts
hidden<template extends {}>(name: string, scope: string, key: string): property<template>
```
Returns a new session that cannot be returned by new or find

```ts
find<template extends {}>(name: string, scope: string, key: string): property<template> | undefined
```
Returns previously created session else nil

```ts
find <template extends {}>(name: string, key: string) : property<template>
```
Returns previously created session else nil

```ts
enum Response {Success, Saved, Locked, State, Error}
```
List of responses that acts like a enum

# Properties

```ts
Value: template
```
Value of datastore

```lua
Metadata  table  {}
```
Metadata associated with the key

```lua
UserIds  table  {}
```
An array of UserIds associated with the key

```lua
SaveInterval number  30
```
Interval in seconds the datastore will automatically save (set to 0 to disable automatic saving)

```lua
Response Success Saved Locked State Error
```
List of responses that acts like a enum

```lua
LockInterval  number  60
```
Interval in seconds the memorystore will update the session lock

```lua
LockAttempts  number  5
```
How many times the memorystore needs to fail before the session closes

```lua
SaveOnClose  boolean  true
```
Automatically save the data when the session is closed or destroyed

```lua
Id  string  "Name/Scope/Key"  READ ONLY
```
Identifying string

```lua
UniqueId  string  "8-4-4-4-12"  READ ONLY
```
Unique identifying string

```lua
Key  string  "Key"  READ ONLY
```
Key used for the datastore

```lua
State  boolean?  false  READ ONLY
```
Current state of the session [nil = Destroyed] [false = Closed] [true = Open]

```lua
Hidden  boolean  false/true  READ ONLY
```
Set to true if this session was created by the hidden constructor

```lua
AttemptsRemaining  number  0  READ ONLY
```
How many memorystore attempts remaining before the session closes

```lua
CreatedTime  number  0  READ ONLY
```
Number of milliseconds from epoch to when the datastore was created

```lua
UpdatedTime  number  0  READ ONLY
```
Number of milliseconds from epoch to when the datastore was updated

```lua
Version  string  ""  READ ONLY
```
Unique identifying string of the current datastore save

```lua
CompressedValue  string  ""  READ ONLY
```
Compressed string that is updated before every save if compression is enabled by setting dataStore.Metadata.Compress = {["Level"] = 2, ["Decimals"] = 3, ["Safety"] = true}
Level = 1 (allows mixed tables), Level = 2 (does not allow mixed tables but compresses arrays better), Decimals = amount of decimal places saved, Safety = replace delete character from strings

# Events

```lua
StateChanged(state: boolean?, object: DataStore)  Signal
```
Fires after state property has changed

```lua
Saving(value: Variant, object: DataStore)  Signal
```
Fires just before the value is about to save

```lua
AttemptsChanged(AttemptsRemaining: number, object: DataStore)  Signal
```
Fires when the AttemptsRemaining property has changed

```lua
ProcessQueue(id: string, values: array, dataStore: DataStore)  Signal
```
Fires when state = true and values detected inside the MemoryStoreQueue

# Methods

```lua
Open(template: any)  string any
```
Tries to open the session, optional template parameter will be reconciled onto the value, returns errorType and errorMessage if fails

```lua
Read(template: any)  string any
```
Reads the datastore value without the need to open the session, optional template parameter will be reconciled onto the value

```lua
Save()  string any
```
Force save the current value to the datastore

```lua
Close()  string any
```
Closes the session

```lua
Destroy()  string any
```
Closes and destroys the session, destroyed sessions will be locked

```lua
Clone()  any
```
Clones the value property

```lua
Queue(value: any, expiration: number?, priority: number?)  string any
Adds a value to the MemoryStoreQueue expiration default (604800 seconds / 7 days), max (3888000 seconds / 45 days)
```

```lua
Remove(id: string)  string any
```
Removed values from the MemoryStoreQueue

```lua
Reconcile(template: any) nil
```
Fills in missing values from the template into the value property

```lua
Usage()  number  number
```
How much datastore has been used, returns the character count and the second number is a number scaled from 0 to 1 [0 = 0% , 0.5 = 50%, 1 = 100%, 1.5 = 150%]

# Simple Example

```ts
import DataStore from "@rbxts/suphi-datastore";
// Find or create a datastore object
const dataStore = new DataStore("Name", "Key");

// Connect a function to the StateChanged event and print to the output when the state changes
dataStore.StateChanged.Connect((state) => {
	if (state === undefined) print("Destroyed", dataStore.Id);
	if (state === false) print("Closed   ", dataStore.Id);
	if (state === true) print("Open     ", dataStore.Id);
});

//  Open the datastore session
const [response, responseData] = dataStore.Open();

//  If the session fails to open lets print why and return
if (response !== "Success") error(response);

//  Set the datastore value
dataStore.Value = "Hello world!";

//  Save, close and destroy the session
dataStore.Destroy();
```

# Load Example

```lua
local DataStoreModule = require(11671168253)
local dataStore = DataStoreModule.new("Name", "Key")

-- read the value from the datastore
if dataStore:Read() ~= "Success" then return end

-- WARNING this value might be out of date use open instead if you need the latest value
print(dataStore.Value)

-- as we never opened the session it will instantly destroy without saving or closing
dataStore:Destroy()
```

# Setup Player Data Example

```ts
import DataStore from "@rbxts/suphi-datastore";
import { Players } from "@rbxts/services";

type optional = {
	Level: number;
	Coins: number;
	Inventory: {};
	DeveloperProducts:	Map<string , number>;
};

const template: optional = {
	Level: 0,
	Coins: 0,
	Inventory: {},
	DeveloperProducts: new Map<string , number>(),
};

Players.PlayerAdded.Connect((player) => {
	const dataStore = new DataStore<optional>("Player", tostring(player.UserId));
	const [success] = dataStore.Open(template);
	if (success !== "Success") print(player.Name, "failed to open");
});

Players.PlayerRemoving.Connect((player) => {
	const dataStore = DataStore.find<optional>("Player", tostring(player.UserId));
	dataStore?.Destroy();
});

```

# Setup Player Data Example

```lua
local dataStore = DataStoreModule.find("Player", player.UserId)
if dataStore == nil then return end
if dataStore.State ~= true then return end -- make sure the session is open or the value will never get saved
dataStore.Value.Level += 1
```

# Developer Products Example

```ts 

import DataStore from "@rbxts/suphi-datastore";
import { MarketplaceService } from "@rbxts/services";

type optional = {
	Level: number;
	Coins: number;
	Inventory: {};
	DeveloperProducts: Map<string, number>;
};

MarketplaceService.ProcessReceipt = function (receiptInfo) {
	const dataStore = DataStore.find<optional>("Player", tostring(receiptInfo.PlayerId));
	if (dataStore === undefined) return Enum.ProductPurchaseDecision.NotProcessedYet;
	if (dataStore.State !== true) return Enum.ProductPurchaseDecision.NotProcessedYet;

	// convert the ProductId to a string as we are not allowed empty slots for numeric indexes
	const productId = tostring(receiptInfo.ProductId);
	const DeveloperProducts = dataStore.Value.DeveloperProducts;
	// Add 1 to to the productId in the DeveloperProducts table
	DeveloperProducts.set(productId, (DeveloperProducts.get(productId) ?? 0) + 1);

	const [saved] = dataStore.Save();
	if (saved === "Saved")
		// there was no errors lets grant the purchase
		return Enum.ProductPurchaseDecision.PurchaseGranted;
	// the save failed lets make sure to remove the product or it might get saved in the next save interval
	else {
		const currentvalue = DeveloperProducts.get(productId);
		DeveloperProducts.set(productId, (currentvalue !== undefined && currentvalue - 1) || 0);
	}
	return Enum.ProductPurchaseDecision.NotProcessedYet;
};

```

# Setup Player Data Automatic Retry Example

```ts
import { Players } from "@rbxts/services";
import DataStore, { property } from "@rbxts/suphi-datastore";

type optional = {
	Level: number;
	Coins: number;
	Inventory: {};
	DeveloperProducts: Map<string, number>;
};

const tem: optional = {
	Level: 0,
	Coins: 0,
	Inventory: {},
	DeveloperProducts: new Map<string, number>(),
};

const StateChanged = (state: boolean, dataStore: property<optional>) => {
	while (dataStore.State === false) {
		const [success] = dataStore.Open(tem);
		if (success !== DataStore.Response.Success) task.wait(6);
	}
};

Players.PlayerAdded.Connect((player) => {
	const ds = new DataStore<optional>("Players_", tostring(player.UserId));
	ds.StateChanged.Connect(StateChanged);
	StateChanged(ds.State ?? (ds.State || false), ds);
});

Players.PlayerRemoving.Connect((player) => {
	const dataSource = DataStore.find<optional>("Players_", tostring(player.UserId));
	dataSource?.Destroy();
});
```
# Responses

```ts
const [response, responseData] = dataStore.Open()
//Success, nil
//Locked, UniqueId
//State, Destroying/Destroyed
//Error, ErrorMessage

const [response, responseData] = dataStore.Read()
//Success, nil
//State, Open
//Error, ErrorMessage

const [response, responseData] = dataStore.Save()
//Saved, nil
//State, Closing/Closed/Destroying/Destroyed
//Error, ErrorMessage

const [response, responseData] = dataStore.Close()
//Success, nil
//Saved, nil

const [response, responseData] = dataStore.Destroy()
//Success, nil
//Saved, nil

const [response, responseData] = dataStore.Queue()
//Success, nil
//Error, ErrorMessage

const [response, responseData] = dataStore.Remove()
//Success, nil
//Error, ErrorMessage
```

# Update 1.0
* bug fixes
* added hidden objects
* added Response enum
* added SaveDelay
* added Hidden property
* added Queue
* added Remove
* renamed Load to Read
* functions now respond differently
* Close and Destroy now tell you if the datastore saved
* improved proxy
* improved task manager
* you can now save custom values inside the object
* under the hood changes