import type { Chapter } from '../engine/types';

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 0 — Rust for Lizard Breeders
// ─────────────────────────────────────────────────────────────────────────────

const CHAPTER_0: Chapter = {
  id: 0,
  title: 'Rust for Lizard Breeders',
  description: 'Learn just enough Rust to write LEZ programs — variables, structs, enums, and serialization',
  lessons: [
    // ─── Lesson 0.1 ──────────────────────────────────────────────────────────
    {
      id: 'ch0-l1',
      chapter: 0,
      step: 1,
      title: 'Variables & Types 📊',
      content: `
## Welcome to Rust, Lizard Breeder! 🦎🔧

Before you can write LEZ programs, you need a little Rust. Don't worry — we'll
only teach what you actually need. By lesson 0.5 you'll have everything to
understand Chapter 1.

> **Note:** These lessons are pure Rust — no LEZ APIs yet. LEZ comes in Chapter 1!

### Immutable by default

In JavaScript you write \`let x = 5\` and can reassign it freely. In Rust,
\`let x = 5\` is **immutable** — you can never change \`x\`. To allow mutation
you must write \`let mut x = 5\`.

\`\`\`rust
let name = String::from("Spike");  // immutable — name never changes
let mut level: u64 = 1;           // mutable — level can grow
level += 1;                        // ✅ works
// name = String::from("Rex");    // ❌ compile error!
\`\`\`

### Common types you'll see in LEZ

| Type | Description | Like in JS/Python |
|---|---|---|
| \`u8\` | 0–255 integer | \`number\` (small) |
| \`u32\` | 0–4 billion integer | \`number\` |
| \`u64\` | 0–18 quintillion integer | \`BigInt\` |
| \`u128\` | very large integer | \`BigInt\` (bigger) |
| \`bool\` | true/false | \`boolean\` |
| \`String\` | text (heap-allocated) | \`string\` |
| \`Vec<u8>\` | growable array of bytes | \`Uint8Array\` |

Type annotations go after the variable name with a colon: \`let age: u64 = 5;\`

### Your mission 📊

The code below won't compile. Fix it by:
1. Adding \`mut\` to \`level\` so it can be incremented
2. Adding \`mut\` and the type annotation \`: u32\` to \`health\`
      `.trim(),

      initialCode: `fn main() {
    // A lizard's name never changes — keep it immutable
    let name: String = String::from("Spike");

    // The lizard's level — starts at 1, can grow
    // FIX: add \`mut\` so we can level up
    let level: u64 = 1;

    // Health points — changes during battle
    // FIX: add \`mut\` and the correct type annotation \`: u32\`
    let health = 100;

    level += 1;
    health -= 10;

    println!("Lizard: {}, Level: {}, HP: {}", name, level, health);
}
`,

      solution: `fn main() {
    let name: String = String::from("Spike");
    let mut level: u64 = 1;
    let mut health: u32 = 100;

    level += 1;
    health -= 10;

    println!("Lizard: {}, Level: {}, HP: {}", name, level, health);
}
`,

      validations: [
        {
          pattern: /let\s+mut\s+level/,
          message: 'Make `level` mutable with `let mut level: u64 = 1;`',
          required: true,
        },
        {
          pattern: /let\s+mut\s+health/,
          message: 'Make `health` mutable with `let mut health`',
          required: true,
        },
        {
          pattern: /health:\s*u32/,
          message: 'Give `health` the type annotation `: u32`',
          required: true,
        },
      ],

      hints: [
        'Change `let level: u64 = 1;` to `let mut level: u64 = 1;` — the `mut` keyword goes between `let` and the variable name',
        'Change `let health = 100;` to `let mut health: u32 = 100;` — add both `mut` and the type annotation `: u32`',
      ],
    },

    // ─── Lesson 0.2 ──────────────────────────────────────────────────────────
    {
      id: 'ch0-l2',
      chapter: 0,
      step: 2,
      title: 'Structs 🏗️',
      content: `
## Grouping Data with Structs

A **struct** lets you bundle related fields together — like a class with only data
(no methods yet). In Solidity you'd call this a struct too; in Python it's a
dataclass.

\`\`\`rust
struct Lizard {
    name: String,
    species: String,
    level: u64,
}

let lizard = Lizard {
    name: String::from("Spike"),
    species: String::from("Gecko"),
    level: 1,
};

println!("{}", lizard.name); // dot notation, same as JS
\`\`\`

### Derive macros — free code from the compiler

\`#[derive(...)]\` tells Rust to auto-generate trait implementations for you:

| Derive | What it gives you |
|---|---|
| \`Debug\` | \`println!("{:?}", lizard)\` — useful for debugging |
| \`Clone\` | \`lizard.clone()\` — make a deep copy |

You need \`Clone\` because Rust's ownership rules mean you can't just copy a
\`String\` by assigning it — you must explicitly call \`.clone()\`.

### Your mission 🏗️

The struct below is missing its \`#[derive]\` macro and its field definitions.

1. Add \`#[derive(Debug, Clone)]\` above the struct
2. Add the three fields: \`name: String\`, \`species: String\`, \`level: u64\`
      `.trim(),

      initialCode: `// FIX 1: add #[derive(Debug, Clone)] here so we can print and clone the lizard
struct Lizard {
    // FIX 2: add fields — name (String), species (String), level (u64)
}

fn main() {
    let mut lizard = Lizard {
        name: String::from("Spike"),
        species: String::from("Gecko"),
        level: 1,
    };

    println!("Before: {:?}", lizard);

    lizard.level += 1;

    // Clone creates an independent copy — changing one won't affect the other
    let hall_of_fame = lizard.clone();
    println!("Hall of fame: {:?}", hall_of_fame);
}
`,

      solution: `#[derive(Debug, Clone)]
struct Lizard {
    name: String,
    species: String,
    level: u64,
}

fn main() {
    let mut lizard = Lizard {
        name: String::from("Spike"),
        species: String::from("Gecko"),
        level: 1,
    };

    println!("Before: {:?}", lizard);

    lizard.level += 1;

    let hall_of_fame = lizard.clone();
    println!("Hall of fame: {:?}", hall_of_fame);
}
`,

      validations: [
        {
          pattern: /#\[derive\([^)]*Debug[^)]*\)\]/,
          message: 'Add `#[derive(Debug, Clone)]` above the struct',
          required: true,
        },
        {
          pattern: /#\[derive\([^)]*Clone[^)]*\)\]/,
          message: 'Include `Clone` in the derive macro: `#[derive(Debug, Clone)]`',
          required: true,
        },
        {
          pattern: /name:\s*String/,
          message: 'Add the `name: String` field to the struct',
          required: true,
        },
        {
          pattern: /level:\s*u64/,
          message: 'Add the `level: u64` field to the struct',
          required: true,
        },
      ],

      hints: [
        'The derive macro goes on the line directly above `struct Lizard {`: `#[derive(Debug, Clone)]`',
        'Add each field on its own line inside the struct: `name: String,` then `species: String,` then `level: u64,`',
        'Remember the commas after each field — Rust structs use trailing commas',
      ],
    },

    // ─── Lesson 0.3 ──────────────────────────────────────────────────────────
    {
      id: 'ch0-l3',
      chapter: 0,
      step: 3,
      title: 'Enums & Match 🦎',
      content: `
## Enums — Named Variants

An **enum** is a type that can be one of several variants. You've seen these in
TypeScript as union types or in Python as \`Enum\`. In Rust they're much more
powerful.

\`\`\`rust
enum Species {
    Gecko,
    Chameleon,
    Dragon,
}

let my_lizard = Species::Dragon; // double-colon to pick a variant
\`\`\`

Enums can also carry data:

\`\`\`rust
enum Action {
    Feed { amount: u64 },
    Rename { new_name: String },
}
\`\`\`

### Match — exhaustive pattern matching

\`match\` is like a \`switch\` in JS/Solidity, but the **compiler forces you to
handle every variant**. No more forgotten cases!

\`\`\`rust
match species {
    Species::Gecko    => 10,
    Species::Chameleon => 25,
    Species::Dragon   => 100,
    // If you forget a variant, the compiler errors. No silent bugs!
}
\`\`\`

### Your mission 🦎🐉

1. Define the \`Species\` enum with variants: \`Gecko\`, \`Chameleon\`, \`Dragon\`
2. Complete \`power_level\` so it matches on the species and returns the correct value
      `.trim(),

      initialCode: `// FIX 1: define the Species enum here
// enum Species { ... }

fn power_level(species: &Species) -> u64 {
    // FIX 2: replace this with a match expression
    // Gecko => 10, Chameleon => 25, Dragon => 100
    0
}

fn main() {
    let species = Species::Dragon;
    println!("Dragon power level: {}", power_level(&species));

    let gecko = Species::Gecko;
    println!("Gecko power level: {}", power_level(&gecko));
}
`,

      solution: `enum Species {
    Gecko,
    Chameleon,
    Dragon,
}

fn power_level(species: &Species) -> u64 {
    match species {
        Species::Gecko     => 10,
        Species::Chameleon => 25,
        Species::Dragon    => 100,
    }
}

fn main() {
    let species = Species::Dragon;
    println!("Dragon power level: {}", power_level(&species));

    let gecko = Species::Gecko;
    println!("Gecko power level: {}", power_level(&gecko));
}
`,

      validations: [
        {
          pattern: /enum\s+Species/,
          message: 'Define `enum Species { ... }` with your variants',
          required: true,
        },
        {
          pattern: /Gecko/,
          message: 'Add a `Gecko` variant to the enum',
          required: true,
        },
        {
          pattern: /Chameleon/,
          message: 'Add a `Chameleon` variant to the enum',
          required: true,
        },
        {
          pattern: /Dragon/,
          message: 'Add a `Dragon` variant to the enum',
          required: true,
        },
        {
          pattern: /match\s+species/,
          message: 'Use a `match species { ... }` expression to return different values per variant',
          required: true,
        },
      ],

      hints: [
        'Define the enum above the function:\n```rust\nenum Species {\n    Gecko,\n    Chameleon,\n    Dragon,\n}\n```',
        'Replace the `0` in `power_level` with:\n```rust\nmatch species {\n    Species::Gecko     => 10,\n    Species::Chameleon => 25,\n    Species::Dragon    => 100,\n}\n```',
        'The match arms use `=>` (fat arrow), not `->`. No `break` needed — Rust match arms don\'t fall through.',
      ],
    },

    // ─── Lesson 0.4 ──────────────────────────────────────────────────────────
    {
      id: 'ch0-l4',
      chapter: 0,
      step: 4,
      title: 'Vectors & Destructuring 📦',
      content: `
## Vec<T> — Growable Arrays

A \`Vec<T>\` is Rust's dynamic array — like a JS \`Array\` or Python \`list\`.

\`\`\`rust
let lizards: Vec<String> = vec![
    String::from("Spike"),
    String::from("Rex"),
];
\`\`\`

### Destructuring into a fixed array

This pattern is **everywhere in LEZ** — you receive a \`Vec\` of accounts and
need to unpack exactly N of them:

\`\`\`rust
let [first, second] = lizards
    .try_into()
    .unwrap_or_else(|_| panic!("Expected exactly 2 lizards"));
\`\`\`

What's happening here?
- \`.try_into()\` — attempt to convert the \`Vec\` into a fixed-size \`[T; 2]\` array
- \`.unwrap_or_else(|_| panic!(...))\` — if the vec doesn't have exactly 2 elements, crash with a message
- \`let [first, second] = ...\` — destructure the array into named variables

### Searching a collection

\`\`\`rust
let found = roster.iter().find(|name| *name == "Rex");
// found is Option<&&String> — Some(&"Rex") or None
\`\`\`

### Your mission 📦

1. Destructure \`lizards\` into exactly \`[first, second]\` using \`.try_into()\`
2. Find \`"Zara"\` in \`roster\` using \`.iter().find()\`
      `.trim(),

      initialCode: `fn main() {
    let lizards: Vec<String> = vec![
        String::from("Spike"),
        String::from("Rex"),
    ];

    // FIX 1: destructure exactly 2 names using .try_into()
    // let [first, second] = lizards.try_into().unwrap_or_else(|_| panic!("Expected 2"));
    let first = &lizards[0];
    let second = &lizards[1];
    println!("First: {}, Second: {}", first, second);

    let roster: Vec<String> = vec![
        String::from("Spike"),
        String::from("Rex"),
        String::from("Zara"),
    ];

    // FIX 2: find "Zara" using .iter().find()
    let found: Option<&String> = None;
    println!("Found Zara: {:?}", found);
}
`,

      solution: `fn main() {
    let lizards: Vec<String> = vec![
        String::from("Spike"),
        String::from("Rex"),
    ];

    let [first, second] = lizards
        .try_into()
        .unwrap_or_else(|_| panic!("Expected exactly 2 lizards"));
    println!("First: {}, Second: {}", first, second);

    let roster: Vec<String> = vec![
        String::from("Spike"),
        String::from("Rex"),
        String::from("Zara"),
    ];

    let found = roster.iter().find(|name| *name == "Zara");
    println!("Found Zara: {:?}", found);
}
`,

      validations: [
        {
          pattern: /let\s+\[/,
          message: 'Use array destructuring: `let [first, second] = ...`',
          required: true,
        },
        {
          pattern: /\.try_into\(\)/,
          message: 'Convert the Vec to a fixed array with `.try_into()`',
          required: true,
        },
        {
          pattern: /\.unwrap_or_else\(/,
          message: 'Handle the conversion error with `.unwrap_or_else(|_| panic!(...))`',
          required: true,
        },
        {
          pattern: /\.find\(/,
          message: 'Search the roster with `.iter().find(...)`',
          required: true,
        },
      ],

      hints: [
        'Replace the two `let first/second` lines with:\n```rust\nlet [first, second] = lizards\n    .try_into()\n    .unwrap_or_else(|_| panic!("Expected exactly 2 lizards"));\n```',
        'For the find, replace `let found: Option<&String> = None;` with:\n```rust\nlet found = roster.iter().find(|name| *name == "Zara");\n```',
        'The `|_|` in `unwrap_or_else` is a closure that takes one argument and ignores it (the error). The `|name|` in `find` is a closure that takes each element and returns `true` if it matches.',
      ],
    },

    // ─── Lesson 0.5 ──────────────────────────────────────────────────────────
    {
      id: 'ch0-l5',
      chapter: 0,
      step: 5,
      title: 'Serialization 💾',
      content: `
## Why bytes?

LEZ stores every account's state as a raw byte array. To save a Rust struct to
an account (or read it back), you need to convert between struct ↔ bytes.
LEZ uses **Borsh** — a compact binary serialization format.

### Adding Borsh to a struct

\`\`\`rust
use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize)]
struct LizardData {
    name: String,
    level: u64,
}
\`\`\`

### Serializing (struct → bytes)

\`\`\`rust
let bytes: Vec<u8> = borsh::to_vec(&lizard).unwrap();
\`\`\`

### Deserializing (bytes → struct)

\`\`\`rust
let restored = LizardData::try_from_slice(&bytes).unwrap();
\`\`\`

In LEZ programs (Chapter 1+) you'll also see \`Data::try_from(vec)\` to convert
\`Vec<u8>\` into the LEZ \`Data\` type — but the pattern is the same.

### Your mission 💾

1. Add \`#[derive(BorshSerialize, BorshDeserialize)]\` to \`LizardData\`
2. Serialize the lizard with \`borsh::to_vec(&lizard).unwrap()\`
3. Deserialize it back with \`LizardData::try_from_slice(&bytes).unwrap()\`

You now have all the Rust you need for Chapter 1. Let's go breed some lizards on-chain! 🦎🚀
      `.trim(),

      initialCode: `use borsh::{BorshDeserialize, BorshSerialize};

// FIX 1: add #[derive(BorshSerialize, BorshDeserialize)] to enable serialization
struct LizardData {
    name: String,
    level: u64,
    health: u32,
}

fn main() {
    let lizard = LizardData {
        name: String::from("Spike"),
        level: 5,
        health: 100,
    };

    // FIX 2: serialize lizard to bytes using borsh::to_vec
    let bytes: Vec<u8> = vec![]; // placeholder — replace this

    println!("Serialized {} bytes", bytes.len());

    // FIX 3: deserialize bytes back to LizardData using try_from_slice
    // let restored = ...
    println!("Restored: Spike level 0"); // replace with real values
}
`,

      solution: `use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize)]
struct LizardData {
    name: String,
    level: u64,
    health: u32,
}

fn main() {
    let lizard = LizardData {
        name: String::from("Spike"),
        level: 5,
        health: 100,
    };

    let bytes: Vec<u8> = borsh::to_vec(&lizard).unwrap();
    println!("Serialized {} bytes", bytes.len());

    let restored = LizardData::try_from_slice(&bytes).unwrap();
    println!("Restored: {} level {}", restored.name, restored.level);
}
`,

      validations: [
        {
          pattern: /#\[derive\([^)]*BorshSerialize[^)]*\)\]/,
          message: 'Add `#[derive(BorshSerialize, BorshDeserialize)]` above the struct',
          required: true,
        },
        {
          pattern: /#\[derive\([^)]*BorshDeserialize[^)]*\)\]/,
          message: 'Include `BorshDeserialize` in the derive macro',
          required: true,
        },
        {
          pattern: /borsh::to_vec\s*\(/,
          message: 'Serialize with `borsh::to_vec(&lizard).unwrap()`',
          required: true,
        },
        {
          pattern: /try_from_slice\s*\(/,
          message: 'Deserialize with `LizardData::try_from_slice(&bytes).unwrap()`',
          required: true,
        },
      ],

      hints: [
        'Add the derive on the line above `struct LizardData {`:\n```rust\n#[derive(BorshSerialize, BorshDeserialize)]\n```',
        'Replace `let bytes: Vec<u8> = vec![];` with:\n```rust\nlet bytes: Vec<u8> = borsh::to_vec(&lizard).unwrap();\n```',
        'Add deserialization after the println:\n```rust\nlet restored = LizardData::try_from_slice(&bytes).unwrap();\nprintln!("Restored: {} level {}", restored.name, restored.level);\n```',
      ],
    },
  ],
};

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
// CHAPTER 3 — Lizard Trading
// ─────────────────────────────────────────────────────────────────────────────

const CHAPTER_3: Chapter = {
  id: 3,
  title: 'Lizard Trading',
  description: 'Chain calls across programs, derive PDAs, and build the ultimate battle arena',
  lessons: [
    // ─── Lesson 7 ────────────────────────────────────────────────────────────
    {
      id: 'ch3-l1',
      chapter: 3,
      step: 1,
      title: 'The Lizard Marketplace 🏪',
      content: `
## Time to Sell Your Lizards!

Your hatchery is booming — time to open a marketplace! When a buyer purchases a lizard,
**payment flows through the Token Program**, a separate LEZ program managing fungible token
balances. Your marketplace program must **chain a call** to the Token Program so it executes
the transfer atomically with your trade.

### ChainedCall

A \`ChainedCall\` hands execution to another program at the end of your transaction:

\`\`\`rust
use nssa_core::program::{ChainedCall, write_nssa_outputs_with_chained_call};

let chained_call = ChainedCall::new(
    token_program_id,                        // program to invoke
    vec![buyer_token_pre, seller_token_pre], // accounts it receives
    &token_core::Instruction::Transfer { amount_to_transfer: price },
);

write_nssa_outputs_with_chained_call(
    instruction_data,
    vec![lizard_pre],   // this program's pre-states
    vec![post_state],   // this program's post-states
    vec![chained_call], // chained calls to execute after
);
\`\`\`

### Getting the token program ID

Read it from the token holding account — its owner **is** the Token Program:

\`\`\`rust
let token_program_id = buyer_token_pre.account.program_owner;
\`\`\`

The Token Program's \`Transfer\` moves tokens from account[0] to account[1].
The buyer is signing the transaction, so their token holding is already authorized.

### Your mission 🏪

1. Get \`token_program_id\` from \`buyer_token_pre.account.program_owner\`
2. Build \`ChainedCall::new(…)\` with the Transfer instruction
3. Replace \`write_nssa_outputs\` with \`write_nssa_outputs_with_chained_call\`
4. Add \`ChainedCall\` and \`write_nssa_outputs_with_chained_call\` to your import
      `.trim(),

      initialCode: `use borsh::{BorshDeserialize, BorshSerialize};
use nssa_core::program::{
    AccountPostState, ProgramInput, read_nssa_inputs, write_nssa_outputs,
};
use serde::{Deserialize, Serialize};

#[derive(BorshSerialize, BorshDeserialize)]
pub struct Lizard {
    pub name: String,
    pub species: String,
    pub level: u32,
}

#[derive(Serialize, Deserialize)]
struct SellInstruction {
    price: u128,
}

fn main() {
    let (ProgramInput { pre_states, instruction: SellInstruction { price } }, instruction_data) =
        read_nssa_inputs::<SellInstruction>();

    let [lizard_pre, buyer_token_pre, seller_token_pre] = pre_states
        .clone()
        .try_into()
        .unwrap_or_else(|_| panic!("Expected lizard, buyer token, and seller token accounts"));

    if !lizard_pre.is_authorized {
        panic!("Unauthorized: only the lizard owner can sell it");
    }

    let post_state = AccountPostState::new(lizard_pre.account.clone());

    // YOUR CODE HERE — read token_program_id from buyer_token_pre.account.program_owner
    // YOUR CODE HERE — build a ChainedCall to transfer price tokens (buyer pays seller)
    // YOUR CODE HERE — call write_nssa_outputs_with_chained_call instead of below
    write_nssa_outputs(instruction_data, vec![lizard_pre], vec![post_state]);
}
`,

      solution: `use borsh::{BorshDeserialize, BorshSerialize};
use nssa_core::program::{
    AccountPostState, ChainedCall, ProgramInput,
    read_nssa_inputs, write_nssa_outputs_with_chained_call,
};
use serde::{Deserialize, Serialize};

#[derive(BorshSerialize, BorshDeserialize)]
pub struct Lizard {
    pub name: String,
    pub species: String,
    pub level: u32,
}

#[derive(Serialize, Deserialize)]
struct SellInstruction {
    price: u128,
}

fn main() {
    let (ProgramInput { pre_states, instruction: SellInstruction { price } }, instruction_data) =
        read_nssa_inputs::<SellInstruction>();

    let [lizard_pre, buyer_token_pre, seller_token_pre] = pre_states
        .clone()
        .try_into()
        .unwrap_or_else(|_| panic!("Expected lizard, buyer token, and seller token accounts"));

    if !lizard_pre.is_authorized {
        panic!("Unauthorized: only the lizard owner can sell it");
    }

    let post_state = AccountPostState::new(lizard_pre.account.clone());

    let token_program_id = buyer_token_pre.account.program_owner;
    let chained_call = ChainedCall::new(
        token_program_id,
        vec![buyer_token_pre, seller_token_pre],
        &token_core::Instruction::Transfer { amount_to_transfer: price },
    );

    write_nssa_outputs_with_chained_call(
        instruction_data,
        vec![lizard_pre],
        vec![post_state],
        vec![chained_call],
    );
}
`,

      validations: [
        {
          pattern: /ChainedCall::new\s*\(/,
          message: 'Build a `ChainedCall::new(token_program_id, vec![…], &token_core::Instruction::Transfer { … })`',
          required: true,
        },
        {
          pattern: /token_core::Instruction::Transfer/,
          message: 'Use `token_core::Instruction::Transfer { amount_to_transfer: price }` as the chained call instruction',
          required: true,
        },
        {
          pattern: /write_nssa_outputs_with_chained_call\s*\(/,
          message: 'Call `write_nssa_outputs_with_chained_call(…)` instead of `write_nssa_outputs` to emit the chained call',
          required: true,
        },
      ],

      hints: [
        'Get the token program ID from the buyer\'s account: `let token_program_id = buyer_token_pre.account.program_owner;`',
        'Build the chained call:\n```rust\nlet chained_call = ChainedCall::new(\n    token_program_id,\n    vec![buyer_token_pre, seller_token_pre],\n    &token_core::Instruction::Transfer { amount_to_transfer: price },\n);\n```',
        'Replace `write_nssa_outputs(…)` with:\n```rust\nwrite_nssa_outputs_with_chained_call(\n    instruction_data,\n    vec![lizard_pre],\n    vec![post_state],\n    vec![chained_call],\n);\n```\nAlso add `ChainedCall` and `write_nssa_outputs_with_chained_call` to your `use nssa_core::program` import.',
      ],
    },

    // ─── Lesson 8 ────────────────────────────────────────────────────────────
    {
      id: 'ch3-l2',
      chapter: 3,
      step: 2,
      title: 'Breeding Pens 🏠',
      content: `
## Every Pair Needs Their Own Pen

Two parent lizards need a **breeding pen** — a dedicated account just for them.
But how do you guarantee a unique account per parent pair without collisions?
**Program-Derived Accounts (PDAs)** are the answer.

A PDA is an \`AccountId\` computed deterministically from your **program ID** and a **seed**:

\`\`\`rust
use nssa_core::account::AccountId;
use nssa_core::program::{PdaSeed, ProgramId};
use risc0_zkvm::sha::{Impl, Sha256};

// Hash the two parent IDs together to form a unique 32-byte seed
let mut seed_input = [0u8; 64];
seed_input[0..32].copy_from_slice(&parent_a_pre.account_id.to_bytes());
seed_input[32..64].copy_from_slice(&parent_b_pre.account_id.to_bytes());
let pda_seed = PdaSeed::new(
    Impl::hash_bytes(&seed_input).as_bytes().try_into().unwrap()
);

// Derive the expected account ID
let expected_pen_id = AccountId::from((&program_id, &pda_seed));
assert_eq!(pen_pre.account_id, expected_pen_id, "Wrong breeding pen account!");
\`\`\`

The hashing ensures the same two parents always produce the same pen ID,
and different pairs never collide.

### Claiming the pen

The pen starts as an unclaimed account (\`program_owner == DEFAULT_PROGRAM_ID\`).
Use \`AccountPostState::new_claimed\` to take ownership:

\`\`\`rust
let pen_post_state = AccountPostState::new_claimed(pen_post);
\`\`\`

### The instruction

The instruction carries your program's own ID (programs look this up at deploy time):

\`\`\`rust
#[derive(Serialize, Deserialize)]
struct BreedInstruction { program_id: [u32; 8] }
\`\`\`

### Your mission 🏠

1. Hash the two parent account IDs into a \`PdaSeed\`
2. Derive \`AccountId::from((&program_id, &pda_seed))\`
3. Assert the provided pen account matches the expected PDA
4. Claim the pen with \`AccountPostState::new_claimed\`
      `.trim(),

      initialCode: `use borsh::{BorshDeserialize, BorshSerialize};
use nssa_core::program::{
    AccountPostState, DEFAULT_PROGRAM_ID, ProgramInput, read_nssa_inputs, write_nssa_outputs,
};
use serde::{Deserialize, Serialize};

#[derive(BorshSerialize, BorshDeserialize)]
pub struct Lizard {
    pub name: String,
    pub species: String,
    pub level: u32,
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct BreedingPen {
    pub parent_a_id: [u8; 32],
    pub parent_b_id: [u8; 32],
    pub offspring_count: u32,
}

#[derive(Serialize, Deserialize)]
struct BreedInstruction { program_id: [u32; 8] }

fn main() {
    let (ProgramInput { pre_states, instruction: BreedInstruction { program_id } }, instruction_data) =
        read_nssa_inputs::<BreedInstruction>();

    let [parent_a_pre, parent_b_pre, pen_pre] = pre_states
        .try_into()
        .unwrap_or_else(|_| panic!("Expected two parent lizards and a breeding pen account"));

    if !parent_a_pre.is_authorized || !parent_b_pre.is_authorized {
        panic!("Unauthorized: both parents must authorize breeding");
    }

    let parent_a_account = parent_a_pre.account.clone();
    let parent_b_account = parent_b_pre.account.clone();

    // YOUR CODE HERE — hash the two parent account_ids into a PdaSeed
    // YOUR CODE HERE — derive AccountId::from((&program_id, &pda_seed))
    // YOUR CODE HERE — assert pen_pre.account_id == expected_pen_id

    let pen = BreedingPen {
        parent_a_id: parent_a_pre.account_id.to_bytes(),
        parent_b_id: parent_b_pre.account_id.to_bytes(),
        offspring_count: 0,
    };
    let mut pen_post = pen_pre.account.clone();
    pen_post.data = borsh::to_vec(&pen).unwrap().try_into().unwrap();

    // YOUR CODE HERE — use new_claimed instead of new (the pen is an unclaimed account!)
    let pen_post_state = AccountPostState::new(pen_post);

    write_nssa_outputs(
        instruction_data,
        vec![parent_a_pre, parent_b_pre, pen_pre],
        vec![
            AccountPostState::new(parent_a_account),
            AccountPostState::new(parent_b_account),
            pen_post_state,
        ],
    );
}
`,

      solution: `use borsh::{BorshDeserialize, BorshSerialize};
use nssa_core::account::AccountId;
use nssa_core::program::{
    AccountPostState, PdaSeed, ProgramInput, read_nssa_inputs, write_nssa_outputs,
};
use risc0_zkvm::sha::{Impl, Sha256};
use serde::{Deserialize, Serialize};

#[derive(BorshSerialize, BorshDeserialize)]
pub struct Lizard {
    pub name: String,
    pub species: String,
    pub level: u32,
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct BreedingPen {
    pub parent_a_id: [u8; 32],
    pub parent_b_id: [u8; 32],
    pub offspring_count: u32,
}

#[derive(Serialize, Deserialize)]
struct BreedInstruction { program_id: [u32; 8] }

fn main() {
    let (ProgramInput { pre_states, instruction: BreedInstruction { program_id } }, instruction_data) =
        read_nssa_inputs::<BreedInstruction>();

    let [parent_a_pre, parent_b_pre, pen_pre] = pre_states
        .try_into()
        .unwrap_or_else(|_| panic!("Expected two parent lizards and a breeding pen account"));

    if !parent_a_pre.is_authorized || !parent_b_pre.is_authorized {
        panic!("Unauthorized: both parents must authorize breeding");
    }

    let parent_a_account = parent_a_pre.account.clone();
    let parent_b_account = parent_b_pre.account.clone();

    let mut seed_input = [0u8; 64];
    seed_input[0..32].copy_from_slice(&parent_a_pre.account_id.to_bytes());
    seed_input[32..64].copy_from_slice(&parent_b_pre.account_id.to_bytes());
    let pda_seed = PdaSeed::new(
        Impl::hash_bytes(&seed_input).as_bytes().try_into().unwrap()
    );
    let expected_pen_id = AccountId::from((&program_id, &pda_seed));
    assert_eq!(pen_pre.account_id, expected_pen_id, "Wrong breeding pen account!");

    let pen = BreedingPen {
        parent_a_id: parent_a_pre.account_id.to_bytes(),
        parent_b_id: parent_b_pre.account_id.to_bytes(),
        offspring_count: 0,
    };
    let mut pen_post = pen_pre.account.clone();
    pen_post.data = borsh::to_vec(&pen).unwrap().try_into().unwrap();
    let pen_post_state = AccountPostState::new_claimed(pen_post);

    write_nssa_outputs(
        instruction_data,
        vec![parent_a_pre, parent_b_pre, pen_pre],
        vec![
            AccountPostState::new(parent_a_account),
            AccountPostState::new(parent_b_account),
            pen_post_state,
        ],
    );
}
`,

      validations: [
        {
          pattern: /PdaSeed/,
          message: 'Create a `PdaSeed::new(…)` by hashing the two parent account IDs together',
          required: true,
        },
        {
          pattern: /AccountId::from\s*\(/,
          message: 'Derive the expected pen ID with `AccountId::from((&program_id, &pda_seed))`',
          required: true,
        },
        {
          pattern: /AccountPostState::new_claimed\s*\(/,
          message: 'Claim the breeding pen account with `AccountPostState::new_claimed(pen_post)`',
          required: true,
        },
      ],

      hints: [
        'Hash the parent IDs:\n```rust\nlet mut seed_input = [0u8; 64];\nseed_input[0..32].copy_from_slice(&parent_a_pre.account_id.to_bytes());\nseed_input[32..64].copy_from_slice(&parent_b_pre.account_id.to_bytes());\nlet pda_seed = PdaSeed::new(\n    Impl::hash_bytes(&seed_input).as_bytes().try_into().unwrap()\n);\n```\nAdd `use risc0_zkvm::sha::{Impl, Sha256};` and `PdaSeed` to your imports.',
        'Derive and verify the expected account ID:\n```rust\nlet expected_pen_id = AccountId::from((&program_id, &pda_seed));\nassert_eq!(pen_pre.account_id, expected_pen_id, "Wrong breeding pen account!");\n```\nAdd `use nssa_core::account::AccountId;` to your imports.',
        'Replace `AccountPostState::new(pen_post)` with `AccountPostState::new_claimed(pen_post)` — the pen starts unclaimed.',
      ],
    },

    // ─── Lesson 9 ────────────────────────────────────────────────────────────
    {
      id: 'ch3-l3',
      chapter: 3,
      step: 3,
      title: 'The Arena ⚔️',
      content: `
## Final Boss: The Lizard Arena

Your lizards have been hatched, named, fed, claimed, and traded. Now they fight.
The arena is the ultimate LEZ program — it combines **everything**:

- **Dual authorization** — both fighters must consent to battle
- **State comparison** — compare levels to crown a winner
- **Record keeping** — update wins and losses on-chain
- **Chained prize** — the loser's tokens flow to the winner via the Token Program

### Two accounts, two auth checks

\`\`\`rust
if !lizard_a_pre.is_authorized {
    panic!("Unauthorized: challenger has not signed");
}
if !lizard_b_pre.is_authorized {
    panic!("Unauthorized: defender has not signed");
}
\`\`\`

### Compare levels, update records

\`\`\`rust
let mut lizard_a = Lizard::try_from_slice(lizard_a_pre.account.data.as_ref()).unwrap();
let mut lizard_b = Lizard::try_from_slice(lizard_b_pre.account.data.as_ref()).unwrap();

let (winner_token, mut loser_token) = if lizard_a.level >= lizard_b.level {
    lizard_a.wins += 1;
    lizard_b.losses += 1;
    (token_a_pre, token_b_pre)
} else {
    lizard_b.wins += 1;
    lizard_a.losses += 1;
    (token_b_pre, token_a_pre)
};
\`\`\`

### Chain the prize transfer

\`\`\`rust
loser_token.is_authorized = true; // authorize the loser's token for the transfer
let chained_call = ChainedCall::new(
    winner_token.account.program_owner,
    vec![loser_token, winner_token],
    &token_core::Instruction::Transfer { amount_to_transfer: PRIZE_AMOUNT },
);
\`\`\`

### Your mission ⚔️

1. Add authorization checks for **both** lizards
2. Compare levels and update \`wins\`/\`losses\` on each \`Lizard\`
3. Build a \`ChainedCall\` that transfers \`PRIZE_AMOUNT\` from loser to winner
4. Use \`write_nssa_outputs_with_chained_call\`
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
    pub wins: u32,
    pub losses: u32,
}

const PRIZE_AMOUNT: u128 = 100;

fn main() {
    let (ProgramInput { pre_states, instruction: _ }, instruction_data) =
        read_nssa_inputs::<()>();

    let [lizard_a_pre, lizard_b_pre, token_a_pre, token_b_pre] = pre_states
        .clone()
        .try_into()
        .unwrap_or_else(|_| panic!("Expected two lizards and two token accounts"));

    // YOUR CODE HERE — check lizard_a_pre.is_authorized (challenger must sign)
    // YOUR CODE HERE — check lizard_b_pre.is_authorized (defender must sign)

    let lizard_a = Lizard::try_from_slice(lizard_a_pre.account.data.as_ref()).unwrap();
    let lizard_b = Lizard::try_from_slice(lizard_b_pre.account.data.as_ref()).unwrap();

    // YOUR CODE HERE — compare levels, update wins/losses, pick winner/loser tokens

    let lizard_a_post = lizard_a_pre.account.clone();
    let lizard_b_post = lizard_b_pre.account.clone();
    let token_a_account = token_a_pre.account.clone();
    let token_b_account = token_b_pre.account.clone();

    // YOUR CODE HERE — build a ChainedCall for the prize transfer
    write_nssa_outputs(
        instruction_data,
        pre_states,
        vec![
            AccountPostState::new(lizard_a_post),
            AccountPostState::new(lizard_b_post),
            AccountPostState::new(token_a_account),
            AccountPostState::new(token_b_account),
        ],
    );
}
`,

      solution: `use borsh::{BorshDeserialize, BorshSerialize};
use nssa_core::program::{
    AccountPostState, ChainedCall, ProgramInput,
    read_nssa_inputs, write_nssa_outputs_with_chained_call,
};

#[derive(BorshSerialize, BorshDeserialize)]
pub struct Lizard {
    pub name: String,
    pub species: String,
    pub level: u32,
    pub wins: u32,
    pub losses: u32,
}

const PRIZE_AMOUNT: u128 = 100;

fn main() {
    let (ProgramInput { pre_states, instruction: _ }, instruction_data) =
        read_nssa_inputs::<()>();

    let [lizard_a_pre, lizard_b_pre, token_a_pre, token_b_pre] = pre_states
        .clone()
        .try_into()
        .unwrap_or_else(|_| panic!("Expected two lizards and two token accounts"));

    if !lizard_a_pre.is_authorized {
        panic!("Unauthorized: challenger has not signed");
    }
    if !lizard_b_pre.is_authorized {
        panic!("Unauthorized: defender has not signed");
    }

    let mut lizard_a = Lizard::try_from_slice(lizard_a_pre.account.data.as_ref()).unwrap();
    let mut lizard_b = Lizard::try_from_slice(lizard_b_pre.account.data.as_ref()).unwrap();
    let token_a_account = token_a_pre.account.clone();
    let token_b_account = token_b_pre.account.clone();

    let (winner_token, mut loser_token) = if lizard_a.level >= lizard_b.level {
        lizard_a.wins += 1; lizard_b.losses += 1;
        (token_a_pre, token_b_pre)
    } else {
        lizard_b.wins += 1; lizard_a.losses += 1;
        (token_b_pre, token_a_pre)
    };

    let mut lizard_a_post = lizard_a_pre.account.clone();
    lizard_a_post.data = borsh::to_vec(&lizard_a).unwrap().try_into().unwrap();
    let mut lizard_b_post = lizard_b_pre.account.clone();
    lizard_b_post.data = borsh::to_vec(&lizard_b).unwrap().try_into().unwrap();

    loser_token.is_authorized = true;
    let chained_call = ChainedCall::new(
        winner_token.account.program_owner,
        vec![loser_token, winner_token],
        &token_core::Instruction::Transfer { amount_to_transfer: PRIZE_AMOUNT },
    );

    write_nssa_outputs_with_chained_call(
        instruction_data, pre_states,
        vec![
            AccountPostState::new(lizard_a_post), AccountPostState::new(lizard_b_post),
            AccountPostState::new(token_a_account), AccountPostState::new(token_b_account),
        ],
        vec![chained_call],
    );
}
`,

      validations: [
        {
          pattern: /!\s*lizard_a_pre\.is_authorized/,
          message: 'Check `!lizard_a_pre.is_authorized` — the challenger must sign the battle',
          required: true,
        },
        {
          pattern: /!\s*lizard_b_pre\.is_authorized/,
          message: 'Check `!lizard_b_pre.is_authorized` — the defender must sign the battle',
          required: true,
        },
        {
          pattern: /ChainedCall::new\s*\(/,
          message: 'Build a `ChainedCall::new(…)` to transfer the prize tokens from loser to winner',
          required: true,
        },
        {
          pattern: /write_nssa_outputs_with_chained_call\s*\(/,
          message: 'Use `write_nssa_outputs_with_chained_call(…)` to emit the prize transfer alongside your outputs',
          required: true,
        },
      ],

      hints: [
        'Add two authorization guards right after unpacking the accounts:\n```rust\nif !lizard_a_pre.is_authorized { panic!("Unauthorized: challenger has not signed"); }\nif !lizard_b_pre.is_authorized { panic!("Unauthorized: defender has not signed"); }\n```',
        'Compare levels and track the result:\n```rust\nlet (winner_token, mut loser_token) = if lizard_a.level >= lizard_b.level {\n    lizard_a.wins += 1; lizard_b.losses += 1;\n    (token_a_pre, token_b_pre)\n} else {\n    lizard_b.wins += 1; lizard_a.losses += 1;\n    (token_b_pre, token_a_pre)\n};\n```',
        'Build the prize chained call and use the right output function:\n```rust\nloser_token.is_authorized = true;\nlet chained_call = ChainedCall::new(\n    winner_token.account.program_owner,\n    vec![loser_token, winner_token],\n    &token_core::Instruction::Transfer { amount_to_transfer: PRIZE_AMOUNT },\n);\n// then call write_nssa_outputs_with_chained_call(…, vec![chained_call])\n```',
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Exports (extended in subsequent chapters)
// ─────────────────────────────────────────────────────────────────────────────

export const CHAPTERS: Chapter[] = [CHAPTER_0, CHAPTER_1, CHAPTER_2, CHAPTER_3];

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
