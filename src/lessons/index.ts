import type { Chapter } from '../engine/types';

const CHAPTER_1: Chapter = {
  id: 1,
  title: 'Getting Started with LEZ',
  description: 'Learn the fundamentals of the Logos Execution Zone',
  lessons: [
    {
      id: 'ch1-l1',
      chapter: 1,
      step: 1,
      title: 'Hatching Your First Lizard',
      content: `
## Welcome to the Logos Execution Zone 🦎

The **Logos Execution Zone (LEZ)** is a sandboxed smart-contract runtime built for the Logos blockchain. LEZ programs are written in **Rust** and follow a strict, deterministic lifecycle:

> **Read → Process → Write**

Every LEZ program does exactly three things:
1. **Read** inputs from the network state (NSSA inputs)
2. **Process** them with pure Rust logic
3. **Write** outputs back to the network state (NSSA outputs)

### The Entry Point

A LEZ program exposes a single \`main\` function that receives inputs and returns a result:

\`\`\`rust
pub fn main(inputs: NssaInputs) -> Result<NssaOutputs, LezError> {
    // your logic here
    Ok(outputs)
}
\`\`\`

### Account State

The core type you'll work with is \`AccountPostState\`, which represents the new state of an account after your program runs:

\`\`\`rust
AccountPostState {
    address: Address,
    balance: u64,
    data: Vec<u8>,
}
\`\`\`

### Your Mission

Complete the skeleton below to create your first LEZ program. You need to:

1. Call \`read_nssa_inputs\` to get the program inputs
2. Build an \`AccountPostState\` for the output
3. Call \`write_nssa_outputs\` to commit the result

**Fill in the \`// YOUR CODE HERE\` sections below and click Check Answer!**
      `.trim(),
      initialCode: `use lez_sdk::prelude::*;

// A LEZ program entry point
pub fn main() -> Result<(), LezError> {
    // Step 1: Read inputs from the NSSA
    // YOUR CODE HERE — call read_nssa_inputs()

    // Step 2: Build the output account state
    // YOUR CODE HERE — create an AccountPostState { address: ..., balance: ..., data: ... }

    // Step 3: Write outputs back to the NSSA
    // YOUR CODE HERE — call write_nssa_outputs(post_state)

    Ok(())
}
`,
      solution: `use lez_sdk::prelude::*;

// A LEZ program entry point
pub fn main() -> Result<(), LezError> {
    // Step 1: Read inputs from the NSSA
    let inputs = read_nssa_inputs();

    // Step 2: Build the output account state
    let post_state = AccountPostState {
        address: inputs.sender,
        balance: inputs.value,
        data: vec![],
    };

    // Step 3: Write outputs back to the NSSA
    write_nssa_outputs(post_state);

    Ok(())
}
`,
      validations: [
        {
          pattern: /read_nssa_inputs\s*\(/,
          message: 'Call `read_nssa_inputs()` to receive program inputs',
          required: true,
        },
        {
          pattern: /AccountPostState\s*\{/,
          message: 'Create an `AccountPostState` struct for the output',
          required: true,
        },
        {
          pattern: /write_nssa_outputs\s*\(/,
          message: 'Call `write_nssa_outputs(...)` to commit the state change',
          required: true,
        },
      ],
      hints: [
        'The function `read_nssa_inputs()` returns the inputs passed to your program. Try: `let inputs = read_nssa_inputs();`',
        'Build the output: `let post_state = AccountPostState { address: inputs.sender, balance: inputs.value, data: vec![] };`',
        'Put it all together:\n```rust\nlet inputs = read_nssa_inputs();\n// ... build post_state ...\nwrite_nssa_outputs(post_state);\n```',
      ],
    },
    {
      id: 'ch1-l2',
      chapter: 1,
      step: 2,
      title: 'Reading Account Balances',
      content: `
## Inspecting Account State

Now that you know the basic Read → Process → Write pattern, let's dig into what \`read_nssa_inputs\` actually gives you.

### The NssaInputs Type

\`read_nssa_inputs()\` returns an \`NssaInputs\` struct:

\`\`\`rust
pub struct NssaInputs {
    pub sender: Address,
    pub value: u64,
    pub accounts: Vec<AccountState>,
    pub calldata: Vec<u8>,
}
\`\`\`

- **sender** — the \`Address\` that triggered this program
- **value** — any native tokens attached to the call
- **accounts** — a list of accounts your program can read from
- **calldata** — arbitrary bytes passed by the caller

### Looking Up an Account

To read an account's current balance, look it up from the \`accounts\` list:

\`\`\`rust
let account = inputs.accounts
    .iter()
    .find(|a| a.address == target_address)
    .ok_or(LezError::AccountNotFound)?;

println!("Balance: {}", account.balance);
\`\`\`

### Your Mission

Complete the program below:
1. Read the NSSA inputs
2. Find the sender's account in the accounts list
3. Emit a log message with their balance using \`lez_log!\`
      `.trim(),
      initialCode: `use lez_sdk::prelude::*;

pub fn main() -> Result<(), LezError> {
    let inputs = read_nssa_inputs();

    // Step 1: Find the sender's account
    // YOUR CODE HERE — search the accounts list for the sender address

    // Step 2: Log the balance
    // YOUR CODE HERE — use lez_log!("Balance: {}", account.balance)

    let post_state = AccountPostState {
        address: Address::zero(), // YOUR CODE HERE — use the sender address
        balance: 0,
        data: vec![],
    };
    write_nssa_outputs(post_state);
    Ok(())
}
`,
      solution: `use lez_sdk::prelude::*;

pub fn main() -> Result<(), LezError> {
    let inputs = read_nssa_inputs();

    // Step 1: Find the sender's account
    let account = inputs.accounts
        .iter()
        .find(|a| a.address == inputs.sender)
        .ok_or(LezError::AccountNotFound)?;

    // Step 2: Log the balance
    lez_log!("Balance: {}", account.balance);

    let post_state = AccountPostState {
        address: inputs.sender,
        balance: account.balance,
        data: vec![],
    };
    write_nssa_outputs(post_state);
    Ok(())
}
`,
      validations: [
        {
          pattern: /inputs\.accounts/,
          message: 'Access `inputs.accounts` to look up account data',
          required: true,
        },
        {
          pattern: /inputs\.sender/,
          message: 'Use `inputs.sender` as the target address',
          required: true,
        },
        {
          pattern: /lez_log!/,
          message: 'Use `lez_log!` macro to emit a log message',
          required: true,
        },
      ],
      hints: [
        'Use `.iter().find(|a| a.address == inputs.sender)` to search through accounts.',
        'After finding the account, call `lez_log!("Balance: {}", account.balance)` to log it.',
        'Don\'t forget to handle the case where the account doesn\'t exist with `.ok_or(LezError::AccountNotFound)?`',
      ],
    },
  ],
};

const CHAPTER_2: Chapter = {
  id: 2,
  title: 'State & Storage',
  description: 'Persist data across LEZ program invocations',
  lessons: [
    {
      id: 'ch2-l1',
      chapter: 2,
      step: 1,
      title: 'Writing to Account Data',
      content: `
## Persistent Storage in LEZ

LEZ programs are stateless between invocations — but you can persist data by writing it into an account's \`data\` field.

### Serializing State

The recommended way is to use \`borsh\` serialization:

\`\`\`rust
use borsh::{BorshSerialize, BorshDeserialize};

#[derive(BorshSerialize, BorshDeserialize)]
pub struct Counter {
    pub count: u64,
}
\`\`\`

To write it:
\`\`\`rust
let state = Counter { count: 42 };
let data = state.try_to_vec()?;
\`\`\`

To read it back next time:
\`\`\`rust
let state = Counter::try_from_slice(&account.data)?;
\`\`\`

### Your Mission

Build a simple counter program that:
1. Reads the current \`Counter\` state from the sender's account (default to 0 if empty)
2. Increments the count by 1
3. Serializes and writes the new state back
      `.trim(),
      initialCode: `use lez_sdk::prelude::*;
use borsh::{BorshSerialize, BorshDeserialize};

#[derive(Default)] // YOUR CODE HERE — also derive BorshSerialize and BorshDeserialize
pub struct Counter {
    pub count: u64,
}

pub fn main() -> Result<(), LezError> {
    let inputs = read_nssa_inputs();

    let account = inputs.accounts
        .iter()
        .find(|a| a.address == inputs.sender)
        .ok_or(LezError::AccountNotFound)?;

    // Step 1: Deserialize current counter (or use default)
    // YOUR CODE HERE

    // Step 2: Increment
    // YOUR CODE HERE

    // Step 3: Serialize and write back
    // YOUR CODE HERE

    Ok(())
}
`,
      solution: `use lez_sdk::prelude::*;
use borsh::{BorshSerialize, BorshDeserialize};

#[derive(BorshSerialize, BorshDeserialize, Default)]
pub struct Counter {
    pub count: u64,
}

pub fn main() -> Result<(), LezError> {
    let inputs = read_nssa_inputs();

    let account = inputs.accounts
        .iter()
        .find(|a| a.address == inputs.sender)
        .ok_or(LezError::AccountNotFound)?;

    // Step 1: Deserialize current counter (or use default)
    let mut state = if account.data.is_empty() {
        Counter::default()
    } else {
        Counter::try_from_slice(&account.data)?
    };

    // Step 2: Increment
    state.count += 1;

    // Step 3: Serialize and write back
    let data = state.try_to_vec()?;
    write_nssa_outputs(AccountPostState {
        address: inputs.sender,
        balance: account.balance,
        data,
    });

    Ok(())
}
`,
      validations: [
        {
          pattern: /BorshSerialize|BorshDeserialize/,
          message: 'Derive `BorshSerialize` and/or `BorshDeserialize` on your state struct',
          required: true,
        },
        {
          pattern: /try_from_slice|Counter::default/,
          message: 'Deserialize the existing state (or use default if empty)',
          required: true,
        },
        {
          pattern: /\.count\s*\+=\s*1/,
          message: 'Increment `state.count` by 1',
          required: true,
        },
        {
          pattern: /try_to_vec/,
          message: 'Serialize the new state with `try_to_vec()`',
          required: true,
        },
      ],
      hints: [
        'To handle an empty account, use: `if account.data.is_empty() { Counter::default() } else { Counter::try_from_slice(&account.data)? }`',
        'Increment with `state.count += 1;`',
        'Serialize with `let data = state.try_to_vec()?;` and pass it into `AccountPostState { data, ... }`',
      ],
    },
  ],
};

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
