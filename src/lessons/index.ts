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
// Exports (extended in subsequent chapters)
// ─────────────────────────────────────────────────────────────────────────────

export const CHAPTERS: Chapter[] = [CHAPTER_1];

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
