import type { Chapter } from '../engine/types';

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 1 — Hatching Season (Basics)
// ─────────────────────────────────────────────────────────────────────────────

const CHAPTER_1: Chapter = {
  id: 1,
  title: 'Hatching Season',
  description: 'Learn the real LEZ programming model: read inputs, process, write outputs',
  lessons: [
    // ─── Lesson 1 ────────────────────────────────────────────────────────────
    {
      id: 'ch1-l1',
      chapter: 1,
      step: 1,
      title: 'Your First Egg 🥚',
      content: `
## Welcome, Lizard Breeder! 🦎

The **Logos Execution Zone (LEZ)** is a ZK-proven smart-contract runtime. Every LEZ program
follows one strict pattern:

> **Read → Process → Write**

1. **Read** — call \`read_nssa_inputs\` to get accounts and an instruction
2. **Process** — apply your business logic
3. **Write** — call \`write_nssa_outputs\` to commit the new account states

### The actual API

\`\`\`rust
use nssa_core::program::{
    AccountPostState, ProgramInput, read_nssa_inputs, write_nssa_outputs,
};

fn main() {
    // Returns (ProgramInput<T>, InstructionData)
    let (ProgramInput { pre_states, instruction }, instruction_data) =
        read_nssa_inputs::<()>();
    // pre_states: Vec<AccountWithMetadata>
    // instruction: () — no instruction data for this lesson
    // instruction_data: InstructionData — raw bytes to echo back in output

    write_nssa_outputs(instruction_data, pre_states, post_states);
}
\`\`\`

### AccountPostState

Wraps the modified \`Account\` you want to commit:

| Constructor | Meaning |
|---|---|
| \`AccountPostState::new(account)\` | Output account (no ownership change) |
| \`AccountPostState::new_claimed(account)\` | Claim ownership of this account |

### Your mission 🥚

Complete the program so it reads **one** account and writes it back **unchanged**.

1. Call \`read_nssa_inputs::<()>()\` and bind both return values
2. Unpack the single account from \`pre_states\` with \`try_into()\`
3. Build \`AccountPostState::new(pre_state.account.clone())\`
4. Call \`write_nssa_outputs(instruction_data, vec![pre_state], vec![post_state])\`
      `.trim(),

      initialCode: `use nssa_core::program::{
    AccountPostState, ProgramInput, read_nssa_inputs, write_nssa_outputs,
};

fn main() {
    // Step 1: Read all program inputs
    // The type parameter <()> means the instruction carries no extra data
    // YOUR CODE HERE

    // Step 2: Unpack exactly one account from pre_states
    // Hint: pre_states.try_into().unwrap_or_else(|_| panic!("..."))
    // YOUR CODE HERE

    // Step 3: Build the post state — output the account unchanged
    // YOUR CODE HERE

    // Step 4: Commit the outputs
    // YOUR CODE HERE
}
`,

      solution: `use nssa_core::program::{
    AccountPostState, ProgramInput, read_nssa_inputs, write_nssa_outputs,
};

fn main() {
    let (ProgramInput { pre_states, instruction: _ }, instruction_data) =
        read_nssa_inputs::<()>();

    let [pre_state] = pre_states
        .try_into()
        .unwrap_or_else(|_| panic!("Expected exactly one account"));

    let post_state = AccountPostState::new(pre_state.account.clone());

    write_nssa_outputs(instruction_data, vec![pre_state], vec![post_state]);
}
`,

      validations: [
        {
          pattern: /read_nssa_inputs\s*::<\s*\(\s*\)\s*>/,
          message: 'Call `read_nssa_inputs::<()>()` with the unit type parameter',
          required: true,
        },
        {
          pattern: /AccountPostState::new\s*\(/,
          message: 'Create an `AccountPostState::new(…)` for the output account',
          required: true,
        },
        {
          pattern: /write_nssa_outputs\s*\(/,
          message: 'Call `write_nssa_outputs(instruction_data, …)` to commit results',
          required: true,
        },
      ],

      hints: [
        'Bind both return values: `let (ProgramInput { pre_states, instruction: _ }, instruction_data) = read_nssa_inputs::<()>();`',
        'Destructure one account: `let [pre_state] = pre_states.try_into().unwrap_or_else(|_| panic!("Expected exactly one account"));`',
        'Build output and commit:\n```rust\nlet post_state = AccountPostState::new(pre_state.account.clone());\nwrite_nssa_outputs(instruction_data, vec![pre_state], vec![post_state]);\n```',
      ],
    },

    // ─── Lesson 2 ────────────────────────────────────────────────────────────
    {
      id: 'ch1-l2',
      chapter: 1,
      step: 2,
      title: 'Naming Your Lizard ✏️',
      content: `
## Account Data & Borsh Serialization

Your lizard lives in an account's \`data\` field — a raw byte blob wrapped in the
\`Data\` type. To store structured state you **Borsh-serialize** your Rust structs.

### Reading and writing data

\`\`\`rust
// Deserialize from account data (Data implements AsRef<[u8]>)
let lizard = Lizard::try_from_slice(pre_state.account.data.as_ref()).unwrap();

// Serialize back to bytes, then convert Vec<u8> → Data
let bytes: Vec<u8> = borsh::to_vec(&lizard).unwrap();
post_account.data = bytes.try_into().unwrap();
\`\`\`

### Derive macros

Your struct needs these so Borsh can read/write it:

\`\`\`rust
#[derive(BorshSerialize, BorshDeserialize)]
pub struct Lizard {
    pub name: String,
    pub species: String,
    pub level: u32,
}
\`\`\`

### Your mission ✏️

The instruction is a \`String\` — the new name for the lizard.

1. Add \`#[derive(BorshSerialize, BorshDeserialize)]\` to \`Lizard\`
2. Deserialize the existing \`Lizard\` from account data
3. Set \`lizard.name = new_name\`
4. Serialize back, update \`post_account.data\`, build the post state
      `.trim(),

      initialCode: `use borsh::{BorshDeserialize, BorshSerialize};
use nssa_core::program::{
    AccountPostState, ProgramInput, read_nssa_inputs, write_nssa_outputs,
};

// YOUR CODE HERE — add the derive macro so Lizard can be stored on-chain
pub struct Lizard {
    pub name: String,
    pub species: String,
    pub level: u32,
}

fn main() {
    // The instruction is the new name for the lizard
    let (ProgramInput { pre_states, instruction: new_name }, instruction_data) =
        read_nssa_inputs::<String>();

    let [pre_state] = pre_states
        .try_into()
        .unwrap_or_else(|_| panic!("Expected exactly one account"));

    // Step 1: Deserialize the Lizard from account data
    // YOUR CODE HERE

    // Step 2: Update the lizard's name
    // YOUR CODE HERE

    // Step 3: Serialize and write the updated lizard back
    // YOUR CODE HERE
    // let bytes: Vec<u8> = borsh::to_vec(&lizard).unwrap();
    // let mut post_account = pre_state.account.clone();
    // post_account.data = bytes.try_into().unwrap();
    // let post_state = AccountPostState::new(post_account);

    write_nssa_outputs(instruction_data, vec![pre_state], vec![post_state]);
}
`,

      solution: `use borsh::{BorshDeserialize, BorshSerialize};
use nssa_core::program::{
    AccountPostState, ProgramInput, read_nssa_inputs, write_nssa_outputs,
};

#[derive(BorshSerialize, BorshDeserialize)]
pub struct Lizard {
    pub name: String,
    pub species: String,
    pub level: u32,
}

fn main() {
    let (ProgramInput { pre_states, instruction: new_name }, instruction_data) =
        read_nssa_inputs::<String>();

    let [pre_state] = pre_states
        .try_into()
        .unwrap_or_else(|_| panic!("Expected exactly one account"));

    let mut lizard = Lizard::try_from_slice(pre_state.account.data.as_ref()).unwrap();
    lizard.name = new_name;

    let bytes: Vec<u8> = borsh::to_vec(&lizard).unwrap();
    let mut post_account = pre_state.account.clone();
    post_account.data = bytes.try_into().unwrap();
    let post_state = AccountPostState::new(post_account);

    write_nssa_outputs(instruction_data, vec![pre_state], vec![post_state]);
}
`,

      validations: [
        {
          pattern: /#\[derive\(.*Borsh/,
          message: 'Add `#[derive(BorshSerialize, BorshDeserialize)]` to the Lizard struct',
          required: true,
        },
        {
          pattern: /try_from_slice/,
          message: 'Deserialize with `Lizard::try_from_slice(pre_state.account.data.as_ref())`',
          required: true,
        },
        {
          pattern: /borsh::to_vec/,
          message: 'Serialize back with `borsh::to_vec(&lizard).unwrap()`',
          required: true,
        },
      ],

      hints: [
        'Put `#[derive(BorshSerialize, BorshDeserialize)]` on the line directly above `pub struct Lizard`.',
        'Deserialize: `let mut lizard = Lizard::try_from_slice(pre_state.account.data.as_ref()).unwrap();` then `lizard.name = new_name;`',
        'Serialize back:\n```rust\nlet bytes: Vec<u8> = borsh::to_vec(&lizard).unwrap();\nlet mut post_account = pre_state.account.clone();\npost_account.data = bytes.try_into().unwrap();\nlet post_state = AccountPostState::new(post_account);\n```',
      ],
    },

    // ─── Lesson 3 ────────────────────────────────────────────────────────────
    {
      id: 'ch1-l3',
      chapter: 1,
      step: 3,
      title: 'The Lizard Registry 📋',
      content: `
## Instruction Enums & Dispatching

Real programs handle multiple operations. In LEZ you define an **instruction enum**
and dispatch on it in \`main\`. The enum must derive **serde** traits so the runtime
can deserialize it from the instruction bus:

\`\`\`rust
#[derive(serde::Serialize, serde::Deserialize)]
enum Instruction {
    Hatch { species: String },
    Rename { new_name: String },
    Feed,
}
\`\`\`

Then read and dispatch:
\`\`\`rust
let (ProgramInput { pre_states, instruction }, instruction_data) =
    read_nssa_inputs::<Instruction>();

match instruction {
    Instruction::Hatch { species } => { /* create new lizard */ }
    Instruction::Rename { new_name } => { /* update name */ }
    Instruction::Feed => { /* increment level */ }
}
\`\`\`

### Why serde (not borsh) for instructions?

The NSSA instruction bus uses \`risc0_zkvm::serde\` (serde-compatible) to encode
instructions as \`Vec<u32>\`. Account *data* uses borsh because it's stored
persistently on-chain and borsh is more compact.

### Your mission 📋

1. Add \`#[derive(Serialize, Deserialize)]\` to \`Instruction\`
2. Add a \`match instruction { … }\` block handling all three variants
3. Each branch updates \`post_account\` using borsh
      `.trim(),

      initialCode: `use borsh::{BorshDeserialize, BorshSerialize};
use serde::{Deserialize, Serialize};
use nssa_core::program::{
    AccountPostState, ProgramInput, read_nssa_inputs, write_nssa_outputs,
};

#[derive(BorshSerialize, BorshDeserialize)]
pub struct Lizard {
    pub name: String,
    pub species: String,
    pub level: u32,
}

// YOUR CODE HERE — add #[derive(Serialize, Deserialize)] here
enum Instruction {
    Hatch { species: String },
    Rename { new_name: String },
    Feed,
}

fn main() {
    let (ProgramInput { pre_states, instruction }, instruction_data) =
        read_nssa_inputs::<Instruction>();

    let [pre_state] = pre_states
        .try_into()
        .unwrap_or_else(|_| panic!("Expected exactly one account"));

    let mut post_account = pre_state.account.clone();

    // YOUR CODE HERE — match on instruction and handle each variant
    // Hatch:  create Lizard { name: "Hatchling".into(), species, level: 1 }
    // Rename: deserialize, update name, re-serialize
    // Feed:   deserialize, increment level, re-serialize

    let post_state = AccountPostState::new(post_account);
    write_nssa_outputs(instruction_data, vec![pre_state], vec![post_state]);
}
`,

      solution: `use borsh::{BorshDeserialize, BorshSerialize};
use serde::{Deserialize, Serialize};
use nssa_core::program::{
    AccountPostState, ProgramInput, read_nssa_inputs, write_nssa_outputs,
};

#[derive(BorshSerialize, BorshDeserialize)]
pub struct Lizard {
    pub name: String,
    pub species: String,
    pub level: u32,
}

#[derive(Serialize, Deserialize)]
enum Instruction {
    Hatch { species: String },
    Rename { new_name: String },
    Feed,
}

fn main() {
    let (ProgramInput { pre_states, instruction }, instruction_data) =
        read_nssa_inputs::<Instruction>();

    let [pre_state] = pre_states
        .try_into()
        .unwrap_or_else(|_| panic!("Expected exactly one account"));

    let mut post_account = pre_state.account.clone();

    match instruction {
        Instruction::Hatch { species } => {
            let lizard = Lizard { name: "Hatchling".into(), species, level: 1 };
            post_account.data = borsh::to_vec(&lizard).unwrap().try_into().unwrap();
        }
        Instruction::Rename { new_name } => {
            let mut lizard = Lizard::try_from_slice(post_account.data.as_ref()).unwrap();
            lizard.name = new_name;
            post_account.data = borsh::to_vec(&lizard).unwrap().try_into().unwrap();
        }
        Instruction::Feed => {
            let mut lizard = Lizard::try_from_slice(post_account.data.as_ref()).unwrap();
            lizard.level += 1;
            post_account.data = borsh::to_vec(&lizard).unwrap().try_into().unwrap();
        }
    }

    let post_state = AccountPostState::new(post_account);
    write_nssa_outputs(instruction_data, vec![pre_state], vec![post_state]);
}
`,

      validations: [
        {
          pattern: /#\[derive\(.*Serialize.*Deserialize|#\[derive\(.*Deserialize.*Serialize/,
          message: 'Add `#[derive(Serialize, Deserialize)]` to the `Instruction` enum',
          required: true,
        },
        {
          pattern: /match\s+instruction/,
          message: 'Add a `match instruction { … }` block to dispatch variants',
          required: true,
        },
        {
          pattern: /Instruction::Hatch/,
          message: 'Handle the `Instruction::Hatch` variant in your match',
          required: true,
        },
      ],

      hints: [
        'Add `#[derive(Serialize, Deserialize)]` on the line above `enum Instruction {`.',
        'Start your dispatch block: `match instruction { Instruction::Hatch { species } => { … }, … }`',
        'For Hatch: `let lizard = Lizard { name: "Hatchling".into(), species, level: 1 }; post_account.data = borsh::to_vec(&lizard).unwrap().try_into().unwrap();`',
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 2 — Lizard Care
// ─────────────────────────────────────────────────────────────────────────────

const CHAPTER_2: Chapter = {
  id: 2,
  title: 'Lizard Care',
  description: 'Secure your hatchery: authorization, account claiming, and balance conservation',
  lessons: [
    // ─── Lesson 4 ────────────────────────────────────────────────────────────
    {
      id: 'ch2-l1',
      chapter: 2,
      step: 1,
      title: 'Only the Owner Can Feed 🔐',
      content: `
## Someone Tried to Feed Your Lizard!

You got an alert: an unknown address just called **Feed** on your lizard account.
In LEZ, every account passed to your program arrives wrapped in \`AccountWithMetadata\`,
which carries an authorization flag:

\`\`\`rust
pub struct AccountWithMetadata {
    pub account: Account,
    pub is_authorized: bool,   // ← set by the LEZ runtime
    pub account_id: AccountId,
}
\`\`\`

The runtime sets \`is_authorized = true\` only when the **account's owner signed**
the transaction. If it's \`false\`, reject the call immediately — someone is trying
to modify an account they don't control!

### Pattern

\`\`\`rust
if !pre_state.is_authorized {
    panic!("Unauthorized: only the lizard owner can feed it");
}
\`\`\`

### Your mission 🔐

1. After unpacking \`pre_state\`, check \`pre_state.is_authorized\`
2. \`panic!\` with a clear message if it is \`false\`
3. Let the existing feed logic run only for authorized callers
      `.trim(),

      initialCode: `use borsh::{BorshDeserialize, BorshSerialize};
use nssa_core::program::{
    AccountPostState, ProgramInput, read_nssa_inputs, write_nssa_outputs,
};

#[derive(BorshSerialize, BorshDeserialize)]
pub struct Lizard {
    pub name: String,
    pub species: String,
    pub level: u32,
}

fn main() {
    let (ProgramInput { pre_states, instruction: _ }, instruction_data) =
        read_nssa_inputs::<()>();

    let [pre_state] = pre_states
        .try_into()
        .unwrap_or_else(|_| panic!("Expected exactly one account"));

    // YOUR CODE HERE — reject unauthorized callers before doing anything else!
    // Hint: check pre_state.is_authorized and panic! if false

    let mut post_account = pre_state.account.clone();
    let mut lizard = Lizard::try_from_slice(post_account.data.as_ref()).unwrap();
    lizard.level += 1;
    post_account.data = borsh::to_vec(&lizard).unwrap().try_into().unwrap();

    let post_state = AccountPostState::new(post_account);
    write_nssa_outputs(instruction_data, vec![pre_state], vec![post_state]);
}
`,

      solution: `use borsh::{BorshDeserialize, BorshSerialize};
use nssa_core::program::{
    AccountPostState, ProgramInput, read_nssa_inputs, write_nssa_outputs,
};

#[derive(BorshSerialize, BorshDeserialize)]
pub struct Lizard {
    pub name: String,
    pub species: String,
    pub level: u32,
}

fn main() {
    let (ProgramInput { pre_states, instruction: _ }, instruction_data) =
        read_nssa_inputs::<()>();

    let [pre_state] = pre_states
        .try_into()
        .unwrap_or_else(|_| panic!("Expected exactly one account"));

    if !pre_state.is_authorized {
        panic!("Unauthorized: only the lizard owner can feed it");
    }

    let mut post_account = pre_state.account.clone();
    let mut lizard = Lizard::try_from_slice(post_account.data.as_ref()).unwrap();
    lizard.level += 1;
    post_account.data = borsh::to_vec(&lizard).unwrap().try_into().unwrap();

    let post_state = AccountPostState::new(post_account);
    write_nssa_outputs(instruction_data, vec![pre_state], vec![post_state]);
}
`,

      validations: [
        {
          pattern: /is_authorized/,
          message: 'Check `pre_state.is_authorized` to verify the caller has permission',
          required: true,
        },
        {
          pattern: /!\s*pre_state\.is_authorized/,
          message: 'Guard against unauthorized access: `if !pre_state.is_authorized { panic!(…) }`',
          required: true,
        },
      ],

      hints: [
        'Add this block right after unpacking `pre_state`:\n```rust\nif !pre_state.is_authorized {\n    panic!("Unauthorized: only the lizard owner can feed it");\n}\n```',
        '`is_authorized` is a field on `AccountWithMetadata` — the type of `pre_state`. Access it with `pre_state.is_authorized`.',
      ],
    },

    // ─── Lesson 5 ────────────────────────────────────────────────────────────
    {
      id: 'ch2-l2',
      chapter: 2,
      step: 2,
      title: 'Claiming Your Egg 🏷️',
      content: `
## Wild Lizard Eggs Are Unclaimed

Out in the wild, lizard eggs exist as accounts with no program owner — their
\`program_owner\` is set to the **default program ID** (all zeros):

\`\`\`rust
pub const DEFAULT_PROGRAM_ID: ProgramId = [0; 8];
\`\`\`

When your hatchery program hatches one of these eggs, it must **claim** ownership
so it can manage the account going forward. Use \`AccountPostState::new_claimed\`
instead of \`AccountPostState::new\` to signal this:

| Constructor | When to use |
|---|---|
| \`AccountPostState::new(account)\` | Account already owned by your program |
| \`AccountPostState::new_claimed(account)\` | Claiming an unowned (default) account |

### Pattern

\`\`\`rust
use nssa_core::program::DEFAULT_PROGRAM_ID;

let post_state = if post_account.program_owner == DEFAULT_PROGRAM_ID {
    AccountPostState::new_claimed(post_account)  // wild egg — claim it!
} else {
    AccountPostState::new(post_account)           // already yours
};
\`\`\`

### Your mission 🏷️

1. Import \`DEFAULT_PROGRAM_ID\` from \`nssa_core::program\`
2. After building \`post_account\`, check whether it's unclaimed
3. Use \`new_claimed\` for unclaimed eggs, \`new\` for already-owned accounts
      `.trim(),

      initialCode: `use borsh::{BorshDeserialize, BorshSerialize};
use nssa_core::program::{
    AccountPostState, ProgramInput, read_nssa_inputs, write_nssa_outputs,
};

#[derive(BorshSerialize, BorshDeserialize)]
pub struct Lizard {
    pub name: String,
    pub species: String,
    pub level: u32,
}

fn main() {
    // The instruction is the species of the newly hatched lizard
    let (ProgramInput { pre_states, instruction: species }, instruction_data) =
        read_nssa_inputs::<String>();

    let [pre_state] = pre_states
        .try_into()
        .unwrap_or_else(|_| panic!("Expected exactly one account"));

    if !pre_state.is_authorized {
        panic!("Unauthorized: cannot hatch into this account");
    }

    let lizard = Lizard { name: "Hatchling".into(), species, level: 1 };
    let mut post_account = pre_state.account.clone();
    post_account.data = borsh::to_vec(&lizard).unwrap().try_into().unwrap();

    // YOUR CODE HERE — should you use new() or new_claimed()?
    // Wild eggs have program_owner == DEFAULT_PROGRAM_ID — claim them!
    let post_state = AccountPostState::new(post_account);

    write_nssa_outputs(instruction_data, vec![pre_state], vec![post_state]);
}
`,

      solution: `use borsh::{BorshDeserialize, BorshSerialize};
use nssa_core::program::{
    AccountPostState, DEFAULT_PROGRAM_ID, ProgramInput, read_nssa_inputs, write_nssa_outputs,
};

#[derive(BorshSerialize, BorshDeserialize)]
pub struct Lizard {
    pub name: String,
    pub species: String,
    pub level: u32,
}

fn main() {
    let (ProgramInput { pre_states, instruction: species }, instruction_data) =
        read_nssa_inputs::<String>();

    let [pre_state] = pre_states
        .try_into()
        .unwrap_or_else(|_| panic!("Expected exactly one account"));

    if !pre_state.is_authorized {
        panic!("Unauthorized: cannot hatch into this account");
    }

    let lizard = Lizard { name: "Hatchling".into(), species, level: 1 };
    let mut post_account = pre_state.account.clone();
    post_account.data = borsh::to_vec(&lizard).unwrap().try_into().unwrap();

    let post_state = if post_account.program_owner == DEFAULT_PROGRAM_ID {
        AccountPostState::new_claimed(post_account)
    } else {
        AccountPostState::new(post_account)
    };

    write_nssa_outputs(instruction_data, vec![pre_state], vec![post_state]);
}
`,

      validations: [
        {
          pattern: /DEFAULT_PROGRAM_ID/,
          message: 'Import and use `DEFAULT_PROGRAM_ID` to detect unclaimed accounts',
          required: true,
        },
        {
          pattern: /AccountPostState::new_claimed\s*\(/,
          message: 'Call `AccountPostState::new_claimed(…)` to claim the wild egg',
          required: true,
        },
      ],

      hints: [
        'Add `DEFAULT_PROGRAM_ID` to your import: `use nssa_core::program::{ AccountPostState, DEFAULT_PROGRAM_ID, … };`',
        'Replace the final `AccountPostState::new(post_account)` with:\n```rust\nlet post_state = if post_account.program_owner == DEFAULT_PROGRAM_ID {\n    AccountPostState::new_claimed(post_account)\n} else {\n    AccountPostState::new(post_account)\n};\n```',
      ],
    },

    // ─── Lesson 6 ────────────────────────────────────────────────────────────
    {
      id: 'ch2-l3',
      chapter: 2,
      step: 3,
      title: 'Lizard Growth 📈',
      content: `
## Your Lizard Needs to Eat

It's feeding time! Your lizard eats **food tokens** to level up. Food tokens live
in a separate **food account** as native LEZ balance (\`account.balance\`).

But LEZ is strict: **total balance across all accounts must be preserved**. You
cannot create or destroy tokens — you can only move them. The runtime enforces this
via \`validate_execution\`:

> *"Total balance of all pre-state accounts must equal total balance of all
> post-state accounts."*

So to feed your lizard you must:
1. **Deduct** \`FEED_COST\` from the food account's balance
2. **Add** \`FEED_COST\` to the lizard account's balance
3. **Level up** the lizard in its borsh data

### Two-account pattern

\`\`\`rust
// Unpack two accounts in order
let [lizard_pre, food_pre] = pre_states
    .try_into()
    .unwrap_or_else(|_| panic!("Expected lizard and food accounts"));

// Pass both into write_nssa_outputs
write_nssa_outputs(
    instruction_data,
    vec![lizard_pre, food_pre],
    vec![lizard_post_state, food_post_state],
);
\`\`\`

### Your mission 📈

1. Destructure **two** accounts from \`pre_states\`: lizard and food
2. Level up the lizard in its borsh data
3. Transfer \`FEED_COST = 10\` from food balance to lizard balance
4. Commit **both** post states to \`write_nssa_outputs\`
      `.trim(),

      initialCode: `use borsh::{BorshDeserialize, BorshSerialize};
use nssa_core::program::{
    AccountPostState, ProgramInput, read_nssa_inputs, write_nssa_outputs,
};

#[derive(BorshSerialize, BorshDeserialize)]
pub struct Lizard {
    pub name: String,
    pub species: String,
    pub level: u32,
}

const FEED_COST: u128 = 10;

fn main() {
    let (ProgramInput { pre_states, instruction: _ }, instruction_data) =
        read_nssa_inputs::<()>();

    // YOUR CODE HERE — unpack TWO accounts: lizard and food
    // let [lizard_pre, food_pre] = pre_states.try_into()...

    // YOUR CODE HERE — check authorization, then level up the lizard
    // Remember: update borsh data AND transfer FEED_COST between balances

    // YOUR CODE HERE — build post states for BOTH accounts and write outputs
    // LEZ will reject the transaction if total balance changes!
}
`,

      solution: `use borsh::{BorshDeserialize, BorshSerialize};
use nssa_core::program::{
    AccountPostState, ProgramInput, read_nssa_inputs, write_nssa_outputs,
};

#[derive(BorshSerialize, BorshDeserialize)]
pub struct Lizard {
    pub name: String,
    pub species: String,
    pub level: u32,
}

const FEED_COST: u128 = 10;

fn main() {
    let (ProgramInput { pre_states, instruction: _ }, instruction_data) =
        read_nssa_inputs::<()>();

    let [lizard_pre, food_pre] = pre_states
        .try_into()
        .unwrap_or_else(|_| panic!("Expected lizard and food accounts"));

    if !lizard_pre.is_authorized {
        panic!("Unauthorized: only the lizard owner can feed it");
    }

    let mut lizard_post = lizard_pre.account.clone();
    let mut lizard = Lizard::try_from_slice(lizard_post.data.as_ref()).unwrap();
    lizard.level += 1;
    lizard_post.data = borsh::to_vec(&lizard).unwrap().try_into().unwrap();
    lizard_post.balance += FEED_COST;

    let mut food_post = food_pre.account.clone();
    food_post.balance -= FEED_COST;

    write_nssa_outputs(
        instruction_data,
        vec![lizard_pre, food_pre],
        vec![AccountPostState::new(lizard_post), AccountPostState::new(food_post)],
    );
}
`,

      validations: [
        {
          pattern: /\[\s*lizard_pre\s*,\s*food_pre\s*\]|\[\s*\w+\s*,\s*\w+\s*\]\s*=\s*pre_states/,
          message: 'Destructure two accounts from `pre_states`: `let [lizard_pre, food_pre] = pre_states.try_into()…`',
          required: true,
        },
        {
          pattern: /FEED_COST/,
          message: 'Use the `FEED_COST` constant when transferring balance between accounts',
          required: true,
        },
        {
          pattern: /vec!\s*\[\s*\w+\s*,\s*\w+\s*\]/,
          message: 'Pass both accounts to `write_nssa_outputs` — LEZ checks that all accounts are accounted for',
          required: true,
        },
      ],

      hints: [
        'Unpack two accounts: `let [lizard_pre, food_pre] = pre_states.try_into().unwrap_or_else(|_| panic!("Expected lizard and food accounts"));`',
        'Level up and transfer energy:\n```rust\nlizard_post.balance += FEED_COST; // lizard gains tokens\nfood_post.balance -= FEED_COST;   // food account loses tokens\n```\nTotal balance stays the same — LEZ is satisfied.',
        'Commit both accounts:\n```rust\nwrite_nssa_outputs(\n    instruction_data,\n    vec![lizard_pre, food_pre],\n    vec![AccountPostState::new(lizard_post), AccountPostState::new(food_post)],\n);\n```',
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Exports (extended in subsequent chapters)
// ─────────────────────────────────────────────────────────────────────────────

export const CHAPTERS: Chapter[] = [CHAPTER_1, CHAPTER_2];

export const ALL_LESSONS = CHAPTERS.flatMap((c) => c.lessons);

export function getLessonById(id: string) {
  return ALL_LESSONS.find((l) => l.id === id);
}

export function getNextLesson(currentId: string) {
  const idx = ALL_LESSONS.findIndex((l) => l.id === currentId);
  return idx >= 0 && idx < ALL_LESSONS.length - 1 ? ALL_LESSONS[idx + 1] : null;
}

export function getPrevLesson(currentId: string) {
  const idx = ALL_LESSONS.findIndex((l) => l.id === currentId);
  return idx > 0 ? ALL_LESSONS[idx - 1] : null;
}
